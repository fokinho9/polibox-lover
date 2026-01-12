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
  Star 
} from "lucide-react";

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

const Navigation = () => {
  return (
    <nav className="bg-background border-b border-border">
      <div className="container-main">
        <div className="flex items-center justify-center overflow-x-auto scrollbar-hide">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
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
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
