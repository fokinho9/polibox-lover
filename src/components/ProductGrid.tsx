import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { productsApi, Product } from "@/lib/api/products";
import ProductCard from "./ProductCard";
import { Zap, Loader2, Flame, Star } from "lucide-react";

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
      <section className="py-16 bg-gradient-to-b from-background to-secondary/20">
        <div className="container-main">
          <div className="flex items-center justify-center gap-3 py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-lg text-muted-foreground">Carregando ofertas...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-background via-secondary/10 to-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-glow/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container-main relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-cyan-glow flex items-center justify-center shadow-lg shadow-primary/30">
                <Flame className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-destructive rounded-full flex items-center justify-center animate-pulse">
                <Zap className="h-3 w-3 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-display text-3xl md:text-4xl text-foreground">
                  SUPER <span className="text-primary text-shadow-glow">OFERTAS</span>
                </h2>
                <div className="hidden md:flex items-center gap-1 px-3 py-1 bg-destructive/20 text-destructive rounded-full text-xs font-bold animate-pulse">
                  <Star className="h-3 w-3 fill-current" />
                  ATÉ 60% OFF
                </div>
              </div>
              <p className="text-muted-foreground mt-1">Produtos com os melhores descontos</p>
            </div>
          </div>
          <Link 
            to="/categoria/ofertas" 
            className="group flex items-center gap-2 px-5 py-2.5 bg-primary/10 hover:bg-primary/20 rounded-full text-primary font-semibold transition-all"
          >
            Ver todas ofertas
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* Discount banner */}
        <div className="mb-8 p-4 bg-gradient-to-r from-destructive/20 via-primary/10 to-destructive/20 rounded-2xl border border-destructive/20 flex flex-wrap items-center justify-center gap-4 md:gap-8 text-center">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-bold text-foreground">ATÉ 60% OFF</span>
          </div>
          <div className="w-px h-6 bg-border hidden md:block" />
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary">+5% OFF</span>
            <span className="text-muted-foreground">no PIX</span>
          </div>
          <div className="w-px h-6 bg-border hidden md:block" />
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Frete</span>
            <span className="font-bold text-green-500">GRÁTIS*</span>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
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