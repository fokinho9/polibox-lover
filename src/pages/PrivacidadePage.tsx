import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck } from "lucide-react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacidadePage = () => {
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
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Política de Privacidade</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Última atualização: Janeiro de 2025
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Database className="h-6 w-6 text-primary" />
                  Dados Coletados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Coletamos apenas os dados necessários para processar suas compras e melhorar sua experiência:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Nome completo e CPF para emissão de nota fiscal</li>
                  <li>Endereço para entrega dos produtos</li>
                  <li>E-mail e telefone para comunicação sobre pedidos</li>
                  <li>Dados de navegação para melhoria do site</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Lock className="h-6 w-6 text-primary" />
                  Segurança dos Dados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Utilizamos as melhores práticas de segurança para proteger suas informações:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Criptografia SSL em todas as páginas</li>
                  <li>Servidores seguros com monitoramento 24/7</li>
                  <li>Dados de pagamento processados por gateways certificados PCI-DSS</li>
                  <li>Acesso restrito às informações pessoais</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Eye className="h-6 w-6 text-primary" />
                  Uso de Cookies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Utilizamos cookies para melhorar sua experiência de navegação, lembrar suas preferências e 
                  analisar como nosso site é utilizado. Você pode desativar os cookies nas configurações do 
                  seu navegador.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <UserCheck className="h-6 w-6 text-primary" />
                  Seus Direitos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  De acordo com a LGPD (Lei Geral de Proteção de Dados), você tem direito a:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Acessar seus dados pessoais</li>
                  <li>Corrigir dados incompletos ou desatualizados</li>
                  <li>Solicitar a exclusão dos seus dados</li>
                  <li>Revogar consentimento a qualquer momento</li>
                </ul>
                <p className="mt-4">
                  Para exercer seus direitos, entre em contato pelo e-mail: <span className="text-primary">privacidade@polibox.com.br</span>
                </p>
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

export default PrivacidadePage;
