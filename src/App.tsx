import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { QuizProvider } from "@/contexts/QuizContext";
import FloatingCart from "@/components/FloatingCart";
import ScrollToTop from "@/components/ScrollToTop";
import { Loader2 } from "lucide-react";

// Critical route - load immediately
import Index from "./pages/Index";

// Lazy load non-critical routes
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const AdminOrdersPage = lazy(() => import("./pages/AdminOrdersPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const CalculadoraPage = lazy(() => import("./pages/CalculadoraPage"));
const SobrePage = lazy(() => import("./pages/SobrePage"));
const ContatoPage = lazy(() => import("./pages/ContatoPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const FreteEnvioPage = lazy(() => import("./pages/FreteEnvioPage"));
const PagamentoPage = lazy(() => import("./pages/PagamentoPage"));
const TrocasPage = lazy(() => import("./pages/TrocasPage"));
const PrivacidadePage = lazy(() => import("./pages/PrivacidadePage"));
const TermosPage = lazy(() => import("./pages/TermosPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const ConfirmacaoPage = lazy(() => import("./pages/ConfirmacaoPage"));
const RastreioPage = lazy(() => import("./pages/RastreioPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes default
      gcTime: 1000 * 60 * 15, // 15 minutes cache
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// App component with all providers
const App = () => (
  <QueryClientProvider client={queryClient}>
    <QuizProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <FloatingCart />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/admin/pedidos" element={<AdminOrdersPage />} />
                <Route path="/categoria/:category" element={<CategoryPage />} />
                <Route path="/produto/:id" element={<ProductDetailPage />} />
                <Route path="/calculadora" element={<CalculadoraPage />} />
                <Route path="/sobre" element={<SobrePage />} />
                <Route path="/contato" element={<ContatoPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/frete-envio" element={<FreteEnvioPage />} />
                <Route path="/pagamento" element={<PagamentoPage />} />
                <Route path="/trocas-devolucoes" element={<TrocasPage />} />
                <Route path="/privacidade" element={<PrivacidadePage />} />
                <Route path="/termos" element={<TermosPage />} />
                <Route path="/busca" element={<SearchPage />} />
                <Route path="/confirmacao" element={<ConfirmacaoPage />} />
                <Route path="/rastreio" element={<RastreioPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </QuizProvider>
  </QueryClientProvider>
);

export default App;
