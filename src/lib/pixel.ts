// Facebook Pixel Helper Functions
// Pixel ID: 1280424109613163

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

// Track page view
export const trackPageView = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

// Track product view
export const trackViewContent = (product: {
  id: string;
  name: string;
  price: number;
  category?: string;
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_ids: [product.id],
      content_name: product.name,
      content_type: 'product',
      content_category: product.category || 'Produtos',
      value: product.price,
      currency: 'BRL',
    });
  }
};

// Track add to cart
export const trackAddToCart = (product: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_ids: [product.id],
      content_name: product.name,
      content_type: 'product',
      value: product.price * product.quantity,
      currency: 'BRL',
    });
  }
};

// Track initiate checkout
export const trackInitiateCheckout = (data: {
  items: Array<{ id: string; name: string; price: number; quantity: number }>;
  totalValue: number;
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      content_ids: data.items.map(item => item.id),
      contents: data.items.map(item => ({
        id: item.id,
        quantity: item.quantity,
      })),
      content_type: 'product',
      num_items: data.items.reduce((sum, item) => sum + item.quantity, 0),
      value: data.totalValue,
      currency: 'BRL',
    });
  }
};

// Track add payment info
export const trackAddPaymentInfo = (data: {
  totalValue: number;
  paymentMethod: string;
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'AddPaymentInfo', {
      value: data.totalValue,
      currency: 'BRL',
      content_category: data.paymentMethod,
    });
  }
};

// Track purchase
export const trackPurchase = (data: {
  orderId: string;
  items: Array<{ id: string; name: string; price: number; quantity: number }>;
  totalValue: number;
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Purchase', {
      content_ids: data.items.map(item => item.id),
      contents: data.items.map(item => ({
        id: item.id,
        quantity: item.quantity,
      })),
      content_type: 'product',
      num_items: data.items.reduce((sum, item) => sum + item.quantity, 0),
      value: data.totalValue,
      currency: 'BRL',
      order_id: data.orderId,
    });
  }
};

// Track search
export const trackSearch = (searchQuery: string) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Search', {
      search_string: searchQuery,
    });
  }
};

// Track lead (quiz completion, contact form, etc)
export const trackLead = (source?: string) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: source || 'Quiz',
    });
  }
};

// Track complete registration (if applicable)
export const trackCompleteRegistration = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'CompleteRegistration');
  }
};
