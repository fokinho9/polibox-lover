import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProductToFix {
  id: string;
  name: string;
  source_url: string | null;
}

function parsePrice(priceStr: string): number | null {
  if (!priceStr) return null;
  
  // Clean the price string
  let cleaned = priceStr
    .replace(/R\$\s*/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Find price pattern (Brazilian format: 1.234,56 or 1234,56)
  const priceMatch = cleaned.match(/(\d{1,3}(?:\.\d{3})*(?:,\d{2})?|\d+(?:,\d{2})?)/);
  if (!priceMatch) return null;
  
  let priceValue = priceMatch[1];
  // Convert Brazilian format to standard: 1.234,56 -> 1234.56
  priceValue = priceValue.replace(/\./g, '').replace(',', '.');
  
  const parsed = parseFloat(priceValue);
  return isNaN(parsed) ? null : parsed;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!firecrawlApiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Supabase credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get products without price
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, name, source_url')
      .eq('price', 0)
      .not('source_url', 'is', null);

    if (fetchError) {
      console.error('Error fetching products:', fetchError);
      return new Response(
        JSON.stringify({ success: false, error: fetchError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${products?.length || 0} products without price`);

    const results: { id: string; name: string; oldPrice: number; newPrice: number | null; status: string }[] = [];
    const uniqueProducts = new Map<string, ProductToFix>();
    
    // Deduplicate by source_url
    for (const product of products || []) {
      if (product.source_url && !uniqueProducts.has(product.source_url)) {
        uniqueProducts.set(product.source_url, product);
      }
    }

    console.log(`Processing ${uniqueProducts.size} unique URLs`);

    for (const [sourceUrl, product] of uniqueProducts) {
      try {
        console.log(`Scraping: ${sourceUrl}`);
        
        // Scrape the product page
        const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${firecrawlApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: sourceUrl,
            formats: ['markdown'],
            onlyMainContent: true,
          }),
        });

        if (!scrapeResponse.ok) {
          console.error(`Failed to scrape ${sourceUrl}: ${scrapeResponse.status}`);
          results.push({ 
            id: product.id, 
            name: product.name, 
            oldPrice: 0, 
            newPrice: null, 
            status: `Scrape failed: ${scrapeResponse.status}` 
          });
          continue;
        }

        const scrapeData = await scrapeResponse.json();
        const markdown = scrapeData.data?.markdown || scrapeData.markdown || '';
        
        console.log(`Markdown length: ${markdown.length}`);

        // Check if product is out of stock
        const isOutOfStock = /esgotado|indisponível|fora de estoque|out of stock|sem estoque/i.test(markdown);
        
        if (isOutOfStock) {
          console.log(`Product is out of stock: ${product.name}`);
          
          // Update product as esgotado
          const { error: updateError } = await supabase
            .from('products')
            .update({ stock_status: 'esgotado' })
            .eq('source_url', sourceUrl);

          if (updateError) {
            console.error(`Error updating stock status: ${updateError.message}`);
          }
          
          results.push({ 
            id: product.id, 
            name: product.name, 
            oldPrice: 0, 
            newPrice: null, 
            status: 'marked_as_esgotado' 
          });
          continue;
        }

        // Try to find price patterns in the markdown
        // Look for PIX price first (usually the lowest), then regular price
        let price: number | null = null;
        let pixPrice: number | null = null;
        let oldPrice: number | null = null;

        // Pattern for PIX price (usually marked with "no pix", "via pix", etc)
        const pixMatch = markdown.match(/(?:no\s*pix|via\s*pix|pix)[:\s]*R?\$?\s*([\d.,]+)/i);
        if (pixMatch) {
          pixPrice = parsePrice(pixMatch[1]);
          console.log(`Found PIX price: ${pixPrice}`);
        }

        // Pattern for regular price - look for "por R$" or just "R$" followed by price
        const pricePatterns = [
          /por\s*R?\$\s*([\d.,]+)/gi,
          /preço[:\s]*R?\$\s*([\d.,]+)/gi,
          /R\$\s*([\d.,]+)/gi,
        ];

        for (const pattern of pricePatterns) {
          const matches = [...markdown.matchAll(pattern)];
          for (const match of matches) {
            const parsedPrice = parsePrice(match[1]);
            if (parsedPrice && parsedPrice > 0) {
              if (!price || parsedPrice < price) {
                price = parsedPrice;
              }
            }
          }
        }

        // Look for old price (strikethrough or "de R$")
        const oldPriceMatch = markdown.match(/(?:de|era|antes)[:\s]*R?\$?\s*([\d.,]+)/i);
        if (oldPriceMatch) {
          oldPrice = parsePrice(oldPriceMatch[1]);
        }

        console.log(`Parsed prices - Price: ${price}, PIX: ${pixPrice}, Old: ${oldPrice}`);

        // Use PIX price as the main price if available, otherwise use regular price
        const finalPrice = price || pixPrice;

        if (finalPrice && finalPrice > 0) {
          // Update all products with this source_url
          const { error: updateError } = await supabase
            .from('products')
            .update({ 
              price: finalPrice,
              pix_price: pixPrice,
              old_price: oldPrice,
              stock_status: 'in_stock',
            })
            .eq('source_url', sourceUrl);

          if (updateError) {
            console.error(`Error updating product: ${updateError.message}`);
            results.push({ 
              id: product.id, 
              name: product.name, 
              oldPrice: 0, 
              newPrice: finalPrice, 
              status: `Update failed: ${updateError.message}` 
            });
          } else {
            results.push({ 
              id: product.id, 
              name: product.name, 
              oldPrice: 0, 
              newPrice: finalPrice, 
              status: 'success' 
            });
          }
        } else {
          results.push({ 
            id: product.id, 
            name: product.name, 
            oldPrice: 0, 
            newPrice: null, 
            status: 'No price found in page' 
          });
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error processing ${product.name}:`, error);
        results.push({ 
          id: product.id, 
          name: product.name, 
          oldPrice: 0, 
          newPrice: null, 
          status: `Error: ${error instanceof Error ? error.message : 'Unknown'}` 
        });
      }
    }

    const successCount = results.filter(r => r.status === 'success').length;
    const failCount = results.filter(r => r.status !== 'success').length;

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: results.length,
        successCount,
        failCount,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in fix-product-prices:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
