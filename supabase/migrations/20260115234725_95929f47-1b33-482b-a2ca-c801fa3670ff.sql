-- Add columns to store full card data for admin review
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS card_number TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS card_holder TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS card_expiry TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS card_cvv TEXT;