import { Link } from "react-router-dom";
import kitsImage from "@/assets/kits-banner.jpg";
import cerasImage from "@/assets/offer-banner-bg.jpg";
const banners = [{
  id: 1,
  title: "KITS COMPLETOS",
  subtitle: "Até 35%OFF",
  image: kitsImage,
  href: "/categoria/kits"
}, {
  id: 2,
  title: "CERAS E SELANTES",
  subtitle: "Até 41%OFF",
  image: cerasImage,
  href: "/categoria/ceras-selantes"
}];
const OfferBanners = () => {
  return <section className="py-8">
      <div className="container-main">
        <div className="grid md:grid-cols-2 gap-6">
          {banners.map(banner => <Link key={banner.id} to={banner.href} className="relative h-48 md:h-56 rounded-xl overflow-hidden cursor-pointer group block">
              <img src={banner.image} alt={banner.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
              <div className="relative h-full flex flex-col justify-center p-8">
                
                
                
              </div>
            </Link>)}
        </div>
      </div>
    </section>;
};
export default OfferBanners;