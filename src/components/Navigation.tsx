import { 
  Tag, 
  Package, 
  Droplets, 
  Sparkles, 
  Car, 
  Wrench, 
  GraduationCap, 
  Building2, 
  Star 
} from "lucide-react";

const navItems = [
  { icon: Tag, label: "OFERTAS", sublabel: "60%OFF", highlight: true },
  { icon: Package, label: "KITS" },
  { icon: Droplets, label: "LAVAGEM" },
  { icon: Sparkles, label: "POLIMENTO" },
  { icon: Car, label: "INTERIOR" },
  { icon: Wrench, label: "EQUIPAMENTOS" },
  { icon: GraduationCap, label: "CURSOS" },
  { icon: Building2, label: "MARCAS" },
  { icon: Star, label: "NOVIDADES" },
];

const Navigation = () => {
  return (
    <nav className="bg-background border-b border-border">
      <div className="container-main">
        <div className="flex items-center justify-center overflow-x-auto scrollbar-hide">
          {navItems.map((item, index) => (
            <div
              key={index}
              className={`nav-item min-w-fit ${
                item.highlight 
                  ? "bg-primary text-primary-foreground hover:bg-cyan-glow rounded-lg mx-1" 
                  : ""
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium whitespace-nowrap">{item.label}</span>
              {item.sublabel && (
                <span className="text-[10px] bg-yellow-500 text-black px-1.5 py-0.5 rounded font-bold">
                  {item.sublabel}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
