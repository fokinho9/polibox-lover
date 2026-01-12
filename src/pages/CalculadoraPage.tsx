import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calculator, Droplets, Beaker, Info, RotateCcw, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

const presetDilutions = [
  { name: "Leve", ratio: 100, description: "Limpeza de manutenção", color: "bg-green-500" },
  { name: "Média", ratio: 50, description: "Sujeira moderada", color: "bg-yellow-500" },
  { name: "Forte", ratio: 20, description: "Sujeira pesada", color: "bg-orange-500" },
  { name: "Concentrada", ratio: 10, description: "Sujeira extrema", color: "bg-red-500" },
];

const commonProducts = [
  { name: "V-FLOC", ratios: "1:100 a 1:400", recommended: "1:200" },
  { name: "MELON", ratios: "1:100 a 1:400", recommended: "1:200" },
  { name: "MAGIL CLEAN", ratios: "1:50 a 1:100", recommended: "1:80" },
  { name: "CITRUS", ratios: "1:10 a 1:50", recommended: "1:20" },
  { name: "APC MULTIUSO", ratios: "1:5 a 1:20", recommended: "1:10" },
  { name: "LIMPADOR DE RODAS", ratios: "1:3 a 1:10", recommended: "1:5" },
];

const CalculadoraPage = () => {
  const [diluicao, setDiluicao] = useState("100");
  const [quantidadeFinal, setQuantidadeFinal] = useState("1000");
  const [resultado, setResultado] = useState<{ produto: number; agua: number } | null>(null);
  const [unidade, setUnidade] = useState<"ml" | "L">("ml");

  const calcular = () => {
    const ratio = parseInt(diluicao);
    let total = parseFloat(quantidadeFinal);
    
    // Convert to ml if in liters
    if (unidade === "L") {
      total = total * 1000;
    }

    if (isNaN(ratio) || isNaN(total) || ratio <= 0 || total <= 0) {
      return;
    }

    const produto = total / (ratio + 1);
    const agua = total - produto;

    setResultado({
      produto: Math.round(produto * 100) / 100,
      agua: Math.round(agua * 100) / 100,
    });
  };

  const resetar = () => {
    setDiluicao("100");
    setQuantidadeFinal("1000");
    setResultado(null);
    setUnidade("ml");
  };

  const selectPreset = (ratio: number) => {
    setDiluicao(ratio.toString());
    setTimeout(calcular, 0);
  };

  const formatVolume = (ml: number) => {
    if (ml >= 1000) {
      return `${(ml / 1000).toFixed(2)} L`;
    }
    return `${ml} ml`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />

      <main className="py-6 md:py-8">
        <div className="container-main max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 md:gap-4 mb-6 md:mb-8 overflow-x-auto scrollbar-hide">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-1 md:gap-2 px-2 md:px-3">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Voltar</span>
              </Button>
            </Link>
            <div className="h-4 md:h-6 w-px bg-border" />
            <nav className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">
              <Link to="/" className="hover:text-primary">Home</Link>
              <span className="mx-1 md:mx-2">/</span>
              <span className="text-foreground">Calculadora de Diluição</span>
            </nav>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Calculator */}
            <div className="lg:col-span-2">
              <Card className="border-primary/20 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-cyan-glow/10 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                      <Calculator className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="font-display text-xl md:text-2xl">Calculadora de Diluição</CardTitle>
                      <CardDescription className="text-sm">
                        Calcule a quantidade exata para sua diluição
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 md:p-6 space-y-6">
                  {/* Preset Buttons */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Diluições Rápidas</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {presetDilutions.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => selectPreset(preset.ratio)}
                          className={`p-3 rounded-lg border border-border hover:border-primary/50 transition-all text-left ${
                            parseInt(diluicao) === preset.ratio ? 'border-primary bg-primary/10' : 'bg-card'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-2 h-2 rounded-full ${preset.color}`} />
                            <span className="font-semibold text-sm">{preset.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">1:{preset.ratio}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dilution Input with Slider */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="diluicao" className="text-sm font-medium">Proporção de Diluição</Label>
                      <Badge variant="outline" className="font-mono text-primary">
                        1:{diluicao}
                      </Badge>
                    </div>
                    <Slider
                      value={[parseInt(diluicao) || 1]}
                      onValueChange={(value) => setDiluicao(value[0].toString())}
                      min={1}
                      max={400}
                      step={1}
                      className="py-2"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-sm">1:</span>
                      <Input
                        id="diluicao"
                        type="number"
                        placeholder="Ex: 100"
                        value={diluicao}
                        onChange={(e) => setDiluicao(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {/* Quantity Input */}
                  <div className="space-y-3">
                    <Label htmlFor="quantidade" className="text-sm font-medium">Quantidade Final Desejada</Label>
                    <div className="flex gap-2">
                      <Input
                        id="quantidade"
                        type="number"
                        placeholder="Ex: 1000"
                        value={quantidadeFinal}
                        onChange={(e) => setQuantidadeFinal(e.target.value)}
                        className="flex-1"
                      />
                      <div className="flex rounded-lg border border-border overflow-hidden">
                        <button
                          onClick={() => setUnidade("ml")}
                          className={`px-3 py-2 text-sm font-medium transition-colors ${
                            unidade === "ml" ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-secondary'
                          }`}
                        >
                          ml
                        </button>
                        <button
                          onClick={() => setUnidade("L")}
                          className={`px-3 py-2 text-sm font-medium transition-colors ${
                            unidade === "L" ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-secondary'
                          }`}
                        >
                          L
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button onClick={calcular} className="flex-1 h-12 btn-buy gap-2">
                      <Sparkles className="h-5 w-5" />
                      Calcular
                    </Button>
                    <Button onClick={resetar} variant="outline" className="h-12 px-4">
                      <RotateCcw className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Result */}
                  {resultado && (
                    <div className="mt-6 p-4 md:p-6 bg-gradient-to-br from-secondary/50 to-secondary/30 rounded-xl border border-border space-y-4">
                      <h3 className="font-display text-lg text-center flex items-center justify-center gap-2">
                        <Beaker className="h-5 w-5 text-primary" />
                        Resultado da Diluição
                      </h3>
                      <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div className="text-center p-4 md:p-5 bg-primary/10 rounded-xl border border-primary/30">
                          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-primary/20 flex items-center justify-center">
                            <Beaker className="h-5 w-5 text-primary" />
                          </div>
                          <p className="text-xs md:text-sm text-muted-foreground mb-1">Produto</p>
                          <p className="text-xl md:text-2xl font-display font-bold text-primary">
                            {formatVolume(resultado.produto)}
                          </p>
                        </div>
                        <div className="text-center p-4 md:p-5 bg-blue-500/10 rounded-xl border border-blue-500/30">
                          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Droplets className="h-5 w-5 text-blue-400" />
                          </div>
                          <p className="text-xs md:text-sm text-muted-foreground mb-1">Água</p>
                          <p className="text-xl md:text-2xl font-display font-bold text-blue-400">
                            {formatVolume(resultado.agua)}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-center text-muted-foreground mt-3">
                        Total: {formatVolume(resultado.produto + resultado.agua)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Reference Sidebar */}
            <div className="space-y-4">
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    Tabela de Referência
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {commonProducts.map((product) => (
                    <div 
                      key={product.name}
                      className="p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      <p className="font-semibold text-sm text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground">Faixa: {product.ratios}</p>
                      <p className="text-xs text-primary mt-1">Recomendado: {product.recommended}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-yellow-500/30 bg-yellow-500/5">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                      <Info className="h-4 w-4 text-yellow-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-yellow-400 mb-1">Dica</p>
                      <p className="text-xs text-muted-foreground">
                        Sempre consulte o rótulo do produto para a diluição recomendada pelo fabricante.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default CalculadoraPage;
