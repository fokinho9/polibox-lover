import kitsImage from "@/assets/kits-banner.jpg";
import cerasImage from "@/assets/ceras-banner.jpg";

const banners = [
  {
    id: 1,
    title: "KITS COMPLETOS",
    subtitle: "Até 35%OFF",
    image: kitsImage,
  },
  {
    id: 2,
    title: "CERAS E SELANTES",
    subtitle: "Até 41%OFF",
    image: cerasImage,
  },
];

const OfferBanners = () => {
  return (
    <section className="py-8">
      <div className="container-main">
        <div className="grid md:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="relative h-48 md:h-56 rounded-xl overflow-hidden cursor-pointer group"
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
              <div className="relative h-full flex flex-col justify-center p-8">
                <span className="text-primary text-sm font-medium mb-1">Oferta</span>
                <h3 className="font-display text-2xl md:text-3xl text-foreground font-bold mb-2">
                  {banner.title}
                </h3>
                <p className="text-lg text-primary font-bold">{banner.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OfferBanners;
