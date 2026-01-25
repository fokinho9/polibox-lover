import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  old_price: number | null;
  pix_price: number | null;
  discount_percent: number | null;
  category: string | null;
  image_url: string | null;
  additional_images: string[] | null;
  stock_status: string | null;
  brand: string | null;
  express_delivery: boolean | null;
  installments_count: number | null;
  installments_value: number | null;
  source_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ScrapeJob {
  id: string;
  url: string;
  status: string;
  products_found: number;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
}

export const productsApi = {
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Lightweight version for listings (faster)
  async getAllLight(): Promise<Partial<Product>[]> {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, price, old_price, pix_price, discount_percent, category, image_url, stock_status, brand, express_delivery, installments_count, installments_value')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getByCategory(category: string): Promise<Product[]> {
    // Handle brand categories - search in both brand field AND product name
    if (category.startsWith('marca-')) {
      const brandName = category.replace('marca-', '').toUpperCase();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`brand.ilike.%${brandName}%,name.ilike.%${brandName}%`)
        .gt('price', 0)
        .order('price', { ascending: true });

      if (error) throw error;
      return data || [];
    }

    // Handle "ofertas" category - get cheapest products with discounts
    if (category === 'ofertas') {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .gt('price', 0)
        .not('discount_percent', 'is', null)
        .order('price', { ascending: true });

      if (error) throw error;
      return data || [];
    }

    // Handle "ceras-selantes" - search in category field with ILIKE
    if (category === 'ceras-selantes') {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('category', '%ceras-selantes%')
        .gt('price', 0)
        .order('price', { ascending: true });

      if (error) throw error;
      return data || [];
    }

    // Handle "polimento" - most expensive first
    if (category === 'polimento') {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', 'polimento')
        .gt('price', 0)
        .order('price', { ascending: false });

      if (error) throw error;
      return data || [];
    }

    // Regular category query
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getByBrand(brand: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`brand.ilike.%${brand}%,name.ilike.%${brand}%`)
      .gt('price', 0)
      .order('price', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async searchProducts(query: string): Promise<Product[]> {
    // Split query into words for better matching
    const words = query.trim().toLowerCase().split(/\s+/).filter(w => w.length > 1);
    
    if (words.length === 0) return [];

    // Build search pattern
    const searchPattern = words.join('%');
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${searchPattern}%,description.ilike.%${searchPattern}%,brand.ilike.%${query}%,category.ilike.%${query}%`)
      .gt('price', 0)
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async deleteAll(): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (error) throw error;
  },

  async scrapeUrl(url: string): Promise<{ success: boolean; products_found?: number; error?: string }> {
    const { data: job, error: jobError } = await supabase
      .from('scrape_jobs')
      .insert({ url, status: 'pending' })
      .select()
      .single();

    if (jobError) throw jobError;

    const { data, error } = await supabase.functions.invoke('scrape-products', {
      body: { url, job_id: job.id },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return data;
  },

  async importCsvProducts(csvContent: string, category: string): Promise<{ success: boolean; products_found?: number; products_inserted?: number; error?: string }> {
    const { data, error } = await supabase.functions.invoke('import-csv-products', {
      body: { csvContent, category },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return data;
  },

  async getScrapeJobs(): Promise<ScrapeJob[]> {
    const { data, error } = await supabase
      .from('scrape_jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    return data || [];
  },

  async fixProductPrices(limit: number = 10): Promise<{ success: boolean; fixed?: number; processed?: number; error?: string }> {
    const { data, error } = await supabase.functions.invoke('fix-product-prices', {
      body: { limit },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Backward/forward compatibility: ensure `fixed` exists even if function returns `successCount`
    const anyData: any = data;
    if (anyData?.success && typeof anyData.fixed !== 'number' && typeof anyData.successCount === 'number') {
      return { ...anyData, fixed: anyData.successCount };
    }

    return anyData;
  },

  async syncDescriptions(limit: number = 10, force: boolean = false): Promise<{ 
    success: boolean; 
    processed?: number; 
    updated?: number; 
    errors?: string[]; 
    error?: string 
  }> {
    const { data, error } = await supabase.functions.invoke('sync-descriptions', {
      body: { limit, force },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return data;
  },

  async syncImages(limit: number = 1): Promise<{ 
    success: boolean; 
    processed?: number; 
    updated?: number; 
    errors?: number;
    results?: { id: string; name: string; image_url?: string; error?: string }[];
    error?: string 
  }> {
    const { data, error } = await supabase.functions.invoke('sync-images', {
      body: { limit },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return data;
  },
};