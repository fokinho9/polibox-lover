import { ShoppingCart, X, Trash2, Plus, Minus, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";

const FloatingCart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems, isCartOpen, setIsCartOpen, lastAddedProduct } = useCart();

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <>
      {/* Top notification when product is added */}
      {lastAddedProduct && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-green-500/40 flex items-center gap-4 border border-green-400/30">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Check className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-base">Produto adicionado ao carrinho!</p>
              <p className="text-sm text-white/90 truncate max-w-[250px]">{lastAddedProduct.name}</p>
            </div>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="ml-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition-colors"
            >
              Ver carrinho
            </button>
          </div>
        </div>
      )}

      {/* Floating Cart Button with effect - Bottom right above WhatsApp */}
      {totalItems > 0 && !isCartOpen && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-24 right-6 z-40 w-16 h-16 bg-gradient-to-br from-primary to-cyan-glow text-primary-foreground rounded-2xl shadow-lg flex items-center justify-center transition-all hover:scale-110 animate-fade-in group"
          style={{
            boxShadow: '0 0 30px hsl(var(--primary) / 0.6), 0 10px 40px -10px hsl(var(--primary) / 0.7)',
          }}
        >
          <ShoppingCart className="h-7 w-7 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-2 -right-2 w-7 h-7 bg-destructive text-white text-sm font-bold rounded-full flex items-center justify-center animate-scale-in shadow-lg">
            {totalItems}
          </span>
          {/* Glow effect on hover */}
          <div className="absolute inset-0 rounded-2xl bg-primary opacity-0 group-hover:opacity-40 blur-xl transition-opacity" />
        </button>
      )}

      {/* Cart Backdrop */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 backdrop-blur-md"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Cart Panel */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-primary/20 z-50 transform transition-transform duration-300 shadow-2xl ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
              Carrinho ({totalItems})
            </h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsCartOpen(false)}
              className="hover:bg-primary/10 h-10 w-10 rounded-xl"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Continue Shopping Button */}
          <button
            onClick={() => setIsCartOpen(false)}
            className="flex items-center gap-2 px-5 py-3 text-primary hover:bg-primary/5 transition-colors border-b border-border"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Continuar comprando</span>
          </button>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center text-muted-foreground py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShoppingCart className="h-10 w-10 text-primary/50" />
                </div>
                <p className="text-lg font-medium">Seu carrinho está vazio</p>
                <p className="text-sm mt-2 text-muted-foreground/70">Adicione produtos para começar</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="flex gap-4 p-4 bg-gradient-to-r from-card to-card/50 rounded-2xl border border-border hover:border-primary/30 transition-colors">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-secondary/50 flex-shrink-0">
                    <img 
                      src={item.product.image_url || '/placeholder.svg'} 
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-2">{item.product.name}</h3>
                    <p className="text-primary font-bold text-lg">{formatPrice(item.product.price)}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-1 bg-secondary/50 rounded-xl p-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-primary/20"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-10 text-center font-bold">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-primary/20"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 ml-auto text-destructive hover:bg-destructive/10 rounded-lg"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-border p-5 space-y-4 bg-gradient-to-t from-primary/5 to-transparent">
              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span className="text-primary">{formatPrice(totalPrice)}</span>
              </div>
              <Link to="/carrinho" onClick={() => setIsCartOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-primary to-cyan-glow hover:opacity-90 text-primary-foreground font-bold py-7 text-lg rounded-2xl shadow-lg shadow-primary/30">
                  FINALIZAR COMPRA
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FloatingCart;