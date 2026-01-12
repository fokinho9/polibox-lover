import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, Package, Clock, AlertCircle, Check } from "lucide-react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TrocasPage = () => {
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
              <RefreshCw className="h-10 w-10 text-primary" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Trocas e Devoluções</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Sua satisfação é nossa prioridade
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-primary" />
                  Prazo para Solicitação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Você tem até <span className="text-primary font-bold">7 dias corridos</span> após o recebimento do produto para solicitar troca ou devolução, conforme o Código de Defesa do Consumidor.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Package className="h-6 w-6 text-primary" />
                  Condições para Troca/Devolução
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span>Produto na embalagem original, sem sinais de uso</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span>Nota fiscal original do produto</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span>Todos os acessórios e manuais inclusos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span>Produto sem violação de lacres ou selos</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <RefreshCw className="h-6 w-6 text-primary" />
                  Como Solicitar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center flex-shrink-0">1</span>
                    <span>Entre em contato pelo WhatsApp ou e-mail informando o número do pedido</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center flex-shrink-0">2</span>
                    <span>Aguarde a análise da sua solicitação (até 2 dias úteis)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center flex-shrink-0">3</span>
                    <span>Envie o produto conforme instruções recebidas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center flex-shrink-0">4</span>
                    <span>Receba o reembolso ou produto novo em até 10 dias úteis</span>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card className="bg-yellow-500/5 border-yellow-500/30">
              <CardContent className="p-6 flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-yellow-400 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Importante</h3>
                  <p className="text-sm text-muted-foreground">
                    Produtos com defeito de fabricação podem ser trocados em até 90 dias. 
                    Para produtos químicos, verifique sempre a data de validade antes do uso.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default TrocasPage;
