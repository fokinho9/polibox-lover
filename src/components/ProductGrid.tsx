import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { productsApi, Product } from "@/lib/api/products";
import ProductCard from "./ProductCard";
import { TrendingUp, Loader2 } from "lucide-react";

const ProductGrid = () => {
  // Fetch real products from database
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products-home'],
    queryFn: async () => {
      const allProducts = await productsApi.getAll();
      // Filter products with price > 0 and return first 12
      return allProducts
        .filter(p => p.price > 0)
        .slice(0, 12);
    },
  });

  if (isLoading) {
    return (
      <section className="py-12 bg-secondary/10">
        <div className="container-main">
          <div className="flex items-center justify-center gap-2 py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-muted-foreground">Carregando produtos...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-secondary/10">
      <div className="container-main">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl text-foreground">
                MAIS <span className="text-primary">VENDIDOS</span>
              </h2>
              <p className="text-sm text-muted-foreground">Os produtos favoritos dos nossos clientes</p>
            </div>
          </div>
          <Link 
            to="/categoria/ofertas" 
            className="text-primary hover:text-cyan-glow font-medium text-sm transition-colors"
          >
            Ver todos →
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {products.map((product: Product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              image={product.image_url || "/placeholder.svg"}
              oldPrice={product.old_price || undefined}
              price={product.price}
              pixPrice={product.pix_price || product.price * 0.95}
              discount={product.discount_percent || undefined}
              installments={
                product.installments_count && product.installments_value
                  ? { count: product.installments_count, value: product.installments_value }
                  : undefined
              }
              express={product.express_delivery ?? true}
              brand={product.brand || undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
