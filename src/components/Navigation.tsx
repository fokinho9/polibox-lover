import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Tag,
  Package,
  Droplets,
  Sparkles,
  Car,
  Wrench,
  GraduationCap,
  Building2,
  Star,
  Menu,
  Calculator
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { icon: Tag, label: "OFERTAS", sublabel: "60%OFF", highlight: true, href: "/categoria/ofertas" },
  { icon: Package, label: "KITS", href: "/categoria/kits" },
  { icon: Droplets, label: "LAVAGEM", href: "/categoria/lavagem" },
  { icon: Sparkles, label: "POLIMENTO", href: "/categoria/polimento" },
  { icon: Car, label: "INTERIOR", href: "/categoria/interior" },
  { icon: Wrench, label: "EQUIPAMENTOS", href: "/categoria/equipamentos" },
  { icon: GraduationCap, label: "CURSOS", href: "/categoria/cursos" },
  { icon: Building2, label: "MARCAS", href: "#marcas" },
  { icon: Star, label: "NOVIDADES", href: "/categoria/novidades" },
];

const calculatorItem = { icon: Calculator, label: "CALCULADORA", href: "/calculadora" };

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-background border-b border-border">
      <div className="container-main">
        <div className="flex items-center gap-2">
          {/* Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-primary hover:bg-primary/10"
              >
                <Menu className="h-5 w-5" />
                <span className="text-xs font-semibold">MENU</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] bg-background border-border">
              <SheetHeader>
                <SheetTitle className="text-left font-display text-primary">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 mt-6">
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
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
