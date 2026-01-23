/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { limit = 1 } = await req.json();

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

    // Get products without images that have source URLs
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, name, source_url')
      .is('image_url', null)
      .not('source_url', 'is', null)
      .limit(limit);

    if (fetchError) {
      console.error('Error fetching products:', fetchError);
      return new Response(
        JSON.stringify({ success: false, error: fetchError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!products || products.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No products without images found', processed: 0, updated: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${products.length} products without images`);

    const results: { id: string; name: string; image_url?: string; error?: string }[] = [];

    for (const product of products) {
      try {
        console.log(`Scraping image for: ${product.name}`);
        console.log(`URL: ${product.source_url}`);

        const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${firecrawlKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: product.source_url,
            formats: ['markdown'],
            onlyMainContent: true,
          }),
        });

        const scrapeData = await scrapeResponse.json();

        if (!scrapeResponse.ok || !scrapeData.success) {
          console.error(`Firecrawl error for ${product.name}:`, scrapeData.error);
          results.push({ id: product.id, name: product.name, error: scrapeData.error || 'Scrape failed' });
          continue;
        }

        const markdown = scrapeData.data?.markdown || '';
        
        // Extract image URL from markdown
        // Look for product images (usually the first image in the product page)
        const imgMatches = markdown.match(/!\[.*?\]\((https?:\/\/[^\s)]+\.(jpg|jpeg|png|webp|gif)[^\s)]*)\)/gi);
        
        let imageUrl: string | null = null;
        
        if (imgMatches && imgMatches.length > 0) {
          // Get the first image that looks like a product image
          for (const match of imgMatches) {
            const urlMatch = match.match(/\((https?:\/\/[^\s)]+)\)/);
            if (urlMatch) {
              const url = urlMatch[1];
              // Prefer polibox or cdn images
              if (url.includes('polibox') || url.includes('cdn') || url.includes('polishop')) {
                imageUrl = url;
                break;
              }
              // Fallback to first valid image
              if (!imageUrl) {
                imageUrl = url;
              }
            }
          }
        }

        // Also try to find image URLs in plain text
        if (!imageUrl) {
          const plainUrlMatch = markdown.match(/(https?:\/\/[^\s)]+\.(jpg|jpeg|png|webp|gif)[^\s)]*)/i);
          if (plainUrlMatch) {
            imageUrl = plainUrlMatch[1];
          }
        }

        if (imageUrl) {
          console.log(`Found image for ${product.name}: ${imageUrl}`);
          
          const { error: updateError } = await supabase
            .from('products')
            .update({ image_url: imageUrl })
            .eq('id', product.id);

          if (updateError) {
            console.error(`Error updating product ${product.name}:`, updateError);
            results.push({ id: product.id, name: product.name, error: updateError.message });
          } else {
            results.push({ id: product.id, name: product.name, image_url: imageUrl });
          }
        } else {
          console.log(`No image found for ${product.name}`);
          results.push({ id: product.id, name: product.name, error: 'No image found in page' });
        }

      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        console.error(`Error processing ${product.name}:`, errorMsg);
        results.push({ id: product.id, name: product.name, error: errorMsg });
      }
    }

    const updated = results.filter(r => r.image_url).length;
    const errors = results.filter(r => r.error).length;

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: products.length,
        updated,
        errors,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in sync-images:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
