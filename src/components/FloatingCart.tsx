import { ShoppingCart, X, Plus, Minus, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";

const FloatingCart = () => {
  const { items, isCartOpen, setIsCartOpen, totalItems, totalPrice, removeFromCart, updateQuantity, lastAddedProduct } = useCart();

  return (
    <>
      {/* Top Notification - Always visible when product is added */}
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

      {/* Floating Cart Button - Bottom right above WhatsApp */}
      {totalItems > 0 && !isCartOpen && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-32 right-4 z-40 w-14 h-14 bg-primary hover:bg-cyan-glow text-primary-foreground rounded-full shadow-lg shadow-primary/30 flex items-center justify-center transition-all hover:scale-110 animate-fade-in animate-bounce"
          style={{
            animation: 'bounce 1s ease-in-out infinite, pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        >
          <ShoppingCart className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-destructive text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {totalItems}
          </span>

          {/* Glow ring effect */}
          <div className="absolute inset-0 rounded-full bg-primary opacity-30 animate-ping" />
        </button>
      )}

      {/* Cart Panel */}
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 animate-fade-in cursor-pointer"
            onClick={() => setIsCartOpen(false)}
          />
          
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border z-50 animate-slide-in-right shadow-2xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b border-border flex items-center justify-between bg-gradient-to-r from-primary/10 to-cyan-glow/10">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors"
                  >
                    <X className="h-5 w-5 text-primary" />
                  </button>
                  <div>
                    <h2 className="font-display text-lg font-bold">Carrinho</h2>
                    <p className="text-xs text-muted-foreground">{totalItems} item(s)</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)} className="hover:bg-destructive/10 hover:text-destructive">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Seu carrinho está vazio</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.product.id} className="flex gap-4 p-3 bg-secondary/30 rounded-xl">
                      <div className="w-20 h-20 rounded-lg bg-card overflow-hidden flex-shrink-0">
                        <img 
                          src={item.product.image_url || "/placeholder.svg"} 
                          alt={item.product.name}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium line-clamp-2">{item.product.name}</h3>
                        <p className="text-primary font-bold mt-1">
                          R$ {item.product.price.toFixed(2).replace('.', ',')}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
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
                            className="h-7 w-7 text-destructive hover:text-destructive ml-auto"
                            onClick={() => removeFromCart(item.product.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-4 border-t border-border space-y-4 bg-card">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="text-xl font-display font-bold text-primary">
                      R$ {totalPrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <Link to="/carrinho" onClick={() => setIsCartOpen(false)}>
                    <Button className="w-full h-12 btn-buy font-display">
                      FINALIZAR COMPRA
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default FloatingCart;
