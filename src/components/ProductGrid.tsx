import ProductCard from "./ProductCard";
import product1 from "@/assets/product-polidor.jpg";
import product2 from "@/assets/product-kit.jpg";
import product3 from "@/assets/product-foam.jpg";
import product4 from "@/assets/product-aspirador.jpg";
import product5 from "@/assets/product-fita.jpg";
import product6 from "@/assets/product-lixa.jpg";

const products = [
  {
    id: 1,
    name: "OPTY Composto Polidor para Vidros - Vonixx (240ml)",
    image: product1,
    oldPrice: 120.90,
    price: 112.90,
    pixPrice: 107.26,
    discount: 6,
    installments: { count: 2, value: 56.45 },
  },
  {
    id: 2,
    name: "Kit FOAMTECH + PLURI MOL 1,5L EasyTech",
    image: product2,
    oldPrice: 150.90,
    price: 146.90,
    pixPrice: 139.56,
    discount: 2,
    installments: { count: 2, value: 73.45 },
  },
  {
    id: 3,
    name: "Canhão De Espuma Snow Foam Black Com Dosador Detailer",
    image: product3,
    oldPrice: 197.90,
    price: 179.90,
    pixPrice: 170.91,
    discount: 9,
    installments: { count: 3, value: 59.97 },
  },
  {
    id: 4,
    name: "Bico Bocal Extrator de Aspirador para Limpeza de Estofados Detailer",
    image: product4,
    oldPrice: 33.90,
    price: 26.90,
    pixPrice: 25.56,
    discount: 20,
  },
  {
    id: 5,
    name: "Pacote de Fita Crepe Automotiva Verde - 18mm x 40m - Rapifix (11 UNIDADES)",
    image: product5,
    oldPrice: 58.85,
    price: 53.90,
    pixPrice: 51.21,
    discount: 8,
  },
  {
    id: 6,
    name: "Lixa D'Água para Polimento 401Q 2500 3M (1 Unidade) 14cm x 22,8cm",
    image: product6,
    oldPrice: 6.75,
    price: 5.15,
    pixPrice: 4.89,
    discount: 23,
  },
];

const ProductGrid = () => {
  return (
    <section className="py-10">
      <div className="container-main">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              image={product.image}
              oldPrice={product.oldPrice}
              price={product.price}
              pixPrice={product.pixPrice}
              discount={product.discount}
              installments={product.installments}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
