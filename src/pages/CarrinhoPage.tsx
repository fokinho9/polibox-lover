import { Link } from "react-router-dom";
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus, CreditCard, Truck, Shield } from "lucide-react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";

const CarrinhoPage = () => {
  // Empty cart state for now
  const cartItems: any[] = [];

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Navigation />
        
        <main className="py-16">
          <div className="container-main">
            <div className="max-w-md mx-auto text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-card flex items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold mb-4">
                Seu carrinho está vazio
              </h1>
              <p className="text-muted-foreground mb-8">
                Explore nossa loja e encontre os melhores produtos para estética automotiva!
              </p>
              <Link to="/">
                <Button size="lg" className="bg-primary hover:bg-cyan-glow text-primary-foreground font-semibold">
                  Continuar Comprando
                </Button>
              </Link>
            </div>

            {/* Benefits */}
            <div className="grid md:grid-cols-3 gap-6 mt-16">
              <div className="text-center p-6 rounded-xl bg-card border border-border">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Frete Grátis</h3>
                <p className="text-sm text-muted-foreground">Em compras acima de R$ 299</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-card border border-border">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Parcele em 12x</h3>
                <p className="text-sm text-muted-foreground">Sem juros no cartão</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-card border border-border">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
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

          <h1 className="font-display text-3xl font-bold mb-8">Meu Carrinho</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-card rounded-xl p-4 border border-border flex gap-4">
                  <div className="w-24 h-24 bg-secondary/30 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1 line-clamp-2">{item.name}</h3>
                    <p className="text-primary font-bold">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">1</span>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl p-6 border border-border sticky top-24">
                <h2 className="font-display text-xl font-bold mb-4">Resumo do Pedido</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>R$ 0,00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frete</span>
                    <span className="text-green-500">Grátis</span>
                  </div>
                  <div className="flex justify-between text-sm text-primary">
                    <span>Desconto Pix (5%)</span>
                    <span>-R$ 0,00</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">R$ 0,00</span>
                  </div>
                </div>

                <Button size="lg" className="w-full bg-primary hover:bg-cyan-glow text-primary-foreground font-semibold mb-3">
                  Finalizar Compra
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Pagamento 100% seguro via Pix, cartão ou boleto
                </p>
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
