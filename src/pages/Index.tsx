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

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
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
    </div>
  );
};

export default Index;
