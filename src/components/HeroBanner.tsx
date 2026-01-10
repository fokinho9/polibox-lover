import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-automotive.jpg";

const slides = [
  {
    id: 1,
    brand: "VONIXX",
    title: "OS MELHORES PRODUTOS PARA LAVAGEM, POLIMENTO",
    subtitle: "HIGIENIZAÇÃO, DETALHAMENTO E ESTÉTICA AUTOMOTIVA!",
    cta: "COMPRE AGORA",
    badge: "AQUI VOCÊ ENCONTRA A LINHA LÍDER!",
    href: "/categoria/kits",
  },
  {
    id: 2,
    brand: "MAGIL CLEAN",
    title: "ULTRA LIMPADOR CONCENTRADO",
    subtitle: "DILUIÇÃO ATÉ 1:100 - MÁXIMO RENDIMENTO!",
    cta: "VER PRODUTO",
    badge: "NOVIDADE",
    href: "/categoria/limpadores-apc",
  },
];

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative h-[400px] md:h-[500px] overflow-hidden hero-banner">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30" />
      </div>

      {/* Content */}
      <div className="container-main relative h-full flex items-center">
        <div className="max-w-2xl animate-fade-in">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`transition-all duration-500 ${
                index === currentSlide ? "opacity-100 translate-x-0" : "opacity-0 absolute -translate-x-full"
              }`}
            >
              <h2 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-4 tracking-wider">
                {slide.brand}
              </h2>
              <p className="text-lg md:text-xl text-foreground/90 mb-2">
                {slide.title}
              </p>
              <p className="text-base md:text-lg text-muted-foreground mb-6">
                {slide.subtitle}
              </p>
              <Link to={slide.href}>
                <Button className="btn-cyan text-lg font-display tracking-wider">
                  {slide.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Badge on right */}
        <div className="hidden lg:flex absolute right-10 top-1/2 -translate-y-1/2 flex-col items-center">
          <div className="w-32 h-32 rounded-full border-4 border-primary flex items-center justify-center bg-background/80 backdrop-blur">
            <div className="text-center px-2">
              <span className="font-display text-xs text-primary font-bold leading-tight block">
                {slides[currentSlide].badge}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/20 hover:bg-background/40 text-foreground"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/20 hover:bg-background/40 text-foreground"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-primary w-8" : "bg-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
