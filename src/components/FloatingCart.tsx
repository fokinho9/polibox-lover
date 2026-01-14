import { ShoppingCart, X, Trash2, Plus, Minus, Check } from "lucide-react";
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
          <div className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg shadow-green-500/30 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Check className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium text-sm">Produto adicionado ao carrinho!</p>
              <p className="text-xs text-white/80 truncate max-w-[200px]">{lastAddedProduct.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Cart Button with effect - Bottom right above WhatsApp */}
      {totalItems > 0 && !isCartOpen && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 animate-fade-in group"
          style={{
            boxShadow: '0 0 20px hsl(var(--primary) / 0.5), 0 10px 30px -10px hsl(var(--primary) / 0.6)',
          }}
        >
          <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-destructive text-white text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
            {totalItems}
          </span>
          {/* Glow effect on hover */}
          <div className="absolute inset-0 rounded-full bg-primary opacity-0 group-hover:opacity-30 blur-xl transition-opacity" />
        </button>
      )}

      {/* Cart Backdrop */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Cart Panel */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-border z-50 transform transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Carrinho ({totalItems})
            </h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsCartOpen(false)}
              className="hover:bg-secondary"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p>Seu carrinho está vazio</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="flex gap-4 p-3 bg-card rounded-lg border border-border">
                  <img 
                    src={item.product.image_url || '/placeholder.svg'} 
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm line-clamp-2">{item.product.name}</h3>
                    <p className="text-primary font-bold mt-1">{formatPrice(item.product.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 ml-auto text-destructive hover:bg-destructive/10"
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
            <div className="border-t border-border p-4 space-y-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary">{formatPrice(totalPrice)}</span>
              </div>
              <Link to="/carrinho" onClick={() => setIsCartOpen(false)}>
                <Button className="w-full bg-primary hover:bg-cyan-glow text-primary-foreground font-semibold py-6">
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
