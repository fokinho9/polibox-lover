import { Zap, Truck, CreditCard, ShieldCheck, Gift, Timer } from "lucide-react";

const PromoSection = () => {
  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-background via-card/30 to-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-orange-500/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container-main relative z-10">
        {/* Main Promo Banner */}
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full mb-4">
            <Timer className="h-4 w-4 text-orange-500 animate-pulse" />
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-wide">Oferta por tempo limitado</span>
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-3">
            MEGA <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-primary">PROMOÇÃO</span>
          </h2>
          
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-sm md:text-lg">
            <span className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Até</span>
              <span className="font-bold text-orange-500">60% OFF</span>
            </span>
            <span className="text-border">•</span>
            <span className="flex items-center gap-1.5">
              <span className="font-bold text-primary">+5% OFF</span>
              <span className="text-muted-foreground">no PIX</span>
            </span>
            <span className="text-border">•</span>
            <span className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Frete</span>
              <span className="font-bold text-emerald-500">GRÁTIS*</span>
            </span>
          </div>
        </div>

        {/* Benefits Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { icon: Truck, title: "Frete Grátis", subtitle: "Acima de R$299", color: "emerald" },
            { icon: Zap, title: "5% OFF no PIX", subtitle: "Desconto exclusivo", color: "primary" },
            { icon: CreditCard, title: "12x sem Juros", subtitle: "Em todos os cartões", color: "primary" },
            { icon: ShieldCheck, title: "Compra Segura", subtitle: "100% protegido", color: "primary" },
          ].map((benefit, index) => (
            <div 
              key={index}
              className="group flex flex-col items-center p-4 md:p-5 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:bg-card/80"
            >
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-${benefit.color === 'emerald' ? 'emerald-500' : 'primary'}/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                <benefit.icon className={`h-6 w-6 md:h-7 md:w-7 ${benefit.color === 'emerald' ? 'text-emerald-500' : 'text-primary'}`} />
              </div>
              <span className="font-bold text-foreground text-center text-xs md:text-sm">{benefit.title}</span>
              <span className="text-[10px] md:text-xs text-muted-foreground text-center mt-0.5">{benefit.subtitle}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoSection;