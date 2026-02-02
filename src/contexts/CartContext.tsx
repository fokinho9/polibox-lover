import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { Product } from '@/lib/api/products';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => boolean;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => boolean;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  totalSavings: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  lastAddedProduct: Product | null;
  getItemPrice: (item: CartItem) => number;
  getItemUnitPrice: (item: CartItem) => number;
  hasWholesaleDiscount: (item: CartItem) => boolean;
  hasCartWholesale: boolean;
  isOverLimit: boolean;
  CART_LIMIT: number;
}

const WHOLESALE_THRESHOLD = 5;
const WHOLESALE_DISCOUNT = 0.20; // 20% discount
const CART_LIMIT = 499.99; // Maximum cart value for free shipping

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState<Product | null>(null);

  const totalItems = useMemo(() => 
    items.reduce((sum, item) => sum + item.quantity, 0), 
    [items]
  );

  // Check if cart total qualifies for wholesale
  const hasCartWholesale = useMemo(() => 
    totalItems >= WHOLESALE_THRESHOLD, 
    [totalItems]
  );

  // Helper to calculate what new total would be
  // Note: product.price already includes site discount from when it was added to cart
  const calculateNewTotal = useCallback((newItems: CartItem[]) => {
    const newTotalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
    const hasWholesale = newTotalItems >= WHOLESALE_THRESHOLD;
    
    return newItems.reduce((sum, item) => {
      const basePrice = item.product.price; // Already has site discount applied
      const unitPrice = (item.quantity >= WHOLESALE_THRESHOLD || hasWholesale) 
        ? basePrice * (1 - WHOLESALE_DISCOUNT) 
        : basePrice;
      return sum + (unitPrice * item.quantity);
    }, 0);
  }, []);

  const addToCart = useCallback((product: Product, quantity: number = 1): boolean => {
    // Calculate what the new total would be
    const existingItem = items.find((item) => item.product.id === product.id);
    const newItems = existingItem 
      ? items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      : [...items, { product, quantity }];
    
    const newTotal = calculateNewTotal(newItems);
    
    // Check if would exceed limit
    if (newTotal > CART_LIMIT) {
      return false; // Signal that addition was blocked
    }
    
    setItems(newItems);
    setLastAddedProduct(product);
    
    // Clear notification after 3 seconds
    setTimeout(() => {
      setLastAddedProduct(null);
    }, 3000);
    
    return true;
  }, [items, calculateNewTotal]);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number): boolean => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return true;
    }
    
    // Calculate what the new total would be
    const newItems = items.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    
    const newTotal = calculateNewTotal(newItems);
    
    // Check if would exceed limit
    if (newTotal > CART_LIMIT) {
      return false; // Signal that update was blocked
    }
    
    setItems(newItems);
    return true;
  }, [removeFromCart, items, calculateNewTotal]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Check if item qualifies for wholesale discount (5+ of same product OR 5+ total in cart)
  const hasWholesaleDiscount = useCallback((item: CartItem) => {
    return item.quantity >= WHOLESALE_THRESHOLD || totalItems >= WHOLESALE_THRESHOLD;
  }, [totalItems]);

  // Get unit price with wholesale discount if applicable
  // The product.price is already the displayed price (with site discount applied)
  const getItemUnitPrice = useCallback((item: CartItem) => {
    const basePrice = item.product.price; // Already has site discount applied
    // Apply wholesale discount if: 5+ of same product OR 5+ total items in cart
    if (item.quantity >= WHOLESALE_THRESHOLD || totalItems >= WHOLESALE_THRESHOLD) {
      return basePrice * (1 - WHOLESALE_DISCOUNT);
    }
    return basePrice;
  }, [totalItems]);

  // Get total price for an item
  const getItemPrice = useCallback((item: CartItem) => {
    return getItemUnitPrice(item) * item.quantity;
  }, [getItemUnitPrice]);
  
  const totalPrice = useMemo(() => 
    items.reduce((sum, item) => sum + getItemPrice(item), 0),
    [items, getItemPrice]
  );

  // Calculate total savings from wholesale discounts
  // product.price already has site discount, so savings is just from wholesale
  const totalSavings = useMemo(() => {
    if (totalItems < WHOLESALE_THRESHOLD) return 0;
    
    return items.reduce((sum, item) => {
      const regularPrice = item.product.price * item.quantity; // Base price (already discounted)
      const discountedPrice = getItemPrice(item); // With wholesale discount
      return sum + (regularPrice - discountedPrice);
    }, 0);
  }, [items, totalItems, getItemPrice]);

  // Check if cart is over the limit
  const isOverLimit = useMemo(() => totalPrice > CART_LIMIT, [totalPrice]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        totalSavings,
        isCartOpen,
        setIsCartOpen,
        lastAddedProduct,
        getItemPrice,
        getItemUnitPrice,
        hasWholesaleDiscount,
        hasCartWholesale,
        isOverLimit,
        CART_LIMIT,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
