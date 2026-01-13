import { Search, Truck, MapPin, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-gradient-to-r from-secondary via-secondary/80 to-secondary py-2.5">
        <div className="container-main flex items-center justify-center gap-8 text-sm">
          <div className="flex items-center gap-2 text-primary">
            <Truck className="h-4 w-4" />
            <span className="text-foreground font-medium">FRETE GRÁTIS</span>
            <span className="text-xs text-muted-foreground">acima de R$299</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-primary font-bold">5% OFF</span>
            <span className="text-muted-foreground">no Pix</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container-main py-4">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-primary tracking-wider text-shadow-glow">
              POLIBOX
            </h1>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <Input
                placeholder="Buscar produtos..."
                className="bg-card border-border pl-4 pr-14 py-6 text-foreground placeholder:text-muted-foreground rounded-xl focus:border-primary focus:ring-primary/20"
              />
              <Button
                size="icon"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-primary hover:bg-cyan-glow rounded-lg h-9 w-9"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Actions - Only rastreio on desktop */}
          <div className="flex items-center gap-2 md:gap-4 ml-auto">
            <Button variant="ghost" className="text-muted-foreground hover:text-primary flex items-center gap-2 hidden lg:flex">
              <MapPin className="h-4 w-4" />
              <span>RASTREIO</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
