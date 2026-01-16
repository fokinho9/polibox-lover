import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { QuizProvider } from "@/contexts/QuizContext";
import FloatingCart from "@/components/FloatingCart";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import AdminPanel from "./pages/AdminPanel";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import CategoryPage from "./pages/CategoryPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CalculadoraPage from "./pages/CalculadoraPage";
import SobrePage from "./pages/SobrePage";
import ContatoPage from "./pages/ContatoPage";

import CheckoutPage from "./pages/CheckoutPage";
import FreteEnvioPage from "./pages/FreteEnvioPage";
import PagamentoPage from "./pages/PagamentoPage";
import TrocasPage from "./pages/TrocasPage";
import PrivacidadePage from "./pages/PrivacidadePage";
import TermosPage from "./pages/TermosPage";
import NotFound from "./pages/NotFound";
import SearchPage from "./pages/SearchPage";
import ConfirmacaoPage from "./pages/ConfirmacaoPage";

const queryClient = new QueryClient();

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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QuizProvider>
</QueryClientProvider>
);

export default App;
