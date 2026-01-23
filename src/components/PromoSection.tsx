import { Zap, Truck, CreditCard, ShieldCheck, Timer, Sparkles, Flame } from "lucide-react";
const PromoSection = () => {
  return <section className="py-10 md:py-16 bg-gradient-to-b from-background via-card/30 to-background relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse" style={{
        animationDelay: '1s'
      }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </div>
      
      <div className="container-main relative z-10">
        {/* Main Promo Banner */}
        <div className="text-center mb-10 md:mb-14">
          
          {/* Text Logo - Bolder */}
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-foreground mb-4 tracking-tight">
            MEGA <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-logo via-red-logo-glow to-red-logo drop-shadow-[0_0_30px_rgba(220,38,38,0.5)]">PROMOÇÃO</span>
          </h2>
          
          {/* Benefits Pills */}
          
        </div>

        {/* Benefits Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {[{
          icon: Truck,
          title: "Frete Grátis",
          subtitle: "Em todas as compras",
          color: "emerald",
          gradient: "from-emerald-500/20 to-emerald-600/10"
        }, {
          icon: Zap,
          title: "5% OFF no PIX",
          subtitle: "Desconto exclusivo",
          color: "primary",
          gradient: "from-primary/20 to-cyan-500/10"
        }, {
          icon: CreditCard,
          title: "12x sem Juros",
          subtitle: "Em todos os cartões",
          color: "primary",
          gradient: "from-primary/20 to-cyan-500/10"
        }, {
          icon: ShieldCheck,
          title: "Compra Segura",
          subtitle: "100% protegido",
          color: "primary",
          gradient: "from-primary/20 to-cyan-500/10"
        }].map((benefit, index) => <div key={index} className={`group relative flex flex-col items-center p-5 md:p-6 bg-gradient-to-br ${benefit.gradient} backdrop-blur-sm rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-primary/10`}>
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-500" />
              
              <div className={`relative w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${benefit.color === 'emerald' ? 'from-emerald-500/30 to-emerald-600/10' : 'from-primary/30 to-cyan-500/10'} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                <benefit.icon className={`h-7 w-7 md:h-8 md:w-8 ${benefit.color === 'emerald' ? 'text-emerald-400' : 'text-primary'} drop-shadow-lg`} />
              </div>
              <span className="relative font-bold text-foreground text-center text-sm md:text-base">{benefit.title}</span>
              <span className="relative text-xs md:text-sm text-muted-foreground text-center mt-1">{benefit.subtitle}</span>
            </div>)}
        </div>
      </div>
    </section>;
};
export default PromoSection;