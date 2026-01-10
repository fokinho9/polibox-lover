import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save, Trash2 } from "lucide-react";
import { Product } from "@/lib/api/products";

const CATEGORIES = [
  { value: "equipamentos", label: "Equipamentos" },
  { value: "interior", label: "Interior" },
  { value: "polimento", label: "Polimento" },
  { value: "lavagem", label: "Lavagem" },
  { value: "kits", label: "Kits" },
  { value: "ofertas", label: "Ofertas" },
  { value: "novidades", label: "Novidades" },
];

interface ProductEditModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (product: Partial<Product>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isSaving: boolean;
}

export function ProductEditModal({
  open,
  onClose,
  product,
  onSave,
  onDelete,
  isSaving,
}: ProductEditModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price,
        old_price: product.old_price,
        pix_price: product.pix_price,
        discount_percent: product.discount_percent,
        category: product.category || "",
        image_url: product.image_url || "",
        source_url: product.source_url || "",
        brand: product.brand || "",
        stock_status: product.stock_status || "in_stock",
        express_delivery: product.express_delivery ?? true,
      });
    }
  }, [product]);

  const handleSave = async () => {
    if (product) {
      await onSave({ id: product.id, ...formData });
    }
  };

  const handleDelete = async () => {
    if (product && confirm("Tem certeza que deseja excluir este produto?")) {
      setIsDeleting(true);
      try {
        await onDelete(product.id);
        onClose();
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const updateField = (field: keyof Product, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Image Preview */}
          {formData.image_url && (
            <div className="flex justify-center">
              <img
                src={formData.image_url}
                alt={formData.name}
                className="max-h-40 object-contain rounded-lg border"
              />
            </div>
          )}

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Produto</Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => updateField("description", e.target.value)}
              rows={3}
            />
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price || ""}
                onChange={(e) => updateField("price", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="old_price">Preço Antigo (R$)</Label>
              <Input
                id="old_price"
                type="number"
                step="0.01"
                value={formData.old_price || ""}
                onChange={(e) => updateField("old_price", parseFloat(e.target.value) || null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pix_price">Preço PIX (R$)</Label>
              <Input
                id="pix_price"
                type="number"
                step="0.01"
                value={formData.pix_price || ""}
                onChange={(e) => updateField("pix_price", parseFloat(e.target.value) || null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Desconto (%)</Label>
              <Input
                id="discount"
                type="number"
                value={formData.discount_percent || ""}
                onChange={(e) => updateField("discount_percent", parseInt(e.target.value) || null)}
              />
            </div>
          </div>

          {/* Category & Brand */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.category || ""}
                onValueChange={(value) => updateField("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
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
            <div className="space-y-2">
              <Label htmlFor="brand">Marca</Label>
              <Input
                id="brand"
                value={formData.brand || ""}
                onChange={(e) => updateField("brand", e.target.value)}
              />
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="image_url">URL da Imagem</Label>
            <Input
              id="image_url"
              value={formData.image_url || ""}
              onChange={(e) => updateField("image_url", e.target.value)}
            />
          </div>

          {/* Source URL */}
          <div className="space-y-2">
            <Label htmlFor="source_url">URL de Origem</Label>
            <Input
              id="source_url"
              value={formData.source_url || ""}
              onChange={(e) => updateField("source_url", e.target.value)}
            />
          </div>

          {/* Stock & Delivery */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock_status">Status do Estoque</Label>
              <Select
                value={formData.stock_status || "in_stock"}
                onValueChange={(value) => updateField("stock_status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_stock">Em Estoque</SelectItem>
                  <SelectItem value="low_stock">Estoque Baixo</SelectItem>
                  <SelectItem value="out_of_stock">Sem Estoque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <Switch
                id="express"
                checked={formData.express_delivery ?? true}
                onCheckedChange={(checked) => updateField("express_delivery", checked)}
              />
              <Label htmlFor="express">Entrega Expressa</Label>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting || isSaving}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Excluir
          </Button>
          <div className="flex-1" />
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-primary">
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
