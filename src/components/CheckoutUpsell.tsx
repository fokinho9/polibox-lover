 import { useQuery } from "@tanstack/react-query";
 import { productsApi, Product } from "@/lib/api/products";
 import { useCart } from "@/contexts/CartContext";
 import { Button } from "@/components/ui/button";
 import { Plus, Flame, Zap, Percent } from "lucide-react";
 import { useToast } from "@/hooks/use-toast";
 
 const CheckoutUpsell = () => {
   const { items, addToCart, isOverLimit } = useCart();
   const { toast } = useToast();
   
   // Get cart item IDs to exclude from suggestions
   const cartItemIds = items.map(item => item.product.id);
   
   const { data: upsellProducts, isLoading } = useQuery({
     queryKey: ['checkout-upsell', cartItemIds],
     queryFn: async () => {
       const allProducts = await productsApi.getAll();
       // Filter products not in cart, with discount and good price
       const filtered = allProducts
         .filter(p => 
           p.price > 0 && 
           p.price <= 80 && // Low price items for impulse buy
           !cartItemIds.includes(p.id) &&
           p.image_url // Has image
         )
         .sort((a, b) => (b.discount_percent || 0) - (a.discount_percent || 0))
         .slice(0, 6);
       return filtered;
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
 
   if (isLoading || !upsellProducts || upsellProducts.length === 0) {
     return null;
   }
 
   return (
     <section className="mt-6 md:mt-8">
       <div className="bg-gradient-to-r from-orange-500/10 via-red-500/10 to-orange-500/10 rounded-xl md:rounded-2xl border border-orange-500/20 overflow-hidden">
         {/* Header */}
         <div className="p-3 md:p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 border-b border-orange-500/20">
           <div className="flex items-center justify-center gap-2">
             <Flame className="h-5 w-5 text-orange-500 animate-pulse" />
             <h2 className="font-display text-base md:text-lg font-bold text-orange-500">
               APROVEITE E LEVE TAMBÉM
             </h2>
             <Flame className="h-5 w-5 text-orange-500 animate-pulse" />
           </div>
           <p className="text-center text-xs text-muted-foreground mt-1">
             Produtos selecionados com desconto especial
           </p>
         </div>
 
         {/* Products Grid */}
         <div className="p-3 md:p-4">
           <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
             {upsellProducts.map((product) => (
               <div
                 key={product.id}
                 className="bg-card rounded-lg md:rounded-xl border border-border p-2 md:p-3 flex flex-col hover:border-primary/50 transition-colors group"
               >
                 {/* Image */}
                 <div className="relative aspect-square rounded-lg overflow-hidden bg-secondary/30 mb-2">
                   <img
                     src={product.image_url || '/placeholder.svg'}
                     alt={product.name}
                     className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                     loading="lazy"
                   />
                   {product.discount_percent && product.discount_percent > 0 && (
                     <div className="absolute top-1 left-1 bg-red-logo text-white text-[10px] md:text-xs px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                       <Percent className="h-2.5 w-2.5" />
                       {product.discount_percent}%
                     </div>
                   )}
                   <div className="absolute top-1 right-1 bg-primary/90 text-primary-foreground text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
                     <Zap className="h-2.5 w-2.5" />
                     Oferta
                   </div>
                 </div>
 
                 {/* Info */}
                 <h3 className="text-[11px] md:text-xs font-medium line-clamp-2 mb-1 flex-1">
                   {product.name}
                 </h3>
 
                 {/* Price */}
                 <div className="mb-2">
                   {product.old_price && product.old_price > product.price && (
                     <span className="text-[10px] text-muted-foreground line-through block">
                       {formatPrice(product.old_price)}
                     </span>
                   )}
                   <span className="text-sm md:text-base font-bold text-primary">
                     {formatPrice(product.price)}
                   </span>
                 </div>
 
                 {/* Add Button */}
                 <Button
                   size="sm"
                   onClick={() => handleAddUpsell(product)}
                   className="w-full h-8 text-xs bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                 >
                   <Plus className="h-3.5 w-3.5 mr-1" />
                   Adicionar
                 </Button>
               </div>
             ))}
           </div>
         </div>
       </div>
     </section>
   );
 };
 
 export default CheckoutUpsell;