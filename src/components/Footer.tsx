import { Phone, Mail, MapPin, Clock, CreditCard, Shield, Truck, Instagram, Facebook, Youtube, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      {/* Benefits bar */}
      <div className="bg-gradient-to-r from-primary via-cyan-glow to-primary py-5">
        <div className="container-main grid grid-cols-1 md:grid-cols-4 gap-4 text-primary-foreground">
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold">Frete Grátis</span>
              <p className="text-xs opacity-80">Acima de R$ 299</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold">5% OFF no Pix</span>
              <p className="text-xs opacity-80">Desconto à vista</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold">Compra Segura</span>
              <p className="text-xs opacity-80">Dados protegidos</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold">Parcelamento</span>
              <p className="text-xs opacity-80">Até 12x sem juros</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-main py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Logo and about */}
          <div className="col-span-2 lg:col-span-1">
            <h2 className="font-display text-3xl font-bold text-primary mb-4">POLIBOX</h2>
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
                <a href="mailto:contato@polibox.com.br" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="h-4 w-4 text-primary" />
                  contato@polibox.com.br
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
              <li><Link to="/admin" className="text-primary hover:text-cyan-glow transition-colors font-medium">⚙️ Painel Admin</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border py-6">
        <div className="container-main flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>© 2025 Polibox - Todos os direitos reservados</span>
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
