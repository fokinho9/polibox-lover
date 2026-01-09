const PromoSection = () => {
  return (
    <section className="py-10 bg-background">
      <div className="container-main text-center">
        <h2 className="font-display text-4xl md:text-5xl">
          <span className="text-foreground">LIMPA </span>
          <span className="text-primary text-shadow-glow">ESTOQUE!</span>
        </h2>
        <p className="text-lg mt-3 text-muted-foreground">
          ATÉ <span className="text-primary font-bold">60%OFF</span> + <span className="text-primary font-bold">5%OFF</span> VIA PIX + FRETE GRÁTIS*
        </p>
      </div>
    </section>
  );
};

export default PromoSection;
