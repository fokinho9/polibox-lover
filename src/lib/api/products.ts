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
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

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
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (error) throw error;
  },

  async scrapeUrl(url: string): Promise<{ success: boolean; products_found?: number; error?: string }> {
    // Create a scrape job
    const { data: job, error: jobError } = await supabase
      .from('scrape_jobs')
      .insert({ url, status: 'pending' })
      .select()
      .single();

    if (jobError) throw jobError;

    // Call edge function to scrape
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

  async fixProductPrices(): Promise<{ success: boolean; fixed?: number; error?: string }> {
    const { data, error } = await supabase.functions.invoke('fix-product-prices', {
      body: {},
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return data;
  },
};
