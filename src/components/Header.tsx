import { Truck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
const Header = () => {
  return <header className="bg-background border-b border-border">
      {/* Top bar */}
      <div className="bg-gradient-to-r from-secondary via-secondary/80 to-secondary py-2.5">
        <div className="container-main flex items-center justify-center gap-8 text-sm">
          <div className="flex items-center gap-2 text-primary">
            <Truck className="h-4 w-4" />
            <span className="text-foreground font-medium">FRETE GRÁTIS</span>
            <span className="text-xs text-muted-foreground">por tempo limitado</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-primary font-bold">5% OFF</span>
            <span className="text-muted-foreground">no Pix</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container-main py-3">
        <div className="flex items-center justify-center">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-primary tracking-wider text-shadow-glow">
              POLIBOX
            </h1>
          </Link>
        </div>
      </div>
    </header>;
};
export default Header;