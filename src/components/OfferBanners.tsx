import { Link } from "react-router-dom";
import kitsImage from "@/assets/kits-banner.jpg";
import cerasImage from "@/assets/offer-banner-bg.jpg";
const banners = [{
  id: 1,
  title: "KITS COMPLETOS",
  subtitle: "Economize até 35%",
  description: "Kits profissionais prontos para uso",
  image: kitsImage,
  href: "/categoria/kits",
  accent: "from-primary/80 to-primary/40"
}, {
  id: 2,
  title: "CERAS & SELANTES",
  subtitle: "Proteção premium",
  description: "As melhores marcas do mercado",
  image: cerasImage,
  href: "/categoria/ceras-selantes",
  accent: "from-orange-500/80 to-orange-500/40"
}];
const OfferBanners = () => {
  return <section className="py-8 md:py-12">
      <div className="container-main">
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {banners.map(banner => <Link key={banner.id} to={banner.href} className="group block overflow-hidden rounded-2xl transition-transform duration-300 hover:scale-[1.02]">
              <img 
                src={banner.image} 
                alt={banner.title} 
                className="w-full h-auto rounded-2xl transition-transform duration-500 group-hover:brightness-110" 
              />
            </Link>)}
        </div>
      </div>
    </section>;
};
export default OfferBanners;