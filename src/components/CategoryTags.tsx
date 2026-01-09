import { Calculator, Trophy, Bike, Sparkles, Circle, Droplet } from "lucide-react";

const categories = [
  { icon: Calculator, label: "Calculadora de diluição" },
  { icon: Trophy, label: "Mais vendidos" },
  { icon: Bike, label: "Motos" },
  { icon: Sparkles, label: "Ceras e Selantes" },
  { icon: Circle, label: "Pneu Pretinho" },
  { icon: Droplet, label: "Limpadores APC" },
];

const CategoryTags = () => {
  return (
    <div className="bg-secondary/30 py-3 border-b border-border">
      <div className="container-main">
        <div className="flex items-center justify-center gap-3 overflow-x-auto scrollbar-hide">
          {categories.map((cat, index) => (
            <button
              key={index}
              className="category-tag flex items-center gap-2 whitespace-nowrap"
            >
              <cat.icon className="h-4 w-4" />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryTags;
