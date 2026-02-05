 import { useQuery } from "@tanstack/react-query";
 import { productsApi, Product } from "@/lib/api/products";
 import { useCart } from "@/contexts/CartContext";
 import { Button } from "@/components/ui/button";
import { Plus, Zap } from "lucide-react";
 import { useToast } from "@/hooks/use-toast";
 
 const CheckoutUpsell = () => {
   const { items, addToCart, isOverLimit } = useCart();
   const { toast } = useToast();
   
   // Get cart item IDs to exclude from suggestions
   const cartItemIds = items.map(item => item.product.id);
   
  const { data: upsellProduct, isLoading } = useQuery({
     queryKey: ['checkout-upsell', cartItemIds],
     queryFn: async () => {
       const allProducts = await productsApi.getAll();
      // Filter products not in cart, with discount and low price
       const filtered = allProducts
         .filter(p => 
           p.price > 0 && 
          p.price <= 50 && // Low price items for impulse buy
           !cartItemIds.includes(p.id) &&
          p.image_url && // Has image
          p.discount_percent && p.discount_percent > 0
         )
         .sort((a, b) => (b.discount_percent || 0) - (a.discount_percent || 0))
        .slice(0, 1);
      return filtered[0] || null;
     },
   });
 
   const formatPrice = (price: number) => {
     return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
   };
 
   const handleAddUpsell = (product: Product) => {
     if (isOverLimit) {
       toast({
         title: "Limite do carrinho atingido",
         description: "O valor máximo do carrinho é R$ 499,99",
         variant: "destructive",
       });
       return;
     }
     
     const success = addToCart({
       id: product.id,
       name: product.name,
       price: product.price,
       image_url: product.image_url,
       pix_price: product.pix_price,
       old_price: product.old_price,
       discount_percent: product.discount_percent,
       brand: product.brand,
     } as any, 1);
     
     if (success) {
       toast({
         title: "Produto adicionado!",
         description: product.name,
       });
     } else {
       toast({
         title: "Limite do carrinho atingido",
         description: "O valor máximo do carrinho é R$ 499,99",
         variant: "destructive",
       });
     }
   };
 
  if (isLoading || !upsellProduct) {
     return null;
   }
 
   return (
    <section className="mt-4">
      <div className="bg-card rounded-lg border border-primary/20 p-3 flex items-center gap-3">
        {/* Image */}
        <div className="w-14 h-14 rounded-lg overflow-hidden bg-secondary/30 flex-shrink-0 relative">
          <img
            src={upsellProduct.image_url || '/placeholder.svg'}
            alt={upsellProduct.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {upsellProduct.discount_percent && (
            <div className="absolute top-0 left-0 bg-primary text-primary-foreground text-[8px] px-1 py-0.5 rounded-br font-bold">
              -{upsellProduct.discount_percent}%
            </div>
          )}
         </div>
 
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 text-[10px] text-primary font-medium mb-0.5">
            <Zap className="h-3 w-3" />
            APROVEITE
          </div>
          <h3 className="text-xs font-medium line-clamp-1">{upsellProduct.name}</h3>
          <span className="text-sm font-bold text-primary">{formatPrice(upsellProduct.price)}</span>
         </div>

        {/* Add Button */}
        <Button
          size="sm"
          onClick={() => handleAddUpsell(upsellProduct)}
          className="h-8 px-3 text-xs flex-shrink-0"
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Adicionar
        </Button>
       </div>
     </section>
   );
 };
 
 export default CheckoutUpsell;