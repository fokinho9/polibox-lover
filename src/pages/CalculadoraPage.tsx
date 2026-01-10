import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calculator } from "lucide-react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CalculadoraPage = () => {
  const [diluicao, setDiluicao] = useState("");
  const [quantidadeFinal, setQuantidadeFinal] = useState("");
  const [resultado, setResultado] = useState<{ produto: number; agua: number } | null>(null);

  const calcular = () => {
    const ratio = parseInt(diluicao);
    const total = parseFloat(quantidadeFinal);

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />

      <main className="py-8">
        <div className="container-main max-w-2xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <div className="h-6 w-px bg-border" />
            <nav className="text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">Calculadora de Diluição</span>
            </nav>
          </div>

          <Card className="border-primary/20">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Calculator className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="font-display text-2xl">Calculadora de Diluição</CardTitle>
              <CardDescription>
                Calcule a quantidade exata de produto e água para sua diluição
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="diluicao">Proporção de Diluição (1:X)</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-muted-foreground">1:</span>
                    <Input
                      id="diluicao"
                      type="number"
                      placeholder="Ex: 10"
                      value={diluicao}
                      onChange={(e) => setDiluicao(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Digite o valor X (ex: para 1:10, digite 10)
                  </p>
                </div>

                <div>
                  <Label htmlFor="quantidade">Quantidade Final Desejada (ml)</Label>
                  <Input
                    id="quantidade"
                    type="number"
                    placeholder="Ex: 1000"
                    value={quantidadeFinal}
                    onChange={(e) => setQuantidadeFinal(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <Button onClick={calcular} className="w-full mt-4">
                  Calcular
                </Button>
              </div>

              {resultado && (
                <div className="mt-6 p-6 bg-secondary/30 rounded-lg space-y-4">
                  <h3 className="font-semibold text-lg text-center mb-4">Resultado:</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Produto</p>
                      <p className="text-2xl font-bold text-primary">
                        {resultado.produto} ml
                      </p>
                    </div>
                    <div className="text-center p-4 bg-secondary rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Água</p>
                      <p className="text-2xl font-bold text-foreground">
                        {resultado.agua} ml
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default CalculadoraPage;
