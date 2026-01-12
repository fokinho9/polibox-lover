import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, ShoppingCart, Truck, Shield, Zap, Star, Check, 
  Package, MapPin, Award, RefreshCw, Clock, ChevronDown, ChevronUp,
  ThumbsUp, MessageSquare, ChevronLeft, ChevronRight
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

// 100+ unique comments pool
const allComments = [
  { author: "Carlos M.", comment: "Produto excelente, chegou muito rápido! Recomendo demais.", rating: 5 },
  { author: "Amanda S.", comment: "Qualidade top! Já é a terceira vez que compro.", rating: 5 },
  { author: "Roberto F.", comment: "Muito bom, só achei a embalagem um pouco pequena.", rating: 4 },
  { author: "Fernanda L.", comment: "Superou minhas expectativas! O acabamento ficou perfeito.", rating: 5 },
  { author: "Lucas P.", comment: "Entrega rápida e produto original. Nota 10!", rating: 5 },
  { author: "Mariana C.", comment: "Uso profissionalmente e recomendo a todos os clientes.", rating: 5 },
  { author: "Pedro H.", comment: "Bom custo-benefício, faz o que promete.", rating: 4 },
  { author: "Juliana A.", comment: "Produto chegou bem embalado e dentro do prazo.", rating: 5 },
  { author: "Bruno R.", comment: "Já testei várias marcas, essa é a melhor!", rating: 5 },
  { author: "Patrícia M.", comment: "Rendimento excelente, vale cada centavo.", rating: 5 },
  { author: "Ricardo S.", comment: "Atendimento nota 10, produto de primeira.", rating: 5 },
  { author: "Camila O.", comment: "Fácil de aplicar e resultado incrível.", rating: 5 },
  { author: "Diego N.", comment: "Comprei para minha oficina, clientes adoraram.", rating: 5 },
  { author: "Tatiana B.", comment: "Produto original, diferença absurda dos genéricos.", rating: 5 },
  { author: "Gustavo L.", comment: "Muito satisfeito com a compra, voltarei a comprar.", rating: 4 },
  { author: "Renata K.", comment: "Dura muito mais que os concorrentes.", rating: 5 },
  { author: "Marcos V.", comment: "Preço justo e qualidade premium.", rating: 5 },
  { author: "Beatriz G.", comment: "Uso há 2 anos, nunca me decepcionou.", rating: 5 },
  { author: "André F.", comment: "Acabamento profissional em casa, sensacional!", rating: 5 },
  { author: "Luciana D.", comment: "Presente para meu marido, ele amou!", rating: 5 },
  { author: "Thiago M.", comment: "Chegou antes do previsto, muito bem embalado.", rating: 5 },
  { author: "Daniela R.", comment: "Resultado visível na primeira aplicação.", rating: 5 },
  { author: "Felipe C.", comment: "Recomendo para detalhamento automotivo.", rating: 5 },
  { author: "Aline S.", comment: "Produto profissional a preço acessível.", rating: 4 },
  { author: "Rodrigo P.", comment: "Excelente para quem trabalha com estética.", rating: 5 },
  { author: "Cristina A.", comment: "Compra 100% segura, recebi certinho.", rating: 5 },
  { author: "Leandro B.", comment: "Faz diferença usar produto de qualidade.", rating: 5 },
  { author: "Vanessa T.", comment: "Meu carro ficou parecendo novo!", rating: 5 },
  { author: "Eduardo H.", comment: "Não troco por nenhuma outra marca.", rating: 5 },
  { author: "Simone L.", comment: "Valeu a pena esperar, produto top!", rating: 5 },
  { author: "Gabriel N.", comment: "Facilidade na aplicação impressionante.", rating: 4 },
  { author: "Paula E.", comment: "Já indiquei para todos os amigos.", rating: 5 },
  { author: "Vinícius O.", comment: "Brilho intenso e duradouro.", rating: 5 },
  { author: "Helena M.", comment: "Produto chegou lacrado e original.", rating: 5 },
  { author: "Fábio J.", comment: "Melhor investimento que fiz pro meu carro.", rating: 5 },
  { author: "Carla W.", comment: "Atende perfeitamente as expectativas.", rating: 4 },
  { author: "Maurício F.", comment: "Proteção de longa duração garantida.", rating: 5 },
  { author: "Natália C.", comment: "Custo-benefício imbatível!", rating: 5 },
  { author: "Alexandre R.", comment: "Uso em detalhamento profissional, aprovo!", rating: 5 },
  { author: "Mônica S.", comment: "Produto confiável, sempre compro aqui.", rating: 5 },
  { author: "Sérgio K.", comment: "Resultado surpreendente na primeira vez.", rating: 5 },
  { author: "Débora L.", comment: "Embalagem resistente, chegou perfeito.", rating: 5 },
  { author: "Cláudio P.", comment: "Qualidade superior, sem comparação.", rating: 5 },
  { author: "Rafaela B.", comment: "Minha esposa adorou o resultado!", rating: 5 },
  { author: "Igor M.", comment: "Compra rápida e produto excelente.", rating: 4 },
  { author: "Larissa V.", comment: "Atendimento pós-venda muito bom.", rating: 5 },
  { author: "Otávio G.", comment: "Frete grátis e produto de qualidade.", rating: 5 },
  { author: "Elaine D.", comment: "Rendeu muito mais que o esperado.", rating: 5 },
  { author: "Henrique A.", comment: "Profissional, só uso essa marca.", rating: 5 },
  { author: "Isabela T.", comment: "Comprei de novo, não me arrependo.", rating: 5 },
  { author: "Wagner F.", comment: "Entrega expressa impecável.", rating: 5 },
  { author: "Bianca N.", comment: "Resultado profissional em minutos.", rating: 5 },
  { author: "Antônio J.", comment: "Melhor produto da categoria.", rating: 5 },
  { author: "Lívia C.", comment: "Brilho espelhado, incrível!", rating: 5 },
  { author: "Caio R.", comment: "Produto chegou rápido e bem protegido.", rating: 4 },
  { author: "Giovana S.", comment: "Uso semanal, qualidade mantida.", rating: 5 },
  { author: "Nelson H.", comment: "Indicação do meu mecânico, aprovado!", rating: 5 },
  { author: "Letícia M.", comment: "Facilidade de uso incomparável.", rating: 5 },
  { author: "Douglas B.", comment: "Vale cada real investido.", rating: 5 },
  { author: "Sabrina L.", comment: "Meu favorito para detalhamento.", rating: 5 },
  { author: "Rogério P.", comment: "Produto premium, resultado premium.", rating: 5 },
  { author: "Adriana K.", comment: "Compra sem erro, recomendo!", rating: 5 },
  { author: "Márcio V.", comment: "Durabilidade excelente.", rating: 4 },
  { author: "Priscila G.", comment: "Acabamento impecável garantido.", rating: 5 },
  { author: "Jefferson D.", comment: "Uso há 3 anos, sempre satisfeito.", rating: 5 },
  { author: "Carolina A.", comment: "Melhorou muito a aparência do carro.", rating: 5 },
  { author: "Evandro T.", comment: "Produto original faz toda diferença.", rating: 5 },
  { author: "Marina F.", comment: "Super fácil de aplicar.", rating: 5 },
  { author: "Silvio N.", comment: "Qualidade certificada, nota máxima!", rating: 5 },
  { author: "Jéssica C.", comment: "Chegou antes do prazo previsto.", rating: 5 },
  { author: "Marcelo R.", comment: "Resultados visíveis imediatamente.", rating: 5 },
  { author: "Daniele S.", comment: "Produto confiável e eficiente.", rating: 4 },
  { author: "Leonardo H.", comment: "Indico de olhos fechados.", rating: 5 },
  { author: "Raquel M.", comment: "Minha segunda compra, sempre excelente.", rating: 5 },
  { author: "Edson B.", comment: "Proteção real contra riscos.", rating: 5 },
  { author: "Viviane L.", comment: "Ótimo para manutenção preventiva.", rating: 5 },
  { author: "Renato P.", comment: "Uso profissional garantido.", rating: 5 },
  { author: "Elisa K.", comment: "Produto chegou conforme anunciado.", rating: 5 },
  { author: "Fabrício V.", comment: "Custo-benefício nota 10.", rating: 5 },
  { author: "Cíntia G.", comment: "Resultado melhor que esperava.", rating: 5 },
  { author: "Valter D.", comment: "Fidelidade total a essa marca.", rating: 5 },
  { author: "Karina A.", comment: "Acabamento de concessionária.", rating: 5 },
  { author: "Jorge T.", comment: "Produto de qualidade comprovada.", rating: 4 },
  { author: "Talita F.", comment: "Facilidade na aplicação surpreendente.", rating: 5 },
  { author: "Rubens N.", comment: "Nunca usei nada melhor.", rating: 5 },
  { author: "Michele C.", comment: "Brilho duradouro garantido.", rating: 5 },
  { author: "Paulo R.", comment: "Excelente para uso doméstico também.", rating: 5 },
  { author: "Fernanda S.", comment: "Produto de primeira linha.", rating: 5 },
  { author: "Cleber H.", comment: "Rendimento acima da média.", rating: 5 },
  { author: "Vanusa M.", comment: "Comprei para presente, adoraram!", rating: 5 },
  { author: "Gilberto B.", comment: "Proteção UV eficiente.", rating: 5 },
  { author: "Sandra L.", comment: "Resultado profissional em casa.", rating: 5 },
  { author: "Reginaldo P.", comment: "Produto essencial para manutenção.", rating: 4 },
  { author: "Fabiana K.", comment: "Qualidade incomparável.", rating: 5 },
  { author: "Nilton V.", comment: "Faz jus à fama da marca.", rating: 5 },
  { author: "Rosana G.", comment: "Aplicação simples e rápida.", rating: 5 },
  { author: "Ademir D.", comment: "Investimento que vale a pena.", rating: 5 },
  { author: "Lúcia A.", comment: "Proteção prolongada comprovada.", rating: 5 },
  { author: "Júlio T.", comment: "Produto chegou perfeito.", rating: 5 },
  { author: "Regina F.", comment: "Uso semanalmente, aprovo!", rating: 5 },
];

// Function to generate unique reviews based on product ID
const generateReviewsForProduct = (productId: string) => {
  // Use product ID to create a seed for consistent but unique reviews
  const seed = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const reviewCount = 2 + (seed % 21); // 2 to 22 reviews
  
  // Shuffle comments based on seed
  const shuffled = [...allComments].sort((a, b) => {
    const hashA = (seed * a.author.charCodeAt(0)) % 1000;
    const hashB = (seed * b.author.charCodeAt(0)) % 1000;
    return hashA - hashB;
  });
  
  // Generate dates
  const baseDate = new Date('2025-12-15');
  
  return shuffled.slice(0, reviewCount).map((review, index) => {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - (index * 3 + (seed % 5)));
    
    return {
      id: index + 1,
      ...review,
      date: date.toLocaleDateString('pt-BR'),
      helpful: Math.floor((seed * (index + 1)) % 20) + 1,
    };
  });
};

const REVIEWS_PER_PAGE = 5;

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cep, setCep] = useState("");
  const [shippingResult, setShippingResult] = useState<{ price: string; days: string } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);
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

  // Generate unique reviews for this product
  const reviews = useMemo(() => {
    if (!id) return [];
    return generateReviewsForProduct(id);
  }, [id]);

  const totalReviews = reviews.length;
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0";
  
  // Pagination
  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const paginatedReviews = reviews.slice(
    (reviewPage - 1) * REVIEWS_PER_PAGE,
    reviewPage * REVIEWS_PER_PAGE
  );

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
                      className={`h-4 w-4 ${i < Math.floor(parseFloat(averageRating)) ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}`} 
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
                            <Star key={i} className={`h-4 w-4 ${i < Math.floor(parseFloat(averageRating)) ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}`} />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{totalReviews} avaliações</p>
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = reviews.filter(r => r.rating === star).length;
                        const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
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
                    {paginatedReviews.map((review) => (
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
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-border">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setReviewPage(p => Math.max(1, p - 1))}
                        disabled={reviewPage === 1}
                        className="gap-1"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Anterior
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={page === reviewPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => setReviewPage(page)}
                            className={`w-8 h-8 p-0 ${page === reviewPage ? 'bg-primary text-primary-foreground' : ''}`}
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setReviewPage(p => Math.min(totalPages, p + 1))}
                        disabled={reviewPage === totalPages}
                        className="gap-1"
                      >
                        Próximo
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
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
