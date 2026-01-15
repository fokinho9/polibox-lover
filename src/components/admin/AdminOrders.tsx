import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  ShoppingCart, Clock, CheckCircle, XCircle, 
  CreditCard, Loader2, Eye, Check, X
} from "lucide-react";

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total: number;
  payment_method: string;
  payment_status: string;
  created_at: string;
  card_brand?: string;
  card_last_digits?: string;
}

export const AdminOrders = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as Order[];
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
            {orders.map((order) => (
              <div key={order.id} className="p-4 bg-secondary/30 rounded-lg border border-border">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-bold">{order.customer_name}</p>
                    <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString('pt-BR')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary text-lg">{formatPrice(Number(order.total))}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {order.payment_method === 'pix' ? 'PIX' : order.payment_method === 'card' ? `Cartão ${order.card_brand || ''} ****${order.card_last_digits || ''}` : order.payment_method}
                    </p>
                    {getStatusBadge(order.payment_status)}
                  </div>
                </div>
                
                {order.payment_status === 'analyzing' && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                    <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => updateStatusMutation.mutate({ orderId: order.id, status: 'paid' })}>
                      <Check className="h-4 w-4 mr-1" /> Aprovar
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => updateStatusMutation.mutate({ orderId: order.id, status: 'failed' })}>
                      <X className="h-4 w-4 mr-1" /> Recusar
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
