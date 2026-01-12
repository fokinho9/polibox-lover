import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, ShoppingCart, Truck, Shield, Zap, Star, Check, 
  Package, MapPin, Award, RefreshCw, Clock, ChevronDown, ChevronUp,
  ThumbsUp, MessageSquare
} from "lucide-react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import FloatingBuyButton from "@/components/FloatingBuyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cep, setCep] = useState("");
  const [shippingResult, setShippingResult] = useState<{ price: string; days: string } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

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

  const handleBuyNow = () => {
    if (!product) return;
    
    addToCart(product, quantity);
    
    toast({
      title: "🛒 Produto adicionado!",
      description: `${product.name} foi adicionado ao carrinho`,
    });
  };

  const handleCalculateShipping = async () => {
    if (!cep || cep.length < 8) return;
    setIsCalculating(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const price = product?.price && product.price >= 299 ? "GRÁTIS" : "R$ 19,90";
    const days = "1-3 dias úteis";
    
    setShippingResult({ price, days });
    setIsCalculating(false);
  };

  const reviews = [
    { id: 1, author: "Carlos M.", rating: 5, date: "15/12/2025", comment: "Produto excelente, chegou muito rápido! Recomendo demais.", helpful: 12 },
    { id: 2, author: "Amanda S.", rating: 5, date: "10/12/2025", comment: "Qualidade top! Já é a terceira vez que compro.", helpful: 8 },
    { id: 3, author: "Roberto F.", rating: 4, date: "05/12/2025", comment: "Muito bom, só achei a embalagem um pouco pequena.", helpful: 5 },
  ];

  const averageRating = 4.8;
  const totalReviews = 47;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Navigation />
        <main className="py-4 md:py-8">
          <div className="container-main">
            <div className="grid md:grid-cols-2 gap-6 md:gap-12 animate-pulse">
              <div className="aspect-square bg-card rounded-2xl" />
              <div className="space-y-4 md:space-y-6">
                <div className="h-6 md:h-8 bg-card rounded w-3/4" />
                <div className="h-4 md:h-6 bg-card rounded w-1/2" />
                <div className="h-24 md:h-32 bg-card rounded-xl" />
                <div className="h-12 md:h-14 bg-card rounded-xl" />
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
  const isFreeShipping = product.price >= 299;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      
      <main className="py-4 md:py-8 pb-32">
        <div className="container-main">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-8 overflow-x-auto scrollbar-hide">
            <Link to={product.category ? `/categoria/${product.category}` : "/"}>
              <Button variant="ghost" size="sm" className="gap-1 md:gap-2 hover:text-primary px-2 md:px-3">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Voltar</span>
              </Button>
            </Link>
            <div className="h-4 md:h-6 w-px bg-border" />
            <nav className="text-xs md:text-sm text-muted-foreground flex items-center flex-nowrap gap-1 whitespace-nowrap">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              {product.category && (
                <>
                  <span className="mx-1 md:mx-2">/</span>
                  <Link to={`/categoria/${product.category}`} className="hover:text-primary capitalize transition-colors">
                    {product.category}
                  </Link>
                </>
              )}
            </nav>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12">
            {/* Images */}
            <div className="space-y-3 md:space-y-4">
              <div className="relative aspect-square bg-gradient-to-br from-card to-secondary/30 rounded-xl md:rounded-2xl overflow-hidden border border-border">
                {product.discount_percent && (
                  <Badge className="absolute top-3 left-3 md:top-4 md:left-4 z-10 discount-badge text-xs md:text-sm">
                    <Zap className="h-3 w-3 mr-1" />
                    -{product.discount_percent}% OFF
                  </Badge>
                )}
                {product.express_delivery && (
                  <Badge className="absolute top-3 right-3 md:top-4 md:right-4 z-10 bg-primary text-primary-foreground text-xs">
                    <Truck className="h-3 w-3 mr-1" />
                    EXPRESS
                  </Badge>
                )}
                <img
                  src={allImages[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-contain p-4 md:p-8 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
              
              {allImages.length > 1 && (
                <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-lg md:rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                        selectedImage === index 
                          ? 'border-primary shadow-lg shadow-primary/30' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`${product.name} - ${index + 1}`}
                        className="w-full h-full object-contain p-1 md:p-2 bg-card"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-4 md:space-y-6">
              {/* Brand and Rating */}
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                {product.brand && (
                  <Badge variant="outline" className="text-primary border-primary/50 text-xs md:text-sm">
                    {product.brand}
                  </Badge>
                )}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < Math.floor(averageRating) ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}`} 
                    />
                  ))}
                  <span className="text-sm font-semibold text-foreground ml-1">{averageRating}</span>
                  <span className="text-xs text-muted-foreground">({totalReviews} avaliações)</span>
                </div>
              </div>
              
              <h1 className="font-display text-xl md:text-2xl lg:text-3xl text-foreground leading-tight">
                {product.name}
              </h1>

              {/* Price Card */}
              <div className="bg-gradient-to-br from-card via-card to-secondary/30 rounded-xl md:rounded-2xl border border-border p-4 md:p-6 space-y-3 md:space-y-4">
                {product.old_price && (
                  <div className="flex items-center gap-2 md:gap-3">
                    <span className="text-muted-foreground line-through text-base md:text-lg">
                      R$ {product.old_price.toFixed(2).replace('.', ',')}
                    </span>
                    {product.discount_percent && (
                      <Badge className="bg-destructive/20 text-destructive text-xs font-bold">
                        ECONOMIA R$ {(product.old_price - product.price).toFixed(2).replace('.', ',')}
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className="space-y-1">
                  <p className="text-sm md:text-base text-muted-foreground">Por apenas:</p>
                  <p className="text-3xl md:text-4xl font-display font-bold text-foreground">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </p>
                </div>

                {/* PIX Price */}
                <div className="flex items-center gap-3 bg-primary/10 rounded-lg md:rounded-xl p-3 md:p-4 border border-primary/30">
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-primary animate-pulse-glow" />
                  <div className="flex-1">
                    <p className="text-xl md:text-2xl font-display font-bold text-primary">
                      R$ {pixPrice.toFixed(2).replace('.', ',')}
                    </p>
                    <p className="text-xs md:text-sm text-primary/80">à vista no Pix (5% desconto)</p>
                  </div>
                  <Badge className="bg-primary text-primary-foreground text-xs">5% OFF</Badge>
                </div>

                <p className="text-xs md:text-sm text-muted-foreground">
                  ou até <span className="font-bold text-foreground">10x</span> de{" "}
                  <span className="font-bold text-foreground">R$ {(product.price / 10).toFixed(2).replace('.', ',')}</span> sem juros
                </p>
              </div>

              {/* Shipping Calculator */}
              <div className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Truck className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-sm md:text-base">Calcular Frete</span>
                  {isFreeShipping && (
                    <Badge className="bg-green-500/20 text-green-400 text-xs ml-auto">FRETE GRÁTIS</Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="CEP"
                    value={cep}
                    onChange={(e) => setCep(e.target.value.replace(/\D/g, '').slice(0, 8))}
                    className="bg-secondary border-border text-sm"
                  />
                  <Button 
                    onClick={handleCalculateShipping}
                    disabled={isCalculating || cep.length < 8}
                    className="bg-primary hover:bg-cyan-glow text-sm px-4"
                  >
                    {isCalculating ? <RefreshCw className="h-4 w-4 animate-spin" /> : "OK"}
                  </Button>
                </div>
                
                {shippingResult && (
                  <div className="mt-3 p-3 bg-secondary/50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-sm">CEP {cep}</span>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${shippingResult.price === "GRÁTIS" ? "text-green-400" : "text-foreground"}`}>
                        {shippingResult.price}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {shippingResult.days}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity & Buy Button */}
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center gap-3 md:gap-4">
                  <span className="text-sm font-medium">Quantidade:</span>
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 md:px-4 py-2 hover:bg-secondary transition-colors text-lg font-bold"
                    >−</button>
                    <span className="px-4 md:px-6 py-2 font-bold bg-secondary/50 min-w-[48px] text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 md:px-4 py-2 hover:bg-secondary transition-colors text-lg font-bold"
                    >+</button>
                  </div>
                </div>

                <Button 
                  onClick={handleBuyNow}
                  className="w-full h-16 md:h-20 text-lg md:text-xl btn-buy gap-3 font-display tracking-wide relative overflow-hidden"
                >
                  <ShoppingCart className="h-6 w-6 md:h-7 md:w-7" />
                  COMPRAR AGORA
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-lg md:rounded-xl bg-card border border-border">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <Truck className="h-4 w-4 md:h-5 md:w-5 text-green-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-xs md:text-sm truncate">Frete Grátis</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground">Acima de R$299</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-lg md:rounded-xl bg-card border border-border">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-xs md:text-sm truncate">Compra Segura</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground">100% Protegido</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-lg md:rounded-xl bg-card border border-border">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                    <Award className="h-4 w-4 md:h-5 md:w-5 text-yellow-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-xs md:text-sm truncate">Original</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground">Garantia Total</p>
                  </div>
                </div>
                
                {product.express_delivery && (
                  <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-lg md:rounded-xl bg-card border border-border">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Zap className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-xs md:text-sm truncate">Express</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground">Receba em 24h</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-8 md:mt-12">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start bg-card border-b border-border rounded-none h-auto p-0 gap-0">
                <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 md:px-6 py-3 md:py-4 text-sm md:text-base">
                  <Package className="h-4 w-4 mr-2" />
                  Descrição
                </TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 md:px-6 py-3 md:py-4 text-sm md:text-base">
                  <Star className="h-4 w-4 mr-2" />
                  Avaliações ({totalReviews})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-4 md:mt-6">
                <div className="bg-card rounded-xl border border-border p-4 md:p-6">
                  <h2 className="font-display text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Descrição do Produto
                  </h2>
                  {product.description ? (
                    <div>
                      <p className={`text-muted-foreground whitespace-pre-line leading-relaxed text-sm md:text-base ${!showFullDescription && 'line-clamp-6'}`}>
                        {product.description}
                      </p>
                      {product.description.length > 300 && (
                        <Button 
                          variant="ghost" 
                          onClick={() => setShowFullDescription(!showFullDescription)}
                          className="mt-3 text-primary hover:text-cyan-glow"
                        >
                          {showFullDescription ? (
                            <>Ver menos <ChevronUp className="h-4 w-4 ml-1" /></>
                          ) : (
                            <>Ver mais <ChevronDown className="h-4 w-4 ml-1" /></>
                          )}
                        </Button>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      Produto de alta qualidade para estética automotiva profissional. 
                      Entre em contato para mais informações.
                    </p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-4 md:mt-6">
                <div className="bg-card rounded-xl border border-border p-4 md:p-6">
                  <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-6 pb-6 border-b border-border">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-4xl md:text-5xl font-display font-bold text-primary">{averageRating}</p>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < Math.floor(averageRating) ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}`} />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{totalReviews} avaliações</p>
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const percentage = star === 5 ? 78 : star === 4 ? 15 : star === 3 ? 5 : 2;
                        return (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-xs w-12">{star} estrelas</span>
                            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                              <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percentage}%` }} />
                            </div>
                            <span className="text-xs text-muted-foreground w-10">{percentage}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="p-4 bg-secondary/30 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-sm">{review.author}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}`} />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">{review.date}</span>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            <Check className="h-3 w-3 mr-1" />
                            Verificada
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                            <ThumbsUp className="h-3 w-3" />
                            Útil ({review.helpful})
                          </button>
                          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                            <MessageSquare className="h-3 w-3" />
                            Responder
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Floating Buy Button */}
      <FloatingBuyButton onBuy={handleBuyNow} price={product.price} pixPrice={pixPrice} />

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ProductDetailPage;
