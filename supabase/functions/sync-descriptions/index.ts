/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Product {
  id: string;
  name: string;
  source_url: string | null;
  description: string | null;
}

function extractDescription(markdown: string): string | null {
  // Primary pattern: Look for "## Descrição Geral" section (Polibox format)
  const descricaoGeralMatch = markdown.match(/##\s*Descrição Geral\s*\n([\s\S]*?)(?=\n##\s|\n\* \* \*\s*\n##|\n---\s*\n##|$)/i);
  
  if (descricaoGeralMatch && descricaoGeralMatch[1]) {
    const desc = cleanDescription(descricaoGeralMatch[1]);
    if (desc.length > 50) {
      return desc;
    }
  }
  
  // Secondary patterns for other sites
  const descriptionPatterns = [
    /##\s*(?:Descrição|Sobre o produto)\s*\n([\s\S]*?)(?=\n##\s|$)/i,
    /(?:Descrição|DESCRIÇÃO)[:\s]*\n+([\s\S]*?)(?=\n(?:##|Características|Especificações|Avaliações|Itens Inclusos|\* \* \*|$))/i,
  ];
  
  for (const pattern of descriptionPatterns) {
    const match = markdown.match(pattern);
    if (match && match[1]) {
      const desc = cleanDescription(match[1]);
      if (desc.length > 50) {
        return desc;
      }
    }
  }
  
  return null;
}

function cleanDescription(text: string): string {
  return text
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Keep link text, remove URL
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1') // Remove bold/italic markers
    .replace(/^\s*[-*]\s+\[.*?\]\(.*?\)\s*$/gm, '') // Remove navigation links
    .replace(/^\s*\* \* \*\s*$/gm, '') // Remove horizontal rules
    .split('\n')
    .filter(line => {
      const trimmed = line.trim();
      // Filter out navigation, price, and CTA lines
      return trimmed.length > 0 &&
        !trimmed.match(/^(Comprar|Adicionar|Frete|Parcele|PIX|Calcular|Avise-me)/i) &&
        !trimmed.includes('R$') &&
        !trimmed.match(/^\d+x\s+de/i) &&
        !trimmed.match(/^https?:\/\//);
    })
    .join('\n')
    .trim()
    .substring(0, 2000);
}

function extractProductInfo(markdown: string): { description?: string; brand?: string } {
  const result: { description?: string; brand?: string } = {};
  
  // Extract description
  result.description = extractDescription(markdown) || undefined;
  
  // Extract brand
  const brandPatterns = [
    /(?:Marca|MARCA)[:\s]*([A-Za-z0-9]+)/i,
    /(?:Fabricante|FABRICANTE)[:\s]*([A-Za-z0-9]+)/i,
  ];
  
  for (const pattern of brandPatterns) {
    const match = markdown.match(pattern);
    if (match && match[1]) {
      result.brand = match[1].toUpperCase();
      break;
    }
  }
  
  return result;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { limit = 10, force = false } = await req.json().catch(() => ({}));

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

    // Get products that need descriptions
    let query = supabase
      .from('products')
      .select('id, name, source_url, description')
      .not('source_url', 'is', null)
      .limit(limit);
    
    // Only get products without descriptions unless force is true
    if (!force) {
      query = query.or('description.is.null,description.eq.""');
    }

    const { data: products, error: fetchError } = await query;

    if (fetchError) {
      console.error('Error fetching products:', fetchError);
      return new Response(
        JSON.stringify({ success: false, error: fetchError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!products || products.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No products need description updates',
          updated: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${products.length} products for description sync`);

    let updatedCount = 0;
    const errors: string[] = [];
    const results: { name: string; status: string }[] = [];

    for (const product of products) {
      if (!product.source_url) continue;

      try {
        console.log(`Scraping: ${product.name}`);

        // Scrape the product page
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
          const errorMsg = scrapeData.error || 'Failed to scrape';
          console.error(`Error scraping ${product.name}:`, errorMsg);
          errors.push(`${product.name}: ${errorMsg}`);
          results.push({ name: product.name, status: 'failed' });
          continue;
        }

        const markdown = scrapeData.data?.markdown || '';
        
        if (markdown.length < 100) {
          console.log(`No content found for ${product.name}`);
          results.push({ name: product.name, status: 'no_content' });
          continue;
        }

        // Extract product info from markdown
        const productInfo = extractProductInfo(markdown);

        if (productInfo.description) {
          // Update the product in database
          const updateData: Record<string, any> = {
            description: productInfo.description,
            updated_at: new Date().toISOString(),
          };

          if (productInfo.brand) {
            updateData.brand = productInfo.brand;
          }

          const { error: updateError } = await supabase
            .from('products')
            .update(updateData)
            .eq('id', product.id);

          if (updateError) {
            console.error(`Error updating ${product.name}:`, updateError);
            errors.push(`${product.name}: ${updateError.message}`);
            results.push({ name: product.name, status: 'update_failed' });
          } else {
            updatedCount++;
            results.push({ name: product.name, status: 'updated' });
            console.log(`Updated: ${product.name}`);
          }
        } else {
          results.push({ name: product.name, status: 'no_description_found' });
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error processing ${product.name}:`, errorMsg);
        errors.push(`${product.name}: ${errorMsg}`);
        results.push({ name: product.name, status: 'error' });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: products.length,
        updated: updatedCount,
        errors: errors.length > 0 ? errors : undefined,
        results: results.slice(0, 20) // Limit results in response
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in sync-descriptions:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});