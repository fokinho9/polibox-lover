import { Link } from "react-router-dom";
import { Calculator, Trophy, Bike, Sparkles, Circle, Droplet } from "lucide-react";

const categories = [
  { icon: Calculator, label: "Calculadora de diluição", href: "/calculadora" },
  { icon: Trophy, label: "Mais vendidos", href: "/categoria/mais-vendidos" },
  { icon: Bike, label: "Motos", href: "/categoria/motos" },
  { icon: Sparkles, label: "Ceras e Selantes", href: "/categoria/ceras-selantes" },
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
              className="category-tag flex items-center gap-2 whitespace-nowrap"
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
