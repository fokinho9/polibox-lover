import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Flame, TrendingDown } from "lucide-react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductCard from "@/components/ProductCard";
import { productsApi, Product } from "@/lib/api/products";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const PRODUCTS_PER_PAGE = 20;

const categoryTitles: Record<string, string> = {
  "kits": "Kits Completos",
  "ceras-selantes": "Ceras e Selantes",
  "mais-vendidos": "Mais Vendidos",
  "motos": "Motos",
  "pneu-pretinho": "Pneu Pretinho",
  "limpadores-apc": "Limpadores APC",
  "ofertas": "Ofertas",
  "lavagem": "Lavagem",
  "polimento": "Polimento",
  "interior": "Interior",
  "equipamentos": "Equipamentos",
  "cursos": "Cursos",
  "marcas": "Marcas",
  "novidades": "Novidades",
  // Brand categories
  "marca-vonixx": "VONIXX",
  "marca-3m": "3M",
  "marca-easytech": "EASYTECH",
  "marca-wurth": "WURTH",
  "marca-detailer": "DETAILER",
  "marca-kers": "KERS",
  "marca-cadillac": "CADILLAC",
  "marca-spartan": "SPARTAN",
  "marca-soft99": "SOFT99",
  "marca-rapifix": "RAPIFIX",
  "marca-vintex": "VINTEX",
};

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', category],
    queryFn: () => category ? productsApi.getByCategory(category) : productsApi.getAll(),
  });

  const title = category ? categoryTitles[category] || category.replace('marca-', '').toUpperCase() : "Todos os Produtos";
  const isOfertasPage = category === 'ofertas';
  const isBrandPage = category?.startsWith('marca-');

  // Pagination logic
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

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
          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl text-foreground flex items-center gap-3">
              {isOfertasPage && <Flame className="h-8 w-8 text-destructive" />}
              {isBrandPage && <TrendingDown className="h-8 w-8 text-primary" />}
              {title}
            </h1>
            {isOfertasPage && (
              <p className="text-muted-foreground mt-2">
                Produtos ordenados do mais barato ao mais caro
              </p>
            )}
            {isBrandPage && (
              <p className="text-muted-foreground mt-2">
                Todos os produtos da marca {title}
              </p>
            )}
          </div>

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
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {paginatedProducts.map((product: Product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {getPageNumbers().map((page, index) => (
                        <PaginationItem key={index}>
                          {page === 'ellipsis' ? (
                            <PaginationEllipsis />
                          ) : (
                            <PaginationLink
                              onClick={() => handlePageChange(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}

          {/* Product count */}
          {!isLoading && products.length > 0 && (
            <p className="text-sm text-muted-foreground mt-8 text-center">
              Exibindo {startIndex + 1}-{Math.min(startIndex + PRODUCTS_PER_PAGE, products.length)} de {products.length} produto{products.length !== 1 ? "s" : ""}
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
