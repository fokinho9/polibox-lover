import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi, Product, ScrapeJob } from "@/lib/api/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Download, 
  Trash2, 
  RefreshCw, 
  Package, 
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminPanel = () => {
  const [scrapeUrl, setScrapeUrl] = useState("https://www.polibox.com.br");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.getAll(),
  });

  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['scrape-jobs'],
    queryFn: () => productsApi.getScrapeJobs(),
    refetchInterval: 5000, // Poll every 5 seconds
  });

  const scrapeMutation = useMutation({
    mutationFn: (url: string) => productsApi.scrapeUrl(url),
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Scraping Concluído!",
          description: `${data.products_found || 0} produtos encontrados.`,
        });
      } else {
        toast({
          title: "Erro no Scraping",
          description: data.error || "Falha ao extrair produtos.",
          variant: "destructive",
        });
      }
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['scrape-jobs'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteAllMutation = useMutation({
    mutationFn: () => productsApi.deleteAll(),
    onSuccess: () => {
      toast({
        title: "Produtos Removidos",
        description: "Todos os produtos foram excluídos.",
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const handleScrape = () => {
    if (!scrapeUrl) {
      toast({
        title: "URL Obrigatória",
        description: "Digite uma URL para fazer scraping.",
        variant: "destructive",
      });
      return;
    }
    scrapeMutation.mutate(scrapeUrl);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                Painel Admin
              </h1>
              <p className="text-muted-foreground">
                Gerenciar produtos e scraping
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <Package className="h-4 w-4 mr-2" />
            {products.length} Produtos
          </Badge>
        </div>

        {/* Scraping Section */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Download className="h-5 w-5 text-primary" />
              Scraping de Produtos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="https://www.polibox.com.br"
                value={scrapeUrl}
                onChange={(e) => setScrapeUrl(e.target.value)}
                className="flex-1 bg-secondary border-border"
              />
              <Button 
                onClick={handleScrape} 
                disabled={scrapeMutation.isPending}
                className="bg-primary hover:bg-cyan-glow"
              >
                {scrapeMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Extraindo...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Extrair Produtos
                  </>
                )}
              </Button>
            </div>

            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => queryClient.invalidateQueries({ queryKey: ['products'] })}
                className="border-border"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar Lista
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => deleteAllMutation.mutate()}
                disabled={deleteAllMutation.isPending || products.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar Todos
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Jobs History */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Clock className="h-5 w-5 text-primary" />
              Histórico de Scraping
            </CardTitle>
          </CardHeader>
          <CardContent>
            {jobsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : jobs.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhum job de scraping ainda.
              </p>
            ) : (
              <div className="space-y-2">
                {jobs.map((job: ScrapeJob) => (
                  <div 
                    key={job.id} 
                    className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(job.status)}
                      <div>
                        <p className="text-sm text-foreground truncate max-w-md">
                          {job.url}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(job.created_at).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {job.status === 'completed' && (
                        <Badge variant="secondary">
                          {job.products_found} produtos
                        </Badge>
                      )}
                      {job.status === 'failed' && job.error_message && (
                        <Badge variant="destructive" className="max-w-[200px] truncate">
                          {job.error_message}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Products Grid */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Package className="h-5 w-5 text-primary" />
              Produtos no Banco de Dados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : products.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhum produto no banco. Use o scraping para importar produtos.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.slice(0, 20).map((product: Product) => (
                  <div 
                    key={product.id} 
                    className="p-4 bg-secondary/30 rounded-lg border border-border"
                  >
                    {product.image_url && (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-32 object-contain mb-3 rounded"
                      />
                    )}
                    <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-bold">
                        R$ {product.price?.toFixed(2).replace('.', ',')}
                      </span>
                      {product.discount_percent && (
                        <Badge className="bg-yellow-500 text-black">
                          -{product.discount_percent}%
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {products.length > 20 && (
              <p className="text-center text-muted-foreground mt-4">
                Mostrando 20 de {products.length} produtos
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
