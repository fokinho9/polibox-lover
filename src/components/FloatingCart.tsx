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
                <ShoppingCart className="h-10 w-10 mx-aut
