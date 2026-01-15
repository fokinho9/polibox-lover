import { useEffect, useState } from "react";
import { ShoppingCart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingBuyButtonProps {
  onBuy: () => void;
  price: number;
  pixPrice: number;
}

const FloatingBuyButton = ({ onBuy, price, pixPrice }: FloatingBuyButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);

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
            <div>
              <p className="text-xs text-muted-foreground">Por apenas</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-display font-bold text-primary">
                  R$ {pixPrice.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-xs text-primary/80">no PIX</span>
              </div>
            </div>
            <Button 
              onClick={onBuy}
              className="h-14 px-8 btn-buy gap-2 text-base font-display relative overflow-hidden"
            >
              <ShoppingCart className="h-5 w-5" />
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
