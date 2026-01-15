import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { productsApi, Product } from "@/lib/api/products";
import { ChevronRight, Star } from "lucide-react";

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
      .slice(0, 3);
  };

  const getBrandCount = (brandName: string): number => {
    return allProducts.filter(p => p.brand?.toLowerCase().includes(brandName.toLowerCase()) && p.price > 0).length;
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
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-2">
            AS MELHORES <span className="text-primary">MARCAS</span>
          </h2>
          <p className="text-muted-foreground">
            Produtos de alta qualidade para estética automotiva
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {brands.map((brand, index) => {
            const brandProducts = getBrandProducts(brand.name);
            const count = getBrandCount(brand.name);
            
            return (
              <Link
                key={index}
                to={`/categoria/${brand.slug}`}
                className="group"
              >
                <div className={`relative bg-gradient-to-br ${brand.color} rounded-xl p-4 md:p-5 h-32 md:h-36 flex flex-col cursor-pointer transition-all duration-300 overflow-hidden hover:shadow-xl hover:scale-[1.02]`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                  </div>
                  
                  {/* Brand Name */}
                  <div className="relative flex items-start justify-between">
                    <span className="font-display text-xl md:text-2xl font-bold text-white">
                      {brand.name}
                    </span>
                    <ChevronRight className="h-5 w-5 text-white/60 group-hover:translate-x-1 group-hover:text-white transition-all" />
                  </div>

                  {/* Product Count */}
                  <div className="relative mt-auto">
                    {count > 0 ? (
                      <span className="text-white/80 text-xs">{count} produtos</span>
                    ) : (
                      <span className="text-white/60 text-xs">Ver coleção</span>
                    )}
                  </div>

                  {/* Mini Product Previews */}
                  {brandProducts.length > 0 && (
                    <div className="absolute bottom-3 right-3 flex -space-x-2">
                      {brandProducts.slice(0, 2).map((product) => (
                        <div 
                          key={product.id} 
                          className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm overflow-hidden border border-white/30"
                        >
                          <img 
                            src={product.image_url || '/placeholder.svg'} 
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BrandShowcase;