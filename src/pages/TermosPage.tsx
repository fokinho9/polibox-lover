import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Scale, AlertTriangle } from "lucide-react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermosPage = () => {
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
              <FileText className="h-10 w-10 text-primary" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Termos de Uso</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Última atualização: Janeiro de 2025
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Scale className="h-6 w-6 text-primary" />
                  Aceitação dos Termos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Ao acessar e utilizar o site Polibox, você concorda com estes termos de uso e com nossa 
                  política de privacidade. Caso não concorde com algum termo, recomendamos que não utilize 
                  nossos serviços.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Uso do Site</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>Ao utilizar nosso site, você se compromete a:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Fornecer informações verdadeiras e atualizadas</li>
                  <li>Não utilizar o site para fins ilegais ou não autorizados</li>
                  <li>Não tentar acessar áreas restritas do sistema</li>
                  <li>Não reproduzir conteúdo sem autorização prévia</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Produtos e Preços</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Os preços podem ser alterados sem aviso prévio</li>
                  <li>Fotos são meramente ilustrativas</li>
                  <li>Disponibilidade sujeita ao estoque</li>
                  <li>Promoções têm prazo de validade definido</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Propriedade Intelectual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Todo o conteúdo do site, incluindo textos, imagens, logotipos e layout, é de propriedade 
                  exclusiva da Polibox ou de seus parceiros, sendo protegido pelas leis de propriedade 
                  intelectual.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-yellow-500/5 border-yellow-500/30">
              <CardContent className="p-6 flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-yellow-400 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Limitação de Responsabilidade</h3>
                  <p className="text-sm text-muted-foreground">
                    A Polibox não se responsabiliza por danos decorrentes do uso inadequado dos produtos. 
                    Sempre siga as instruções do fabricante e utilize equipamentos de proteção quando necessário.
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

export default TermosPage;
