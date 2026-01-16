import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Percent, Droplet, Car, Sparkles, Calculator, Search, Paintbrush, Settings, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { productsApi, Product } from "@/lib/api/products";
const navItems = [
  { icon: Percent, label: "OFERTAS", href: "/categoria/ofertas", highlight: true, sublabel: "-40%" },
  { icon: Droplet, label: "LAVAGEM", href: "/categoria/lavagem" },
  { icon: Sparkles, label: "POLIMENTO", href: "/categoria/polimento" },
  { icon: Car, label: "INTERIOR", href: "/categoria/interior" },
  { icon: Paintbrush, label: "CERAS", href: "/categoria/ceras" },
  { icon: Package, label: "KITS", href: "/categoria/kits" },
  { icon: Settings, label: "EQUIPAMENTOS", href: "/categoria/equipamentos" },
];

const calculatorItem = { icon: Calculator, label: "CALCULADORA DE DILUIÇÃO", href: "/calculadora" };

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Debounce search
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await productsApi.searchProducts(searchQuery.trim());
        setSuggestions(results.slice(0, 5));
      } catch (error) {
        console.error('Error searching products:', error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (productId: string) => {
    navigate(`/produto/${productId}`);
    setSearchQuery("");
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <nav className="bg-background border-b border-border">
      <div className="container-main py-2">
        <div className="flex items-center gap-3">
          {/* Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-2 text-primary hover:bg-primary/10 flex-shrink-0"
              >
                <Menu className="h-5 w-5" />
                <span className="text-xs font-semibold">MENU</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] bg-background border-border flex flex-col">
              <SheetHeader>
                <SheetTitle className="text-left font-display text-primary">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 mt-6 overflow-y-auto flex-1 pb-6">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      item.highlight 
                        ? "bg-primary text-primary-foreground hover:bg-cyan-glow" 
                        : "hover:bg-secondary text-foreground"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                    {item.sublabel && (
                      <span className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded font-bold ml-auto">
                        {item.sublabel}
                      </span>
                    )}
                  </Link>
                ))}
                
                {/* Separator and Calculator */}
                <Separator className="my-2 bg-border" />
                <Link
                  to={calculatorItem.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors bg-gradient-to-r from-primary/20 to-cyan-glow/20 hover:from-primary/30 hover:to-cyan-glow/30 text-primary border border-primary/30"
                >
                  <calculatorItem.icon className="h-5 w-5" />
                  <span className="font-medium">{calculatorItem.label}</span>
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded font-bold ml-auto">
                    NOVO
                  </span>
                </Link>
              </div>
            </SheetContent>
          </Sheet>

          {/* Search Bar with Autocomplete */}
          <div ref={searchRef} className="flex-1 relative">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Input
                  placeholder="Buscar produtos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  className="bg-card border-border pl-4 pr-12 py-2 h-10 text-sm text-foreground placeholder:text-muted-foreground rounded-lg focus:border-primary focus:ring-primary/20"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary hover:bg-cyan-glow rounded-md h-8 w-8"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && searchQuery.trim().length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                {isSearching ? (
                  <div className="px-4 py-3 text-sm text-muted-foreground">Buscando...</div>
                ) : suggestions.length > 0 ? (
                  <ul>
                    {suggestions.map((product) => (
                      <li key={product.id}>
                        <button
                          type="button"
                          onClick={() => handleSuggestionClick(product.id)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors text-left"
                        >
                          {product.image_url && (
                            <img 
                              src={product.image_url} 
                              alt={product.name} 
                              className="w-10 h-10 object-contain rounded bg-background"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground line-clamp-1">{product.name}</p>
                            <p className="text-xs text-primary font-semibold">
                              {product.pix_price 
                                ? `R$ ${product.pix_price.toFixed(2).replace('.', ',')}` 
                                : product.price 
                                  ? `R$ ${product.price.toFixed(2).replace('.', ',')}`
                                  : ''
                              }
                            </p>
                          </div>
                          <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        </button>
                      </li>
                    ))}
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          navigate(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
                          setSearchQuery("");
                          setShowSuggestions(false);
                        }}
                        className="w-full px-4 py-3 text-sm text-primary hover:bg-secondary transition-colors text-center font-medium border-t border-border"
                      >
                        Ver todos os resultados para "{searchQuery}"
                      </button>
                    </li>
                  </ul>
                ) : (
                  <div className="px-4 py-3 text-sm text-muted-foreground">
                    Nenhum produto encontrado
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
