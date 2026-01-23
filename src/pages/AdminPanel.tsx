import { useState, useRef } from "react";
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
  ArrowLeft,
  Upload,
  FileSpreadsheet,
  Pencil,
  Plus,
  Wrench,
  AlertTriangle,
  FileText,
  ShoppingCart,
  Image,
  Filter,
  Square,
  CheckSquare
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductEditModal } from "@/components/admin/ProductEditModal";
import { ProductCreateModal, NewProduct } from "@/components/admin/ProductCreateModal";

// Categorias do menu principal
const MENU_CATEGORIES = [
  { value: "ofertas", label: "Ofertas" },
  { value: "kits", label: "Kits" },
  { value: "motos", label: "Motos" },
  { value: "lavagem", label: "Lavagem" },
  { value: "polimento", label: "Polimento" },
  { value: "interior", label: "Interior" },
  { value: "equipamentos", label: "Equipamentos" },
  { value: "ceras-selantes", label: "Ceras e Selantes" },
  { value: "pneu-pretinho", label: "Pneu Pretinho" },
  { value: "limpadores-apc", label: "Limpadores APC" },
  { value: "mais-vendidos", label: "Mais Vendidos" },
  { value: "cursos", label: "Cursos" },
  { value: "novidades", label: "Novidades" },
];

// Marcas disponíveis
const BRAND_CATEGORIES = [
  { value: "vonixx", label: "VONIXX" },
  { value: "3m", label: "3M" },
  { value: "easytech", label: "EASYTECH" },
  { value: "wurth", label: "WURTH" },
  { value: "detailer", label: "DETAILER" },
  { value: "kers", label: "KERS" },
  { value: "cadillac", label: "CADILLAC" },
  { value: "spartan", label: "SPARTAN" },
  { value: "soft99", label: "SOFT99" },
  { value: "rapifix", label: "RAPIFIX" },
];

// Todas as categorias combinadas para importação
const CATEGORIES = [
  ...MENU_CATEGORIES,
  ...BRAND_CATEGORIES.map(b => ({ value: `marca-${b.value}`, label: `Marca: ${b.label}` })),
];

const AdminPanel = () => {
  const [scrapeUrl, setScrapeUrl] = useState("https://www.polibox.com.br");
  const [selectedCategory, setSelectedCategory] = useState("equipamentos");
  const [isImporting, setIsImporting] = useState(false);
  const [isFixingPrices, setIsFixingPrices] = useState(false);
  const [isSyncingDescriptions, setIsSyncingDescriptions] = useState(false);
  const [isSyncingImages, setIsSyncingImages] = useState(false);
  const [isSyncingSingleImage, setIsSyncingSingleImage] = useState(false);
  const [syncProgress, setSyncProgress] = useState<{
    current: number;
    total: number;
    updated: number;
    estimatedTime: string;
  } | null>(null);
  const [imagesSyncProgress, setImagesSyncProgress] = useState<{
    current: number;
    total: number;
    updated: number;
    estimatedTime: string;
  } | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterBy, setFilterBy] = useState<'all' | 'with-description' | 'without-description' | 'with-image' | 'without-image'>('all');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);
  const productsPerPage = 50;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.getAll(),
  });

  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['scrape-jobs'],
    queryFn: () => productsApi.getScrapeJobs(),
    refetchInterval: 5000,
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

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    
    try {
      const csvContent = await file.text();
      
      const result = await productsApi.importCsvProducts(csvContent, selectedCategory);
      
      if (result.success) {
        toast({
          title: "Importação Concluída!",
          description: `${result.products_inserted} produtos importados para "${selectedCategory}".`,
        });
        queryClient.invalidateQueries({ queryKey: ['products'] });
      } else {
        toast({
          title: "Erro na Importação",
          description: result.error || "Falha ao importar produtos.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao processar arquivo.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  const handleSaveProduct = async (updates: Partial<Product>) => {
    if (!updates.id) return;
    
    setIsSaving(true);
    try {
      await productsApi.update(updates.id, updates);
      toast({
        title: "Produto Atualizado",
        description: "As alterações foram salvas.",
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setEditingProduct(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar produto.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await productsApi.delete(id);
      toast({
        title: "Produto Excluído",
        description: "O produto foi removido.",
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao excluir produto.",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.size === 0) return;
    
    const confirmDelete = window.confirm(`Tem certeza que deseja excluir ${selectedProducts.size} produtos?`);
    if (!confirmDelete) return;
    
    setIsDeletingBulk(true);
    let deletedCount = 0;
    let errorCount = 0;
    
    try {
      for (const productId of selectedProducts) {
        try {
          await productsApi.delete(productId);
          deletedCount++;
        } catch (error) {
          errorCount++;
          console.error(`Failed to delete product ${productId}:`, error);
        }
      }
      
      toast({
        title: "Exclusão em lote concluída",
        description: `${deletedCount} produtos excluídos${errorCount > 0 ? `, ${errorCount} erros` : ''}.`,
      });
      
      setSelectedProducts(new Set());
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha na exclusão em lote.",
        variant: "destructive",
      });
    } finally {
      setIsDeletingBulk(false);
    }
  };

  const toggleProductSelection = (productId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = (paginatedProducts: Product[]) => {
    const allSelected = paginatedProducts.every(p => selectedProducts.has(p.id));
    if (allSelected) {
      // Deselect all on current page
      setSelectedProducts(prev => {
        const newSet = new Set(prev);
        paginatedProducts.forEach(p => newSet.delete(p.id));
        return newSet;
      });
    } else {
      // Select all on current page
      setSelectedProducts(prev => {
        const newSet = new Set(prev);
        paginatedProducts.forEach(p => newSet.add(p.id));
        return newSet;
      });
    }
  };

  const handleCreateProduct = async (newProduct: NewProduct) => {
    setIsSaving(true);
    try {
      await productsApi.create(newProduct as any);
      toast({
        title: "Produto Criado",
        description: "O novo produto foi adicionado.",
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsCreatingProduct(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao criar produto.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFixPrices = async () => {
    setIsFixingPrices(true);
    try {
      const result = await productsApi.fixProductPrices(5);
      if (result.success) {
        const processed = result.processed ?? 0;
        const fixed = result.fixed ?? 0;
        const anyResult: any = result;
        const outOfStockCount = anyResult?.outOfStockCount ?? 0;
        const failCount = anyResult?.failCount ?? 0;

        toast({
          title: "Correção de preços concluída",
          description: `Processados: ${processed} · Atualizados: ${fixed} · Esgotados: ${outOfStockCount} · Falhas: ${failCount}`,
        });
        queryClient.invalidateQueries({ queryKey: ['products'] });
      } else {
        toast({
          title: "Erro",
          description: result.error || "Falha ao corrigir preços.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao executar correção de preços.",
        variant: "destructive",
      });
    } finally {
      setIsFixingPrices(false);
    }
  };

  const handleSyncDescriptions = async () => {
    setIsSyncingDescriptions(true);
    setSyncProgress(null);
    
    const BATCH_SIZE = 5;
    const TIME_PER_PRODUCT = 1.5; // seconds estimate per product
    
    try {
      // First, count how many products need syncing
      const productsNeedingSync = products.filter(p => !p.description || p.description.length <= 10).length;
      
      if (productsNeedingSync === 0) {
        toast({
          title: "Tudo sincronizado!",
          description: "Todos os produtos já têm descrições.",
        });
        setIsSyncingDescriptions(false);
        return;
      }
      
      let totalProcessed = 0;
      let totalUpdated = 0;
      let batchNumber = 0;
      const totalBatches = Math.ceil(productsNeedingSync / BATCH_SIZE);
      
      while (totalProcessed < productsNeedingSync) {
        batchNumber++;
        const remaining = productsNeedingSync - totalProcessed;
        const estimatedSeconds = remaining * TIME_PER_PRODUCT;
        const estimatedMinutes = Math.ceil(estimatedSeconds / 60);
        
        setSyncProgress({
          current: totalProcessed,
          total: productsNeedingSync,
          updated: totalUpdated,
          estimatedTime: estimatedMinutes > 1 ? `~${estimatedMinutes} min restantes` : `< 1 min restante`,
        });
        
        const result = await productsApi.syncDescriptions(BATCH_SIZE, false);
        
        if (!result.success) {
          toast({
            title: "Erro no lote " + batchNumber,
            description: result.error || "Falha ao sincronizar lote.",
            variant: "destructive",
          });
          break;
        }
        
        totalProcessed += result.processed || 0;
        totalUpdated += result.updated || 0;
        
        // If no products were processed, we're done
        if (!result.processed || result.processed === 0) {
          break;
        }
        
        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      toast({
        title: "Sincronização concluída!",
        description: `${totalUpdated} produtos atualizados de ${totalProcessed} processados.`,
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao executar sincronização.",
        variant: "destructive",
      });
    } finally {
      setIsSyncingDescriptions(false);
      setSyncProgress(null);
    }
  };

  const handleSyncImages = async () => {
    setIsSyncingImages(true);
    setImagesSyncProgress(null);
    
    const TIME_PER_PRODUCT = 4; // seconds estimate per product (scraping takes time)
    
    try {
      // Count products without images
      const productsNeedingImages = products.filter(p => !p.image_url || p.image_url.length === 0).length;
      
      if (productsNeedingImages === 0) {
        toast({
          title: "Todas as imagens sincronizadas!",
          description: "Todos os produtos já têm imagens.",
        });
        setIsSyncingImages(false);
        return;
      }
      
      let totalProcessed = 0;
      let totalUpdated = 0;
      
      while (totalProcessed < productsNeedingImages) {
        const remaining = productsNeedingImages - totalProcessed;
        const estimatedSeconds = remaining * TIME_PER_PRODUCT;
        const estimatedMinutes = Math.ceil(estimatedSeconds / 60);
        
        setImagesSyncProgress({
          current: totalProcessed,
          total: productsNeedingImages,
          updated: totalUpdated,
          estimatedTime: estimatedMinutes > 1 ? `~${estimatedMinutes} min restantes` : `< 1 min restante`,
        });
        
        const result = await productsApi.syncImages(1);
        
        if (!result.success) {
          toast({
            title: "Erro na sincronização",
            description: result.error || "Falha ao sincronizar imagem.",
            variant: "destructive",
          });
          break;
        }
        
        totalProcessed += result.processed || 0;
        totalUpdated += result.updated || 0;
        
        // If no products were processed, we're done
        if (!result.processed || result.processed === 0) {
          break;
        }
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      toast({
        title: "Sincronização de imagens concluída!",
        description: `${totalUpdated} imagens atualizadas de ${totalProcessed} processados.`,
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao executar sincronização de imagens.",
        variant: "destructive",
      });
    } finally {
      setIsSyncingImages(false);
      setImagesSyncProgress(null);
    }
  };

  const handleSyncSingleImage = async () => {
    setIsSyncingSingleImage(true);
    
    try {
      const result = await productsApi.syncImages(1);
      
      if (result.success) {
        if (result.updated && result.updated > 0) {
          const productName = result.results?.[0]?.name || 'Produto';
          toast({
            title: "✅ Imagem sincronizada!",
            description: `${productName}`,
          });
        } else {
          toast({
            title: "Nenhuma imagem atualizada",
            description: result.results?.[0]?.error || "Produto já tem imagem ou não encontrada.",
          });
        }
        queryClient.invalidateQueries({ queryKey: ['products'] });
      } else {
        toast({
          title: "Erro",
          description: result.error || "Falha ao sincronizar imagem.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao executar sincronização.",
        variant: "destructive",
      });
    } finally {
      setIsSyncingSingleImage(false);
    }
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

  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    const cat = product.category || 'sem-categoria';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  // Count products without price
  const productsWithoutPrice = products.filter(p => !p.price || p.price === 0).length;
  
  // Count products with description
  const productsWithDescription = products.filter(p => p.description && p.description.length > 10).length;
  
  // Count products without description
  const productsWithoutDescription = products.filter(p => !p.description || p.description.length <= 10).length;
  
  // Count products with image
  const productsWithImage = products.filter(p => p.image_url && p.image_url.length > 0).length;

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
                Gerenciar produtos e importação
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <Package className="h-4 w-4 mr-2" />
            {products.length} Produtos
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={() => setIsCreatingProduct(true)}
            className="bg-primary hover:bg-cyan-glow"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Produto
          </Button>
          
          <Button 
            onClick={handleFixPrices}
            disabled={isFixingPrices || productsWithoutPrice === 0}
            variant="outline"
            className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
          >
            {isFixingPrices ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Corrigindo...
              </>
            ) : (
              <>
                <Wrench className="h-4 w-4 mr-2" />
                Corrigir Preços ({productsWithoutPrice})
              </>
            )}
          </Button>
          
          <Button 
            onClick={handleSyncImages}
            disabled={isSyncingImages || (products.length - productsWithImage) === 0}
            variant="outline"
            className="border-purple-500 text-purple-500 hover:bg-purple-500/10"
          >
            {isSyncingImages ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sincronizando...
              </>
            ) : (
              <>
                <Image className="h-4 w-4 mr-2" />
                Sincronizar Imagens ({products.length - productsWithImage})
              </>
            )}
          </Button>
          
          <Button 
            onClick={handleSyncSingleImage}
            disabled={isSyncingSingleImage || (products.length - productsWithImage) === 0}
            variant="outline"
            className="border-pink-500 text-pink-500 hover:bg-pink-500/10"
          >
            {isSyncingSingleImage ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sincronizando 1...
              </>
            ) : (
              <>
                <Image className="h-4 w-4 mr-2" />
                +1 Imagem
              </>
            )}
          </Button>
          
          {/* Image Sync Progress */}
          {imagesSyncProgress && (
            <div className="w-full bg-card border border-border rounded-lg p-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Sincronizando imagens: {imagesSyncProgress.current}/{imagesSyncProgress.total}</span>
                <span>{imagesSyncProgress.updated} atualizadas</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 transition-all duration-300"
                  style={{ width: `${(imagesSyncProgress.current / imagesSyncProgress.total) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{imagesSyncProgress.estimatedTime}</p>
            </div>
          )}
          
          {productsWithoutPrice > 0 && (
            <Badge variant="outline" className="border-red-500 text-red-400 px-3 py-2">
              <AlertTriangle className="h-4 w-4 mr-2" />
              {productsWithoutPrice} sem preço
            </Badge>
          )}
          
          <Badge variant="outline" className="border-green-500 text-green-400 px-3 py-2">
            <FileText className="h-4 w-4 mr-2" />
            {productsWithDescription} com descrição
          </Badge>
          
          {productsWithoutDescription > 0 && (
            <Badge variant="outline" className="border-orange-500 text-orange-400 px-3 py-2">
              <FileText className="h-4 w-4 mr-2" />
              {productsWithoutDescription} sem descrição
            </Badge>
          )}
          
          <Badge variant="outline" className="border-blue-500 text-blue-400 px-3 py-2">
            <Image className="h-4 w-4 mr-2" />
            {productsWithImage} com imagem
          </Badge>
          
          {products.length - productsWithImage > 0 && (
            <Badge variant="outline" className="border-purple-500 text-purple-400 px-3 py-2">
              <Image className="h-4 w-4 mr-2" />
              {products.length - productsWithImage} sem imagem
            </Badge>
          )}
        </div>
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filterBy === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => { setFilterBy('all'); setCurrentPage(1); }}
          >
            <Filter className="h-4 w-4 mr-1" />
            Todos
          </Button>
          <Button
            variant={filterBy === 'with-description' ? 'default' : 'outline'}
            size="sm"
            onClick={() => { setFilterBy('with-description'); setCurrentPage(1); }}
            className={filterBy === 'with-description' ? 'bg-green-600 hover:bg-green-700' : 'border-green-500 text-green-500 hover:bg-green-500/10'}
          >
            Com Descrição
          </Button>
          <Button
            variant={filterBy === 'without-description' ? 'default' : 'outline'}
            size="sm"
            onClick={() => { setFilterBy('without-description'); setCurrentPage(1); }}
            className={filterBy === 'without-description' ? 'bg-orange-600 hover:bg-orange-700' : 'border-orange-500 text-orange-500 hover:bg-orange-500/10'}
          >
            Sem Descrição
          </Button>
          <Button
            variant={filterBy === 'with-image' ? 'default' : 'outline'}
            size="sm"
            onClick={() => { setFilterBy('with-image'); setCurrentPage(1); }}
            className={filterBy === 'with-image' ? 'bg-blue-600 hover:bg-blue-700' : 'border-blue-500 text-blue-500 hover:bg-blue-500/10'}
          >
            Com Imagem
          </Button>
          <Button
            variant={filterBy === 'without-image' ? 'default' : 'outline'}
            size="sm"
            onClick={() => { setFilterBy('without-image'); setCurrentPage(1); }}
            className={filterBy === 'without-image' ? 'bg-purple-600 hover:bg-purple-700' : 'border-purple-500 text-purple-500 hover:bg-purple-500/10'}
          >
            Sem Imagem ({products.length - productsWithImage})
          </Button>
        </div>

        {/* CSV Import Section */}
        <Card className="bg-card border-border border-2 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
              Importar CSV por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm text-muted-foreground mb-2 block">
                  Categoria de destino:
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <input
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isImporting}
                  className="bg-primary hover:bg-cyan-glow"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Selecionar CSV
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Selecione um arquivo CSV para visualizar os produtos antes de importar.
              Você poderá selecionar quais produtos importar e ver os preços.
            </p>
          </CardContent>
        </Card>

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

            <div className="flex flex-wrap gap-4">
              <Button 
                variant="outline" 
                onClick={() => queryClient.invalidateQueries({ queryKey: ['products'] })}
                className="border-border"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar Lista
              </Button>
              <Button 
                variant="outline"
                onClick={handleSyncDescriptions}
                disabled={isSyncingDescriptions}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                {isSyncingDescriptions ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sincronizando...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Sincronizar Descrições ({productsWithoutDescription})
                  </>
                )}
              </Button>
              
              {/* Sync Progress Indicator */}
              {syncProgress && (
                <div className="w-full bg-secondary/50 rounded-lg p-4 border border-primary/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">
                      Progresso da Sincronização
                    </span>
                    <span className="text-xs text-primary font-semibold">
                      {syncProgress.estimatedTime}
                    </span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2.5 mb-2">
                    <div 
                      className="bg-primary h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((syncProgress.current / syncProgress.total) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{syncProgress.current} / {syncProgress.total} processados</span>
                    <span>{syncProgress.updated} atualizados</span>
                  </div>
                </div>
              )}
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

        {/* Link to Orders Page */}
        <Link to="/admin/pedidos">
          <Button className="w-full bg-primary hover:bg-cyan-glow text-lg py-6">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Ver Pedidos
          </Button>
        </Link>

        {/* Products by Category Summary */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Package className="h-5 w-5 text-primary" />
              Produtos por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
                <div 
                  key={category}
                  className="p-4 bg-secondary/30 rounded-lg border border-border text-center"
                >
                  <p className="text-2xl font-bold text-primary">{categoryProducts.length}</p>
                  <p className="text-sm text-muted-foreground capitalize">{category}</p>
                </div>
              ))}
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
              <span className="text-sm font-normal text-muted-foreground ml-2">
                (Clique para editar)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : products.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhum produto no banco. Use o scraping ou importe um CSV.
              </p>
            ) : (
              <>
                {(() => {
                  // Apply filter
                  const filteredProducts = products.filter((p: Product) => {
                    if (filterBy === 'with-description') return p.description && p.description.length > 10;
                    if (filterBy === 'without-description') return !p.description || p.description.length <= 10;
                    if (filterBy === 'with-image') return p.image_url && p.image_url.length > 0;
                    if (filterBy === 'without-image') return !p.image_url || p.image_url.length === 0;
                    return true;
                  });
                  
                  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
                  const paginatedProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);
                  
                  const allOnPageSelected = paginatedProducts.length > 0 && paginatedProducts.every(p => selectedProducts.has(p.id));
                  
                  return (
                    <>
                      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleSelectAll(paginatedProducts)}
                            className="flex items-center gap-2"
                          >
                            {allOnPageSelected ? (
                              <CheckSquare className="h-4 w-4 text-primary" />
                            ) : (
                              <Square className="h-4 w-4" />
                            )}
                            {allOnPageSelected ? 'Desmarcar tudo' : 'Selecionar página'}
                          </Button>
                          {selectedProducts.size > 0 && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={handleBulkDelete}
                              disabled={isDeletingBulk}
                              className="flex items-center gap-2"
                            >
                              {isDeletingBulk ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                              Excluir ({selectedProducts.size})
                            </Button>
                          )}
                          <p className="text-sm text-muted-foreground">
                            Página {currentPage} de {totalPages} 
                            ({filteredProducts.length} produtos{filterBy !== 'all' ? ` - Filtro: ${filterBy === 'with-description' ? 'Com Descrição' : filterBy === 'without-description' ? 'Sem Descrição' : filterBy}` : ''})
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                          >
                            Anterior
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage >= totalPages}
                          >
                            Próximo
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {paginatedProducts.map((product: Product) => (
                          <div 
                            key={product.id} 
                            className={`p-4 rounded-lg border cursor-pointer transition-all group relative ${
                              selectedProducts.has(product.id)
                                ? 'ring-2 ring-primary border-primary bg-primary/10'
                                : product.price === 0 
                                  ? 'bg-red-500/10 border-red-500/50 hover:border-red-500' 
                                  : 'bg-secondary/30 border-border hover:border-primary/50'
                            }`}
                            onClick={() => setEditingProduct(product)}
                          >
                            {/* Checkbox */}
                            <div 
                              className="absolute top-2 left-2 z-10"
                              onClick={(e) => toggleProductSelection(product.id, e)}
                            >
                              {selectedProducts.has(product.id) ? (
                                <CheckSquare className="h-5 w-5 text-primary cursor-pointer" />
                              ) : (
                                <Square className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
                              )}
                            </div>
                            
                            <div className="relative">
                              {product.image_url && (
                                <img 
                                  src={product.image_url} 
                                  alt={product.name}
                                  className="w-full h-32 object-contain mb-3 rounded"
                                />
                              )}
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-primary rounded-full p-1.5">
                                  <Pencil className="h-3 w-3 text-white" />
                                </div>
                              </div>
                              {product.price === 0 && (
                                <Badge className="absolute top-2 left-6 bg-red-500">
                                  SEM PREÇO
                                </Badge>
                              )}
                              {product.description && product.description.length > 10 && (
                                <Badge className="absolute top-2 bg-green-500" style={{ left: product.price === 0 ? '110px' : '28px' }}>
                                  DESCRIÇÃO
                                </Badge>
                              )}
                            </div>
                            <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-2">
                              {product.name}
                            </h3>
                            <div className="flex items-center justify-between">
                              <div>
                                <span className={`font-bold ${product.price === 0 ? 'text-red-500' : 'text-primary'}`}>
                                  R$ {product.price?.toFixed(2).replace('.', ',')}
                                </span>
                                {product.pix_price && product.pix_price > 0 && (
                                  <p className="text-xs text-green-500">
                                    PIX: R$ {product.pix_price.toFixed(2).replace('.', ',')}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-1 flex-wrap justify-end">
                                <Badge variant="outline" className="text-xs">
                                  {product.category}
                                </Badge>
                                {product.discount_percent && product.discount_percent > 0 && (
                                  <Badge className="bg-yellow-500 text-black text-xs">
                                    -{product.discount_percent}%
                                  </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                        ))}
                      </div>
                      <div className="flex justify-center gap-2 mt-4">
                        {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                              className="w-10"
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                        {totalPages > 10 && (
                          <span className="text-muted-foreground px-2">...</span>
                        )}
                      </div>
                    </>
                  );
                })()}
              </>
            )}
          </CardContent>
        </Card>
      </div>


      {/* Product Edit Modal */}
      <ProductEditModal
        open={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        product={editingProduct}
        onSave={handleSaveProduct}
        onDelete={handleDeleteProduct}
        isSaving={isSaving}
      />

      {/* Product Create Modal */}
      <ProductCreateModal
        open={isCreatingProduct}
        onClose={() => setIsCreatingProduct(false)}
        onSave={handleCreateProduct}
        isSaving={isSaving}
        categories={CATEGORIES}
      />
    </div>
  );
};

export default AdminPanel;
