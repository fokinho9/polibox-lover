const brands = [
  { name: "VONIXX", color: "from-orange-500 to-red-600" },
  { name: "3M", color: "from-red-600 to-red-800" },
  { name: "EASYTECH", color: "from-green-500 to-green-700" },
  { name: "WURTH", color: "from-red-600 to-gray-700" },
  { name: "DETAILER", color: "from-blue-500 to-blue-700" },
  { name: "RAPIFIX", color: "from-yellow-500 to-orange-600" },
];

const BrandShowcase = () => {
  return (
    <section className="py-12 bg-secondary/20">
      <div className="container-main">
        <h2 className="font-display text-3xl text-center text-foreground mb-8">
          NOSSAS <span className="text-primary">MARCAS</span>
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {brands.map((brand, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${brand.color} rounded-xl p-6 flex items-center justify-center aspect-video cursor-pointer hover:scale-105 transition-transform duration-300`}
            >
              <span className="font-display text-lg md:text-xl font-bold text-white tracking-wider">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandShowcase;
