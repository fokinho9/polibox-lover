import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, ImageIcon } from "lucide-react";

interface ProductCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: NewProduct) => void;
  isSaving: boolean;
  categories: { value: string; label: string }[];
}

export interface NewProduct {
  name: string;
  description?: string;
  price: number;
  old_price?: number;
  pix_price?: number;
  category: string;
  brand?: string;
  image_url?: string;
  source_url?: string;
  express_delivery: boolean;
  stock_status: string;
  discount_percent?: number;
}

const defaultProduct: NewProduct = {
  name: "",
  description: "",
  price: 0,
  old_price: undefined,
  pix_price: undefined,
  category: "lavagem",
  brand: "",
  image_url: "",
  source_url: "",
  express_delivery: true,
  stock_status: "in_stock",
  discount_percent: undefined,
};

export const ProductCreateModal = ({
  open,
  onClose,
  onSave,
  isSaving,
  categories,
}: ProductCreateModalProps) => {
  const [formData, setFormData] = useState<NewProduct>(defaultProduct);

  const updateField = (field: keyof NewProduct, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;
    
    // Calculate discount if old_price exists
    let discount = undefined;
    if (formData.old_price && formData.old_price > formData.price) {
      discount = Math.round(((formData.old_price - formData.price) / formData.old_price) * 100);
    }
    
    // Calculate pix_price if not set
    const pixPrice = formData.pix_price || formData.price * 0.95;
    
    onSave({
      ...formData,
      pix_price: pixPrice,
      discount_percent: discount,
    });
    
    // Reset form
    setFormData(defaultProduct);
  };

  const handleClose = () => {
    setFormData(defaultProduct);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Adicionar Novo Produto
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Image Preview */}
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 rounded-lg bg-secondary/50 border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
              {formData.image_url ? (
                <img 
                  src={formData.image_url} 
                  alt="Preview" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <Label>URL da Imagem</Label>
              <Input
                value={formData.image_url || ""}
                onChange={(e) => updateField("image_url", e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <Label>Nome do Produto *</Label>
            <Input
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Nome do produto"
              className="mt-1"
            />
          </div>

          {/* Brand */}
          <div>
            <Label>Marca</Label>
            <Input
              value={formData.brand || ""}
              onChange={(e) => updateField("brand", e.target.value)}
              placeholder="Ex: Vonixx, 3M, EasyTech..."
              className="mt-1"
            />
          </div>

          {/* Prices */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Preço (R$) *</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.price || ""}
                onChange={(e) => updateField("price", parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Preço Antigo (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.old_price || ""}
                onChange={(e) => updateField("old_price", parseFloat(e.target.value) || undefined)}
                placeholder="0.00"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Preço PIX (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.pix_price || ""}
                onChange={(e) => updateField("pix_price", parseFloat(e.target.value) || undefined)}
                placeholder="Auto: -5%"
                className="mt-1"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <Label>Categoria</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => updateField("category", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stock Status */}
          <div>
            <Label>Status do Estoque</Label>
            <Select
              value={formData.stock_status}
              onValueChange={(value) => updateField("stock_status", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in_stock">Em Estoque</SelectItem>
                <SelectItem value="esgotado">Esgotado</SelectItem>
                <SelectItem value="low_stock">Estoque Baixo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Source URL */}
          <div>
            <Label>URL de Origem</Label>
            <Input
              value={formData.source_url || ""}
              onChange={(e) => updateField("source_url", e.target.value)}
              placeholder="https://www.polibox.com.br/produto/..."
              className="mt-1"
            />
          </div>

          {/* Description */}
          <div>
            <Label>Descrição</Label>
            <Textarea
              value={formData.description || ""}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Descrição do produto..."
              rows={3}
              className="mt-1"
            />
          </div>

          {/* Express Delivery */}
          <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
            <div>
              <Label>Entrega Express</Label>
              <p className="text-xs text-muted-foreground">Disponível para entrega rápida</p>
            </div>
            <Switch
              checked={formData.express_delivery}
              onCheckedChange={(checked) => updateField("express_delivery", checked)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !formData.name.trim()}
            className="bg-primary hover:bg-cyan-glow"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Criar Produto
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
