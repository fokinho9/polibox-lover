import { Link } from "react-router-dom";
import { ArrowLeft, CreditCard, Wallet, QrCode, Banknote, Check, Shield } from "lucide-react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PagamentoPage = () => {
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
              <CreditCard className="h-10 w-10 text-primary" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Formas de Pagamento</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Oferecemos diversas opções para sua comodidade
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-primary">
                  <QrCode className="h-6 w-6" />
                  PIX - 5% Desconto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Pagamento instantâneo com <span className="text-primary font-bold">5% de desconto</span> em todas as compras!
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    Aprovação imediata
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    Envio mais rápido
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-primary" />
                  Cartão de Crédito
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Parcele em até <span className="font-bold">12x sem juros</span>
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    Visa, Mastercard, Elo, Amex
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    Parcelas a partir de R$ 20,00
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Banknote className="h-6 w-6 text-primary" />
                  Boleto Bancário
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Vencimento em 3 dias úteis com <span className="font-bold">5% de desconto</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Wallet className="h-6 w-6 text-primary" />
                  Carteiras Digitais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Pague com Google Pay, Apple Pay, Samsung Pay e outras carteiras digitais.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-green-500/5 border-green-500/30">
            <CardContent className="p-6 flex items-center gap-4">
              <Shield className="h-12 w-12 text-green-400" />
              <div>
                <h3 className="font-semibold text-lg">Compra 100% Segura</h3>
                <p className="text-sm text-muted-foreground">
                  Todos os dados são criptografados e processados com total segurança.
                </p>
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

export default PagamentoPage;
