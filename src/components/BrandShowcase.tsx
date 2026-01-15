import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { productsApi, Product } from "@/lib/api/products";
import { ChevronRight, Star, ShoppingBag } from "lucide-react";

const brands = [
  { name: "VONIXX", slug: "marca-vonixx", color: "from-orange-500 to-orange-600" },
  { name: "3M", slug: "marca-3m", color: "from-red-600 to-red-700" },
  { name: "EASYTECH", slug: "marca-easytech", color: "from-emerald-500 to-emerald-600" },
  { name: "WURTH", slug: "marca-wurth", color: "from-red-700 to-red-800" },
  { name: "DETAILER", slug: "marca-detailer", color: "from-blue-500 to-blue-600" },
  { name: "KERS", slug: "marca-kers", color: "from-violet-500 to-violet-600" },
  { name: "CADILLAC", slug: "marca-cadillac", color: "from-amber-500 to-amber-600" },
  { name: "SPARTAN", slug: "marca-spartan", color: "from-sky-500 to-sky-600" },
  { name: "SOFT99", slug: "marca-soft99", color: "from-pink-500 to-pink-600" },
  { name: "RAPIFIX", slug: "marca-rapifix", color: "from-yellow-500 to-yellow-600" },
];

const BrandShowcase = () => {
  const { data: allProducts = [] } = useQuery({
    queryKey: ['all-products-brands'],
    queryFn: productsApi.getAll,
  });

  const getBrandProducts = (brandName: string): Product[] => {
    return allProducts
      .filter(p => p.brand?.toLowerCase().includes(brandName.toLowerCase()) && p.price > 0)
      .slice(0, 4);
  };

  const getBrandCount = (brandName: string): number => {
    return allProducts.filter(p => p.brand?.toLowerCase().includes(brandName.toLowerCase()) && p.price > 0).length;
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <section id="marcas" className="py-12 md:py-16 bg-card/30">
      <div className="container-main">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-4">
            <Star className="h-4 w-4 text-primary" />
            <span className="text-primary font-medium text-sm">Marcas Premium</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-2 tracking-tight">
            AS MELHORES <span className="text-primary">MARCAS</span>
          </h2>
          <p className="text-muted-foreground">
            Produtos de alta qualidade para estética automotiva
          </p>
        </div>

        {/* Brands with Products */}
        <div className="space-y-8">
          {brands.map((brand, index) => {
            const brandProducts = getBrandProducts(brand.name);
            const count = getBrandCount(brand.name);
            
            if (count === 0) return null;
            
            return (
              <div key={index} className="bg-card/50 rounded-2xl border border-border/50 overflow-hidden">
                {/* Brand Header */}
                <Link 
                  to={`/categoria/${brand.slug}`}
                  className={`block bg-gradient-to-r ${brand.color} p-4 md:p-5 group`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-2xl md:text-3xl font-black text-white tracking-tight">
                        {brand.name}
                      </span>
                      <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-semibold">
                        {count} produtos
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
                      <span className="text-sm font-medium hidden sm:inline">Ver todos</span>
                      <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>

                {/* Products Grid */}
                <div className="p-4 md:p-5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                    {brandProducts.map((product) => (
                      <Link
                        key={product.id}
                        to={`/produto/${product.id}`}
                        className="group/product"
                      >
                        <div className="bg-secondary/30 rounded-xl overflow-hidden border border-border/30 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
                          {/* Product Image */}
                          <div className="aspect-square relative overflow-hidden bg-background/50">
                            <img 
                              src={product.image_url || '/placeholder.svg'} 
                              alt={product.name}
                              className="w-full h-full object-contain p-2 group-hover/product:scale-105 transition-transform duration-300"
                            />
                            {product.discount_percent && product.discount_percent > 0 && (
                              <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded">
                                -{product.discount_percent}%
                              </span>
                            )}
                          </div>
                          
                          {/* Product Info */}
                          <div className="p-2.5">
                            <h4 className="text-xs font-medium text-foreground line-clamp-2 leading-tight mb-2 min-h-[2rem]">
                              {product.name}
                            </h4>
                            <div className="flex items-center justify-between">
                              <div>
                                {product.old_price && product.old_price > product.price && (
                                  <span className="text-[10px] text-muted-foreground line-through block">
                                    {formatPrice(product.old_price)}
                                  </span>
                                )}
                                <span className="text-sm font-bold text-primary">
                                  {formatPrice(product.price)}
                                </span>
                              </div>
                              <div className="p-1.5 rounded-full bg-primary/10 text-primary opacity-0 group-hover/product:opacity-100 transition-opacity">
                                <ShoppingBag className="h-3 w-3" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BrandShowcase;