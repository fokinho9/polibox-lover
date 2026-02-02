import { ShoppingCart, X, Trash2, Plus, Minus, ArrowLeft, Package, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { applyDiscount } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const HEADER_HEIGHT = 72; // ajuste se seu header for maior ou menor

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
    CART_LIMIT
  } = useCart();

  const { toast } = useToast();

  const formatPrice = (price: number) =>
    price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <>
      {/* Floating Button */}
      {totalItems > 0 && !isCartOpen && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-24 right-6 z-50 w-16 h-16 bg-gradient-to-br from-primary to-cyan-glow text-primary-foreground rounded-2xl shadow-lg flex items-center justify-center transition-all hover:scale-110"
        >
          <ShoppingCart className="h-7 w-7" />
          <span className="absolute -top-2 -right-2 w-7 h-7 bg-destructive text-white text-sm font-bold rounded-full flex items-center justify-center shadow-lg">
            {totalItems}
          </span>
        </button>
      )}

      {/* Backdrop */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 backdrop-blur-md"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Cart Panel */}
      <div 
        className={`fixed right-0 w-full max-w-md border-l border-primary/20 z-50 transform transition-transform duration-300 shadow-2xl ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ 
          top: HEADER_HEIGHT,
          height: `calc(100% - ${HEADER_HEIGHT}px)`,
          backgroundColor: "hsl(220, 18%, 10%)"
        }}
      >
        <div className="flex flex-col h-full relative">

          {/* Close Button */}
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setIsCartOpen(false)}
            className="absolute top-4 right-4 z-50 h-10 w-10 rounded-full bg-destructive hover:bg-destructive/90 border-0"
          >
            <X className="h-5 w-5 text-white" />
          </Button>

          {/* Header */}
          <div className="flex items-center p-5 pr-16 border-b border-border">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
              Carrinho ({totalItems})
            </h2>
          </div>

          {/* ✅ CONTINUAR COMPRANDO FIXADO ABAIXO DO HEADER */}
          <div className="sticky top-0 z-40 bg-[hsl(220,18%,10%)]">
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-full flex items-center gap-2 px-5 py-3 text-primary hover:bg-primary/10 transition-colors border-b border-border"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium">Continuar comprando</span>
            </button>
          </div>

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

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center text-muted-foreground py-16">
                <ShoppingCart className="h-10 w-10 mx-auto mb-4 opacity-40" />
                <p className="text-lg">Seu carrinho está vazio</p>
              </div>
            ) : (
              items.map((item) => {
                const isWholesale = hasWholesaleDiscount(item);
                const unitPrice = getItemUnitPrice(item);
                const regularPrice = applyDiscount(item.product.price);

                return (
                  <div key={item.product.id} className="flex gap-4 p-4 bg-card rounded-2xl border border-border">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-secondary flex-shrink-0 relative">
                      <img 
                        src={item.product.image_url || "/placeholder.svg"} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                      {isWholesale && (
                        <Badge className="absolute top-1 left-1 bg-green-500 text-white text-[10px]">
                          -20%
                        </Badge>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-sm mb-1">{item.product.name}</h3>

                      <div className="flex gap-2 items-center">
                        {isWholesale && (
                          <span className="text-xs line-through text-muted-foreground">
                            {formatPrice(regularPrice)}
                          </span>
                        )}
                        <span className="font-bold text-primary">
                          {formatPrice(unitPrice)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <Button size="icon" variant="ghost" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                          <Minus />
                        </Button>

                        <span className="font-bold">{item.quantity}</span>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            const ok = updateQuantity(item.product.id, item.quantity + 1);
                            if (!ok) {
                              toast({
                                title: "⚠️ Limite atingido",
                                description: `O carrinho não pode ultrapassar R$ ${CART_LIMIT.toFixed(2)}`,
                                variant: "destructive"
                              });
                            }
                          }}
                        >
                          <Plus />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="ml-auto text-destructive"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <Trash2 />
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
            <div className="border-t border-border p-5 space-y-3">
              {totalSavings > 0 && (
                <div className="flex justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <span className="text-green-500 font-bold">Economia:</span>
                  <span className="text-green-500 font-bold">-{formatPrice(totalSavings)}</span>
                </div>
              )}

              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span className="text-primary">{formatPrice(totalPrice)}</span>
              </div>

              <Link to="/checkout" onClick={() => setIsCartOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-primary to-cyan-glow text-primary-foreground font-bold py-6 rounded-2xl shadow-lg">
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
