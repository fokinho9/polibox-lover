import { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  Check, Clock, XCircle, Copy, 
  ArrowLeft, ShieldCheck, Loader2, CreditCard, RefreshCw
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ConfirmacaoPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('pedido');
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const queryClient = useQueryClient();

  // Function to actively check payment status via edge function
  const checkPaymentStatus = useCallback(async () => {
    if (!orderId || isChecking) return;
    
    setIsChecking(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-payment-status', {
        body: { orderId }
      });
      
      if (!error && data?.order) {
        // Update the query cache with new data
        queryClient.setQueryData(['order', orderId], data.order);
        
        if (data.status === 'paid') {
          toast({
            title: "✅ Pagamento Confirmado!",
            description: "Seu pedido foi aprovado com sucesso.",
          });
        }
      }
    } catch (err) {
      console.error('Error checking payment:', err);
    } finally {
      setIsChecking(false);
    }
  }, [orderId, isChecking, queryClient, toast]);

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!orderId) return null;
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!orderId,
    refetchInterval: (query) => {
      // Poll every 3 seconds if payment is pending PIX
      const orderData = query.state.data;
      if (orderData?.payment_status === 'pending' && orderData?.payment_method === 'pix') {
        return 3000;
      }
      return false;
    },
  });

  // Auto-check payment status every 3 seconds for pending PIX
  useEffect(() => {
    if (order?.payment_status === 'pending' && order?.payment_method === 'pix') {
      const interval = setInterval(() => {
        checkPaymentStatus();
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [order?.payment_status, order?.payment_method, checkPaymentStatus]);

  const handleCopyPix = async () => {
    if (order?.pix_qrcode) {
      await navigator.clipboard.writeText(order.pix_qrcode);
      setCopied(true);
      toast({
        title: "Código PIX copiado!",
        description: "Cole no app do seu banco para pagar.",
      });
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-20">
          <div className="container-main max-w-md mx-auto text-center">
            <XCircle className="h-16 w-16 mx-auto mb-6 text-destructive" />
            <h1 className="font-display text-2xl font-bold mb-4">Pedido não encontrado</h1>
            <p className="text-muted-foreground mb-8">O pedido solicitado não existe ou foi removido.</p>
            <Link to="/">
              <Button size="lg">Voltar para a loja</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isPix = order.payment_method === 'pix';
  const isCard = order.payment_method === 'card';
  const isPaid = order.payment_status === 'paid';
  const isPending = order.payment_status === 'pending';
  const isAnalyzing = order.payment_status === 'analyzing';
  const isFailed = order.payment_status === 'failed';

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <Header />
      
      <main className="py-12">
        <div className="container-main max-w-2xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
            <ArrowLeft className="h-4 w-4" />
            Voltar para a loja
          </Link>

          {/* Status Card */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden mb-6">
            {/* Status Header */}
            <div className={`p-6 text-center ${
              isPaid ? 'bg-green-500/10' : 
              isFailed ? 'bg-destructive/10' : 
              isAnalyzing ? 'bg-yellow-500/10' :
              'bg-primary/10'
            }`}>
              {isPaid ? (
                <>
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="h-10 w-10 text-green-500" />
                  </div>
                  <h1 className="font-display text-2xl font-bold text-green-500 mb-2">
                    Pagamento Confirmado!
                  </h1>
                  <p className="text-muted-foreground">
                    Seu pedido foi aprovado e está sendo preparado.
                  </p>
                </>
              ) : isFailed ? (
                <>
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-destructive/20 flex items-center justify-center">
                    <XCircle className="h-10 w-10 text-destructive" />
                  </div>
                  <h1 className="font-display text-2xl font-bold text-destructive mb-2">
                    Pagamento Recusado
                  </h1>
                  <p className="text-muted-foreground">
                    Houve um problema com seu pagamento. Tente novamente.
                  </p>
                </>
              ) : isAnalyzing ? (
                <>
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center animate-pulse">
                    <CreditCard className="h-10 w-10 text-yellow-500" />
                  </div>
                  <h1 className="font-display text-2xl font-bold text-yellow-500 mb-2">
                    Analisando Pagamento
                  </h1>
                  <p className="text-muted-foreground">
                    Estamos verificando seu pagamento. Isso pode levar alguns minutos.
                  </p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                    <Clock className="h-10 w-10 text-primary" />
                  </div>
                  <h1 className="font-display text-2xl font-bold text-primary mb-2">
                    Aguardando Pagamento
                  </h1>
                  <p className="text-muted-foreground">
                    {isPix ? 'Escaneie o QR Code ou copie o código PIX para pagar.' : 'Complete o pagamento para confirmar seu pedido.'}
                  </p>
                </>
              )}
            </div>

            {/* PIX Payment Section */}
            {isPix && isPending && order.pix_qrcode && (
              <div className="p-6 border-t border-border">
                <div className="text-center mb-6">
                  <h2 className="font-bold text-lg mb-4">Pague com PIX</h2>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    Copie o código abaixo e cole no app do seu banco
                  </p>
                  
                  <div className="bg-secondary rounded-xl p-4 mb-4">
                    <p className="text-xs font-mono break-all text-muted-foreground mb-3">
                      {order.pix_qrcode.substring(0, 80)}...
                    </p>
                    <Button 
                      onClick={handleCopyPix}
                      className="w-full bg-primary hover:bg-primary/90 mb-2"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      {copied ? 'Copiado!' : 'Copiar Código PIX'}
                    </Button>
                    
                    <Button 
                      onClick={checkPaymentStatus}
                      variant="outline"
                      className="w-full"
                      disabled={isChecking}
                    >
                      {isChecking ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      {isChecking ? 'Verificando...' : 'Já paguei, verificar'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span>Verificando automaticamente a cada 3s...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Order Details */}
            <div className="p-6 border-t border-border">
              <h2 className="font-bold text-lg mb-4">Detalhes do Pedido</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Número do pedido</span>
                  <span className="font-mono">{order.id.substring(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data</span>
                  <span>{new Date(order.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Forma de pagamento</span>
                  <span className="capitalize">
                    {order.payment_method === 'pix' ? 'PIX' : 
                     order.payment_method === 'card' ? 'Cartão de Crédito' : 
                     'Boleto'}
                  </span>
                </div>
                {isCard && order.card_last_digits && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cartão</span>
                    <span>**** **** **** {order.card_last_digits}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-border">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-primary">{formatPrice(Number(order.total))}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="p-6 border-t border-border">
              <h2 className="font-bold text-lg mb-4">Endereço de Entrega</h2>
              <p className="text-sm text-muted-foreground">
                {order.shipping_address}, {order.shipping_number}
                {order.shipping_complement && ` - ${order.shipping_complement}`}<br />
                {order.shipping_neighborhood} - {order.shipping_city}/{order.shipping_state}<br />
                CEP: {order.shipping_cep}
              </p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              Pagamento Seguro
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-green-500" />
              Dados Protegidos
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ConfirmacaoPage;
