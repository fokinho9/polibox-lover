import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ProductData {
  name: string;
  price: number;
  old_price: number | null;
  pix_price: number | null;
  discount_percent: number | null;
  image_url: string | null;
  source_url: string | null;
  category: string;
  express_delivery: boolean;
}

function parsePrice(priceStr: string): number {
  if (!priceStr) return 0;
  // Remove R$, spaces, and handle Brazilian format (1.234,56)
  const cleaned = priceStr.replace(/R\$\s*/g, '').replace(/\./g, '').replace(',', '.').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function parsePixPrice(intPart: string, decPart: string): number | null {
  if (!intPart) return null;
  const cleaned = intPart.replace(/\./g, '').trim();
  const decimal = decPart?.replace(',', '').trim() || '00';
  const num = parseFloat(`${cleaned}.${decimal}`);
  return isNaN(num) ? null : num;
}

function parseCsvProducts(csvContent: string, category: string): ProductData[] {
  const products: ProductData[] = [];
  const lines = csvContent.split('\n');
  
  // Skip header line
  let i = 1;
  
  while (i < lines.length) {
    const line = lines[i]?.trim();
    if (!line) {
      i++;
      continue;
    }
    
    // Check if this line starts a product (starts with a URL in quotes)
    if (line.startsWith('"https://')) {
      // Parse CSV line - handle quoted fields properly
      const fields: string[] = [];
      let field = '';
      let inQuotes = false;
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          fields.push(field);
          field = '';
        } else {
          field += char;
        }
      }
      fields.push(field); // Last field
      
      // Check if this is a product line (has enough fields)
      if (fields.length >= 6) {
        const sourceUrl = fields[0] || null;
        let imageUrl = fields[1] || null;
        
        // Skip loading.gif placeholder images
        if (imageUrl && imageUrl.includes('loading.gif')) {
          // Try to extract from source URL
          imageUrl = null;
        }
        
        const name = fields[5]?.trim();
        
        // Skip if no name
        if (!name) {
          i++;
          continue;
        }
        
        // Parse prices based on CSV structure
        // For lavagem.csv format: fields[6]=price, fields[7]=pix_int, fields[8]=pix_dec
        // For others: fields[7]=price, fields[8]=pix_int, fields[10]=pix_dec
        
        let price: number;
        let pixPrice: number | null;
        
        // Check if this is lavagem format (fewer columns, no "R$" field)
        if (fields.length < 15) {
          // Lavagem format
          price = parsePrice(fields[6] || '0');
          pixPrice = parsePixPrice(fields[7], fields[8]);
        } else {
          // Standard format with R$ field
          price = parsePrice(fields[7] || '0');
          pixPrice = parsePixPrice(fields[8], fields[10]);
        }
        
        // Calculate discount
        let discountPercent: number | null = null;
        if (price > 0 && pixPrice && pixPrice < price) {
          discountPercent = Math.round(((price - pixPrice) / price) * 100);
        }
        
        products.push({
          name,
          price,
          old_price: price > 0 ? price * 1.1 : null, // Estimate old price
          pix_price: pixPrice,
          discount_percent: discountPercent || 5,
          image_url: imageUrl,
          source_url: sourceUrl,
          category,
          express_delivery: true,
        });
      }
      
      // Skip to next product (products span multiple lines in this format)
      // Look for next line starting with "https://
      i++;
      while (i < lines.length && !lines[i]?.trim().startsWith('"https://')) {
        i++;
      }
    } else {
      i++;
    }
  }
  
  return products;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { csvContent, category } = await req.json();
    
    if (!csvContent || !category) {
      return new Response(
        JSON.stringify({ success: false, error: "CSV content and category are required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Parse CSV
    const products = parseCsvProducts(csvContent, category);
    
    if (products.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "No products found in CSV" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Insert products in batches
    const batchSize = 50;
    let insertedCount = 0;
    
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('products')
        .insert(batch);
      
      if (error) {
        console.error('Batch insert error:', error);
      } else {
        insertedCount += batch.length;
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        products_found: products.length,
        products_inserted: insertedCount,
        category,
        sample: products.slice(0, 3)
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
