import { Zap, Truck, CreditCard, ShieldCheck } from "lucide-react";

const PromoSection = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-background to-secondary/20 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-primary/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container-main relative z-10">
        {/* Main promo text */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-destructive/20 rounded-full mb-4">
            <Zap className="h-5 w-5 text-destructive animate-pulse" />
            <span className="text-destructive font-bold uppercase tracking-wide">Promoção por tempo limitado</span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl">
            <span className="text-foreground">LIMPA </span>
            <span className="text-primary text-shadow-glow animate-pulse">ESTOQUE!</span>
          </h2>
          <p className="text-xl md:text-2xl mt-4 text-muted-foreground">
            ATÉ <span className="text-destructive font-bold">60%OFF</span> + <span className="text-primary font-bold">5%OFF</span> VIA PIX + <span className="text-green-500 font-bold">FRETE GRÁTIS*</span>
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center p-5 bg-card/50 backdrop-blur-sm rounded-2xl border border-border hover:border-primary/30 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Truck className="h-7 w-7 text-primary" />
            </div>
            <span className="font-bold text-foreground text-center text-sm">Frete Grátis*</span>
            <span className="text-xs text-muted-foreground text-center mt-1">em compras acima de R$299</span>
          </div>
          
          <div className="flex flex-col items-center p-5 bg-card/50 backdrop-blur-sm rounded-2xl border border-border hover:border-primary/30 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Zap className="h-7 w-7 text-primary" />
            </div>
            <span className="font-bold text-foreground text-center text-sm">5% OFF no Pix</span>
            <span className="text-xs text-muted-foreground text-center mt-1">desconto exclusivo</span>
          </div>
          
          <div className="flex flex-col items-center p-5 bg-card/50 backdrop-blur-sm rounded-2xl border border-border hover:border-primary/30 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <CreditCard className="h-7 w-7 text-primary" />
            </div>
            <span className="font-bold text-foreground text-center text-sm">12x sem Juros</span>
            <span className="text-xs text-muted-foreground text-center mt-1">em todos os cartões</span>
          </div>
          
          <div className="flex flex-col items-center p-5 bg-card/50 backdrop-blur-sm rounded-2xl border border-border hover:border-primary/30 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-7 w-7 text-primary" />
            </div>
            <span className="font-bold text-foreground text-center text-sm">Compra Segura</span>
            <span className="text-xs text-muted-foreground text-center mt-1">site 100% protegido</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;