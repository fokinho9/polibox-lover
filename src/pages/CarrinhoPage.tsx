import { Link } from "react-router-dom";
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus, CreditCard, Truck, Shield, ArrowRight, Zap } from "lucide-react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

const CarrinhoPage = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const pixDiscount = totalPrice * 0.05;
  const pixTotal = totalPrice - pixDiscount;
  const freeShippingThreshold = 299;
  const hasFreeShipping = totalPrice >= freeShippingThreshold;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Navigation />
        
        <main className="py-16">
          <div className="container-main">
            <div className="max-w-md mx-auto text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-primary" />
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold mb-4">
                Seu carrinho está vazio
              </h1>
              <p className="text-muted-foreground mb-8">
                Explore nossa loja e encontre os melhores produtos para estética automotiva!
              </p>
              <Link to="/">
                <Button size="lg" className="bg-gradient-to-r from-primary to-cyan-glow text-primary-foreground font-semibold">
                  Continuar Comprando
                </Button>
              </Link>
            </div>

            {/* Benefits */}
            <div className="grid md:grid-cols-3 gap-6 mt-16">
              <div className="text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Truck className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Frete Grátis</h3>
                <p className="text-sm text-muted-foreground">Em compras acima de R$ 299</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <CreditCard className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Parcele em 12x</h3>
                <p className="text-sm text-muted-foreground">Sem juros no cartão</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Compra Segura</h3>
                <p className="text-sm text-muted-foreground">Seus dados protegidos</p>
              </div>
            </div>
          </div>
        </main>

        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      
      <main className="py-8">
        <div className="container-main">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Continuar Comprando
              </Button>
            </Link>
          </div>

          <h1 className="font-display text-3xl font-bold mb-8 flex items-center gap-3">
            <ShoppingBag className="h-8 w-8 text-primary" />
            Meu Carrinho ({totalItems})
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="bg-card rounded-2xl p-5 border border-border flex gap-4 hover:border-primary/20 transition-colors">
                  <div className="w-28 h-28 bg-secondary/30 rounded-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={item.product.image_url || '/placeholder.svg'} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium mb-1 line-clamp-2">{item.product.name}</h3>
                    {item.product.brand && (
                      <p className="text-xs text-primary font-medium mb-2">{item.product.brand}</p>
                    )}
                    <p className="text-primary font-bold text-lg">{formatPrice(item.product.price)}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-1 bg-secondary/50 rounded-xl p-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-10 text-center font-bold">{item.quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:bg-destructive/10 rounded-lg"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl border border-border sticky top-24 overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-primary/10 to-transparent border-b border-border">
                  <h2 className="font-display text-xl font-bold">Resumo do Pedido</h2>
                </div>
                
                <div className="p-5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frete</span>
                    {hasFreeShipping ? (
                      <span className="text-green-500 font-bold">Grátis</span>
                    ) : (
                      <span>Calcular no checkout</span>
                    )}
                  </div>
                  <div className="flex justify-between text-sm text-green-500">
                    <span className="flex items-center gap-1">
                      <Zap className="h-4 w-4" />
                      Desconto Pix (5%)
                    </span>
                    <span>-{formatPrice(pixDiscount)}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-bold text-xl">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(pixTotal)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">*Valor com desconto Pix</p>
                </div>

                <div className="p-5 pt-0">
                  <Link to="/checkout">
                    <Button size="lg" className="w-full h-14 bg-gradient-to-r from-primary to-cyan-glow hover:opacity-90 text-primary-foreground font-bold text-lg gap-2 rounded-xl shadow-lg shadow-primary/30">
                      Ir para Checkout
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    Pagamento 100% seguro via Pix, cartão ou boleto
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default CarrinhoPage;