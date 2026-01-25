import { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ShoppingCart, Truck, Shield, Zap, Star, Check, Package, MapPin, Award, RefreshCw, Clock, ChevronDown, ChevronUp, ThumbsUp, MessageSquare, ChevronLeft, ChevronRight, Flame, Heart, BadgeCheck, Sparkles, Gift, CreditCard, Users, Eye, TrendingUp, Timer, ShieldCheck, RotateCcw } from "lucide-react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import FloatingBuyButton from "@/components/FloatingBuyButton";
import RelatedProducts from "@/components/RelatedProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/contexts/CartContext";
import { useQuiz } from "@/contexts/QuizContext";
import { useToast } from "@/hooks/use-toast";
import { applyDiscount } from "@/lib/utils";

// 100+ unique comments pool
const allComments = [{
  author: "Carlos M.",
  comment: "Produto excelente, chegou muito rápido! Recomendo demais.",
  rating: 5
}, {
  author: "Amanda S.",
  comment: "Qualidade top! Já é a terceira vez que compro.",
  rating: 5
}, {
  author: "Roberto F.",
  comment: "Muito bom, só achei a embalagem um pouco pequena.",
  rating: 4
}, {
  author: "Fernanda L.",
  comment: "Superou minhas expectativas! O acabamento ficou perfeito.",
  rating: 5
}, {
  author: "Lucas P.",
  comment: "Entrega rápida e produto original. Nota 10!",
  rating: 5
}, {
  author: "Mariana C.",
  comment: "Uso profissionalmente e recomendo a todos os clientes.",
  rating: 5
}, {
  author: "Pedro H.",
  comment: "Bom custo-benefício, faz o que promete.",
  rating: 4
}, {
  author: "Juliana A.",
  comment: "Produto chegou bem embalado e dentro do prazo.",
  rating: 5
}, {
  author: "Bruno R.",
  comment: "Já testei várias marcas, essa é a melhor!",
  rating: 5
}, {
  author: "Patrícia M.",
  comment: "Rendimento excelente, vale cada centavo.",
  rating: 5
}, {
  author: "Ricardo S.",
  comment: "Atendimento nota 10, produto de primeira.",
  rating: 5
}, {
  author: "Camila O.",
  comment: "Fácil de aplicar e resultado incrível.",
  rating: 5
}, {
  author: "Diego N.",
  comment: "Comprei para minha oficina, clientes adoraram.",
  rating: 5
}, {
  author: "Tatiana B.",
  comment: "Produto original, diferença absurda dos genéricos.",
  rating: 5
}, {
  author: "Gustavo L.",
  comment: "Muito satisfeito com a compra, voltarei a comprar.",
  rating: 4
}, {
  author: "Renata K.",
  comment: "Dura muito mais que os concorrentes.",
  rating: 5
}, {
  author: "Marcos V.",
  comment: "Preço justo e qualidade premium.",
  rating: 5
}, {
  author: "Beatriz G.",
  comment: "Uso há 2 anos, nunca me decepcionou.",
  rating: 5
}, {
  author: "André F.",
  comment: "Acabamento profissional em casa, sensacional!",
  rating: 5
}, {
  author: "Luciana D.",
  comment: "Presente para meu marido, ele amou!",
  rating: 5
}, {
  author: "Thiago M.",
  comment: "Chegou antes do previsto, muito bem embalado.",
  rating: 5
}, {
  author: "Daniela R.",
  comment: "Resultado visível na primeira aplicação.",
  rating: 5
}, {
  author: "Felipe C.",
  comment: "Recomendo para detalhamento automotivo.",
  rating: 5
}, {
  author: "Aline S.",
  comment: "Produto profissional a preço acessível.",
  rating: 4
}, {
  author: "Rodrigo P.",
  comment: "Excelente para quem trabalha com estética.",
  rating: 5
}, {
  author: "Cristina A.",
  comment: "Compra 100% segura, recebi certinho.",
  rating: 5
}, {
  author: "Leandro B.",
  comment: "Faz diferença usar produto de qualidade.",
  rating: 5
}, {
  author: "Vanessa T.",
  comment: "Meu carro ficou parecendo novo!",
  rating: 5
}, {
  author: "Eduardo H.",
  comment: "Não troco por nenhuma outra marca.",
  rating: 5
}, {
  author: "Simone L.",
  comment: "Valeu a pena esperar, produto top!",
  rating: 5
}, {
  author: "Gabriel N.",
  comment: "Facilidade na aplicação impressionante.",
  rating: 4
}, {
  author: "Paula E.",
  comment: "Já indiquei para todos os amigos.",
  rating: 5
}, {
  author: "Vinícius O.",
  comment: "Brilho intenso e duradouro.",
  rating: 5
}, {
  author: "Helena M.",
  comment: "Produto chegou lacrado e original.",
  rating: 5
}, {
  author: "Fábio J.",
  comment: "Melhor investimento que fiz pro meu carro.",
  rating: 5
}, {
  author: "Carla W.",
  comment: "Atende perfeitamente as expectativas.",
  rating: 4
}, {
  author: "Maurício F.",
  comment: "Proteção de longa duração garantida.",
  rating: 5
}, {
  author: "Natália C.",
  comment: "Custo-benefício imbatível!",
  rating: 5
}, {
  author: "Alexandre R.",
  comment: "Uso em detalhamento profissional, aprovo!",
  rating: 5
}, {
  author: "Mônica S.",
  comment: "Produto confiável, sempre compro aqui.",
  rating: 5
}, {
  author: "Sérgio K.",
  comment: "Resultado surpreendente na primeira vez.",
  rating: 5
}, {
  author: "Débora L.",
  comment: "Embalagem resistente, chegou perfeito.",
  rating: 5
}, {
  author: "Cláudio P.",
  comment: "Qualidade superior, sem comparação.",
  rating: 5
}, {
  author: "Rafaela B.",
  comment: "Minha esposa adorou o resultado!",
  rating: 5
}, {
  author: "Igor M.",
  comment: "Compra rápida e produto excelente.",
  rating: 4
}, {
  author: "Larissa V.",
  comment: "Atendimento pós-venda muito bom.",
  rating: 5
}, {
  author: "Otávio G.",
  comment: "Frete grátis e produto de qualidade.",
  rating: 5
}, {
  author: "Elaine D.",
  comment: "Rendeu muito mais que o esperado.",
  rating: 5
}, {
  author: "Henrique A.",
  comment: "Profissional, só uso essa marca.",
  rating: 5
}, {
  author: "Isabela T.",
  comment: "Comprei de novo, não me arrependo.",
  rating: 5
}, {
  author: "Wagner F.",
  comment: "Entrega expressa impecável.",
  rating: 5
}, {
  author: "Bianca N.",
  comment: "Resultado profissional em minutos.",
  rating: 5
}, {
  author: "Antônio J.",
  comment: "Melhor produto da categoria.",
  rating: 5
}, {
  author: "Lívia C.",
  comment: "Brilho espelhado, incrível!",
  rating: 5
}, {
  author: "Caio R.",
  comment: "Produto chegou rápido e bem protegido.",
  rating: 4
}, {
  author: "Giovana S.",
  comment: "Uso semanal, qualidade mantida.",
  rating: 5
}, {
  author: "Nelson H.",
  comment: "Indicação do meu mecânico, aprovado!",
  rating: 5
}, {
  author: "Letícia M.",
  comment: "Facilidade de uso incomparável.",
  rating: 5
}, {
  author: "Douglas B.",
  comment: "Vale cada real investido.",
  rating: 5
}, {
  author: "Sabrina L.",
  comment: "Meu favorito para detalhamento.",
  rating: 5
}, {
  author: "Rogério P.",
  comment: "Produto premium, resultado premium.",
  rating: 5
}, {
  author: "Adriana K.",
  comment: "Compra sem erro, recomendo!",
  rating: 5
}, {
  author: "Márcio V.",
  comment: "Durabilidade excelente.",
  rating: 4
}, {
  author: "Priscila G.",
  comment: "Acabamento impecável garantido.",
  rating: 5
}, {
  author: "Jefferson D.",
  comment: "Uso há 3 anos, sempre satisfeito.",
  rating: 5
}, {
  author: "Carolina A.",
  comment: "Melhorou muito a aparência do carro.",
  rating: 5
}, {
  author: "Evandro T.",
  comment: "Produto original faz toda diferença.",
  rating: 5
}, {
  author: "Marina F.",
  comment: "Super fácil de aplicar.",
  rating: 5
}, {
  author: "Silvio N.",
  comment: "Qualidade certificada, nota máxima!",
  rating: 5
}, {
  author: "Jéssica C.",
  comment: "Chegou antes do prazo previsto.",
  rating: 5
}, {
  author: "Marcelo R.",
  comment: "Resultados visíveis imediatamente.",
  rating: 5
}, {
  author: "Daniele S.",
  comment: "Produto confiável e eficiente.",
  rating: 4
}, {
  author: "Leonardo H.",
  comment: "Indico de olhos fechados.",
  rating: 5
}, {
  author: "Raquel M.",
  comment: "Minha segunda compra, sempre excelente.",
  rating: 5
}, {
  author: "Edson B.",
  comment: "Proteção real contra riscos.",
  rating: 5
}, {
  author: "Viviane L.",
  comment: "Ótimo para manutenção preventiva.",
  rating: 5
}, {
  author: "Renato P.",
  comment: "Uso profissional garantido.",
  rating: 5
}, {
  author: "Elisa K.",
  comment: "Produto chegou conforme anunciado.",
  rating: 5
}, {
  author: "Fabrício V.",
  comment: "Custo-benefício nota 10.",
  rating: 5
}, {
  author: "Cíntia G.",
  comment: "Resultado melhor que esperava.",
  rating: 5
}, {
  author: "Valter D.",
  comment: "Fidelidade total a essa marca.",
  rating: 5
}, {
  author: "Karina A.",
  comment: "Acabamento de concessionária.",
  rating: 5
}, {
  author: "Jorge T.",
  comment: "Produto de qualidade comprovada.",
  rating: 4
}, {
  author: "Talita F.",
  comment: "Facilidade na aplicação surpreendente.",
  rating: 5
}, {
  author: "Rubens N.",
  comment: "Nunca usei nada melhor.",
  rating: 5
}, {
  author: "Michele C.",
  comment: "Brilho duradouro garantido.",
  rating: 5
}, {
  author: "Paulo R.",
  comment: "Excelente para uso doméstico também.",
  rating: 5
}, {
  author: "Fernanda S.",
  comment: "Produto de primeira linha.",
  rating: 5
}, {
  author: "Cleber H.",
  comment: "Rendimento acima da média.",
  rating: 5
}, {
  author: "Vanusa M.",
  comment: "Comprei para presente, adoraram!",
  rating: 5
}, {
  author: "Gilberto B.",
  comment: "Proteção UV eficiente.",
  rating: 5
}, {
  author: "Sandra L.",
  comment: "Resultado profissional em casa.",
  rating: 5
}, {
  author: "Reginaldo P.",
  comment: "Produto essencial para manutenção.",
  rating: 4
}, {
  author: "Fabiana K.",
  comment: "Qualidade incomparável.",
  rating: 5
}, {
  author: "Nilton V.",
  comment: "Faz jus à fama da marca.",
  rating: 5
}, {
  author: "Rosana G.",
  comment: "Aplicação simples e rápida.",
  rating: 5
}, {
  author: "Ademir D.",
  comment: "Investimento que vale a pena.",
  rating: 5
}, {
  author: "Lúcia A.",
  comment: "Proteção prolongada comprovada.",
  rating: 5
}, {
  author: "Júlio T.",
  comment: "Produto chegou perfeito.",
  rating: 5
}, {
  author: "Regina F.",
  comment: "Uso semanalmente, aprovo!",
  rating: 5
}];

// Function to generate unique reviews based on product ID
const generateReviewsForProduct = (productId: string) => {
  const seed = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const reviewCount = 2 + seed % 21;
  const shuffled = [...allComments].sort((a, b) => {
    const hashA = seed * a.author.charCodeAt(0) % 1000;
    const hashB = seed * b.author.charCodeAt(0) % 1000;
    return hashA - hashB;
  });
  const baseDate = new Date('2025-12-15');
  return shuffled.slice(0, reviewCount).map((review, index) => {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - (index * 3 + seed % 5));
    return {
      id: index + 1,
      ...review,
      date: date.toLocaleDateString('pt-BR'),
      helpful: Math.floor(seed * (index + 1) % 20) + 1
    };
  });
};
const REVIEWS_PER_PAGE = 5;
const ProductDetailPage = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cep, setCep] = useState("");
  const [shippingResult, setShippingResult] = useState<{
    price: string;
    days: string;
    city?: string;
    state?: string;
  } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [viewersNow, setViewersNow] = useState(0);
  const [recentBuyers, setRecentBuyers] = useState(0);
  const {
    addToCart
  } = useCart();
  const {
    hasCompletedQuiz,
    discountPercent,
    timeRemaining
  } = useQuiz();
  const {
    toast
  } = useToast();

  // Social proof - random viewers and buyers
  useEffect(() => {
    if (id) {
      const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      setViewersNow(12 + seed % 28);
      setRecentBuyers(45 + seed % 120);
    }
  }, [id]);
  const {
    data: product,
    isLoading
  } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('products').select('*').eq('id', id).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes cache
  });
  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    toast({
      title: "🛒 Produto adicionado!",
      description: `${product.name} foi adicionado ao carrinho`
    });
  };
  const handleCalculateShipping = async () => {
    if (!cep || cep.length < 8) return;
    setIsCalculating(true);
    
    try {
      const cleanCep = cep.replace(/\D/g, '');
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        setShippingResult({
          price: "GRÁTIS",
          days: "7 dias úteis"
        });
      } else {
        setShippingResult({
          price: "GRÁTIS",
          days: "7 dias úteis",
          city: data.localidade,
          state: data.uf
        });
      }
    } catch (error) {
      setShippingResult({
        price: "GRÁTIS",
        days: "7 dias úteis"
      });
    }
    
    setIsCalculating(false);
  };
  const reviews = useMemo(() => {
    if (!id) return [];
    return generateReviewsForProduct(id);
  }, [id]);
  const totalReviews = reviews.length;
  const averageRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "0";
  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const paginatedReviews = reviews.slice((reviewPage - 1) * REVIEWS_PER_PAGE, reviewPage * REVIEWS_PER_PAGE);
  if (isLoading) {
    return <div className="min-h-screen bg-background">
        <Header />
        <Navigation />
        <main className="py-4 md:py-8">
          <div className="container-main">
            <div className="grid md:grid-cols-2 gap-6 md:gap-12 animate-pulse">
              <div className="aspect-square bg-card rounded-3xl" />
              <div className="space-y-4 md:space-y-6">
                <div className="h-6 md:h-8 bg-card rounded w-3/4" />
                <div className="h-4 md:h-6 bg-card rounded w-1/2" />
                <div className="h-24 md:h-32 bg-card rounded-2xl" />
                <div className="h-12 md:h-14 bg-card rounded-2xl" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>;
  }
  if (!product) {
    return <div className="min-h-screen bg-background">
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
      </div>;
  }
  const quizMultiplier = hasCompletedQuiz ? (100 - discountPercent) / 100 : 1;
  const basePrice = applyDiscount(product.price);
  const displayPrice = basePrice * quizMultiplier;
  const allImages = [product.image_url, ...(product.additional_images || [])].filter(Boolean);
  const isFreeShipping = true; // Always free shipping

  return <div className="min-h-screen bg-gradient-to-b from-background via-background to-card/20">
      <Header />
      <Navigation />
      
      {/* Quiz Discount Banner - Orange Theme */}
      {hasCompletedQuiz && <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 text-white py-3 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%200h20v20H0z%22%20fill%3D%22%23fff%22%20fill-opacity%3D%22.05%22%2F%3E%3C%2Fsvg%3E')]" />
          <div className="container-main flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 relative">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 animate-pulse" />
              <span className="font-bold text-sm sm:text-base">🎉 DESCONTO EXCLUSIVO DE {discountPercent}% APLICADO!</span>
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5">
              <Clock className="h-4 w-4" />
              <span className="font-mono font-bold text-sm">{timeRemaining}</span>
            </div>
          </div>
        </div>}
      
      <main className="py-4 md:py-8 pb-32">
        <div className="container-main">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 md:gap-4 mb-4 overflow-x-auto scrollbar-hide">
            <Link to={product.category ? `/categoria/${product.category}` : "/"}>
              <Button variant="ghost" size="sm" className="gap-1 md:gap-2 hover:text-primary px-2 md:px-3 rounded-full">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Voltar</span>
              </Button>
            </Link>
            <div className="h-4 md:h-6 w-px bg-border" />
            <nav className="text-xs md:text-sm text-muted-foreground flex items-center flex-nowrap gap-1 whitespace-nowrap">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              {product.category && <>
                  <span className="mx-1 md:mx-2">/</span>
                  <Link to={`/categoria/${product.category}`} className="hover:text-primary capitalize transition-colors">
                    {product.category}
                  </Link>
                </>}
            </nav>
          </div>

          {/* Social Proof Bar */}
          <div className="flex flex-wrap items-center gap-3 md:gap-6 mb-6 p-3 bg-gradient-to-r from-primary/10 via-card to-emerald-500/10 rounded-2xl border border-primary/20">
            <div className="flex items-center gap-2 text-sm">
              <div className="relative">
                <Eye className="h-4 w-4 text-primary" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </div>
              <span className="text-muted-foreground"><span className="font-bold text-foreground">{viewersNow}</span> vendo agora</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-emerald-400" />
              <span className="text-muted-foreground"><span className="font-bold text-foreground">{recentBuyers}</span> compraram esta semana</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-orange-400" />
              <span className="text-orange-400 font-semibold">🔥 Mais vendido</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-[520px_1fr] xl:grid-cols-[580px_1fr] gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square max-w-[480px] md:max-w-none lg:max-w-[520px] xl:max-w-[580px] mx-auto bg-gradient-to-br from-card via-card to-secondary/30 rounded-3xl overflow-hidden border border-border/50 shadow-2xl shadow-black/20 group">
                {/* Discount Banner - Eye-catching */}
                {product.discount_percent && <div className="absolute top-0 left-0 right-0 z-10">
                    <div className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 text-white py-2 px-4 flex items-center justify-center gap-2 text-sm font-black shadow-lg">
                      <Flame className="h-4 w-4 animate-pulse" />
                      <span className="tracking-wide">ECONOMIZE {product.discount_percent}% AGORA</span>
                      <Sparkles className="h-4 w-4" />
                    </div>
                  </div>}
                
                {/* Side Badges */}
                <div className="absolute top-14 left-3 z-10 flex flex-col gap-2">
                  {product.express_delivery && <Badge className="bg-gradient-to-r from-primary to-cyan-400 text-white border-0 text-xs font-bold px-3 py-1.5 shadow-lg animate-pulse">
                      <Zap className="h-3 w-3 mr-1" />
                      ENTREGA EXPRESS
                    </Badge>}
                  {isFreeShipping && <Badge className="bg-gradient-to-r from-emerald-500 to-green-400 text-white border-0 text-xs font-bold px-3 py-1.5 shadow-lg">
                      <Truck className="h-3 w-3 mr-1" />
                      FRETE GRÁTIS
                    </Badge>}
                </div>
                
                {/* Favorite Button */}
                <button onClick={() => setIsFavorite(!isFavorite)} className="absolute top-14 right-3 z-10 w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all hover:scale-110 hover:bg-white/20">
                  <Heart className={`h-5 w-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white/70'}`} />
                </button>
                
                <img src={allImages[selectedImage] || "/placeholder.svg"} alt={product.name} className="w-full h-full object-contain p-6 md:p-10 pt-16 transition-transform duration-700 group-hover:scale-105" onError={e => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }} />
                
                {/* Bottom Urgency Strip */}
                {product.discount_percent && product.discount_percent >= 15 && <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent py-4 px-4">
                    <div className="flex items-center justify-center gap-2 text-white text-sm font-semibold">
                      <Timer className="h-4 w-4 text-yellow-400 animate-pulse" />
                      <span>Restam poucas unidades neste preço!</span>
                    </div>
                  </div>}
              </div>
              
              {/* Thumbnails */}
              {allImages.length > 1 && <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide justify-center lg:justify-start">
                  {allImages.map((img, index) => <button key={index} onClick={() => setSelectedImage(index)} className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === index ? 'border-primary shadow-lg shadow-primary/30 scale-105' : 'border-border/50 hover:border-primary/50 opacity-70 hover:opacity-100'}`}>
                      <img src={img || "/placeholder.svg"} alt={`${product.name} - ${index + 1}`} className="w-full h-full object-contain p-1 bg-card" />
                    </button>)}
                </div>}

              {/* Mini Social Proof under image */}
              <div className="flex items-center justify-center gap-4 py-3 px-4 bg-card/50 rounded-xl border border-border/30">
                <div className="flex -space-x-2">
                  {['👨', '👩', '👨‍🦱', '👩‍🦰', '🧑'].map((emoji, i) => <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-cyan-500/20 border-2 border-card flex items-center justify-center text-sm">
                      {emoji}
                    </div>)}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-bold text-foreground">{recentBuyers}+ clientes</span> satisfeitos
                </p>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-5 md:space-y-6">
              {/* Brand and Rating */}
              <div className="flex flex-wrap items-center gap-3">
                {product.brand && <Badge className="bg-gradient-to-r from-primary/20 to-cyan-500/20 text-primary border-primary/30 text-xs md:text-sm font-semibold px-3 py-1">
                    <BadgeCheck className="h-3.5 w-3.5 mr-1" />
                    {product.brand}
                  </Badge>}
                <div className="flex items-center gap-1.5 bg-yellow-500/10 rounded-full px-3 py-1.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.floor(parseFloat(averageRating)) ? 'text-yellow-400 fill-current' : 'text-muted-foreground/30'}`} />)}
                  <span className="text-sm font-bold text-yellow-400 ml-1">{averageRating}</span>
                  <span className="text-xs text-muted-foreground">({totalReviews})</span>
                </div>
              </div>
              
              {/* Product Name */}
              <h1 className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground leading-tight">
                {product.name}
              </h1>

              {/* MEGA Discount Banner */}
              {product.discount_percent && product.discount_percent >= 15 && <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 p-0.5">
                  <div className="bg-gradient-to-r from-red-900/90 via-orange-900/90 to-yellow-900/90 rounded-lg px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center">
                          <span className="text-lg font-black text-white">{product.discount_percent}%</span>
                        </div>
                        <div>
                          <p className="text-white font-black text-sm tracking-wide">DESCONTO IMPERDÍVEL</p>
                          <p className="text-white/80 text-xs">Economize R$ {product.old_price ? (applyDiscount(product.old_price) - basePrice).toFixed(2).replace('.', ',') : '0,00'}</p>
                        </div>
                      </div>
                      <Flame className="h-6 w-6 text-yellow-400 animate-pulse" />
                    </div>
                  </div>
                </div>}

              {/* Price Card - Premium */}
              <div className="relative bg-gradient-to-br from-card via-card to-primary/5 rounded-2xl border border-border/50 p-4 md:p-5 space-y-3 overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                
                {/* Quiz Discount Applied Message */}
                {hasCompletedQuiz && <div className="relative p-3 bg-gradient-to-r from-primary/20 to-cyan-500/10 border border-primary/30 rounded-xl mb-2">
                    <div className="flex items-center gap-2 text-sm text-primary font-bold">
                      <Sparkles className="h-4 w-4 animate-pulse" />
                      <span>DESCONTO EXCLUSIVO DE {discountPercent}% APLICADO!</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-primary/80 mt-1">
                      <Clock className="h-3 w-3" />
                      <span>Expira em: <span className="font-mono font-bold">{timeRemaining}</span></span>
                    </div>
                  </div>}

                {(product.old_price || hasCompletedQuiz) && <div className="flex items-center gap-2 relative flex-wrap">
                    <span className="text-muted-foreground line-through text-base">
                      R$ {(hasCompletedQuiz ? basePrice : applyDiscount(product.old_price || product.price))?.toFixed(2).replace('.', ',')}
                    </span>
                    {(product.discount_percent || hasCompletedQuiz) && <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 text-[10px] font-black animate-pulse">
                        <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                        -{hasCompletedQuiz ? discountPercent : product.discount_percent}% OFF
                      </Badge>}
                  </div>}
                
                <div className="space-y-0.5 relative">
                  <p className="text-xs text-muted-foreground">Por apenas:</p>
                  <p className="text-2xl md:text-3xl font-display font-black text-foreground">
                    R$ {displayPrice.toFixed(2).replace('.', ',')}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground relative">
                  <CreditCard className="h-3.5 w-3.5 text-primary" />
                  <span>ou até <span className="font-bold text-foreground">10x</span> de{" "}
                  <span className="font-bold text-foreground">R$ {(displayPrice / 10).toFixed(2).replace('.', ',')}</span> sem juros</span>
                </div>

                {/* Wholesale Price - 5+ units */}
                <div className="relative p-3 bg-gradient-to-r from-green-500/15 to-green-500/5 border border-green-500/30 rounded-xl mt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-bold text-green-500">ATACADO</span>
                      <Badge className="bg-green-500/20 text-green-500 border-green-500/30 text-[10px]">
                        -20% OFF
                      </Badge>
                    </div>
                    <span className="font-display font-bold text-lg text-green-500">
                      R$ {(displayPrice * 0.8).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">A partir de 5 unidades de qualquer produto      </p>
                </div>
              </div>

              {/* Shipping Calculator */}
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <Truck className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-sm md:text-base">Calcular Frete</span>
                    {isFreeShipping}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Digite seu CEP" value={cep} onChange={e => setCep(e.target.value.replace(/\D/g, '').slice(0, 8))} className="bg-secondary/50 border-border/50 text-sm rounded-xl" />
                  <Button onClick={handleCalculateShipping} disabled={isCalculating || cep.length < 8} className="bg-primary hover:bg-cyan-glow text-sm px-6 rounded-xl">
                    {isCalculating ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Calcular"}
                  </Button>
                </div>
                
                {shippingResult && <div className="mt-4 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-emerald-400" />
                        <div className="flex flex-col">
                          {shippingResult.city && shippingResult.state ? (
                            <>
                              <span className="text-sm font-medium">{shippingResult.city} - {shippingResult.state}</span>
                              <span className="text-xs text-muted-foreground">CEP {cep}</span>
                            </>
                          ) : (
                            <span className="text-sm">CEP {cep}</span>
                          )}
                        </div>
                      </div>
                      <p className="font-bold text-lg text-emerald-400">
                        {shippingResult.price}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-emerald-500/20">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{shippingResult.days}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                        <Package className="h-3 w-3" />
                        <span>Entrega rastreável</span>
                      </div>
                    </div>
                  </div>}
              </div>

              {/* Quantity & Buy Button */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Quantidade:</span>
                  <div className="flex items-center bg-secondary/50 rounded-xl overflow-hidden border border-border/50">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 hover:bg-secondary transition-colors text-lg font-bold">−</button>
                    <span className="px-6 py-3 font-bold bg-card/50 min-w-[60px] text-center text-lg">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 hover:bg-secondary transition-colors text-lg font-bold">+</button>
                  </div>
                </div>

                <Button onClick={handleBuyNow} className="w-full h-18 md:h-20 text-xl md:text-2xl bg-gradient-to-r from-emerald-500 via-primary to-cyan-500 bg-[length:200%_auto] hover:bg-right transition-all duration-500 text-white font-display font-black tracking-wide relative overflow-hidden rounded-2xl shadow-2xl shadow-primary/40 gap-3">
                  <ShoppingCart className="h-7 w-7 md:h-8 md:w-8" />
                  COMPRAR AGORA
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
                </Button>
                
                {/* Urgency text */}
                <p className="text-center text-sm text-orange-400 font-semibold animate-pulse">
                  ⚡ {viewersNow} pessoas estão vendo este produto agora!
                </p>
              </div>

              {/* Trust Badges - Enhanced */}
              <div className="grid grid-cols-2 gap-3">
                {[{
                icon: ShieldCheck,
                title: "Compra 100% Segura",
                subtitle: "Site protegido SSL",
                color: "emerald"
              }, {
                icon: RotateCcw,
                title: "Devolução Grátis",
                subtitle: "7 dias garantidos",
                color: "primary"
              }, {
                icon: Award,
                title: "Produto Original",
                subtitle: "Garantia de fábrica",
                color: "yellow"
              }, {
                icon: Truck,
                title: "Entrega Garantida",
                subtitle: "Rastreio completo",
                color: "primary"
              }].map((badge, index) => <div key={index} className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-card to-secondary/30 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${badge.color === 'emerald' ? 'from-emerald-500/20 to-emerald-600/10' : badge.color === 'yellow' ? 'from-yellow-500/20 to-yellow-600/10' : 'from-primary/20 to-cyan-500/10'} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <badge.icon className={`h-6 w-6 ${badge.color === 'emerald' ? 'text-emerald-400' : badge.color === 'yellow' ? 'text-yellow-400' : 'text-primary'}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate">{badge.title}</p>
                      <p className="text-xs text-muted-foreground">{badge.subtitle}</p>
                    </div>
                  </div>)}
              </div>

              {/* Featured Review - Social Proof */}
              {reviews.length > 0 && <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/5 rounded-2xl border border-yellow-500/20 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="font-bold text-sm">Avaliação em destaque</span>
                  </div>
                  <p className="text-muted-foreground text-sm italic mb-3">"{reviews[0].comment}"</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center text-white text-xs font-bold">
                        {reviews[0].author.charAt(0)}
                      </div>
                      <span className="text-sm font-medium">{reviews[0].author}</span>
                    </div>
                    <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                      <Check className="h-3 w-3 mr-1" />
                      Compra verificada
                    </Badge>
                  </div>
                </div>}
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-12 md:mt-16">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start bg-card/50 border border-border/50 rounded-2xl p-1.5 gap-1 h-auto">
                <TabsTrigger value="description" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white px-6 py-3 text-sm md:text-base transition-all">
                  <Package className="h-4 w-4 mr-2" />
                  Descrição
                </TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white px-6 py-3 text-sm md:text-base transition-all">
                  <Star className="h-4 w-4 mr-2" />
                  Avaliações ({totalReviews})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-6">
                <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 p-6 md:p-8 shadow-xl">
                  <h2 className="font-display text-xl md:text-2xl font-bold mb-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    Descrição do Produto
                  </h2>
                  {product.description ? <div>
                      <p className={`text-muted-foreground whitespace-pre-line leading-relaxed text-sm md:text-base ${!showFullDescription && 'line-clamp-6'}`}>
                        {product.description}
                      </p>
                      {product.description.length > 300 && <Button variant="ghost" onClick={() => setShowFullDescription(!showFullDescription)} className="mt-4 text-primary hover:text-cyan-glow rounded-xl">
                          {showFullDescription ? <>Ver menos <ChevronUp className="h-4 w-4 ml-1" /></> : <>Ver mais <ChevronDown className="h-4 w-4 ml-1" /></>}
                        </Button>}
                    </div> : <p className="text-muted-foreground text-sm">
                      Produto de alta qualidade para estética automotiva profissional. 
                      Entre em contato para mais informações.
                    </p>}
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 p-6 md:p-8 shadow-xl">
                  {/* Rating Summary */}
                  <div className="flex flex-col md:flex-row gap-6 md:gap-10 mb-8 pb-8 border-b border-border/50">
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-5xl md:text-6xl font-display font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">{averageRating}</p>
                        <div className="flex items-center justify-center gap-1 mt-2">
                          {[...Array(5)].map((_, i) => <Star key={i} className={`h-5 w-5 ${i < Math.floor(parseFloat(averageRating)) ? 'text-yellow-400 fill-current' : 'text-muted-foreground/30'}`} />)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{totalReviews} avaliações</p>
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-2.5">
                      {[5, 4, 3, 2, 1].map(star => {
                      const count = reviews.filter(r => r.rating === star).length;
                      const percentage = totalReviews > 0 ? Math.round(count / totalReviews * 100) : 0;
                      return <div key={star} className="flex items-center gap-3">
                            <span className="text-sm w-16 text-muted-foreground">{star} estrelas</span>
                            <div className="flex-1 h-2.5 bg-secondary/50 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-500" style={{
                            width: `${percentage}%`
                          }} />
                            </div>
                            <span className="text-sm text-muted-foreground w-12 text-right">{percentage}%</span>
                          </div>;
                    })}
                    </div>
                  </div>
                  
                  {/* Reviews List */}
                  <div className="space-y-4">
                    {paginatedReviews.map(review => <div key={review.id} className="p-5 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-2xl border border-border/30 hover:border-primary/20 transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-base">{review.author}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground/30'}`} />)}
                              </div>
                              <span className="text-xs text-muted-foreground">{review.date}</span>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                            <Check className="h-3 w-3 mr-1" />
                            Verificada
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-3">{review.comment}</p>
                        <div className="flex items-center gap-4 mt-4">
                          <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors bg-secondary/50 px-3 py-1.5 rounded-full">
                            <ThumbsUp className="h-3.5 w-3.5" />
                            Útil ({review.helpful})
                          </button>
                          <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                            <MessageSquare className="h-3.5 w-3.5" />
                            Responder
                          </button>
                        </div>
                      </div>)}
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-border/50">
                      <Button variant="outline" size="sm" onClick={() => setReviewPage(p => Math.max(1, p - 1))} disabled={reviewPage === 1} className="gap-1 rounded-xl">
                        <ChevronLeft className="h-4 w-4" />
                        Anterior
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({
                      length: totalPages
                    }, (_, i) => i + 1).map(page => <Button key={page} variant={page === reviewPage ? "default" : "outline"} size="sm" onClick={() => setReviewPage(page)} className={`w-10 h-10 p-0 rounded-xl ${page === reviewPage ? 'bg-primary' : ''}`}>
                            {page}
                          </Button>)}
                      </div>
                      
                      <Button variant="outline" size="sm" onClick={() => setReviewPage(p => Math.min(totalPages, p + 1))} disabled={reviewPage === totalPages} className="gap-1 rounded-xl">
                        Próximo
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>}
                </div>
              </TabsContent>
            </Tabs>

            {/* Related Products */}
            <RelatedProducts currentProductId={product.id} category={product.category} brand={product.brand} />
          </div>
        </div>
      </main>

      <FloatingBuyButton onBuy={handleBuyNow} price={displayPrice} />
      <WhatsAppButton />
      <Footer />
    </div>;
};
export default ProductDetailPage;