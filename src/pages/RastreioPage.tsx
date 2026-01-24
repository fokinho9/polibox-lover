import { useState } from "react";
import { Package, Search, Truck, CheckCircle, Clock, MapPin, AlertTriangle, RotateCcw, Home, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { supabase } from "@/integrations/supabase/client";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  created_at: string;
  payment_status: string;
  customer_name: string;
  shipping_address: string;
  shipping_number: string;
  shipping_neighborhood: string;
  shipping_city: string;
  shipping_state: string | null;
  shipping_cep: string;
  items: unknown;
  total: number;
}

interface TrackingStep {
  status: string;
  title: string;
  description: string;
  date: string;
  icon: typeof Package;
  completed: boolean;
  current: boolean;
}

const formatCPF = (value: string) => {
  const numbers = value.replace(/\D/g, "").slice(0, 11);
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`;
};

const getTrackingSteps = (orderDate: Date, paymentStatus: string): TrackingStep[] => {
  const now = new Date();
  const diffMs = now.getTime() - orderDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  // If not paid, show only pending step
  if (paymentStatus !== 'approved' && paymentStatus !== 'paid') {
    return [
      {
        status: "pending_payment",
        title: "Aguardando Pagamento",
        description: "Seu pedido está aguardando a confirmação do pagamento",
        date: orderDate.toLocaleDateString('pt-BR'),
        icon: Clock,
        completed: false,
        current: true
      }
    ];
  }

  const steps: TrackingStep[] = [];

  // Step 1: Order confirmed (immediate after payment)
  steps.push({
    status: "confirmed",
    title: "Pedido Confirmado",
    description: "Pagamento aprovado e pedido confirmado",
    date: orderDate.toLocaleDateString('pt-BR'),
    icon: CheckCircle,
    completed: true,
    current: diffHours < 2
  });

  // Step 2: Preparing (2-6 hours after payment)
  const preparingDate = new Date(orderDate.getTime() + 2 * 60 * 60 * 1000);
  steps.push({
    status: "preparing",
    title: "Em Separação",
    description: "Seu pedido está sendo separado no estoque",
    date: preparingDate.toLocaleDateString('pt-BR'),
    icon: Package,
    completed: diffHours >= 2,
    current: diffHours >= 2 && diffHours < 6
  });

  // Step 3: Shipped (6 hours - 1 day)
  const shippedDate = new Date(orderDate.getTime() + 6 * 60 * 60 * 1000);
  steps.push({
    status: "shipped",
    title: "Enviado",
    description: "Pedido coletado pela transportadora",
    date: shippedDate.toLocaleDateString('pt-BR'),
    icon: Truck,
    completed: diffHours >= 6,
    current: diffHours >= 6 && diffDays < 3
  });

  // Step 4: In transit (days 3-5)
  const inTransitDate = new Date(orderDate.getTime() + 3 * 24 * 60 * 60 * 1000);
  steps.push({
    status: "in_transit",
    title: "Em Trânsito",
    description: "Seu pedido está a caminho",
    date: inTransitDate.toLocaleDateString('pt-BR'),
    icon: MapPin,
    completed: diffDays >= 3,
    current: diffDays >= 3 && diffDays < 7
  });

  // Step 5: Out for delivery (day 7)
  const deliveryDate = new Date(orderDate.getTime() + 7 * 24 * 60 * 60 * 1000);
  steps.push({
    status: "out_for_delivery",
    title: "Saiu para Entrega",
    description: "1ª tentativa de entrega",
    date: deliveryDate.toLocaleDateString('pt-BR'),
    icon: Home,
    completed: diffDays >= 7,
    current: diffDays >= 7 && diffDays < 8
  });

  // Step 6: Second attempt (day 8)
  if (diffDays >= 8) {
    const attempt2Date = new Date(orderDate.getTime() + 8 * 24 * 60 * 60 * 1000);
    steps.push({
      status: "attempt_2",
      title: "2ª Tentativa de Entrega",
      description: "Destinatário ausente - nova tentativa agendada",
      date: attempt2Date.toLocaleDateString('pt-BR'),
      icon: AlertTriangle,
      completed: diffDays >= 8,
      current: diffDays >= 8 && diffDays < 9
    });
  }

  // Step 7: Third attempt (day 9)
  if (diffDays >= 9) {
    const attempt3Date = new Date(orderDate.getTime() + 9 * 24 * 60 * 60 * 1000);
    steps.push({
      status: "attempt_3",
      title: "3ª Tentativa de Entrega",
      description: "Última tentativa de entrega",
      date: attempt3Date.toLocaleDateString('pt-BR'),
      icon: AlertTriangle,
      completed: diffDays >= 9,
      current: diffDays >= 9 && diffDays < 10
    });
  }

  // Step 8: Returned (day 10+)
  if (diffDays >= 10) {
    const returnDate = new Date(orderDate.getTime() + 10 * 24 * 60 * 60 * 1000);
    steps.push({
      status: "returned",
      title: "Devolvido ao Remetente",
      description: "Após 3 tentativas sem sucesso, o pedido retornou à loja. Entre em contato conosco.",
      date: returnDate.toLocaleDateString('pt-BR'),
      icon: RotateCcw,
      completed: true,
      current: true
    });
  }

  return steps;
};

const RastreioPage = () => {
  const [cpf, setCpf] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanCpf = cpf.replace(/\D/g, "");
    if (cleanCpf.length !== 11) {
      setError("Por favor, insira um CPF válido");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const { data, error: queryError } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_cpf', cleanCpf)
        .in('payment_status', ['approved', 'paid'])
        .order('created_at', { ascending: false });

      if (queryError) throw queryError;

      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError("Erro ao buscar pedidos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />

      <main className="container-main py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Package className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Rastrear <span className="text-primary">Pedido</span>
          </h1>
          <p className="text-muted-foreground">
            Acompanhe o status da sua entrega em tempo real
          </p>
        </div>

        {/* Search Form */}
        <Card className="max-w-md mx-auto mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Consultar com CPF</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <Input
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(formatCPF(e.target.value))}
                  className="text-center text-lg tracking-wider"
                />
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Digite o CPF utilizado na compra
                </p>
              </div>
              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}
              <Button 
                type="submit" 
                className="w-full gap-2"
                disabled={loading}
              >
                <Search className="h-4 w-4" />
                {loading ? "Buscando..." : "Rastrear Pedido"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {searched && !loading && (
          <div className="max-w-2xl mx-auto">
            {orders.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Nenhum pedido encontrado</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Não encontramos pedidos pagos para este CPF.
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Se você acabou de fazer um pedido, aguarde a confirmação do pagamento.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => {
                  const orderDate = new Date(order.created_at);
                  const trackingSteps = getTrackingSteps(orderDate, order.payment_status);
                  const items = (order.items as unknown as OrderItem[]) || [];

                  return (
                    <Card key={order.id} className="overflow-hidden">
                      <CardHeader className="bg-card border-b border-border">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Pedido</p>
                            <p className="font-mono text-sm font-semibold text-primary">
                              #{order.id.slice(0, 8).toUpperCase()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Data do pedido</p>
                            <p className="text-sm font-medium">
                              {orderDate.toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-6">
                        {/* Tracking Timeline */}
                        <div className="relative">
                          {trackingSteps.map((step, index) => {
                            const IconComponent = step.icon;
                            const isLast = index === trackingSteps.length - 1;
                            const isReturned = step.status === 'returned';
                            
                            return (
                              <div key={step.status} className="flex gap-4 pb-6 last:pb-0">
                                {/* Timeline line and dot */}
                                <div className="flex flex-col items-center">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    isReturned 
                                      ? 'bg-destructive/20 text-destructive' 
                                      : step.current 
                                        ? 'bg-primary text-primary-foreground animate-pulse' 
                                        : step.completed 
                                          ? 'bg-green-500/20 text-green-500' 
                                          : 'bg-muted text-muted-foreground'
                                  }`}>
                                    <IconComponent className="h-5 w-5" />
                                  </div>
                                  {!isLast && (
                                    <div className={`w-0.5 flex-1 mt-2 ${
                                      step.completed ? 'bg-green-500/50' : 'bg-border'
                                    }`} />
                                  )}
                                </div>
                                
                                {/* Content */}
                                <div className="flex-1 pb-4">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className={`font-semibold ${
                                      isReturned 
                                        ? 'text-destructive' 
                                        : step.current 
                                          ? 'text-primary' 
                                          : ''
                                    }`}>
                                      {step.title}
                                    </h4>
                                    {step.current && !isReturned && (
                                      <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-semibold">
                                        ATUAL
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {step.description}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {step.date}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Order Details */}
                        <div className="mt-6 pt-6 border-t border-border">
                          <h4 className="font-semibold text-sm mb-3">Itens do Pedido</h4>
                          <div className="space-y-2">
                            {items.map((item: OrderItem, idx: number) => (
                              <div key={idx} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  {item.quantity}x {item.name}
                                </span>
                                <span className="font-medium">
                                  R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between mt-4 pt-4 border-t border-border font-semibold">
                            <span>Total</span>
                            <span className="text-primary">
                              R$ {Number(order.total).toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="mt-6 pt-6 border-t border-border">
                          <h4 className="font-semibold text-sm mb-2">Endereço de Entrega</h4>
                          <p className="text-sm text-muted-foreground">
                            {order.shipping_address}, {order.shipping_number}
                            {order.shipping_neighborhood && ` - ${order.shipping_neighborhood}`}
                            <br />
                            {order.shipping_city} - {order.shipping_state}, {order.shipping_cep}
                          </p>
                        </div>

                        {/* Contact for returned orders */}
                        {trackingSteps.some(s => s.status === 'returned') && (
                          <div className="mt-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                            <div className="flex items-start gap-3">
                              <Phone className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-destructive mb-1">
                                  Entre em contato conosco
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  Seu pedido retornou à loja após 3 tentativas de entrega. 
                                  Entre em contato pelo WhatsApp para combinar uma nova entrega.
                                </p>
                                <a 
                                  href="https://api.whatsapp.com/send?phone=5521996327544"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 mt-3 text-sm font-semibold text-primary hover:underline"
                                >
                                  <Phone className="h-4 w-4" />
                                  Falar no WhatsApp
                                </a>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default RastreioPage;
