/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProductData {
  name: string;
  price: number;
  old_price?: number;
  pix_price?: number;
  discount_percent?: number;
  description?: string;
  image_url?: string;
  category?: string;
  source_url?: string;
}

function extractProducts(markdown: string, sourceUrl: string): ProductData[] {
  const products: ProductData[] = [];
  const lines = markdown.split('\n');
  
  let currentProduct: Partial<ProductData> | null = null;
  
  for (const line of lines) {
    // Match product names (### headers or bold text with product-like content)
    const productNameMatch = line.match(/###\s*\[(.+?)\]/);
    if (productNameMatch) {
      if (currentProduct && currentProduct.name) {
        products.push(currentProduct as ProductData);
      }
      currentProduct = {
        name: productNameMatch[1].trim(),
        price: 0,
        source_url: sourceUrl,
      };
      continue;
    }

    // Match prices in R$ format
    const priceMatch = line.match(/R\$\s*([\d.,]+)/g);
    if (priceMatch && currentProduct) {
      const prices = priceMatch.map(p => {
        const num = p.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
        return parseFloat(num);
      }).filter(n => !isNaN(n));
      
      if (prices.length >= 1 && !currentProduct.price) {
        currentProduct.price = prices[0];
      }
      if (prices.length >= 2 && !currentProduct.pix_price) {
        currentProduct.pix_price = prices[prices.length - 1];
      }
    }

    // Match discount percentage
    const discountMatch = line.match(/-(\d+)%/);
    if (discountMatch && currentProduct) {
      currentProduct.discount_percent = parseInt(discountMatch[1]);
    }

    // Match "De:" price (old price)
    if (line.includes('De:') && currentProduct) {
      const oldPriceMatch = line.match(/R\$\s*([\d.,]+)/);
      if (oldPriceMatch) {
        currentProduct.old_price = parseFloat(
          oldPriceMatch[1].replace(/\./g, '').replace(',', '.')
        );
      }
    }

    // Match image URLs
    const imgMatch = line.match(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/);
    if (imgMatch && currentProduct && !currentProduct.image_url) {
      currentProduct.image_url = imgMatch[1];
    }
  }

  // Don't forget the last product
  if (currentProduct && currentProduct.name) {
    products.push(currentProduct as ProductData);
  }

  // Filter out products with zero or invalid prices
  return products.filter(p => p.name && p.name.length > 5);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, job_id } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlKey) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update job status to processing
    if (job_id) {
      await supabase
        .from('scrape_jobs')
        .update({ status: 'processing' })
        .eq('id', job_id);
    }

    console.log('Scraping URL:', url);

    // Call Firecrawl to scrape the page
    const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        formats: ['markdown'],
        onlyMainContent: true,
      }),
    });

    const scrapeData = await scrapeResponse.json();

    if (!scrapeResponse.ok || !scrapeData.success) {
      const errorMsg = scrapeData.error || 'Failed to scrape page';
      console.error('Firecrawl error:', errorMsg);
      
      if (job_id) {
        await supabase
          .from('scrape_jobs')
          .update({ status: 'failed', error_message: errorMsg })
          .eq('id', job_id);
      }
      
      return new Response(
        JSON.stringify({ success: false, error: errorMsg }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const markdown = scrapeData.data?.markdown || '';
    console.log('Scraped markdown length:', markdown.length);

    // Extract products from markdown
    const products = extractProducts(markdown, url);
    console.log('Extracted products:', products.length);

    // Insert products into database
    if (products.length > 0) {
      const { error: insertError } = await supabase
        .from('products')
        .insert(products);

      if (insertError) {
        console.error('Insert error:', insertError);
      }
    }

    // Update job status
    if (job_id) {
      await supabase
        .from('scrape_jobs')
        .update({ 
          status: 'completed', 
          products_found: products.length,
          completed_at: new Date().toISOString()
        })
        .eq('id', job_id);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        products_found: products.length,
        products: products.slice(0, 5) // Return first 5 as preview
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in scrape-products:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});