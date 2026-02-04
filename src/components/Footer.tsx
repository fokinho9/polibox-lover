import { useState } from "react";
import { Phone, Mail, MapPin, Clock, CreditCard, Shield, Truck, Instagram, Facebook, Youtube, Sparkles, Store, X } from "lucide-react";
import { Link } from "react-router-dom";
import logoPolicar from "@/assets/logo-policar.png";
import lojaPolicar from "@/assets/loja-policar.png";
import { Dialog, DialogContent } from "@/components/ui/dialog";
const Footer = () => {
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  return <footer className="bg-card border-t border-border">
      {/* Photo Lightbox Modal */}
      <Dialog open={isPhotoOpen} onOpenChange={setIsPhotoOpen}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-0 shadow-none">
          <div className="relative">
            <button onClick={() => setIsPhotoOpen(false)} className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <X className="h-5 w-5" />
            </button>
            <img src={lojaPolicar} alt="Loja Policar" className="w-full h-auto rounded-2xl shadow-2xl" />
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-xl p-4">
              <h3 className="font-display text-xl text-white mb-1">POLICAR - Estética Automotiva</h3>
              <p className="text-white/70 text-sm">R. Cap. João José de Macedo, 279 - Centro, Jacareí - SP</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Store Location Section - Above footer */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-10 border-b border-primary/20">
        {/* Background glow effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/4 w-64 h-32 bg-primary/10 blur-3xl rounded-full -translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-64 h-32 bg-cyan-500/10 blur-3xl rounded-full -translate-y-1/2" />
        
        <div className="container-main relative">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            {/* Store Photo with Google Maps style design */}
            <div className="relative flex-shrink-0 group cursor-pointer" onClick={() => setIsPhotoOpen(true)}>
              {/* Map-style container */}
              <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
                {/* Background map pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-800/30 via-emerald-700/20 to-teal-800/30" />
                <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 30h60M30 0v60' stroke='%23ffffff' stroke-width='0.5' fill='none' opacity='0.3'/%3E%3C/svg%3E")`,
                backgroundSize: '30px 30px'
              }} />
                
                {/* Store photo in center */}
                <div className="absolute inset-4 rounded-xl overflow-hidden border-2 border-white/30 shadow-lg">
                  <img src={lojaPolicar} alt="Loja Policar" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                
                {/* Map pin marker */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shadow-lg animate-bounce">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-red-500 -mt-1" />
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">Ver foto</span>
                </div>
              </div>
              
              {/* Location badge */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-cyan-500 px-3 py-1 rounded-full shadow-lg">
                <span className="text-white text-xs font-bold whitespace-nowrap">📍 Jacareí - SP</span>
              </div>
            </div>
            
            {/* Location Info */}
            <div className="text-center md:text-left flex-1">
              {/* Reinauguration Banner */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 rounded-full mb-4 shadow-lg shadow-orange-500/40 animate-pulse">
                <Sparkles className="h-4 w-4 text-white" />
                <span className="text-white text-sm font-bold uppercase tracking-wider">REINAUGURAÇÃO</span>
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              
              <h3 className="font-display text-2xl md:text-3xl text-white mb-2">NOSSA LOJA FÍSICA</h3>
              
              <p className="text-white/80 mb-4 text-sm md:text-base max-w-lg">
                <span className="text-orange-400 font-semibold">Estamos de volta e melhor do que nunca!</span> Venha conhecer nossa loja totalmente renovada com os melhores produtos para estética automotiva!
              </p>
              
              <div className="flex flex-col gap-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-white/80 justify-center md:justify-start">
                  <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>R. Cap. João José de Macedo, 279 - Centro, Jacareí - SP, 12327-030</span>
                </div>
                <div className="flex items-center gap-2 text-white/80 justify-center md:justify-start">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Seg-Sex: 9h às 18h | Sáb: 9h às 13h</span>
                </div>
              </div>
              
              <a href="https://maps.app.goo.gl/S85kWhpiBBAfFpcZ9" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-cyan-500 text-white text-sm font-bold rounded-full hover:scale-105 transition-transform shadow-lg shadow-primary/40">
                <MapPin className="h-4 w-4" />
                Ver no Google Maps
              </a>
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
                <a href="tel:+5511972238165" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
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
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>R. Cap. João José de Macedo, 279 - Centro, Jacareí - SP</span>
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
              <li><a href="https://api.whatsapp.com/send?phone=5511972238165" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">Atendimento WhatsApp</a></li>
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
    </footer>;
};
export default Footer;