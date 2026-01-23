import { ShoppingCart, X, Trash2, Plus, Minus, Check, ArrowLeft, Package, Sparkles, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { applyDiscount } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const FloatingCart = () => {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    totalPrice, 
    totalItems, 
    totalSavings,
    isCartOpen, 
    setIsCartOpen, 
    lastAddedProduct,
    getItemUnitPrice,
    hasWholesaleDiscount,
    hasCartWholesale,
    isOverLimit,
    CART_LIMIT
  } = useCart();
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <>
      {/* Floating Cart Button with effect - Bottom right above WhatsApp */}
      {totalItems > 0 && !isCartOpen && (
        <button
          onClick={() => setIsCartOpen(true)}
          className={`fixed bottom-24 right-6 z-50 w-16 h-16 bg-gradient-to-br from-primary to-cyan-glow text-primary-foreground rounded-2xl shadow-lg flex items-center justify-center transition-all hover:scale-110 group ${lastAddedProduct ? 'animate-bounce' : 'animate-fade-in'}`}
          style={{
            boxShadow: lastAddedProduct 
              ? '0 0 50px hsl(var(--primary) / 0.9), 0 0 80px hsl(var(--primary) / 0.6)'
              : '0 0 30px hsl(var(--primary) / 0.6), 0 10px 40px -10px hsl(var(--primary) / 0.7)',
          }}
        >
          <ShoppingCart className={`h-7 w-7 transition-transform ${lastAddedProduct ? 'scale-125' : 'group-hover:scale-110'}`} />
          <span className={`absolute -top-2 -right-2 w-7 h-7 bg-destructive text-white text-sm font-bold rounded-full flex items-center justify-center shadow-lg ${lastAddedProduct ? 'animate-ping' : 'animate-scale-in'}`}>
            {totalItems}
          </span>
          <span className="absolute -top-2 -right-2 w-7 h-7 bg-destructive text-white text-sm font-bold rounded-full flex items-center justify-center shadow-lg">
            {totalItems}
          </span>
          {/* Glow effect */}
          <div className={`absolute inset-0 rounded-2xl bg-primary blur-xl transition-opacity ${lastAddedProduct ? 'opacity-60' : 'opacity-0 group-hover:opacity-40'}`} />
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
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md border-l border-primary/20 z-50 transform transition-transform duration-300 shadow-2xl ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ backgroundColor: 'hsl(220, 18%, 10%)' }}
      >
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

          {/* Wholesale Banner */}
          {hasCartWholesale && items.length > 0 && (
            <div className="mx-4 mt-3 p-3 bg-green-500/15 border border-green-500/30 rounded-xl flex items-center gap-2">
              <Package className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-bold text-green-500">🎉 ATACADO ATIVADO!</p>
                <p className="text-xs text-muted-foreground">20% de desconto em todos os produtos</p>
              </div>
            </div>
          )}

          {/* Hint to unlock wholesale */}
          {!hasCartWholesale && totalItems >= 3 && totalItems < 5 && (
            <div className="mx-4 mt-3 p-3 bg-primary/10 border border-primary/30 rounded-xl flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground">
                Adicione mais <span className="font-bold text-primary">{5 - totalItems}</span> {5 - totalItems === 1 ? 'produto' : 'produtos'} para desbloquear <span className="font-bold text-green-500">20% OFF ATACADO</span>
              </p>
            </div>
          )}

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ backgroundColor: 'hsl(220, 18%, 10%)' }}>
            {items.length === 0 ? (
              <div className="text-center text-muted-foreground py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShoppingCart className="h-10 w-10 text-primary/50" />
                </div>
                <p className="text-lg font-medium">Seu carrinho está vazio</p>
                <p className="text-sm mt-2 text-muted-foreground/70">Adicione produtos para começar</p>
              </div>
            ) : (
              items.map((item) => {
                const isWholesale = hasWholesaleDiscount(item);
                const unitPrice = getItemUnitPrice(item);
                const regularPrice = applyDiscount(item.product.price);
                
                return (
                  <div key={item.product.id} className="flex gap-4 p-4 bg-gradient-to-r from-card to-card/50 rounded-2xl border border-border hover:border-primary/30 transition-colors">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-secondary/50 flex-shrink-0 relative">
                      <img 
                        src={item.product.image_url || '/placeholder.svg'} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                      {isWholesale && (
                        <div className="absolute top-1 left-1">
                          <Badge className="bg-green-500 text-white text-[8px] px-1.5 py-0.5">
                            -20%
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm line-clamp-2 mb-1">{item.product.name}</h3>
                      
                      {/* Wholesale Badge */}
                      {isWholesale && (
                        <div className="flex items-center gap-1 mb-1">
                          <Package className="h-3 w-3 text-green-500" />
                          <span className="text-[10px] font-bold text-green-500">ATACADO</span>
                        </div>
                      )}
                      
                      {/* Price */}
                      <div className="flex items-center gap-2">
                        {isWholesale && (
                          <span className="text-xs text-muted-foreground line-through">
                            {formatPrice(regularPrice)}
                          </span>
                        )}
                        <span className={`font-bold text-lg ${isWholesale ? 'text-green-500' : 'text-primary'}`}>
                          {formatPrice(unitPrice)}
                        </span>
                      </div>
                      
                      {/* Quantity hint for wholesale */}
                      {!isWholesale && item.quantity >= 3 && (
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          +{5 - item.quantity} unid. para desconto atacado
                        </p>
                      )}
                      
                      <div className="flex items-center gap-3 mt-2">
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
                          onClick={() => {
                            const success = updateQuantity(item.product.id, item.quantity + 1);
                            if (!success) {
                              toast({
                                title: "⚠️ Limite atingido",
                                description: `O carrinho não pode ultrapassar R$ ${CART_LIMIT.toFixed(2).replace('.', ',')} para manter o frete grátis.`,
                                variant: "destructive"
                              });
                            }
                          }}
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
                );
              })
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-border p-5 space-y-3 bg-gradient-to-t from-primary/5 to-transparent">
              {/* Savings Banner */}
              {totalSavings > 0 && (
                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-bold text-green-500">Economia atacado:</span>
                  </div>
                  <span className="font-bold text-green-500">-{formatPrice(totalSavings)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span className="text-primary">{formatPrice(totalPrice)}</span>
              </div>
              <Link to="/checkout" onClick={() => setIsCartOpen(false)}>
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