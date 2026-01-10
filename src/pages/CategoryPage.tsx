import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductCard from "@/components/ProductCard";
import { productsApi, Product } from "@/lib/api/products";
import { Button } from "@/components/ui/button";

const categoryTitles: Record<string, string> = {
  "kits": "Kits Completos",
  "ceras-selantes": "Ceras e Selantes",
  "mais-vendidos": "Mais Vendidos",
  "motos": "Motos",
  "pneu-pretinho": "Pneu Pretinho",
  "limpadores-apc": "Limpadores APC",
  "calculadora": "Calculadora de Diluição",
};

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', category],
    queryFn: () => category ? productsApi.getByCategory(category) : productsApi.getAll(),
  });

  const title = category ? categoryTitles[category] || category : "Todos os Produtos";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      
      <main className="py-8">
        <div className="container-main">
          {/* Breadcrumb */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <div className="h-6 w-px bg-border" />
            <nav className="text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">{title}</span>
            </nav>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-8">
            {title}
          </h1>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-secondary/50 rounded-lg mb-4" />
                  <div className="h-4 bg-secondary/50 rounded mb-2" />
                  <div className="h-4 bg-secondary/50 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">
                Nenhum produto encontrado nesta categoria.
              </p>
              <Link to="/">
                <Button>Ver todos os produtos</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map((product: Product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  image={product.image_url || "/placeholder.svg"}
                  oldPrice={product.old_price || undefined}
                  price={product.price}
                  pixPrice={product.pix_price || product.price * 0.95}
                  discount={product.discount_percent || undefined}
                  installments={
                    product.installments_count && product.installments_value
                      ? { count: product.installments_count, value: product.installments_value }
                      : undefined
                  }
                  express={product.express_delivery ?? true}
                />
              ))}
            </div>
          )}

          {/* Product count */}
          {!isLoading && products.length > 0 && (
            <p className="text-sm text-muted-foreground mt-8 text-center">
              Exibindo {products.length} produto{products.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default CategoryPage;
