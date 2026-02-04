import { Link } from "react-router-dom";
import { Calculator, Trophy, Bike, Circle, Droplet, Package, Percent } from "lucide-react";

const categories = [
  { icon: Percent, label: "Super Ofertas", href: "/categoria/super-ofertas", highlight: true },
  { icon: Calculator, label: "Calculadora de diluição", href: "/calculadora" },
  { icon: Bike, label: "Motos", href: "/categoria/motos" },
  { icon: Trophy, label: "Mais vendidos", href: "/categoria/mais-vendidos" },
  { icon: Package, label: "Kits", href: "/categoria/kits" },
  { icon: Circle, label: "Pneu Pretinho", href: "/categoria/pneu-pretinho" },
  { icon: Droplet, label: "Limpadores APC", href: "/categoria/limpadores-apc" },
];

const CategoryTags = () => {
  return (
    <div className="bg-secondary/30 py-3 border-b border-border">
      <div className="container-main">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-transparent">
          {categories.map((cat, index) => (
            <Link
              key={index}
              to={cat.href}
              className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                (cat as any).highlight 
                  ? 'bg-gradient-to-r from-primary to-cyan-glow text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50' 
                  : 'category-tag'
              }`}
            >
              <cat.icon className="h-4 w-4" />
              <span>{cat.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryTags;
