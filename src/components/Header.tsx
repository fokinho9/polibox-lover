import { Search, Truck, User, ShoppingCart, MapPin, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-secondary/50 py-2">
        <div className="container-main flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-primary">
            <Truck className="h-4 w-4" />
            <span className="text-foreground">FRETE GRÁTIS</span>
            <ChevronDown className="h-3 w-3" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary font-bold">5%OFF</span>
            <span className="text-muted-foreground">BEM-VINDO</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container-main py-4">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="font-display text-3xl font-bold text-primary tracking-wider">
              POLIBOX
            </h1>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Input
                placeholder="Busca"
                className="bg-card border-border pl-4 pr-12 py-6 text-foreground placeholder:text-muted-foreground"
              />
              <Button
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary hover:bg-cyan-glow"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-muted-foreground hover:text-primary flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden md:inline">RASTREIO</span>
            </Button>

            <Button className="bg-secondary hover:bg-secondary/80 text-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>ÁREA DO CLIENTE</span>
            </Button>

            <Button variant="ghost" size="icon" className="relative text-primary hover:bg-primary/10">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                0
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
