import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  name: string;
  image: string;
  oldPrice?: number;
  price: number;
  pixPrice: number;
  discount?: number;
  installments?: { count: number; value: number };
  express?: boolean;
}

const ProductCard = ({
  name,
  image,
  oldPrice,
  price,
  pixPrice,
  discount,
  installments,
  express = true,
}: ProductCardProps) => {
  return (
    <div className="card-product group">
      {/* Image */}
      <div className="relative aspect-square bg-secondary/30 overflow-hidden">
        {discount && (
          <div className="absolute top-3 left-3 z-10">
            <span className="discount-badge">-{discount}% OFF</span>
          </div>
        )}
        {express && (
          <div className="absolute bottom-0 left-0 right-0 bg-primary text-primary-foreground text-xs text-center py-1 font-medium">
            ENTREGA EXPRESS!
          </div>
        )}
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-3 min-h-[40px]">
          {name}
        </h3>

        {/* Prices */}
        <div className="space-y-1">
          {oldPrice && (
            <p className="price-old">
              De: R$ {oldPrice.toFixed(2).replace('.', ',')}
            </p>
          )}
          <p className="text-muted-foreground text-sm">
            Por: <span className="price-current text-foreground">R$ {price.toFixed(2).replace('.', ',')}</span>
          </p>
          <p className="price-pix">
            R$ {pixPrice.toFixed(2).replace('.', ',')} com desconto via <span className="font-bold">Pix</span>
          </p>
          {installments && (
            <p className="text-xs text-muted-foreground">
              ou <span className="font-bold">{installments.count}x</span> de{" "}
              <span className="font-bold">R$ {installments.value.toFixed(2).replace('.', ',')}</span> Sem juros
            </p>
          )}
        </div>

        {/* Buy button */}
        <Button className="w-full mt-4 bg-primary hover:bg-cyan-glow text-primary-foreground font-semibold">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Comprar
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
