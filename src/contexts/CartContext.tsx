import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Product } from '@/lib/api/products';
import { applyDiscount } from '@/lib/utils';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
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
}

const WHOLESALE_THRESHOLD = 5;
const WHOLESALE_DISCOUNT = 0.20; // 20% discount

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState<Product | null>(null);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setLastAddedProduct(product);
    
    // Clear notification after 3 seconds
    setTimeout(() => {
      setLastAddedProduct(null);
    }, 3000);
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Check if item qualifies for wholesale discount
  const hasWholesaleDiscount = useCallback((item: CartItem) => {
    return item.quantity >= WHOLESALE_THRESHOLD;
  }, []);

  // Get unit price with wholesale discount if applicable
  const getItemUnitPrice = useCallback((item: CartItem) => {
    const basePrice = applyDiscount(item.product.price);
    if (item.quantity >= WHOLESALE_THRESHOLD) {
      return basePrice * (1 - WHOLESALE_DISCOUNT);
    }
    return basePrice;
  }, []);

  // Get total price for an item
  const getItemPrice = useCallback((item: CartItem) => {
    return getItemUnitPrice(item) * item.quantity;
  }, [getItemUnitPrice]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalPrice = items.reduce(
    (sum, item) => sum + getItemPrice(item),
    0
  );

  // Calculate total savings from wholesale discounts
  const totalSavings = items.reduce((sum, item) => {
    if (item.quantity >= WHOLESALE_THRESHOLD) {
      const regularPrice = applyDiscount(item.product.price) * item.quantity;
      const discountedPrice = getItemPrice(item);
      return sum + (regularPrice - discountedPrice);
    }
    return sum;
  }, 0);

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
