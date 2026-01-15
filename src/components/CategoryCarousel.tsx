import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import carouselKits from "@/assets/carousel-kits.jpg";
import carouselVidros from "@/assets/carousel-vidros.jpg";
import carouselMicrofibras from "@/assets/carousel-microfibras.jpg";
import carouselLimpeza from "@/assets/carousel-limpeza.jpg";

const slides = [
  {
    id: 1,
    image: carouselKits,
    href: "/categoria/kits",
  },
  {
    id: 2,
    image: carouselVidros,
    href: "/buscar?q=vidro",
  },
  {
    id: 3,
    image: carouselMicrofibras,
    href: "/buscar?q=microfibra",
  },
  {
    id: 4,
    image: carouselLimpeza,
    href: "/buscar?q=limpeza",
  },
];

const CategoryCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="py-8 bg-background">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl">
          {/* Carousel Container */}
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
                  alt={`Categoria ${slide.id}`}
                  className="w-full h-auto object-contain"
                />
              </Link>
            ))}
          </div>

          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full h-12 w-12"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full h-12 w-12"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? "bg-primary w-8"
                    : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryCarousel;
