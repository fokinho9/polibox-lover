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

function parseCsvProducts(csvContent: string, category: string): ProductData[] {
  const products: ProductData[] = [];
  const lines = csvContent.split('\n');
  
  console.log(`Total lines in CSV: ${lines.length}`);
  
  // Detect CSV format by checking header
  const header = lines[0] || '';
  const isLavagemFormat = !header.includes('"product__price"'); // Lavagem format doesn't have "R$" column
  console.log(`CSV format detected: ${isLavagemFormat ? 'lavagem' : 'standard'}`);
  
  let i = 1; // Skip header
  let productCount = 0;
  const seenProducts = new Set<string>(); // Track duplicates by name
  
  while (i < lines.length) {
    const line = lines[i]?.trim();
    
    // Skip empty lines
    if (!line) {
      i++;
      continue;
    }
    
    // Check if this line starts a product (starts with a URL in quotes)
    if (line.startsWith('"https://www.polibox.com.br/')) {
      productCount++;
      
      // Join lines until we hit the next product or end
      let fullLine = line;
      let j = i + 1;
      
      // Keep adding lines until we find the closing of the JavaScript block
      while (j < lines.length) {
        const nextLine = lines[j]?.trim();
        if (!nextLine) {
          j++;
          continue;
        }
        // If this line starts a new product, stop
        if (nextLine.startsWith('"https://www.polibox.com.br/')) {
          break;
        }
        fullLine += '\n' + nextLine;
        j++;
      }
      
      // Now parse the full product line using regex to extract quoted fields
      const fieldMatches = fullLine.match(/"([^"]*(?:"""[^"]*)*)"/g);
      
      if (fieldMatches && fieldMatches.length >= 6) {
        // Remove quotes from each match
        const fields = fieldMatches.map(f => f.replace(/^"|"$/g, '').replace(/""/g, '"'));
        
        const sourceUrl = fields[0] || null;
        let imageUrl = fields[1] || null;
        
        // Validate image URL - must be a valid image URL
        if (imageUrl) {
          if (imageUrl.includes('loading.gif') || 
              imageUrl === '0' || 
              !imageUrl.startsWith('http')) {
            imageUrl = null;
          }
        }
        
        // Get product name - field[5] for both formats
        const name = fields[5]?.trim();
        
        // Skip if no name or too short
        if (!name || name.length < 3) {
          i = j;
          continue;
        }
        
        // Skip duplicates
        if (seenProducts.has(name)) {
          i = j;
          continue;
        }
        seenProducts.add(name);
        
        let price = 0;
        let pixPrice: number | null = null;
        
        if (isLavagemFormat) {
          // Lavagem format: field[6] = price, field[7] = pix integer, field[8] = pix decimal
          price = parsePrice(fields[6] || '0');
          const pixInt = fields[7]?.replace(/\./g, '').trim() || '';
          const pixDec = fields[8]?.replace(',', '').trim() || '00';
          if (pixInt) {
            pixPrice = parseFloat(`${pixInt}.${pixDec}`);
            if (isNaN(pixPrice)) pixPrice = null;
          }
        } else {
          // Standard format: field[6] = "R$", field[7] = price, field[8] = pix integer, field[10] = pix decimal
          if (fields[6] === 'R$') {
            price = parsePrice(fields[7] || '0');
            const pixInt = fields[8]?.replace(/\./g, '').trim() || '';
            const pixDec = fields[10]?.replace(',', '').trim() || '00';
            if (pixInt) {
              pixPrice = parseFloat(`${pixInt}.${pixDec}`);
              if (isNaN(pixPrice)) pixPrice = null;
            }
          } else {
            // Fallback: try to parse as lavagem format
            price = parsePrice(fields[6] || '0');
            const pixInt = fields[7]?.replace(/\./g, '').trim() || '';
            const pixDec = fields[8]?.replace(',', '').trim() || '00';
            if (pixInt) {
              pixPrice = parseFloat(`${pixInt}.${pixDec}`);
              if (isNaN(pixPrice)) pixPrice = null;
            }
          }
        }
        
        // Calculate discount
        let discountPercent = 5; // Default discount
        if (price > 0 && pixPrice && pixPrice < price) {
          discountPercent = Math.round(((price - pixPrice) / price) * 100);
        }
        
        // Estimate old price (10% higher)
        const oldPrice = price > 0 ? Math.round(price * 1.1 * 100) / 100 : null;
        
        console.log(`Product: ${name.substring(0, 50)}... | Image: ${imageUrl ? 'YES' : 'NO'} | Price: ${price}`);
        
        products.push({
          name,
          price,
          old_price: oldPrice,
          pix_price: pixPrice,
          discount_percent: discountPercent,
          image_url: imageUrl,
          source_url: sourceUrl,
          category,
          express_delivery: true,
        });
      }
      
      i = j;
    } else {
      i++;
    }
  }
  
  console.log(`Parsed ${products.length} unique products from ${productCount} product blocks`);
  console.log(`Products with images: ${products.filter(p => p.image_url).length}`);
  console.log(`Products without images: ${products.filter(p => !p.image_url).length}`);
  
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
    
    console.log(`Processing CSV for category: ${category}`);
    console.log(`CSV content length: ${csvContent.length} characters`);
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Parse CSV
    const products = parseCsvProducts(csvContent, category);
    
    console.log(`Found ${products.length} valid products`);
    
    if (products.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "No products found in CSV", debug: { csvLength: csvContent.length } }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Insert products in batches
    const batchSize = 100;
    let insertedCount = 0;
    let errors: string[] = [];
    
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('products')
        .insert(batch);
      
      if (error) {
        console.error('Batch insert error:', error);
        errors.push(`Batch ${Math.floor(i/batchSize)}: ${error.message}`);
      } else {
        insertedCount += batch.length;
        console.log(`Inserted batch ${Math.floor(i/batchSize) + 1}: ${batch.length} products`);
      }
    }
    
    const productsWithImages = products.filter(p => p.image_url).length;
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        products_found: products.length,
        products_inserted: insertedCount,
        products_with_images: productsWithImages,
        category,
        errors: errors.length > 0 ? errors : undefined,
        sample: products.slice(0, 3).map(p => ({ name: p.name, price: p.price, image_url: p.image_url }))
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
