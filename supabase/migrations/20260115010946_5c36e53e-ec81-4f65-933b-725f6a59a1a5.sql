-- Create orders table to track all orders and payments
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_cpf TEXT NOT NULL,
  shipping_cep TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_number TEXT NOT NULL,
  shipping_complement TEXT,
  shipping_neighborhood TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_state TEXT,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  shipping_cost NUMERIC NOT NULL DEFAULT 0,
  discount NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL,
  payment_method TEXT NOT NULL, -- 'pix', 'card', 'boleto'
  payment_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'analyzing', 'paid', 'failed', 'refunded'
  streetpay_transaction_id TEXT,
  pix_qrcode TEXT,
  pix_expiration TIMESTAMP WITH TIME ZONE,
  card_last_digits TEXT,
  card_brand TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Anyone can create orders (for checkout)
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (true);

-- Anyone can view orders (for confirmation page) - in production you'd want to restrict this
CREATE POLICY "Anyone can view orders" ON public.orders FOR SELECT USING (true);

-- Anyone can update orders (for webhook) - in production you'd want to restrict this
CREATE POLICY "Anyone can update orders" ON public.orders FOR UPDATE USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();