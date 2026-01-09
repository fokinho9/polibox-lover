import { Phone, Mail, MapPin, Clock, CreditCard, Shield, Truck } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      {/* Benefits bar */}
      <div className="bg-primary py-4">
        <div className="container-main grid grid-cols-1 md:grid-cols-3 gap-4 text-primary-foreground">
          <div className="flex items-center justify-center gap-3">
            <Truck className="h-6 w-6" />
            <span className="font-medium">Frete Grátis</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Shield className="h-6 w-6" />
            <span className="font-medium">Compra Segura</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <CreditCard className="h-6 w-6" />
            <span className="font-medium">Parcelamento em até 12x</span>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-main py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and about */}
          <div>
            <h2 className="font-display text-2xl font-bold text-primary mb-4">POLIBOX</h2>
            <p className="text-muted-foreground text-sm">
              Sua loja especializada em produtos para estética automotiva. 
              Qualidade e preço justo para profissionais e entusiastas.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg text-foreground mb-4">CONTATO</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                (11) 4000-0000
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                contato@polibox.com.br
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                São Paulo, SP
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Seg-Sex: 9h às 18h
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display text-lg text-foreground mb-4">CATEGORIAS</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Lavagem</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Polimento</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Interior</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Equipamentos</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Kits</a></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="font-display text-lg text-foreground mb-4">INSTITUCIONAL</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Trocas e Devoluções</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Formas de Pagamento</a></li>
              <li><a href="/admin" className="text-primary hover:text-cyan-glow transition-colors font-medium">⚙️ Painel Admin</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border py-4">
        <div className="container-main text-center text-sm text-muted-foreground">
          © 2025 Polibox - Todos os direitos reservados
        </div>
      </div>
    </footer>
  );
};

export default Footer;
