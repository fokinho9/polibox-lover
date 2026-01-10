import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Loader2, Upload, Image as ImageIcon } from "lucide-react";

interface CsvProduct {
  name: string;
  price: string;
  pixPrice: string;
  url: string;
  imageUrl: string;
  selected: boolean;
}

interface CsvPreviewModalProps {
  open: boolean;
  onClose: () => void;
  products: CsvProduct[];
  category: string;
  onConfirm: (products: CsvProduct[]) => void;
  isImporting: boolean;
}

export function CsvPreviewModal({
  open,
  onClose,
  products,
  category,
  onConfirm,
  isImporting,
}: CsvPreviewModalProps) {
  const [selectedProducts, setSelectedProducts] = useState<CsvProduct[]>(products);

  const toggleProduct = (index: number) => {
    setSelectedProducts((prev) =>
      prev.map((p, i) => (i === index ? { ...p, selected: !p.selected } : p))
    );
  };

  const selectAll = () => {
    setSelectedProducts((prev) => prev.map((p) => ({ ...p, selected: true })));
  };

  const deselectAll = () => {
    setSelectedProducts((prev) => prev.map((p) => ({ ...p, selected: false })));
  };

  const selectedCount = selectedProducts.filter((p) => p.selected).length;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Preview do CSV - {category}
            <Badge variant="secondary">{products.length} produtos</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 mb-2">
          <Button variant="outline" size="sm" onClick={selectAll}>
            Selecionar Todos
          </Button>
          <Button variant="outline" size="sm" onClick={deselectAll}>
            Desmarcar Todos
          </Button>
          <Badge className="ml-auto">{selectedCount} selecionados</Badge>
        </div>

        <ScrollArea className="flex-1 border rounded-lg">
          <div className="p-2 space-y-2">
            {selectedProducts.map((product, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  product.selected
                    ? "bg-primary/10 border-primary/30"
                    : "bg-muted/30 border-border opacity-60"
                }`}
              >
                <Checkbox
                  checked={product.selected}
                  onCheckedChange={() => toggleProduct(index)}
                />
                
                <div className="w-16 h-16 flex-shrink-0 bg-muted rounded overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-2">{product.name}</p>
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline truncate block"
                  >
                    {product.url}
                  </a>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-foreground">{product.price}</p>
                  {product.pixPrice && product.pixPrice !== product.price && (
                    <p className="text-sm text-green-500 font-medium">
                      PIX: {product.pixPrice}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={isImporting}>
            Cancelar
          </Button>
          <Button
            onClick={() => onConfirm(selectedProducts.filter((p) => p.selected))}
            disabled={isImporting || selectedCount === 0}
            className="bg-primary"
          >
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Importando...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Importar {selectedCount} Produtos
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function parseCsvForPreview(csvContent: string): CsvProduct[] {
  const lines = csvContent.split('\n');
  const products: CsvProduct[] = [];
  
  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]?.trim();
    if (!line) continue;
    
    // Parse CSV line
    const fields: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    fields.push(current.trim());
    
    // New format: Nome, Preço, Preço Promocional, Descrição, URL, Imagem
    const name = fields[0]?.replace(/^"|"$/g, '').trim();
    const price = fields[1]?.replace(/^"|"$/g, '').trim() || '';
    const pixPrice = fields[2]?.replace(/^"|"$/g, '').trim() || '';
    const url = fields[4]?.replace(/^"|"$/g, '').replace(/\\/g, '').trim() || '';
    const imageUrl = fields[5]?.replace(/^"|"$/g, '').replace(/\\/g, '').trim() || '';
    
    if (name && name.length > 2) {
      products.push({
        name,
        price,
        pixPrice,
        url,
        imageUrl,
        selected: true,
      });
    }
  }
  
  return products;
}
