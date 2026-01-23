import { Phone, Mail, MapPin, Clock, CreditCard, Shield, Truck, Instagram, Facebook, Youtube, Sparkles, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import logoPolicar from "@/assets/logo-policar.png";
import lojaPolicar from "@/assets/loja-policar.png";

// Google Maps link for Policar store
const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/RioDeJaneiro";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      {/* Store Location Section - Above footer */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-10 border-b border-primary/20">
        {/* Background glow effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/4 w-64 h-32 bg-primary/10 blur-3xl rounded-full -translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-64 h-32 bg-cyan-500/10 blur-3xl rounded-full -translate-y-1/2" />
        
        <div className="container-main relative">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            {/* Circular Store Photo - Clickable to open Google Maps */}
            <a 
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex-shrink-0 group cursor-pointer"
            >
              <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-primary/40 shadow-2xl shadow-primary/30 ring-4 ring-primary/20 group-hover:ring-primary/40 group-hover:border-primary/60 transition-all duration-300 group-hover:scale-105">
                <img 
                  src={lojaPolicar} 
                  alt="Loja Policar" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex flex-col items-center gap-1">
                  <ExternalLink className="h-5 w-5 text-white" />
                  <span className="text-white text-xs font-medium">Ver no Maps</span>
                </div>
              </div>
            </a>
            
            {/* Location Info */}
            <div className="text-center md:text-left flex-1">
              <h3 className="font-display text-2xl md:text-3xl text-white mb-3">NOSSA LOJA FÍSICA</h3>
              <p className="text-white/70 mb-5 text-sm md:text-base max-w-lg">
                Visite nossa loja e confira de perto os melhores produtos para estética automotiva!
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 text-sm">
                <a 
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/80 hover:text-primary transition-colors"
                >
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Rio de Janeiro, RJ</span>
                  <ExternalLink className="h-3 w-3 opacity-50" />
                </a>
                <div className="flex items-center gap-2 text-white/80">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Seg-Sex: 9h às 18h | Sáb: 9h às 13h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits bar */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 py-6 border-b border-border/50">
        <div className="container-main relative grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {/* Frete Grátis */}
          <div className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-red-logo/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-logo/10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-logo to-red-logo-dark flex items-center justify-center shadow-lg shadow-red-logo/30 group-hover:scale-110 transition-transform">
                <Truck className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-white text-sm">Frete Grátis</span>
                <p className="text-xs text-red-logo font-medium">Para todo Brasil</p>
              </div>
            </div>
          </div>
          
          {/* 5% OFF Pix */}
          <div className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-white text-sm">5% OFF no Pix</span>
                <p className="text-xs text-primary font-medium">Desconto à vista</p>
              </div>
            </div>
          </div>
          
          {/* Compra Segura */}
          <div className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-white text-sm">Compra Segura</span>
                <p className="text-xs text-violet-400 font-medium">Dados protegidos</p>
              </div>
            </div>
          </div>
          
          {/* Parcelamento */}
          <div className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-white text-sm">Parcelamento</span>
                <p className="text-xs text-amber-400 font-medium">Até 12x sem juros</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-main py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Logo and about */}
          <div className="col-span-2 lg:col-span-1">
            <img src={logoPolicar} alt="Policar" className="h-10 md:h-12 w-auto mb-4" />
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Sua loja especializada em produtos para estética automotiva. 
              Qualidade e preço justo para profissionais e entusiastas.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg text-foreground mb-6">CONTATO</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <a href="tel:+5521996327544" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <Phone className="h-4 w-4 text-primary" />
                  (21) 99632-7544
                </a>
              </li>
              <li>
              <a href="mailto:contato@policar.com.br" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="h-4 w-4 text-primary" />
                  contato@policar.com.br
                </a>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                Rio de Janeiro, RJ
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" />
                Seg-Sex: 9h às 18h
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display text-lg text-foreground mb-6">CATEGORIAS</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/categoria/lavagem" className="text-muted-foreground hover:text-primary transition-colors">Lavagem</Link></li>
              <li><Link to="/categoria/polimento" className="text-muted-foreground hover:text-primary transition-colors">Polimento</Link></li>
              <li><Link to="/categoria/interior" className="text-muted-foreground hover:text-primary transition-colors">Interior</Link></li>
              <li><Link to="/categoria/equipamentos" className="text-muted-foreground hover:text-primary transition-colors">Equipamentos</Link></li>
              <li><Link to="/categoria/kits" className="text-muted-foreground hover:text-primary transition-colors">Kits</Link></li>
              <li><Link to="/categoria/ofertas" className="text-muted-foreground hover:text-primary transition-colors">Ofertas</Link></li>
            </ul>
          </div>

          {/* Institucional */}
          <div>
            <h3 className="font-display text-lg text-foreground mb-6">INSTITUCIONAL</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/sobre" className="text-muted-foreground hover:text-primary transition-colors">Sobre Nós</Link></li>
              <li><Link to="/contato" className="text-muted-foreground hover:text-primary transition-colors">Contato</Link></li>
              <li><Link to="/calculadora" className="text-muted-foreground hover:text-primary transition-colors">Calculadora de Diluição</Link></li>
              <li><Link to="/frete-envio" className="text-muted-foreground hover:text-primary transition-colors">Frete e Envio</Link></li>
              <li><Link to="/pagamento" className="text-muted-foreground hover:text-primary transition-colors">Formas de Pagamento</Link></li>
              <li><Link to="/trocas-devolucoes" className="text-muted-foreground hover:text-primary transition-colors">Trocas e Devoluções</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-display text-lg text-foreground mb-6">AJUDA</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/privacidade" className="text-muted-foreground hover:text-primary transition-colors">Política de Privacidade</Link></li>
              <li><Link to="/termos" className="text-muted-foreground hover:text-primary transition-colors">Termos de Uso</Link></li>
              <li><a href="https://api.whatsapp.com/send?phone=5521996327544" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">Atendimento WhatsApp</a></li>
            </ul>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="border-t border-border py-6">
        <div className="container-main flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>© 2025 Policar - Todos os direitos reservados</span>
          <div className="flex items-center gap-6">
            <Link to="/privacidade" className="hover:text-primary transition-colors">Privacidade</Link>
            <Link to="/termos" className="hover:text-primary transition-colors">Termos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
