import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { productsApi, Product } from "@/lib/api/products";
import { ChevronRight } from "lucide-react";

const brands = [
  { name: "VONIXX", slug: "marca-vonixx", color: "from-orange-500 to-red-600" },
  { name: "3M", slug: "marca-3m", color: "from-red-600 to-red-800" },
  { name: "EASYTECH", slug: "marca-easytech", color: "from-green-500 to-green-700" },
  { name: "WURTH", slug: "marca-wurth", color: "from-red-600 to-gray-700" },
  { name: "DETAILER", slug: "marca-detailer", color: "from-blue-500 to-blue-700" },
  { name: "KERS", slug: "marca-kers", color: "from-purple-500 to-purple-700" },
  { name: "CADILLAC", slug: "marca-cadillac", color: "from-amber-600 to-amber-800" },
  { name: "SPARTAN", slug: "marca-spartan", color: "from-cyan-500 to-cyan-700" },
  { name: "SOFT99", slug: "marca-soft99", color: "from-pink-500 to-pink-700" },
  { name: "RAPIFIX", slug: "marca-rapifix", color: "from-yellow-500 to-orange-600" },
];

const BrandShowcase = () => {
  // Fetch products for each brand to show preview
  const { data: allProducts = [] } = useQuery({
    queryKey: ['all-products-brands'],
    queryFn: productsApi.getAll,
  });

  const getBrandProducts = (brandName: string): Product[] => {
    return allProducts
      .filter(p => p.brand?.toLowerCase().includes(brandName.toLowerCase()) && p.price > 0)
      .slice(0, 3);
  };

  return (
    <section id="marcas" className="py-16 bg-gradient-to-b from-secondary/20 to-background">
      <div className="container-main">
        <div className="text-center mb-10">
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-3">
            NOSSAS <span className="text-primary text-shadow-glow">MARCAS</span>
          </h2>
          <p className="text-muted-foreground">
            As melhores marcas de estética automotiva em um só lugar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {brands.map((brand, index) => {
            const brandProducts = getBrandProducts(brand.name);
            
            return (
              <Link
                key={index}
                to={`/categoria/${brand.slug}`}
                className="group"
              >
                <div className={`bg-gradient-to-br ${brand.color} rounded-2xl p-5 flex flex-col cursor-pointer hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-2xl min-h-[200px]`}>
                  {/* Brand Name */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display text-2xl font-bold text-white tracking-wider">
                      {brand.name}
                    </span>
                    <ChevronRight className="h-5 w-5 text-white/80 group-hover:translate-x-1 transition-transform" />
                  </div>

                  {/* Product Previews */}
                  {brandProducts.length > 0 ? (
                    <div className="flex gap-2 mt-auto">
                      {brandProducts.map((product) => (
                        <div 
                          key={product.id} 
                          className="w-14 h-14 rounded-lg bg-white/20 backdrop-blur-sm overflow-hidden flex-shrink-0"
                        >
                          <img 
                            src={product.image_url || '/placeholder.svg'} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {brandProducts.length > 0 && (
                        <div className="w-14 h-14 rounded-lg bg-white/10 flex items-center justify-center text-white text-xs font-bold">
                          +mais
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-auto text-white/70 text-sm">
                      Ver produtos →
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