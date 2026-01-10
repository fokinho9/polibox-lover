import { ShoppingCart, Zap, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
      <div className="card-product group h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square bg-gradient-to-br from-secondary/50 to-secondary/20 overflow-hidden">
          {discount && (
            <div className="absolute top-3 left-3 z-10">
              <span className="discount-badge flex items-center gap-1">
                <Zap className="h-3 w-3" />
                -{discount}%
              </span>
            </div>
          )}
          {express && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-primary to-cyan-glow text-primary-foreground text-xs text-center py-1.5 font-bold tracking-wide">
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
            <span className="text-xs text-primary/80 font-semibold uppercase tracking-wide mb-1">
              {brand}
            </span>
          )}
          <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-4 min-h-[40px] group-hover:text-primary transition-colors">
            {name}
          </h3>

          {/* Prices */}
          <div className="space-y-1.5 mt-auto">
            {oldPrice && (
              <p className="price-old flex items-center gap-2">
                <span>De:</span>
                <span>R$ {oldPrice.toFixed(2).replace('.', ',')}</span>
              </p>
            )}
            <p className="text-muted-foreground text-sm">
              Por: <span className="price-current text-foreground">R$ {price.toFixed(2).replace('.', ',')}</span>
            </p>
            <div className="flex items-center gap-2 bg-primary/10 rounded-lg px-3 py-2 -mx-1">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <p className="price-pix">
                R$ {pixPrice.toFixed(2).replace('.', ',')} <span className="text-xs font-normal text-primary/80">no Pix</span>
              </p>
            </div>
            {installments && (
              <p className="text-xs text-muted-foreground pt-1">
                ou <span className="font-bold text-foreground">{installments.count}x</span> de{" "}
                <span className="font-bold text-foreground">R$ {installments.value.toFixed(2).replace('.', ',')}</span> sem juros
              </p>
            )}
          </div>

          {/* Buy button */}
          <Button className="w-full mt-5 btn-buy h-12 text-sm gap-2" onClick={(e) => e.preventDefault()}>
            <ShoppingCart className="h-4 w-4" />
            COMPRAR AGORA
          </Button>
        </div>
      </div>
    </CardWrapper>
  );
};

export default ProductCard;
