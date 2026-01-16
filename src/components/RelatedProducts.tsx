import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingCart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { applyDiscount } from "@/lib/utils";

interface RelatedProductsProps {
  currentProductId: string;
  category: string | null;
  brand: string | null;
}

const RelatedProducts = ({ currentProductId, category, brand }: RelatedProductsProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: relatedProducts, isLoading } = useQuery({
    queryKey: ['related-products', currentProductId, category, brand],
    queryFn: async () => {
      // First try to get products from same category
      let query = supabase
        .from('products')
        .select('*')
        .neq('id', currentProductId)
        .gt('price', 0)
        .limit(8);

      if (category) {
        query = query.eq('category', category);
      }

      const { data: categoryProducts, error: categoryError } = await query;
      
      if (categoryError) throw categoryError;

      // If we have enough products from category, return them
      if (categoryProducts && categoryProducts.length >= 4) {
        return categoryProducts.slice(0, 8);
      }

      // Otherwise, try to get more products by brand or just random ones
      const { data: moreProducts, error: moreError } = await supabase
        .from('products')
        .select('*')
        .neq('id', currentProductId)
        .gt('price', 0)
        .order('created_at', { ascending: false })
        .limit(8);

      if (moreError) throw moreError;

      // Combine and dedupe
      const combined = [...(categoryProducts || []), ...(moreProducts || [])];
      const unique = combined.filter((product, index, self) =>
        index === self.findIndex((p) => p.id === product.id)
      );

      return unique.slice(0, 8);
    },
    enabled: !!currentProductId,
  });

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart(product, 1);
    toast({
      title: "🛒 Produto adicionado!",
      description: `${product.name} foi adicionado ao carrinho`,
    });
  };

  if (isLoading) {
    return (
      <section className="mt-12 md:mt-16">
        <h2 className="text-xl md:text-2xl font-display font-bold mb-6">Produtos Relacionados</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card rounded-2xl p-4 animate-pulse">
              <div className="aspect-square bg-muted rounded-xl mb-3" />
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-5 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 md:mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-display font-bold">Produtos Relacionados</h2>
        {category && (
          <Link 
            to={`/categoria/${category}`}
            className="text-sm text-primary hover:underline font-medium"
          >
            Ver todos →
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {relatedProducts.map((product) => {
          const discountedPrice = applyDiscount(product.price);
          const pixPrice = applyDiscount(product.pix_price || product.price * 0.95);
          
          return (
            <Link
              key={product.id}
              to={`/produto/${product.id}`}
              className="group bg-card hover:bg-card/80 rounded-2xl p-3 md:p-4 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 border border-transparent hover:border-primary/20"
            >
              {/* Image */}
              <div className="relative aspect-square mb-3 rounded-xl overflow-hidden bg-muted/50">
                <img
                  src={product.image_url || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
                
                {/* Discount badge */}
                {product.discount_percent && product.discount_percent > 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                    -{product.discount_percent}%
                  </div>
                )}
                
                {/* Express badge */}
                {product.express_delivery && (
                  <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                  </div>
                )}
              </div>

              {/* Product info */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5rem]">
                  {product.name}
                </h3>
                
                {/* Prices */}
                <div className="space-y-1">
                {product.old_price && product.old_price > product.price && (
                    <p className="text-xs text-muted-foreground line-through">
                      R$ {applyDiscount(product.old_price).toFixed(2)}
                    </p>
                  )}
                  <p className="text-lg font-bold text-primary">
                    R$ {discountedPrice.toFixed(2)}
                  </p>
                  <p className="text-xs text-emerald-400 font-medium">
                    no PIX: R$ {pixPrice.toFixed(2)}
                  </p>
                </div>

                {/* Add to cart button */}
                <Button
                  size="sm"
                  className="w-full mt-2 gap-2 bg-primary hover:bg-primary/90 rounded-xl"
                  onClick={(e) => handleAddToCart(e, product)}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Comprar
                </Button>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default RelatedProducts;
