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
          {banners.map(banner => <Link key={banner.id} to={banner.href} className="relative h-40 md:h-48 rounded-xl overflow-hidden cursor-pointer group block bg-background">
              <img src={banner.image} alt={banner.title} className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105" />
            </Link>)}
        </div>
      </div>
    </section>;
};
export default OfferBanners;