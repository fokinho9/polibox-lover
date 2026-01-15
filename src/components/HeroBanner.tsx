import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import bannerOfertas50 from "@/assets/banner-ofertas-50.jpg";
import bannerFrete from "@/assets/banner-frete.jpg";
import bannerMagil from "@/assets/banner-magil.jpg";
import bannerCerasSelantes from "@/assets/banner-ceras-selantes.jpg";

const slides = [
  {
    id: 1,
    image: bannerOfertas50,
    href: "/categoria/kits"
  },
  {
    id: 2,
    image: bannerFrete,
    href: "/frete-envio"
  },
  {
    id: 3,
    image: bannerMagil,
    href: "/categoria/limpadores-apc"
  },
  {
    id: 4,
    image: bannerCerasSelantes,
    href: "/categoria/ceras-selantes"
  }
];

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full overflow-hidden hero-banner">
      {/* Slides */}
      <div 
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <Link 
            key={slide.id} 
            to={slide.href}
            className="w-full flex-shrink-0"
          >
            <img 
              src={slide.image} 
              alt={`Banner ${slide.id}`}
              className="w-full h-auto object-cover"
            />
          </Link>
        ))}
      </div>

      {/* Navigation arrows */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={prevSlide} 
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/20 hover:bg-background/40 text-foreground h-10 w-10"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={nextSlide} 
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/20 hover:bg-background/40 text-foreground h-10 w-10"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button 
            key={index} 
            onClick={() => setCurrentSlide(index)} 
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === currentSlide 
                ? "bg-primary w-6" 
                : "bg-foreground/30 hover:bg-foreground/50"
            }`} 
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
