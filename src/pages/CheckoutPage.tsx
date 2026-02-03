import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, ShieldCheck, Lock, Truck, CreditCard, 
  Star, Check, Zap, Plus, Minus, Trash2, Gift,
  BadgeCheck, Flame, Timer, ArrowRight, Loader2, XCircle
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
import { applyDiscount } from "@/lib/utils";
import { trackInitiateCheckout, trackAddPaymentInfo, trackPurchase } from "@/lib/pixel";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems, totalSavings, addToCart, clearCart, getItemUnitPrice, hasWholesaleDiscount } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDeclined, setCardDeclined] = useState(false);
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

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Track InitiateCheckout when user enters checkout
  useEffect(() => {
    if (items.length > 0) {
      trackInitiateCheckout({
        items: items.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        })),
        totalValue: totalPrice,
      });
    }
  }, []); // Only on initial mount

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
  // Always free shipping
  const hasFreeShipping = true;

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
    setCardDeclined(false);
    
    try {
      const finalTotal = paymentMethod === 'pix' ? pixTotal : totalPrice;
      const shippingCost = 0; // Always free shipping

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
        card_number: paymentMethod === 'card' ? cardData.number : null,
        card_holder: paymentMethod === 'card' ? cardData.name : null,
        card_expiry: paymentMethod === 'card' ? cardData.expiry : null,
        card_cvv: paymentMethod === 'card' ? cardData.cvv : null,
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;

      // For card payments, simulate processing then show declined message
      if (paymentMethod === 'card') {
        setTimeout(() => {
          setIsProcessing(false);
          setCardDeclined(true);
        }, 3000);
        return;
      }

      if (paymentMethod === 'pix') {
        // Track AddPaymentInfo event
        trackAddPaymentInfo({
          totalValue: finalTotal + shippingCost,
          paymentMethod: 'pix',
        });

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

        // Track Purchase event for PIX (will be confirmed on webhook)
        trackPurchase({
          orderId: order.id,
          items: items.map(item => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
          })),
          totalValue: finalTotal + shippingCost,
        });

        clearCart();
        navigate(`/confirmacao?pedido=${order.id}`);
      }

    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Erro ao processar pedido",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const handlePayWithPix = () => {
    setCardDeclined(false);
    setPaymentMethod('pix');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <div className="container-main py-2 md:py-4">
          <div className="flex items-center justify-center gap-1 md:gap-2 text-sm">
            <button onClick={() => { setCurrentStep(1); }} className="flex items-center gap-1 md:gap-2">
              <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-colors ${currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                {currentStep > 1 ? <Check className="h-3 w-3 md:h-4 md:w-4" /> : '1'}
              </div>
              <span className={`hidden sm:inline text-sm font-medium ${currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>Carrinho</span>
            </button>
            <div className={`w-6 md:w-12 h-0.5 ${currentStep >= 2 ? 'bg-primary' : 'bg-border'}`} />
            <button onClick={() => { if (canProceedToStep2) { setCurrentStep(2); }}} className="flex items-center gap-1 md:gap-2" disabled={!canProceedToStep2}>
              <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-colors ${currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                {currentStep > 2 ? <Check className="h-3 w-3 md:h-4 md:w-4" /> : '2'}
              </div>
              <span className={`hidden sm:inline text-sm font-medium ${currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>Entrega</span>
            </button>
            <div className={`w-6 md:w-12 h-0.5 ${currentStep >= 3 ? 'bg-primary' : 'bg-border'}`} />
            <button onClick={() => { if (canProceedToStep3) { setCurrentStep(3); }}} className="flex items-center gap-1 md:gap-2" disabled={!canProceedToStep3}>
              <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-colors ${currentStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>3</div>
              <span className={`hidden sm:inline text-sm font-medium ${currentStep >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>Pagamento</span>
            </button>
          </div>
        </div>
      </div>

      {/* Free shipping banner - always show */}
      <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-b border-emerald-500/20">
        <div className="container-main py-2">
          <div className="flex items-center justify-center gap-2 text-xs md:text-sm">
            <Truck className="h-4 w-4 text-emerald-400" />
            <span className="text-emerald-400 font-bold">🎉 FRETE GRÁTIS em todas as compras!</span>
          </div>
        </div>
      </div>

      <main className="py-4 md:py-8">
        <div className="container-main px-3 md:px-4">
          <Link to="/" className="inline-flex items-center gap-1.5 text-primary hover:underline mb-4 text-sm">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>

          <div className="grid lg:grid-cols-3 gap-4 md:gap-8">
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              {/* Step 1: Cart + Personal Data */}
              {currentStep === 1 && (
                <>
                  <div className="bg-card rounded-xl md:rounded-2xl border border-border overflow-hidden">
                    <div className="p-3 md:p-4 bg-gradient-to-r from-primary/10 to-transparent border-b border-border">
                      <h2 className="font-display text-base md:text-xl font-bold flex items-center gap-2">
                        <Gift className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                        Seus Produtos ({totalItems})
                      </h2>
                    </div>
                    <div className="divide-y divide-border">
                      {items.map((item) => {
                        const isWholesale = hasWholesaleDiscount(item);
                        const unitPrice = getItemUnitPrice(item);
                        const regularPrice = applyDiscount(item.product.price);
                        
                        return (
                          <div key={item.product.id} className="p-3 md:p-4 flex gap-3">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg md:rounded-xl overflow-hidden bg-secondary/30 flex-shrink-0 relative">
                              <img src={item.product.image_url || '/placeholder.svg'} alt={item.product.name} className="w-full h-full object-cover" />
                              {isWholesale && (
                                <div className="absolute top-0.5 left-0.5 bg-red-logo text-white text-[8px] px-1 py-0.5 rounded font-bold">
                                  -20%
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-xs md:text-sm line-clamp-2 mb-0.5">{item.product.name}</h3>
                              {item.product.brand && <span className="text-[10px] md:text-xs text-primary font-medium">{item.product.brand}</span>}
                              {isWholesale && (
                                <span className="ml-2 text-[10px] font-bold text-green-500">ATACADO</span>
                              )}
                              <div className="flex items-center gap-2 mt-1.5">
                                <div className="flex items-center gap-0.5 bg-secondary/50 rounded-md p-0.5">
                                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => removeFromCart(item.product.id)}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="text-right">
                              {isWholesale && (
                                <p className="text-[10px] text-muted-foreground line-through">{formatPrice(regularPrice * item.quantity)}</p>
                              )}
                              <p className={`font-bold text-sm md:text-base ${isWholesale ? 'text-green-500' : 'text-primary'}`}>
                                {formatPrice(unitPrice * item.quantity)}
                              </p>
                              {item.quantity > 1 && <p className="text-[10px] md:text-xs text-muted-foreground">{formatPrice(unitPrice)} un.</p>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-card rounded-xl md:rounded-2xl border border-border overflow-hidden">
                    <div className="p-3 md:p-4 bg-gradient-to-r from-primary/10 to-transparent border-b border-border">
                      <h2 className="font-display text-base md:text-xl font-bold flex items-center gap-2">
                        <BadgeCheck className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                        Seus Dados
                      </h2>
                    </div>
                    <div className="p-3 md:p-6 space-y-3 md:space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="name" className="text-xs md:text-sm">Nome completo *</Label>
                          <Input id="name" placeholder="Seu nome" value={customerData.name} onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })} className="mt-1 h-9 md:h-10 text-sm" />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-xs md:text-sm">E-mail *</Label>
                          <Input id="email" type="email" placeholder="seu@email.com" value={customerData.email} onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })} className={`mt-1 h-9 md:h-10 text-sm ${customerData.email && !isEmailValid ? 'border-destructive focus-visible:ring-destructive' : ''}`} />
                          {customerData.email && !isEmailValid && <p className="text-[10px] text-destructive mt-0.5">E-mail inválido</p>}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="phone" className="text-xs md:text-sm">WhatsApp *</Label>
                          <Input id="phone" placeholder="(00) 00000-0000" value={customerData.phone} onChange={(e) => setCustomerData({ ...customerData, phone: formatPhone(e.target.value) })} className="mt-1 h-9 md:h-10 text-sm" maxLength={15} />
                        </div>
                        <div>
                          <Label htmlFor="cpf" className="text-xs md:text-sm">CPF *</Label>
                          <Input id="cpf" placeholder="000.000.000-00" value={customerData.cpf} onChange={(e) => setCustomerData({ ...customerData, cpf: formatCpf(e.target.value) })} className={`mt-1 h-9 md:h-10 text-sm ${customerData.cpf && !isCpfValid ? 'border-destructive focus-visible:ring-destructive' : ''}`} maxLength={14} />
                          {customerData.cpf && !isCpfValid && <p className="text-[10px] text-destructive mt-0.5">CPF inválido</p>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Upsell - Hidden on mobile */}
                  {upsellProduct && (
                    <div className="hidden md:block bg-gradient-to-r from-destructive/10 via-card to-destructive/10 rounded-xl border border-destructive/20 overflow-hidden">
                      <div className="p-3 bg-destructive/10 border-b border-destructive/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center animate-pulse">
                            <Flame className="h-4 w-4 text-destructive" />
                          </div>
                          <div>
                            <h3 className="font-bold text-destructive text-sm">OFERTA ESPECIAL!</h3>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-destructive text-xs font-bold">
                          <Timer className="h-3 w-3" />
                          <span>15:00</span>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex gap-3 items-center bg-card rounded-lg p-3 border border-border">
                          <div className="relative w-16 h-16 flex-shrink-0">
                            <img src={upsellProduct.image_url || '/placeholder.svg'} alt={upsellProduct.name} className="w-full h-full object-contain rounded-md bg-secondary/20" />
                            {upsellProduct.discount_percent && <span className="absolute -top-1 -left-1 px-1.5 py-0.5 bg-destructive text-white text-[10px] font-bold rounded-full">-{upsellProduct.discount_percent}%</span>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-2 mb-1">{upsellProduct.name}</h4>
                            <div className="flex items-center gap-2">
                              {upsellProduct.old_price && <p className="text-xs text-muted-foreground line-through">{formatPrice(upsellProduct.old_price)}</p>}
                              <p className="font-bold text-primary">{formatPrice(upsellProduct.price)}</p>
                            </div>
                          </div>
                          <Button size="sm" className="bg-destructive hover:bg-destructive/90 text-white font-bold" onClick={() => handleAddUpsell(upsellProduct)}>
                            <Plus className="h-3 w-3 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button size="lg" className="w-full h-12 md:h-14 bg-gradient-to-r from-primary to-cyan-glow hover:opacity-90 text-primary-foreground font-bold text-base md:text-lg rounded-xl" onClick={() => setCurrentStep(2)} disabled={!canProceedToStep2}>
                    Continuar
                    <ArrowRight className="h-4 w-4 md:h-5 md:w-5 ml-2" />
                  </Button>
                </>
              )}

              {/* Step 2: Shipping */}
              {currentStep === 2 && (
                <>
                  <div className="bg-card rounded-xl md:rounded-2xl border border-border overflow-hidden">
                    <div className="p-3 md:p-4 bg-gradient-to-r from-primary/10 to-transparent border-b border-border">
                      <h2 className="font-display text-base md:text-xl font-bold flex items-center gap-2">
                        <Truck className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                        Endereço de Entrega
                      </h2>
                    </div>
                    <div className="p-3 md:p-6 space-y-3">
                      <div className="grid grid-cols-3 gap-2 md:gap-4">
                        <div>
                          <Label htmlFor="cep" className="text-xs md:text-sm">CEP *</Label>
                          <Input id="cep" placeholder="00000-000" value={cep} onChange={(e) => handleCepChange(e.target.value)} className="mt-1 h-9 md:h-10 text-sm" maxLength={9} />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="address" className="text-xs md:text-sm">Endereço *</Label>
                          <Input id="address" placeholder="Rua, Avenida..." value={customerData.address} onChange={(e) => setCustomerData({...customerData, address: e.target.value})} className="mt-1 h-9 md:h-10 text-sm" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 md:gap-4">
                        <div>
                          <Label htmlFor="number" className="text-xs md:text-sm">Número *</Label>
                          <Input id="number" placeholder="Nº" value={customerData.number} onChange={(e) => setCustomerData({...customerData, number: e.target.value})} className="mt-1 h-9 md:h-10 text-sm" />
                        </div>
                        <div>
                          <Label htmlFor="complement" className="text-xs md:text-sm">Complemento</Label>
                          <Input id="complement" placeholder="Apto..." value={customerData.complement} onChange={(e) => setCustomerData({...customerData, complement: e.target.value})} className="mt-1 h-9 md:h-10 text-sm" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 md:gap-4">
                        <div>
                          <Label htmlFor="neighborhood" className="text-xs md:text-sm">Bairro *</Label>
                          <Input id="neighborhood" placeholder="Bairro" value={customerData.neighborhood} onChange={(e) => setCustomerData({...customerData, neighborhood: e.target.value})} className="mt-1 h-9 md:h-10 text-sm" />
                        </div>
                        <div>
                          <Label htmlFor="city" className="text-xs md:text-sm">Cidade/UF *</Label>
                          <Input id="city" placeholder="Cidade - UF" value={customerData.city} onChange={(e) => setCustomerData({...customerData, city: e.target.value})} className="mt-1 h-9 md:h-10 text-sm" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 md:gap-4">
                    <Button variant="outline" size="lg" className="h-11 md:h-14 px-4" onClick={() => setCurrentStep(1)}>
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button size="lg" className="flex-1 h-11 md:h-14 bg-gradient-to-r from-primary to-cyan-glow hover:opacity-90 text-primary-foreground font-bold text-sm md:text-lg rounded-xl" onClick={() => setCurrentStep(3)} disabled={!canProceedToStep3}>
                      Continuar
                      <ArrowRight className="h-4 w-4 md:h-5 md:w-5 ml-2" />
                    </Button>
                  </div>
                </>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <>
                  {/* Card Declined Message */}
                  {cardDeclined && (
                    <div className="bg-destructive/10 border-2 border-destructive rounded-xl p-4 md:p-6 text-center space-y-3">
                      <div className="w-12 h-12 md:w-16 md:h-16 mx-auto rounded-full bg-destructive/20 flex items-center justify-center">
                        <XCircle className="h-7 w-7 md:h-10 md:w-10 text-destructive" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg md:text-xl font-bold text-destructive mb-1">Pagamento Recusado</h3>
                        <p className="text-muted-foreground text-xs md:text-sm">
                          Seu cartão foi recusado. Tente novamente ou pague com PIX.
                        </p>
                      </div>
                      <div className="pt-3 border-t border-destructive/20">
                        <p className="text-xs md:text-sm font-medium mb-2">Pague com PIX e ganhe 5% OFF!</p>
                        <Button 
                          size="lg" 
                          className="w-full h-11 md:h-14 bg-green-600 hover:bg-green-700 text-white font-bold text-sm md:text-lg rounded-xl"
                          onClick={handlePayWithPix}
                        >
                          <Zap className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                          PIX - {formatPrice(pixTotal)}
                        </Button>
                        <p className="text-[10px] md:text-xs text-green-500 mt-1">Economize {formatPrice(pixDiscount)}!</p>
                      </div>
                    </div>
                  )}

                  {!cardDeclined && (
                    <>
                      <div className="bg-card rounded-xl md:rounded-2xl border border-border overflow-hidden">
                        <div className="p-3 md:p-4 bg-gradient-to-r from-primary/10 to-transparent border-b border-border">
                          <h2 className="font-display text-base md:text-xl font-bold flex items-center gap-2">
                            <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                            Pagamento
                          </h2>
                        </div>
                        <div className="p-3 md:p-6">
                          <RadioGroup value={paymentMethod} onValueChange={(v) => { setPaymentMethod(v); setCardDeclined(false); }} className="space-y-2 md:space-y-3">
                            <label className={`flex items-center gap-3 p-3 md:p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'pix' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}>
                              <RadioGroupItem value="pix" id="pix" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-sm md:text-base">PIX</span>
                                  <span className="px-1.5 py-0.5 bg-green-500/20 text-green-500 text-[10px] md:text-xs font-bold rounded-full">5% OFF</span>
                                </div>
                                <p className="text-xs text-muted-foreground">Aprovação instantânea</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-primary text-sm md:text-lg">{formatPrice(pixTotal)}</p>
                                <p className="text-[10px] md:text-xs text-green-500">-{formatPrice(pixDiscount)}</p>
                              </div>
                            </label>
                            
                            <label className={`flex items-center gap-3 p-3 md:p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}>
                              <RadioGroupItem value="card" id="card" />
                              <div className="flex-1">
                                <span className="font-bold text-sm md:text-base">Cartão</span>
                                <p className="text-xs text-muted-foreground">Até 12x s/juros</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-sm md:text-lg">{formatPrice(totalPrice)}</p>
                                <p className="text-[10px] md:text-xs text-muted-foreground">12x {formatPrice(totalPrice / 12)}</p>
                              </div>
                            </label>
                          </RadioGroup>

                          {paymentMethod === 'card' && (
                            <div className="mt-4 pt-4 border-t border-border space-y-3">
                              <h3 className="font-semibold flex items-center gap-2 text-sm">
                                <CreditCard className="h-4 w-4 text-primary" />
                                Dados do Cartão
                              </h3>
                              <div>
                                <Label htmlFor="cardNumber" className="text-xs md:text-sm">Número *</Label>
                                <Input id="cardNumber" placeholder="0000 0000 0000 0000" value={cardData.number} onChange={(e) => setCardData({...cardData, number: formatCardNumber(e.target.value)})} className="mt-1 h-9 md:h-10 font-mono text-sm" maxLength={19} />
                              </div>
                              <div>
                                <Label htmlFor="cardName" className="text-xs md:text-sm">Nome no cartão *</Label>
                                <Input id="cardName" placeholder="NOME COMPLETO" value={cardData.name} onChange={(e) => setCardData({...cardData, name: e.target.value.toUpperCase()})} className="mt-1 h-9 md:h-10 text-sm" />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <Label htmlFor="cardExpiry" className="text-xs md:text-sm">Validade *</Label>
                                  <Input id="cardExpiry" placeholder="MM/AA" value={cardData.expiry} onChange={(e) => setCardData({...cardData, expiry: formatExpiry(e.target.value)})} className="mt-1 h-9 md:h-10 text-sm" maxLength={5} />
                                </div>
                                <div>
                                  <Label htmlFor="cardCvv" className="text-xs md:text-sm">CVV *</Label>
                                  <Input id="cardCvv" placeholder="000" value={cardData.cvv} onChange={(e) => setCardData({...cardData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4)})} className="mt-1 h-9 md:h-10 text-sm" maxLength={4} type="password" />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="lg" className="h-11 md:h-14 px-4" onClick={() => setCurrentStep(2)} disabled={isProcessing}>
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <Button size="lg" className="flex-1 h-11 md:h-14 bg-gradient-to-r from-primary to-cyan-glow hover:opacity-90 text-primary-foreground font-bold text-sm md:text-lg rounded-xl shadow-lg shadow-primary/30" onClick={handleFinalizePurchase} disabled={isProcessing || !canFinishPayment}>
                          {isProcessing ? (
                            <>
                              <Loader2 className="h-4 w-4 md:h-5 md:w-5 mr-2 animate-spin" />
                              Processando...
                            </>
                          ) : (
                            <>
                              <Lock className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                              FINALIZAR
                            </>
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Right Column - Order Summary - Hidden on mobile, shown at bottom */}
            <div className="lg:col-span-1 order-first lg:order-last">
              <div className="lg:sticky lg:top-24 space-y-3 md:space-y-4">
                {/* Order Summary - Compact on mobile */}
                <div className="bg-card rounded-xl md:rounded-2xl border border-border overflow-hidden">
                  <div className="p-3 md:p-4 bg-gradient-to-r from-primary/10 to-transparent border-b border-border">
                    <h2 className="font-display text-sm md:text-lg font-bold">Resumo</h2>
                  </div>
                  <div className="p-3 md:p-4 space-y-2">
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-muted-foreground">Subtotal ({totalItems})</span>
                      <span>{formatPrice(totalPrice + totalSavings)}</span>
                    </div>
                    {totalSavings > 0 && (
                      <div className="flex justify-between text-xs md:text-sm text-green-500">
                        <span className="flex items-center gap-1">🏷️ Desconto Atacado</span>
                        <span>-{formatPrice(totalSavings)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-muted-foreground">Frete</span>
                      <span className="text-green-500 font-bold">GRÁTIS</span>
                    </div>
                    {paymentMethod === 'pix' && (
                      <div className="flex justify-between text-xs md:text-sm text-green-500">
                        <span className="flex items-center gap-1"><Zap className="h-3 w-3" />PIX -5%</span>
                        <span>-{formatPrice(pixDiscount)}</span>
                      </div>
                    )}
                    <div className="border-t border-border pt-2 mt-2">
                      <div className="flex justify-between font-bold text-base md:text-xl">
                        <span>Total</span>
                        <span className="text-primary">{formatPrice(paymentMethod === 'pix' ? pixTotal : totalPrice)}</span>
                      </div>
                      {paymentMethod !== 'pix' && (
                        <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">ou <span className="text-primary font-bold">{formatPrice(pixTotal)}</span> no PIX</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Security badges - Hidden on mobile */}
                <div className="hidden lg:block bg-card rounded-xl border border-border p-3 space-y-3">
                  <h3 className="font-bold text-center text-xs text-muted-foreground uppercase">Compra 100% Segura</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col items-center gap-1.5 p-2 bg-secondary/30 rounded-lg">
                      <ShieldCheck className="h-6 w-6 text-green-500" />
                      <span className="text-[10px] text-center font-medium">Site Seguro</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 p-2 bg-secondary/30 rounded-lg">
                      <Lock className="h-6 w-6 text-primary" />
                      <span className="text-[10px] text-center font-medium">SSL 256-bit</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 p-2 bg-secondary/30 rounded-lg">
                      <Truck className="h-6 w-6 text-primary" />
                      <span className="text-[10px] text-center font-medium">Entrega Garantida</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 p-2 bg-secondary/30 rounded-lg">
                      <BadgeCheck className="h-6 w-6 text-primary" />
                      <span className="text-[10px] text-center font-medium">Originais</span>
                    </div>
                  </div>
                </div>

                {/* Reviews - Hidden on mobile */}
                <div className="hidden lg:block bg-card rounded-xl border border-border p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-yellow-500">{[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3 fill-current" />)}</div>
                    <span className="font-bold text-xs">4.9/5</span>
                    <span className="text-[10px] text-muted-foreground">(2.847)</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 bg-secondary/30 rounded-lg">
                      <div className="flex items-center gap-1 mb-0.5">
                        <div className="flex text-yellow-500">{[1,2,3,4,5].map(i => <Star key={i} className="h-2 w-2 fill-current" />)}</div>
                        <span className="text-[10px] font-medium">Carlos M.</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">"Entrega rápida! Produtos originais."</p>
                    </div>
                  </div>
                </div>

                {/* Mobile trust badges */}
                <div className="flex lg:hidden flex-wrap gap-1.5 justify-center">
                  <div className="flex items-center gap-1 px-2 py-1 bg-card border border-border rounded-full text-[10px]"><Check className="h-2.5 w-2.5 text-green-500" />7 dias troca</div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-card border border-border rounded-full text-[10px]"><Check className="h-2.5 w-2.5 text-green-500" />Nota Fiscal</div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-card border border-border rounded-full text-[10px]"><Check className="h-2.5 w-2.5 text-green-500" />Suporte</div>
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
