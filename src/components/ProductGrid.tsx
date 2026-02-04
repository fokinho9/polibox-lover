import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { productsApi, Product } from "@/lib/api/products";
import ProductCard from "./ProductCard";
import { Loader2, Flame, ArrowRight, Sparkles } from "lucide-react";

const ProductGrid = () => {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products-home-super-ofertas'],
    queryFn: async () => {
      // Get only Vonixx kits for super ofertas
      const allProducts = await productsApi.getAll();
      return allProducts
        .filter(p => 
          p.price > 0 && 
          (p.brand?.toLowerCase().includes('vonixx') || p.name?.toLowerCase().includes('vonixx')) &&
          p.name?.toLowerCase().includes('kit')
        )
        .sort((a, b) => (a.price || 0) - (b.price || 0))
        .slice(0, 12);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes cache
  });

  if (isLoading) {
    return (
      <section className="py-12 md:py-16 bg-background">
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
    <section className="py-12 md:py-16 bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>
      
      <div className="container-main relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-red-logo to-red-logo-dark flex items-center justify-center shadow-lg shadow-red-logo/30">
                <Flame className="h-6 w-6 md:h-7 md:w-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                <Sparkles className="h-2.5 w-2.5 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h2 className="font-display font-black text-2xl md:text-3xl lg:text-4xl text-foreground">
                SUPER <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-logo to-red-logo-glow">OFERTAS</span>
              </h2>
              <p className="text-muted-foreground text-sm mt-0.5">Os melhores descontos para você</p>
            </div>
          </div>
          
          <Link 
            to="/categoria/super-ofertas" 
            className="group inline-flex items-center gap-2 px-5 py-2.5 bg-card hover:bg-card/80 border border-border hover:border-primary/30 rounded-full text-sm font-medium text-foreground transition-all duration-300"
          >
            Ver todas
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
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