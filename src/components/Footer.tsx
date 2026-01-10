import { Phone, Mail, MapPin, Clock, CreditCard, Shield, Truck, Instagram, Facebook, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      {/* Benefits bar */}
      <div className="bg-gradient-to-r from-primary via-cyan-glow to-primary py-5">
        <div className="container-main grid grid-cols-1 md:grid-cols-3 gap-4 text-primary-foreground">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo and about */}
          <div>
            <h2 className="font-display text-3xl font-bold text-primary mb-4">POLIBOX</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Sua loja especializada em produtos para estética automotiva. 
              Qualidade e preço justo para profissionais e entusiastas.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg text-foreground mb-6">CONTATO</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <a href="tel:+5511400000000" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                  <Phone className="h-4 w-4 text-primary" />
                  (11) 4000-0000
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
                São Paulo, SP
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
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="font-display text-lg text-foreground mb-6">INSTITUCIONAL</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/sobre" className="text-muted-foreground hover:text-primary transition-colors">Sobre Nós</Link></li>
              <li><Link to="/contato" className="text-muted-foreground hover:text-primary transition-colors">Contato</Link></li>
              <li><Link to="/calculadora" className="text-muted-foreground hover:text-primary transition-colors">Calculadora de Diluição</Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Trocas e Devoluções</a></li>
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
            <a href="#" className="hover:text-primary transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-primary transition-colors">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
