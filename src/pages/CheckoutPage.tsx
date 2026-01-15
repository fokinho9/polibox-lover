import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, ShieldCheck, Lock, Truck, CreditCard, 
  Star, Check, Zap, Plus, Minus, Trash2, Gift,
  BadgeCheck, Flame, Timer, ArrowRight, Loader2
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/contexts/CartContext";
import { productsApi, Product } from "@/lib/api/products";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems, addToCart, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cep, setCep] = useState("");
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    address: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: ""
  });
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  const { data: upsellProduct } = useQuery({
    queryKey: ['upsell-product'],
    queryFn: async () => {
      const allProducts = await productsApi.getAll();
      const filtered = allProducts
        .filter(p => p.price > 0 && p.discount_percent && p.discount_percent >= 20)
        .slice(0, 1);
      return filtered[0] || null;
    },
  });

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const pixDiscount = totalPrice * 0.05;
  const pixTotal = totalPrice - pixDiscount;
  const freeShippingThreshold = 299;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - totalPrice);
  const hasFreeShipping = totalPrice >= freeShippingThreshold;

  const handleAddUpsell = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      pix_price: product.pix_price,
      old_price: product.old_price,
      discount_percent: product.discount_percent,
      brand: product.brand,
    } as any, 1);
  };

  // Formatters
  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 11);
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  };

  const formatCpf = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 11);
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
    if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
  };

  const formatCep = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 8);
    if (cleaned.length <= 5) return cleaned;
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 16);
    return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    return cleaned;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateCpf = (cpf: string): boolean => {
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length !== 11) return false;
    if (/^(\d)\1+$/.test(cleaned)) return false;
    
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cleaned[i]) * (10 - i);
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleaned[9])) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cleaned[i]) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    return remainder === parseInt(cleaned[10]);
  };

  const isCpfValid = customerData.cpf.length === 0 || validateCpf(customerData.cpf);
  const isEmailValid = customerData.email.length === 0 || validateEmail(customerData.email);

  const fetchAddressByCep = async (cepValue: string) => {
    const cleaned = cepValue.replace(/\D/g, '');
    if (cleaned.length !== 8) return;
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setCustomerData(prev => ({
          ...prev,
          address: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          state: data.uf || '',
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };

  const handleCepChange = (value: string) => {
    const formatted = formatCep(value);
    setCep(formatted);
    if (formatted.replace(/\D/g, '').length === 8) {
      fetchAddressByCep(formatted);
    }
  };

  const detectCardBrand = (number: string): string => {
    const cleaned = number.replace(/\D/g, '');
    if (cleaned.startsWith('4')) return 'Visa';
    if (/^5[1-5]/.test(cleaned)) return 'Mastercard';
    if (/^3[47]/.test(cleaned)) return 'Amex';
    if (/^6(?:011|5)/.test(cleaned)) return 'Discover';
    return 'Outro';
  };

  const canProceedToStep2 = items.length > 0 && customerData.name && customerData.email && isEmailValid && customerData.phone && customerData.cpf && isCpfValid;
  const canProceedToStep3 = canProceedToStep2 && cep && customerData.address && customerData.number && customerData.neighborhood && customerData.city;
  const canFinishPayment = paymentMethod === 'pix' || (paymentMethod === 'card' && cardData.number && cardData.name && cardData.expiry && cardData.cvv);

  const handleFinalizePurchase = async () => {
    setIsProcessing(true);
    
    try {
      const finalTotal = paymentMethod === 'pix' ? pixTotal : totalPrice;
      const shippingCost = hasFreeShipping ? 0 : 19.90;

      const orderData = {
        customer_name: customerData.name,
        customer_email: customerData.email,
        customer_phone: customerData.phone,
        customer_cpf: customerData.cpf,
        shipping_cep: cep,
        shipping_address: customerData.address,
        shipping_number: customerData.number,
        shipping_complement: customerData.complement || null,
        shipping_neighborhood: customerData.neighborhood,
        shipping_city: customerData.city,
        shipping_state: customerData.state || null,
        items: items.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        })),
        subtotal: totalPrice,
        shipping_cost: shippingCost,
        discount: paymentMethod === 'pix' ? pixDiscount : 0,
        total: finalTotal + shippingCost,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'card' ? 'analyzing' : 'pending',
        card_last_digits: paymentMethod === 'card' ? cardData.number.replace(/\D/g, '').slice(-4) : null,
        card_brand: paymentMethod === 'card' ? detectCardBrand(cardData.number) : null,
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;

      if (paymentMethod === 'pix') {
        const { error: pixError } = await supabase.functions.invoke('create-pix-payment', {
          body: {
            orderId: order.id,
            customer: {
              name: customerData.name,
              email: customerData.email,
              phone: customerData.phone,
              cpf: customerData.cpf,
            },
            items: items.map(item => ({
              name: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
            })),
            total: finalTotal + shippingCost,
          },
        });

        if (pixError) {
          console.error('PIX error:', pixError);
          toast({
            title: "Erro ao gerar PIX",
            description: "Tente novamente ou escolha outra forma de pagamento.",
            variant: "destructive",
          });
          setIsProcessing(false);
          return;
        }
      }

      clearCart();
      navigate(`/confirmacao?pedido=${order.id}`);

    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Erro ao processar pedido",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-20">
          <div className="container-main max-w-md mx-auto text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="h-12 w-12 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold mb-4">Carrinho Vazio</h1>
            <p className="text-muted-foreground mb-8">Adicione produtos para continuar com a compra</p>
            <Link to="/">
              <Button size="lg" className="bg-gradient-to-r from-primary to-cyan-glow">
                Ver Produtos
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <Header />
      
      {/* Progress bar */}
      <div className="bg-card border-b border-border">
        <div className="container-main py-4">
          <div className="flex items-center justify-center gap-2 text-sm">
            <button onClick={() => { setCurrentStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors ${currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                {currentStep > 1 ? <Check className="h-4 w-4" /> : '1'}
              </div>
              <span className={`hidden sm:inline font-medium ${currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>Carrinho</span>
            </button>
            <div className={`w-12 h-0.5 ${currentStep >= 2 ? 'bg-primary' : 'bg-border'}`} />
            <button onClick={() => { if (canProceedToStep2) { setCurrentStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }); }}} className="flex items-center gap-2" disabled={!canProceedToStep2}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors ${currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                {currentStep > 2 ? <Check className="h-4 w-4" /> : '2'}
              </div>
              <span className={`hidden sm:inline font-medium ${currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>Entrega</span>
            </button>
            <div className={`w-12 h-0.5 ${currentStep >= 3 ? 'bg-primary' : 'bg-border'}`} />
            <button onClick={() => { if (canProceedToStep3) { setCurrentStep(3); window.scrollTo({ top: 0, behavior: 'smooth' }); }}} className="flex items-center gap-2" disabled={!canProceedToStep3}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors ${currentStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>3</div>
              <span className={`hidden sm:inline font-medium ${currentStep >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>Pagamento</span>
            </button>
          </div>
        </div>
      </div>

      {/* Free shipping progress */}
      {!hasFreeShipping && (
        <div className="bg-gradient-to-r from-primary/20 to-cyan-glow/20 border-b border-primary/20">
          <div className="container-main py-3">
            <div className="flex items-center justify-center gap-3 text-sm">
              <Truck className="h-5 w-5 text-primary" />
              <span>Faltam <strong className="text-primary">{formatPrice(remainingForFreeShipping)}</strong> para FRETE GRÁTIS!</span>
              <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-cyan-glow transition-all" style={{ width: `${Math.min(100, (totalPrice / freeShippingThreshold) * 100)}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="py-8">
        <div className="container-main">
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
            <ArrowLeft className="h-4 w-4" />
            Continuar comprando
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Steps */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Cart + Personal Data */}
              {currentStep === 1 && (
                <>
                  <div className="bg-card rounded-2xl border border-border overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-primary/10 to-transparent border-b border-border">
                      <h2 className="font-display text-xl font-bold flex items-center gap-2">
                        <Gift className="h-5 w-5 text-primary" />
                        Seus Produtos ({totalItems})
                      </h2>
                    </div>
                    <div className="divide-y divide-border">
                      {items.map((item) => (
                        <div key={item.product.id} className="p-4 flex gap-4">
                          <div className="w-20 h-20 rounded-xl overflow-hidden bg-secondary/30 flex-shrink-0">
                            <img src={item.product.image_url || '/placeholder.svg'} alt={item.product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm line-clamp-2 mb-1">{item.product.name}</h3>
                            {item.product.brand && <span className="text-xs text-primary font-medium">{item.product.brand}</span>}
                            <div className="flex items-center gap-3 mt-2">
                              <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => removeFromCart(item.product.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">{formatPrice(item.product.price * item.quantity)}</p>
                            {item.quantity > 1 && <p className="text-xs text-muted-foreground">{formatPrice(item.product.price)} cada</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Personal Data */}
                  <div className="bg-card rounded-2xl border border-border overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-primary/10 to-transparent border-b border-border">
                      <h2 className="font-display text-xl font-bold flex items-center gap-2">
                        <BadgeCheck className="h-5 w-5 text-primary" />
                        Seus Dados
                      </h2>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Nome completo *</Label>
                          <Input id="name" placeholder="Seu nome" value={customerData.name} onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })} className="mt-1.5" />
                        </div>
                        <div>
                          <Label htmlFor="email">E-mail *</Label>
                          <Input id="email" type="email" placeholder="seu@email.com" value={customerData.email} onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })} className={`mt-1.5 ${customerData.email && !isEmailValid ? 'border-destructive focus-visible:ring-destructive' : ''}`} />
                          {customerData.email && !isEmailValid && <p className="text-xs text-destructive mt-1">E-mail inválido</p>}
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Telefone (WhatsApp) *</Label>
                          <Input id="phone" placeholder="(00) 00000-0000" value={customerData.phone} onChange={(e) => setCustomerData({ ...customerData, phone: formatPhone(e.target.value) })} className="mt-1.5" maxLength={15} />
                        </div>
                        <div>
                          <Label htmlFor="cpf">CPF *</Label>
                          <Input id="cpf" placeholder="000.000.000-00" value={customerData.cpf} onChange={(e) => setCustomerData({ ...customerData, cpf: formatCpf(e.target.value) })} className={`mt-1.5 ${customerData.cpf && !isCpfValid ? 'border-destructive focus-visible:ring-destructive' : ''}`} maxLength={14} />
                          {customerData.cpf && !isCpfValid && <p className="text-xs text-destructive mt-1">CPF inválido</p>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Upsell */}
                  {upsellProduct && (
                    <div className="bg-gradient-to-r from-destructive/10 via-card to-destructive/10 rounded-2xl border border-destructive/20 overflow-hidden">
                      <div className="p-4 bg-destructive/10 border-b border-destructive/20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center animate-pulse">
                            <Flame className="h-5 w-5 text-destructive" />
                          </div>
                          <div>
                            <h3 className="font-bold text-destructive">OFERTA ESPECIAL!</h3>
                            <p className="text-xs text-muted-foreground">Aproveite antes que acabe</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-destructive text-sm font-bold">
                          <Timer className="h-4 w-4" />
                          <span>15:00</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex gap-4 items-center bg-card rounded-xl p-4 border border-border">
                          <div className="relative w-24 h-24 flex-shrink-0">
                            <img src={upsellProduct.image_url || '/placeholder.svg'} alt={upsellProduct.name} className="w-full h-full object-contain rounded-lg bg-secondary/20" />
                            {upsellProduct.discount_percent && <span className="absolute -top-2 -left-2 px-2 py-1 bg-destructive text-white text-xs font-bold rounded-full">-{upsellProduct.discount_percent}%</span>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium line-clamp-2 mb-2">{upsellProduct.name}</h4>
                            <div className="flex items-center gap-2">
                              {upsellProduct.old_price && <p className="text-sm text-muted-foreground line-through">{formatPrice(upsellProduct.old_price)}</p>}
                              <p className="font-bold text-primary text-lg">{formatPrice(upsellProduct.price)}</p>
                            </div>
                          </div>
                          <Button className="bg-destructive hover:bg-destructive/90 text-white font-bold" onClick={() => handleAddUpsell(upsellProduct)}>
                            <Plus className="h-4 w-4 mr-1" />
                            Adicionar
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button size="lg" className="w-full h-14 bg-gradient-to-r from-primary to-cyan-glow hover:opacity-90 text-primary-foreground font-bold text-lg rounded-xl" onClick={() => setCurrentStep(2)} disabled={!canProceedToStep2}>
                    Continuar para Entrega
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </>
              )}

              {/* Step 2: Shipping */}
              {currentStep === 2 && (
                <>
                  <div className="bg-card rounded-2xl border border-border overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-primary/10 to-transparent border-b border-border">
                      <h2 className="font-display text-xl font-bold flex items-center gap-2">
                        <Truck className="h-5 w-5 text-primary" />
                        Endereço de Entrega
                      </h2>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="cep">CEP *</Label>
                          <Input id="cep" placeholder="00000-000" value={cep} onChange={(e) => handleCepChange(e.target.value)} className="mt-1.5" maxLength={9} />
                        </div>
                        <div className="sm:col-span-2">
                          <Label htmlFor="address">Endereço *</Label>
                          <Input id="address" placeholder="Rua, Avenida..." value={customerData.address} onChange={(e) => setCustomerData({...customerData, address: e.target.value})} className="mt-1.5" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                          <Label htmlFor="number">Número *</Label>
                          <Input id="number" placeholder="Nº" value={customerData.number} onChange={(e) => setCustomerData({...customerData, number: e.target.value})} className="mt-1.5" />
                        </div>
                        <div>
                          <Label htmlFor="complement">Complemento</Label>
                          <Input id="complement" placeholder="Apto, Bloco..." value={customerData.complement} onChange={(e) => setCustomerData({...customerData, complement: e.target.value})} className="mt-1.5" />
                        </div>
                        <div>
                          <Label htmlFor="neighborhood">Bairro *</Label>
                          <Input id="neighborhood" placeholder="Bairro" value={customerData.neighborhood} onChange={(e) => setCustomerData({...customerData, neighborhood: e.target.value})} className="mt-1.5" />
                        </div>
                        <div>
                          <Label htmlFor="city">Cidade / UF *</Label>
                          <Input id="city" placeholder="Cidade - UF" value={customerData.city} onChange={(e) => setCustomerData({...customerData, city: e.target.value})} className="mt-1.5" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" size="lg" className="flex-1 h-14" onClick={() => setCurrentStep(1)}>
                      <ArrowLeft className="h-5 w-5 mr-2" />
                      Voltar
                    </Button>
                    <Button size="lg" className="flex-1 h-14 bg-gradient-to-r from-primary to-cyan-glow hover:opacity-90 text-primary-foreground font-bold text-lg rounded-xl" onClick={() => setCurrentStep(3)} disabled={!canProceedToStep3}>
                      Continuar para Pagamento
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </div>
                </>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <>
                  <div className="bg-card rounded-2xl border border-border overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-primary/10 to-transparent border-b border-border">
                      <h2 className="font-display text-xl font-bold flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        Forma de Pagamento
                      </h2>
                    </div>
                    <div className="p-6">
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                        <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'pix' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}>
                          <RadioGroupItem value="pix" id="pix" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold">PIX</span>
                              <span className="px-2 py-0.5 bg-green-500/20 text-green-500 text-xs font-bold rounded-full">5% OFF</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Aprovação instantânea</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary text-lg">{formatPrice(pixTotal)}</p>
                            <p className="text-xs text-green-500">Economize {formatPrice(pixDiscount)}</p>
                          </div>
                        </label>
                        
                        <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}>
                          <RadioGroupItem value="card" id="card" />
                          <div className="flex-1">
                            <span className="font-bold">Cartão de Crédito</span>
                            <p className="text-sm text-muted-foreground">Até 12x sem juros</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">{formatPrice(totalPrice)}</p>
                            <p className="text-xs text-muted-foreground">ou 12x de {formatPrice(totalPrice / 12)}</p>
                          </div>
                        </label>
                      </RadioGroup>

                      {paymentMethod === 'card' && (
                        <div className="mt-6 pt-6 border-t border-border space-y-4">
                          <h3 className="font-semibold flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-primary" />
                            Dados do Cartão
                          </h3>
                          <div>
                            <Label htmlFor="cardNumber">Número do cartão *</Label>
                            <Input id="cardNumber" placeholder="0000 0000 0000 0000" value={cardData.number} onChange={(e) => setCardData({...cardData, number: formatCardNumber(e.target.value)})} className="mt-1.5 font-mono" maxLength={19} />
                          </div>
                          <div>
                            <Label htmlFor="cardName">Nome impresso no cartão *</Label>
                            <Input id="cardName" placeholder="NOME COMPLETO" value={cardData.name} onChange={(e) => setCardData({...cardData, name: e.target.value.toUpperCase()})} className="mt-1.5" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="cardExpiry">Validade *</Label>
                              <Input id="cardExpiry" placeholder="MM/AA" value={cardData.expiry} onChange={(e) => setCardData({...cardData, expiry: formatExpiry(e.target.value)})} className="mt-1.5" maxLength={5} />
                            </div>
                            <div>
                              <Label htmlFor="cardCvv">CVV *</Label>
                              <Input id="cardCvv" placeholder="000" value={cardData.cvv} onChange={(e) => setCardData({...cardData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4)})} className="mt-1.5" maxLength={4} type="password" />
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">* Seus dados são processados de forma segura. O pagamento será analisado manualmente.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" size="lg" className="flex-1 h-14" onClick={() => setCurrentStep(2)} disabled={isProcessing}>
                      <ArrowLeft className="h-5 w-5 mr-2" />
                      Voltar
                    </Button>
                    <Button size="lg" className="flex-1 h-14 bg-gradient-to-r from-primary to-cyan-glow hover:opacity-90 text-primary-foreground font-bold text-lg rounded-xl shadow-lg shadow-primary/30" onClick={handleFinalizePurchase} disabled={isProcessing || !canFinishPayment}>
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        <>
                          <Lock className="h-5 w-5 mr-2" />
                          FINALIZAR COMPRA
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <div className="bg-card rounded-2xl border border-border overflow-hidden">
                  <div className="p-4 bg-gradient-to-r from-primary/10 to-transparent border-b border-border">
                    <h2 className="font-display text-lg font-bold">Resumo do Pedido</h2>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal ({totalItems} itens)</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Frete</span>
                      {hasFreeShipping ? <span className="text-green-500 font-bold">GRÁTIS</span> : <span>R$ 19,90</span>}
                    </div>
                    {paymentMethod === 'pix' && (
                      <div className="flex justify-between text-sm text-green-500">
                        <span className="flex items-center gap-1"><Zap className="h-4 w-4" />Desconto PIX (5%)</span>
                        <span>-{formatPrice(pixDiscount)}</span>
                      </div>
                    )}
                    <div className="border-t border-border pt-3 mt-3">
                      <div className="flex justify-between font-bold text-xl">
                        <span>Total</span>
                        <span className="text-primary">{formatPrice(paymentMethod === 'pix' ? pixTotal : totalPrice)}</span>
                      </div>
                      {paymentMethod !== 'pix' && (
                        <p className="text-xs text-muted-foreground mt-1">ou <span className="text-primary font-bold">{formatPrice(pixTotal)}</span> no PIX</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-2xl border border-border p-4 space-y-4">
                  <h3 className="font-bold text-center text-sm text-muted-foreground uppercase tracking-wide">Compra 100% Segura</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col items-center gap-2 p-3 bg-secondary/30 rounded-xl">
                      <ShieldCheck className="h-8 w-8 text-green-500" />
                      <span className="text-xs text-center font-medium">Site Seguro</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-3 bg-secondary/30 rounded-xl">
                      <Lock className="h-8 w-8 text-primary" />
                      <span className="text-xs text-center font-medium">SSL 256-bit</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-3 bg-secondary/30 rounded-xl">
                      <Truck className="h-8 w-8 text-primary" />
                      <span className="text-xs text-center font-medium">Entrega Garantida</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-3 bg-secondary/30 rounded-xl">
                      <BadgeCheck className="h-8 w-8 text-primary" />
                      <span className="text-xs text-center font-medium">Produtos Originais</span>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-2xl border border-border p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-yellow-500">{[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
                    <span className="font-bold text-sm">4.9/5</span>
                    <span className="text-xs text-muted-foreground">(2.847 avaliações)</span>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-secondary/30 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex text-yellow-500">{[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3 fill-current" />)}</div>
                        <span className="text-xs font-medium">Carlos M.</span>
                      </div>
                      <p className="text-xs text-muted-foreground">"Entrega super rápida! Produtos originais e bem embalados."</p>
                    </div>
                    <div className="p-3 bg-secondary/30 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex text-yellow-500">{[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3 fill-current" />)}</div>
                        <span className="text-xs font-medium">Ana P.</span>
                      </div>
                      <p className="text-xs text-muted-foreground">"Melhor loja de produtos automotivos! Recomendo muito."</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-full text-xs"><Check className="h-3 w-3 text-green-500" />7 dias para troca</div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-full text-xs"><Check className="h-3 w-3 text-green-500" />Nota Fiscal</div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-full text-xs"><Check className="h-3 w-3 text-green-500" />Suporte WhatsApp</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
