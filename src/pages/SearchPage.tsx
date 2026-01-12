import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query.trim()) {
        setProducts([]);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .or(`name.ilike.%${query}%,description.ilike.%${query}%,brand.ilike.%${query}%,category.ilike.%${query}%`)
          .order("name");

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      
      <main className="container-main py-8">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Input
              type="text"
              placeholder="Buscar produtos, marcas, categorias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-card border-border pl-4 pr-14 py-6 text-foreground placeholder:text-muted-foreground rounded-xl focus:border-primary focus:ring-primary/20 text-lg"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-primary hover:bg-cyan-glow rounded-lg h-10 w-10 flex items-center justify-center transition-colors"
            >
              <Search className="h-5 w-5 text-primary-foreground" />
            </button>
          </div>
        </form>

        {/* Results */}
        {query && (
          <div className="mb-6">
            <h1 className="text-2xl font-display font-bold">
              Resultados para: <span className="text-primary">"{query}"</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              {products.length} produto(s) encontrado(s)
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-card rounded-xl h-64" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard 
                key={product.id}
                id={product.id}
                name={product.name}
                image={product.image_url || "/placeholder.svg"}
                oldPrice={product.old_price || undefined}
                price={product.price}
                pixPrice={product.pix_price || product.price * 0.95}
                discount={product.discount_percent || undefined}
                installments={product.installments_count && product.installments_value ? {
                  count: product.installments_count,
                  value: product.installments_value
                } : undefined}
                express={product.express_delivery || false}
                brand={product.brand || undefined}
              />
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-16">
            <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-display font-bold mb-2">Nenhum produto encontrado</h2>
            <p className="text-muted-foreground">
              Tente buscar por outros termos ou navegue pelas categorias
            </p>
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-display font-bold mb-2">Busque produtos</h2>
            <p className="text-muted-foreground">
              Digite o nome do produto, marca ou categoria que você procura
            </p>
          </div>
        )}
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default SearchPage;
