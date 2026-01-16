import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import CategoryTags from "@/components/CategoryTags";
import HeroBanner from "@/components/HeroBanner";
import PromoSection from "@/components/PromoSection";
import OfferBanners from "@/components/OfferBanners";
import ProductGrid from "@/components/ProductGrid";
import BrandShowcase from "@/components/BrandShowcase";
import CategoryCarousel from "@/components/CategoryCarousel";
import MoreProducts from "@/components/MoreProducts";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import QuizModal from "@/components/QuizModal";
import { useQuiz } from "@/contexts/QuizContext";

const Index = () => {
  const [showQuiz, setShowQuiz] = useState(false);
  const { hasCompletedQuiz } = useQuiz();
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    // Don't show quiz if already completed or already triggered this session
    if (hasCompletedQuiz || hasTriggered) return;

    const handleScroll = () => {
      // Trigger quiz after scrolling 50px
      if (window.scrollY > 50 && !hasTriggered) {
        setShowQuiz(true);
        setHasTriggered(true);
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasCompletedQuiz, hasTriggered]);

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50">
        <Header />
        <Navigation />
      </div>
      <CategoryTags />
      <HeroBanner />
      <PromoSection />
      <OfferBanners />
      <ProductGrid />
      <BrandShowcase />
      <CategoryCarousel />
      <MoreProducts />
      <Footer />
      <WhatsAppButton />
      <ScrollToTopButton />
      <QuizModal open={showQuiz} onOpenChange={setShowQuiz} />
    </div>
  );
};

export default Index;
