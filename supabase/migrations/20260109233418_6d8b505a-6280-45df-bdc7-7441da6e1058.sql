-- Create products table
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    old_price DECIMAL(10, 2),
    pix_price DECIMAL(10, 2),
    discount_percent INTEGER,
    category TEXT,
    image_url TEXT,
    additional_images TEXT[],
    stock_status TEXT DEFAULT 'in_stock',
    brand TEXT,
    express_delivery BOOLEAN DEFAULT true,
    installments_count INTEGER,
    installments_value DECIMAL(10, 2),
    source_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public read access for products (anyone can view)
CREATE POLICY "Anyone can view products"
ON public.products
FOR SELECT
USING (true);

-- Create categories table
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
ON public.categories
FOR SELECT
USING (true);

-- Create scrape_jobs table to track scraping tasks
CREATE TABLE public.scrape_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    products_found INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.scrape_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view scrape jobs"
ON public.scrape_jobs
FOR SELECT
USING (true);

CREATE POLICY "Anyone can create scrape jobs"
ON public.scrape_jobs
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update scrape jobs"
ON public.scrape_jobs
FOR UPDATE
USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for products
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial categories
INSERT INTO public.categories (name, slug, icon) VALUES
    ('Lavagem', 'lavagem', 'droplets'),
    ('Polimento', 'polimento', 'sparkles'),
    ('Interior', 'interior', 'car'),
    ('Equipamentos', 'equipamentos', 'wrench'),
    ('Kits', 'kits', 'package'),
    ('Ceras e Selantes', 'ceras-selantes', 'circle');

-- Admin insert/update/delete policies for products (will add auth later if needed)
CREATE POLICY "Anyone can insert products"
ON public.products
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update products"
ON public.products
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete products"
ON public.products
FOR DELETE
USING (true);