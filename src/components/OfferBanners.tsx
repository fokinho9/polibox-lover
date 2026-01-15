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
          {banners.map(banner => <Link key={banner.id} to={banner.href} className="relative h-44 md:h-52 rounded-2xl overflow-hidden group block">
              {/* Background Image */}
              <img src={banner.image} alt={banner.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.accent} opacity-60`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Content */}
              
            </Link>)}
        </div>
      </div>
    </section>;
};
export default OfferBanners;