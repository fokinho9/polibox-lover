import { Truck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import logoPolicar from "@/assets/logo-policar.png";

const Header = () => {
  return <header className="bg-background border-b border-border">
      {/* Top bar */}
      <div className="bg-gradient-to-r from-red-logo/20 via-red-logo/10 to-red-logo/20 py-2.5 border-b border-red-logo/30">
        <div className="container-main flex items-center justify-center gap-8 text-sm">
          <div className="flex items-center gap-2 text-red-logo">
            <Truck className="h-4 w-4" />
            <span className="text-foreground font-medium">FRETE GRÁTIS</span>
            <span className="text-xs text-red-logo-glow font-semibold">em todas as compras</span>
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
        <div className="flex items-center justify-center">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img 
              src={logoPolicar} 
              alt="Policar - Estética Automotiva" 
              className="h-10 md:h-12 w-auto object-contain"
            />
          </Link>
        </div>
      </div>
    </header>;
};
export default Header;