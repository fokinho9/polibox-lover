import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Filter, SlidersHorizontal, ArrowUpDown, X, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import { productsApi, Product } from "@/lib/api/products";
import { trackSearch } from "@/lib/pixel";

const popularSearches = [
  "kit polimento",
  "cera",
  "shampoo",
  "vonixx",
  "pretinho",
  "limpador apc",
  "microfibra",
  "clay bar"
];

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [priceRange, setPriceRange] = useState<string>("all");

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query.trim()) {
        setProducts([]);
        return;
      }

      // Track search event
      trackSearch(query);

      setIsLoading(true);
      try {
        const data = await productsApi.searchProducts(query);
        setProducts(data);
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

  const handleQuickSearch = (term: string) => {
    setSearchQuery(term);
    setSearchParams({ q: term });
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Apply price filter
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      result = result.filter(p => {
        if (max) return p.price >= min && p.price <= max;
        return p.price >= min;
      });
    }

    // Apply sorting
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "discount":
        result.sort((a, b) => (b.discount_percent || 0) - (a.discount_percent || 0));
        break;
      default:
        // relevance - keep original order
        break;
    }

    return result;
  }, [products, sortBy, priceRange]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      
      <main className="container-main py-8">
        {/* Search Header */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-display mb-2">
              BUSCAR <span className="text-primary">PRODUTOS</span>
            </h1>
            <p className="text-muted-foreground">
              Encontre os melhores produtos para estética automotiva
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Input
                type="text"
                placeholder="O que você está procurando?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-card border-border pl-5 pr-14 py-7 text-foreground placeholder:text-muted-foreground rounded-2xl focus:border-primary focus:ring-primary/20 text-lg shadow-lg"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-cyan-glow hover:opacity-90 rounded-xl h-12 w-12 flex items-center justify-center transition-all shadow-lg shadow-primary/30"
              >
                <Search className="h-5 w-5 text-primary-foreground" />
              </button>
            </div>
          </form>

          {/* Quick Searches */}
          {!query && (
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="text-sm text-muted-foreground mr-2 flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                Buscas populares:
              </span>
              {popularSearches.map((term) => (
                <Badge
                  key={term}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors px-3 py-1"
                  onClick={() => handleQuickSearch(term)}
                >
                  {term}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Results Section */}
        {query && (
          <>
            {/* Results Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 p-4 bg-card rounded-2xl border border-border">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  Resultados para: <span className="text-primary">"{query}"</span>
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredProducts.length} produto(s) encontrado(s)
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="w-[140px] bg-secondary border-border">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Preço" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="0-50">Até R$ 50</SelectItem>
                    <SelectItem value="50-100">R$ 50 - R$ 100</SelectItem>
                    <SelectItem value="100-200">R$ 100 - R$ 200</SelectItem>
                    <SelectItem value="200-500">R$ 200 - R$ 500</SelectItem>
                    <SelectItem value="500-99999">Acima de R$ 500</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px] bg-secondary border-border">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Ordenar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevância</SelectItem>
                    <SelectItem value="price-asc">Menor Preço</SelectItem>
                    <SelectItem value="price-desc">Maior Preço</SelectItem>
                    <SelectItem value="discount">Maior Desconto</SelectItem>
                    <SelectItem value="name">Nome A-Z</SelectItem>
                  </SelectContent>
                </Select>

                {(priceRange !== "all" || sortBy !== "relevance") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setPriceRange("all");
                      setSortBy("relevance");
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Limpar
                  </Button>
                )}
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-card rounded-2xl h-72" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredProducts.map((product) => (
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
            ) : (
              <div className="text-center py-16 bg-card rounded-2xl border border-border">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Search className="h-10 w-10 text-primary/50" />
                </div>
                <h2 className="text-2xl font-display font-bold mb-2">Nenhum produto encontrado</h2>
                <p className="text-muted-foreground mb-6">
                  Tente buscar por outros termos ou navegue pelas categorias
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {popularSearches.slice(0, 4).map((term) => (
                    <Badge
                      key={term}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-4 py-2"
                      onClick={() => handleQuickSearch(term)}
                    >
                      Buscar "{term}"
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!query && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-cyan-glow/10 flex items-center justify-center">
              <Search className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-2">Comece sua busca</h2>
            <p className="text-muted-foreground mb-8">
              Digite o nome do produto, marca ou categoria que você procura
            </p>
            <Link to="/">
              <Button variant="outline" size="lg" className="gap-2">
                Ver todos os produtos
              </Button>
            </Link>
          </div>
        )}
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default SearchPage;
