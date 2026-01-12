import { Link } from "react-router-dom";

const brands = [
  { name: "VONIXX", slug: "marca-vonixx", color: "from-orange-500 to-red-600" },
  { name: "3M", slug: "marca-3m", color: "from-red-600 to-red-800" },
  { name: "EASYTECH", slug: "marca-easytech", color: "from-green-500 to-green-700" },
  { name: "WURTH", slug: "marca-wurth", color: "from-red-600 to-gray-700" },
  { name: "DETAILER", slug: "marca-detailer", color: "from-blue-500 to-blue-700" },
  { name: "KERS", slug: "marca-kers", color: "from-purple-500 to-purple-700" },
  { name: "CADILLAC", slug: "marca-cadillac", color: "from-amber-600 to-amber-800" },
  { name: "SPARTAN", slug: "marca-spartan", color: "from-cyan-500 to-cyan-700" },
  { name: "SOFT99", slug: "marca-soft99", color: "from-pink-500 to-pink-700" },
  { name: "RAPIFIX", slug: "marca-rapifix", color: "from-yellow-500 to-orange-600" },
];

const BrandShowcase = () => {
  return (
    <section id="marcas" className="py-12 bg-secondary/20">
      <div className="container-main">
        <h2 className="font-display text-3xl text-center text-foreground mb-8">
          NOSSAS <span className="text-primary">MARCAS</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
          {brands.map((brand, index) => (
            <Link
              key={index}
              to={`/categoria/${brand.slug}`}
              className={`bg-gradient-to-br ${brand.color} rounded-xl p-4 md:p-6 flex items-center justify-center aspect-video cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl`}
            >
              <span className="font-display text-sm md:text-lg font-bold text-white tracking-wider text-center">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandShowcase;
