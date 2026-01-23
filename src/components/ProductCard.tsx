import { ShoppingCart, Zap, Flame, Sparkles, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useQuiz } from "@/contexts/QuizContext";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  id?: string;
  name: string;
  image: string;
  oldPrice?: number;
  price: number;
  pixPrice: number;
  discount?: number;
  installments?: { count: number; value: number };
  express?: boolean;
  brand?: string;
}

const ProductCard = ({
  id,
  name,
  image,
  oldPrice,
  price,
  pixPrice,
  discount,
  installments,
  express = true,
  brand,
}: ProductCardProps) => {
  const { addToCart } = useCart();
  const { hasCompletedQuiz, discountPercent, timeRemaining } = useQuiz();
  const { toast } = useToast();

  // Apply quiz discount
  const quizMultiplier = hasCompletedQuiz ? (100 - discountPercent) / 100 : 1;
  const finalPrice = price * quizMultiplier;
  const finalPixPrice = pixPrice * quizMultiplier;
  const finalOldPrice = hasCompletedQuiz ? price : oldPrice;
  const finalDiscount = hasCompletedQuiz ? discountPercent : discount;
  const finalInstallments = installments ? {
    count: installments.count,
    value: installments.value * quizMultiplier
  } : undefined;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!id) return;

    const product = {
      id,
      name,
      price: finalPrice,
      image_url: image,
      pix_price: finalPixPrice,
      old_price: finalOldPrice,
      discount_percent: finalDiscount,
      brand,
    };

    addToCart(product as any, 1);
    
    toast({
      title: "🛒 Produto adicionado!",
      description: `${name} foi adicionado ao carrinho`,
    });
  };

  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (id) {
      return (
        <Link to={`/produto/${id}`} className="block h-full">
          {children}
        </Link>
      );
    }
    return <>{children}</>;
  };

  return (
    <CardWrapper>
      <div className="group h-full flex flex-col bg-card rounded-xl border border-border/50 transition-all duration-500 overflow-hidden hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative aspect-square bg-gradient-to-br from-muted/30 via-background to-muted/50 overflow-hidden">
          {/* Discount Badge */}
          {finalDiscount && finalDiscount > 0 && (
            <div className="absolute top-2 left-2 z-10">
              <div className="relative">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 ${hasCompletedQuiz ? 'bg-gradient-to-r from-primary to-cyan-glow' : 'bg-gradient-to-r from-red-logo to-red-logo-glow'} text-white text-[10px] font-black rounded-md shadow-lg shadow-red-logo/40`}>
                  {hasCompletedQuiz ? <Sparkles className="h-3 w-3" /> : <Flame className="h-3 w-3" />}
                  -{finalDiscount}%
                </span>
              </div>
            </div>
          )}

          {/* Express Badge */}
          {express && (
            <div className="absolute top-2 right-2 z-10">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/90 backdrop-blur-sm text-primary-foreground text-[9px] font-bold rounded-md">
                <Zap className="h-2.5 w-2.5" />
                EXPRESS
              </span>
            </div>
          )}

          {/* Product Image */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <img
              src={image}
              alt={name}
              className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-3 md:p-4">
          {/* Quiz Discount Message with Countdown */}
          {hasCompletedQuiz && (
            <div className="mb-2 p-2 bg-gradient-to-r from-primary/20 to-cyan-glow/10 border border-primary/30 rounded-lg">
              <div className="flex items-center gap-1.5 text-[10px] text-primary font-bold">
                <Sparkles className="h-3 w-3" />
                <span>DESCONTO EXCLUSIVO APLICADO!</span>
              </div>
              <div className="flex items-center gap-1 text-[9px] text-primary/80 mt-0.5">
                <Clock className="h-2.5 w-2.5" />
                <span>Expira em: {timeRemaining}</span>
              </div>
            </div>
          )}

          {/* Brand */}
          {brand && (
            <span className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">
              {brand}
            </span>
          )}

          {/* Name */}
          <h3 className="text-xs md:text-sm font-medium text-foreground/90 line-clamp-2 mb-3 min-h-[32px] md:min-h-[40px] leading-tight group-hover:text-foreground transition-colors">
            {name}
          </h3>

          {/* Prices */}
          <div className="mt-auto space-y-1.5">
            {/* Old Price */}
            {finalOldPrice && finalOldPrice > finalPrice && (
              <p className="text-[10px] text-muted-foreground">
                De: <span className="line-through">R$ {finalOldPrice.toFixed(2).replace('.', ',')}</span>
              </p>
            )}

            {/* Current Price */}
            <p className="text-xs text-muted-foreground">
              Por: <span className="text-foreground font-semibold">R$ {finalPrice.toFixed(2).replace('.', ',')}</span>
            </p>

            {/* Price - Card format */}
            <div className={`flex items-center gap-2 rounded-lg px-2.5 py-2 border ${hasCompletedQuiz ? 'bg-gradient-to-r from-primary/25 to-cyan-glow/15 border-primary/40' : 'bg-gradient-to-r from-primary/15 to-primary/5 border-primary/20'}`}>
              <div className="relative flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary animate-ping absolute" />
                <div className="w-2 h-2 rounded-full bg-primary relative" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-primary font-bold text-sm md:text-base">
                  R$ {finalPrice.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            {/* Installments */}
            {finalInstallments && (
              <p className="text-[10px] text-muted-foreground">
                ou {finalInstallments.count}x de R$ {finalInstallments.value.toFixed(2).replace('.', ',')}
              </p>
            )}
          </div>

          {/* Buy Button */}
          <Button 
            className="w-full mt-3 h-9 md:h-10 text-xs gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/30" 
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            COMPRAR
          </Button>
        </div>
      </div>
    </CardWrapper>
  );
};

export default ProductCard;