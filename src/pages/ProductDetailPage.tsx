import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ShoppingCart, Truck, Shield, CreditCard } from "lucide-react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Navigation />
        <main className="py-8">
          <div className="container-main">
            <div className="grid md:grid-cols-2 gap-8 animate-pulse">
              <div className="aspect-square bg-secondary/50 rounded-lg" />
              <div className="space-y-4">
                <div className="h-8 bg-secondary/50 rounded w-3/4" />
                <div className="h-6 bg-secondary/50 rounded w-1/2" />
                <div className="h-20 bg-secondary/50 rounded" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Navigation />
        <main className="py-8">
          <div className="container-main text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
            <Link to="/">
              <Button>Voltar à loja</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const pixPrice = product.pix_price || product.price * 0.95;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      
      <main className="py-8">
        <div className="container-main">
          {/* Breadcrumb */}
          <div className="flex items-center gap-4 mb-8">
            <Link to={product.category ? `/categoria/${product.category}` : "/"}>
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <div className="h-6 w-px bg-border" />
            <nav className="text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary">Home</Link>
              {product.category && (
                <>
                  <span className="mx-2">/</span>
                  <Link to={`/categoria/${product.category}`} className="hover:text-primary capitalize">
                    {product.category}
                  </Link>
                </>
              )}
              <span className="mx-2">/</span>
              <span className="text-foreground line-clamp-1">{product.name}</span>
            </nav>
          </div>

          {/* Product Details */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Image */}
            <div className="relative">
              {product.discount_percent && (
                <Badge className="absolute top-4 left-4 z-10 bg-destructive text-destructive-foreground">
                  -{product.discount_percent}% OFF
                </Badge>
              )}
              <div className="aspect-square bg-card rounded-lg overflow-hidden border">
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-contain p-8"
                />
              </div>
              {product.additional_images && product.additional_images.length > 0 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  <div className="w-20 h-20 flex-shrink-0 border-2 border-primary rounded-lg overflow-hidden">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  {product.additional_images.map((img, index) => (
                    <div key={index} className="w-20 h-20 flex-shrink-0 border rounded-lg overflow-hidden hover:border-primary transition-colors cursor-pointer">
                      <img
                        src={img}
                        alt={`${product.name} - ${index + 2}`}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-6">
              {product.brand && (
                <p className="text-sm text-muted-foreground uppercase tracking-wide">{product.brand}</p>
              )}
              
              <h1 className="font-display text-2xl md:text-3xl text-foreground">
                {product.name}
              </h1>

              {/* Prices */}
              <div className="space-y-2 p-6 bg-card rounded-lg border">
                {product.old_price && (
                  <p className="text-muted-foreground line-through">
                    De: R$ {product.old_price.toFixed(2).replace('.', ',')}
                  </p>
                )}
                <p className="text-lg">
                  Por: <span className="text-2xl font-bold text-foreground">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                </p>
                <p className="text-xl font-bold text-primary">
                  R$ {pixPrice.toFixed(2).replace('.', ',')} <span className="text-sm font-normal">com desconto via Pix</span>
                </p>
                {product.installments_count && product.installments_value && (
                  <p className="text-sm text-muted-foreground">
                    ou <span className="font-bold">{product.installments_count}x</span> de{" "}
                    <span className="font-bold">R$ {product.installments_value.toFixed(2).replace('.', ',')}</span> sem juros
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button className="w-full h-14 text-lg bg-primary hover:bg-cyan-glow">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Comprar Agora
                </Button>
                <Button variant="outline" className="w-full h-12">
                  Adicionar ao Carrinho
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                {product.express_delivery && (
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-5 w-5 text-primary" />
                    <span>Entrega Express</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Compra Segura</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span>Parcele em até 12x</span>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div className="pt-6 border-t">
                  <h2 className="font-semibold text-lg mb-3">Descrição</h2>
                  <p className="text-muted-foreground whitespace-pre-line">{product.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ProductDetailPage;
