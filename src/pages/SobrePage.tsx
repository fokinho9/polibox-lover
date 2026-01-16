import { Link } from "react-router-dom";
import { Award, Users, Truck, Shield, Target, Heart } from "lucide-react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const SobrePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
          <div className="container-main relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Sobre a <span className="text-primary">POLICAR</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Somos especialistas em estética automotiva, oferecendo os melhores produtos 
                para profissionais e entusiastas que buscam excelência no cuidado com seus veículos.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-card/50">
          <div className="container-main">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-card to-background border border-border hover:border-primary/50 transition-all duration-300">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold mb-4">Nossa Missão</h3>
                <p className="text-muted-foreground">
                  Democratizar o acesso a produtos de alta qualidade para estética automotiva, 
                  com preços justos e atendimento excepcional.
                </p>
              </div>

              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-card to-background border border-border hover:border-primary/50 transition-all duration-300">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold mb-4">Nossos Valores</h3>
                <p className="text-muted-foreground">
                  Qualidade, transparência e compromisso com o cliente são os pilares 
                  que sustentam nossa empresa desde o início.
                </p>
              </div>

              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-card to-background border border-border hover:border-primary/50 transition-all duration-300">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold mb-4">Nossa Visão</h3>
                <p className="text-muted-foreground">
                  Ser a referência nacional em produtos para estética automotiva, 
                  reconhecida pela qualidade e inovação constante.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="container-main">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-display font-bold text-primary mb-2">5K+</div>
                <p className="text-muted-foreground">Clientes Satisfeitos</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-display font-bold text-primary mb-2">500+</div>
                <p className="text-muted-foreground">Produtos</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-display font-bold text-primary mb-2">50+</div>
                <p className="text-muted-foreground">Marcas Parceiras</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-display font-bold text-primary mb-2">10+</div>
                <p className="text-muted-foreground">Anos de Experiência</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-card/50">
          <div className="container-main">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
              Por que escolher a <span className="text-primary">POLICAR</span>?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-display font-bold mb-2">Entrega Rápida</h4>
                <p className="text-sm text-muted-foreground">Enviamos para todo o Brasil com agilidade</p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-display font-bold mb-2">Compra Segura</h4>
                <p className="text-sm text-muted-foreground">Seus dados protegidos em todas as transações</p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-display font-bold mb-2">Produtos Originais</h4>
                <p className="text-sm text-muted-foreground">100% autênticos e de procedência garantida</p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-display font-bold mb-2">Suporte Especializado</h4>
                <p className="text-sm text-muted-foreground">Equipe pronta para ajudar você</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default SobrePage;
