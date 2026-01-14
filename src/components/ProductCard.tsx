import { ShoppingCart, Zap, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
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
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!id) return;

    // Create a product object for cart
    const product = {
      id,
      name,
      price,
      image_url: image,
      pix_price: pixPrice,
      old_price: oldPrice,
      discount_percent: discount,
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
      <div className="group h-full flex flex-col bg-gradient-to-b from-card to-card/80 rounded-2xl border border-border hover:border-primary/40 transition-all duration-300 overflow-hidden hover:shadow-xl hover:shadow-primary/10">
        {/* Image */}
        <div className="relative aspect-square bg-gradient-to-br from-secondary/30 to-background overflow-hidden">
          {discount && (
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-destructive to-red-600 text-white text-xs font-bold rounded-full shadow-lg shadow-destructive/30">
                <Flame className="h-3.5 w-3.5" />
                -{discount}% OFF
              </span>
            </div>
          )}
          {express && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-primary via-cyan-glow to-primary text-primary-foreground text-xs text-center py-2 font-bold tracking-wider">
              ⚡ ENTREGA EXPRESS
            </div>
          )}
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain p-6 transition-all duration-500 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {brand && (
            <span className="text-xs text-primary font-bold uppercase tracking-wider mb-1.5">
              {brand}
            </span>
          )}
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-4 min-h-[40px] group-hover:text-primary transition-colors">
            {name}
          </h3>

          {/* Prices */}
          <div className="space-y-2 mt-auto">
            {oldPrice && (
              <p className="text-muted-foreground text-xs flex items-center gap-2">
                <span>De:</span>
                <span className="line-through">R$ {oldPrice.toFixed(2).replace('.', ',')}</span>
              </p>
            )}
            <p className="text-muted-foreground text-sm">
              Por: <span className="text-foreground font-bold text-base">R$ {price.toFixed(2).replace('.', ',')}</span>
            </p>
            <div className="flex items-center gap-2 bg-gradient-to-r from-primary/20 to-primary/5 rounded-xl px-3 py-2.5 -mx-1 border border-primary/20">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-lg shadow-primary/50" />
              <p className="text-primary font-bold text-lg">
                R$ {pixPrice.toFixed(2).replace('.', ',')}
              </p>
              <span className="text-xs text-primary/80 font-medium">no Pix</span>
            </div>
            {installments && (
              <p className="text-xs text-muted-foreground pt-1">
                ou <span className="font-bold text-foreground">{installments.count}x</span> de{" "}
                <span className="font-bold text-foreground">R$ {installments.value.toFixed(2).replace('.', ',')}</span>
              </p>
            )}
          </div>

          {/* Buy button */}
          <Button 
            className="w-full mt-5 h-12 text-sm gap-2 bg-gradient-to-r from-primary to-cyan-glow hover:opacity-90 text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30" 
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
            COMPRAR AGORA
          </Button>
        </div>
      </div>
    </CardWrapper>
  );
};

export default ProductCard;