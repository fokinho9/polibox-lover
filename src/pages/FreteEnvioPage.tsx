import { Link } from "react-router-dom";
import { ArrowLeft, Truck, MapPin, Clock, Package, Check } from "lucide-react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FreteEnvioPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />

      <main className="py-8">
        <div className="container-main max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </Link>
          </div>

          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Truck className="h-10 w-10 text-primary" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Frete e Envio</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Conheça nossas opções de entrega e prazos
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-primary">
                  <Package className="h-6 w-6" />
                  Frete Grátis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Compras acima de <span className="text-primary font-bold">R$ 299,00</span> têm frete grátis para todo o Brasil!
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    Válido para todo território nacional
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    Envio em até 24h após confirmação
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-primary" />
                  Prazos de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
                    <span>Rio de Janeiro (Capital)</span>
                    <span className="font-bold text-primary">1-2 dias úteis</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
                    <span>São Paulo e Região</span>
                    <span className="font-bold text-primary">2-4 dias úteis</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
                    <span>Demais Regiões</span>
                    <span className="font-bold text-primary">5-10 dias úteis</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-primary" />
                Retire na Loja
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Você pode retirar seu pedido em uma de nossas lojas físicas sem custo adicional!
              </p>
              <div className="p-4 bg-secondary/30 rounded-lg">
                <p className="font-semibold">Loja Polibox - Rio de Janeiro</p>
                <p className="text-sm text-muted-foreground">Rua Exemplo, 123 - Centro, RJ</p>
                <p className="text-sm text-muted-foreground">Seg-Sex: 9h às 18h | Sáb: 9h às 13h</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default FreteEnvioPage;
