import { useEffect, useState } from "react";
import { ShoppingCart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingBuyButtonProps {
  onBuy: () => void;
  price: number;
  originalPrice?: number;
  showWholesale?: boolean;
}

const FloatingBuyButton = ({ onBuy, price, originalPrice, showWholesale }: FloatingBuyButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);

  // Calculate wholesale price (20% off)
  const wholesalePrice = price * 0.8;

  useEffect(() => {
    const handleScroll = () => {
      // Show button when scrolled past 400px
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-background via-background to-transparent pb-6 pt-8 animate-fade-in">
      <div className="container-main max-w-lg mx-auto">
        <div className="bg-card/95 backdrop-blur-md rounded-2xl border border-primary/30 p-4 shadow-2xl shadow-primary/20">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase">Por apenas</span>
              <span className="text-xl font-display font-bold text-primary">
                R$ {price.toFixed(2).replace('.', ',')}
              </span>
              {/* Wholesale price indicator */}
              <div className="flex items-center gap-1.5 mt-1">
                <Users className="h-3 w-3 text-emerald-400" />
                <span className="text-[10px] text-emerald-400 font-medium">
                  5+ un: R$ {wholesalePrice.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
            <Button 
              onClick={onBuy}
              className="h-12 px-6 btn-buy gap-2 text-sm font-display relative overflow-hidden animate-pulse-glow"
            >
              <ShoppingCart className="h-4 w-4" />
              COMPRAR
              
              {/* Animated glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingBuyButton;
