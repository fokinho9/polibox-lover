import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ShoppingCart, Truck, Shield, CreditCard, Zap, Star, Check, Package, Heart } from "lucide-react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

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
            <div className="grid md:grid-cols-2 gap-12 animate-pulse">
              <div className="aspect-square bg-card rounded-2xl" />
              <div className="space-y-6">
                <div className="h-8 bg-card rounded w-3/4" />
                <div className="h-6 bg-card rounded w-1/2" />
                <div className="h-32 bg-card rounded-xl" />
                <div className="h-14 bg-card rounded-xl" />
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
        <main className="py-16">
          <div className="container-main text-center">
            <div className="max-w-md mx-auto">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
              <h1 className="text-2xl font-display font-bold mb-4">Produto não encontrado</h1>
              <p className="text-muted-foreground mb-8">O produto que você procura não existe ou foi removido.</p>
              <Link to="/">
                <Button className="btn-buy">Voltar à Loja</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const pixPrice = product.pix_price || product.price * 0.95;
  const allImages = [product.image_url, ...(product.additional_images || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      
      <main className="py-8">
        <div className="container-main">
          {/* Breadcrumb */}
          <div className="flex items-center gap-4 mb-8">
            <Link to={product.category ? `/categoria/${product.category}` : "/"}>
              <Button variant="ghost" size="sm" className="gap-2 hover:text-primary">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <div className="h-6 w-px bg-border" />
            <nav className="text-sm text-muted-foreground flex items-center flex-wrap gap-1">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              {product.category && (
                <>
                  <span className="mx-2">/</span>
                  <Link to={`/categoria/${product.category}`} className="hover:text-primary capitalize transition-colors">
                    {product.category}
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Product Details */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Images */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-gradient-to-br from-card to-secondary/30 rounded-2xl overflow-hidden border border-border">
                {product.discount_percent && (
                  <Badge className="absolute top-4 left-4 z-10 discount-badge">
                    <Zap className="h-3 w-3 mr-1" />
                    -{product.discount_percent}% OFF
                  </Badge>
                )}
                <img
                  src={allImages[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-contain p-8 transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
              
              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                        selectedImage === index 
                          ? 'border-primary shadow-lg shadow-primary/30' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`${product.name} - ${index + 1}`}
                        className="w-full h-full object-contain p-2 bg-card"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-6">
              {product.brand && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-primary font-semibold uppercase tracking-wider">{product.brand}</span>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                </div>
              )}
              
              <h1 className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground leading-tight">
                {product.name}
              </h1>

              {/* Price Card */}
              <div className="premium-card p-6 space-y-4">
                {product.old_price && (
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground line-through text-lg">
                      R$ {product.old_price.toFixed(2).replace('.', ',')}
                    </span>
                    {product.discount_percent && (
                      <span className="bg-destructive/20 text-destructive text-xs font-bold px-2 py-1 rounded">
                        ECONOMIA DE R$ {(product.old_price - product.price).toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </div>
                )}
                
                <div className="space-y-2">
                  <p className="text-lg text-muted-foreground">
                    Por apenas:
                  </p>
                  <p className="text-4xl font-display font-bold text-foreground">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-primary/10 rounded-xl p-4 border border-primary/20">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse-glow" />
                  <div>
                    <p className="text-2xl font-display font-bold text-primary">
                      R$ {pixPrice.toFixed(2).replace('.', ',')}
                    </p>
                    <p className="text-sm text-primary/80">à vista no Pix (5% de desconto)</p>
                  </div>
                </div>

                {product.installments_count && product.installments_value && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    ou <span className="font-bold text-foreground">{product.installments_count}x</span> de{" "}
                    <span className="font-bold text-foreground">R$ {product.installments_value.toFixed(2).replace('.', ',')}</span> sem juros
                  </p>
                )}
              </div>

              {/* Quantity & Actions */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Quantidade:</span>
                  <div className="flex items-center border border-border rounded-lg">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-secondary transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-bold">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 hover:bg-secondary transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <Button className="w-full h-16 text-lg btn-buy gap-3 font-display tracking-wide">
                  <ShoppingCart className="h-6 w-6" />
                  COMPRAR AGORA
                </Button>
                
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 h-12 gap-2 hover:border-primary hover:text-primary">
                    <Heart className="h-5 w-5" />
                    Favoritar
                  </Button>
                  <Button variant="outline" className="flex-1 h-12 gap-2 hover:border-primary hover:text-primary">
                    Adicionar ao Carrinho
                  </Button>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {product.express_delivery && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Truck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Entrega Express</p>
                      <p className="text-xs text-muted-foreground">Receba em até 24h</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Compra Segura</p>
                    <p className="text-xs text-muted-foreground">Pagamento protegido</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Produto Original</p>
                    <p className="text-xs text-muted-foreground">100% autêntico</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Parcele em 12x</p>
                    <p className="text-xs text-muted-foreground">Sem juros no cartão</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div className="pt-6 border-t border-border">
                  <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Descrição do Produto
                  </h2>
                  <div className="prose prose-invert prose-sm max-w-none">
                    <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                      {product.description}
                    </p>
                  </div>
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
