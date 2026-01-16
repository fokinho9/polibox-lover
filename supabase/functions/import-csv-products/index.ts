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
  
  // Log the original price string for debugging
  console.log(`Parsing price: "${priceStr}"`);
  
  // Remove R$, spaces, "via", and other text
  let cleaned = priceStr
    .replace(/R\$\s*/gi, '')
    .replace(/via/gi, '')
    .replace(/\s+/g, '')
    .trim();
  
  // Handle Brazilian format: 1.234,56 -> 1234.56
  // First remove thousand separators (dots followed by 3 digits)
  cleaned = cleaned.replace(/\.(\d{3})/g, '$1');
  // Then replace comma with dot for decimal
  cleaned = cleaned.replace(',', '.');
  
  const num = parseFloat(cleaned);
  console.log(`Cleaned: "${cleaned}" -> ${num}`);
  
  return isNaN(num) ? 0 : num;
}

function detectCsvFormat(header: string): 'new' | 'lavagem' | 'standard' {
  const headerLower = header.toLowerCase();
  
  // New format: Nome,Preço,Preço Promocional,Descrição,URL,Imagem Selecionada
  if (headerLower.includes('nome') && headerLower.includes('preço') && headerLower.includes('imagem')) {
    return 'new';
  }
  
  // Standard format has "product__price" or "R$" column
  if (header.includes('"product__price"') || header.includes('"R$"')) {
    return 'standard';
  }
  
  return 'lavagem';
}

function parseNewFormatCsv(csvContent: string, category: string): ProductData[] {
  const products: ProductData[] = [];
  const lines = csvContent.split('\n');
  const seenProducts = new Set<string>();
  
  console.log(`Parsing NEW format CSV with ${lines.length} lines`);
  
  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]?.trim();
    if (!line) continue;
    
    // Parse CSV line considering quoted fields
    const fields: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    fields.push(current.trim()); // Last field
    
    // New format columns: Nome, Preço, Preço Promocional, Descrição, URL, Imagem Selecionada
    const name = fields[0]?.replace(/^"|"$/g, '').trim();
    const priceStr = fields[1]?.replace(/^"|"$/g, '').trim() || '0';
    const pixPriceStr = fields[2]?.replace(/^"|"$/g, '').trim() || '0';
    const sourceUrl = fields[4]?.replace(/^"|"$/g, '').replace(/\\/g, '').trim() || null;
    let imageUrl = fields[5]?.replace(/^"|"$/g, '').replace(/\\/g, '').trim() || null;
    
    // Skip if no name
    if (!name || name.length < 3) continue;
    
    // Skip duplicates
    if (seenProducts.has(name)) continue;
    seenProducts.add(name);
    
    // Validate image URL
    if (imageUrl) {
      if (imageUrl.includes('loading.gif') || 
          imageUrl === '0' || 
          !imageUrl.startsWith('http')) {
        imageUrl = null;
      }
    }
    
    const price = parsePrice(priceStr);
    const pixPrice = parsePrice(pixPriceStr);
    
    // Skip products with no price
    if (price === 0) continue;
    
    // Calculate discount
    let discountPercent = 5;
    if (price > 0 && pixPrice > 0 && pixPrice < price) {
      discountPercent = Math.round(((price - pixPrice) / price) * 100);
    }
    
    // Estimate old price (10% higher)
    const oldPrice = price > 0 ? Math.round(price * 1.1 * 100) / 100 : null;
    
    console.log(`Product: ${name.substring(0, 50)}... | Image: ${imageUrl ? 'YES' : 'NO'} | Price: ${price}`);
    
    products.push({
      name,
      price,
      old_price: oldPrice,
      pix_price: pixPrice > 0 ? pixPrice : null,
      discount_percent: discountPercent,
      image_url: imageUrl,
      source_url: sourceUrl,
      category,
      express_delivery: true,
    });
  }
  
  return products;
}

function parseLegacyCsv(csvContent: string, category: string, isLavagemFormat: boolean): ProductData[] {
  const products: ProductData[] = [];
  const lines = csvContent.split('\n');
  
  console.log(`Parsing LEGACY format CSV with ${lines.length} lines`);
  
  let i = 1; // Skip header
  let productCount = 0;
  const seenProducts = new Set<string>();
  
  while (i < lines.length) {
    const line = lines[i]?.trim();
    
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
      
      while (j < lines.length) {
        const nextLine = lines[j]?.trim();
        if (!nextLine) {
          j++;
          continue;
        }
        if (nextLine.startsWith('"https://www.polibox.com.br/')) {
          break;
        }
        fullLine += '\n' + nextLine;
        j++;
      }
      
      // Parse the full product line
      const fieldMatches = fullLine.match(/"([^"]*(?:"""[^"]*)*)"/g);
      
      if (fieldMatches && fieldMatches.length >= 6) {
        const fields = fieldMatches.map(f => f.replace(/^"|"$/g, '').replace(/""/g, '"'));
        
        const sourceUrl = fields[0] || null;
        let imageUrl = fields[1] || null;
        
        if (imageUrl) {
          if (imageUrl.includes('loading.gif') || 
              imageUrl === '0' || 
              !imageUrl.startsWith('http')) {
            imageUrl = null;
          }
        }
        
        const name = fields[5]?.trim();
        
        if (!name || name.length < 3) {
          i = j;
          continue;
        }
        
        if (seenProducts.has(name)) {
          i = j;
          continue;
        }
        seenProducts.add(name);
        
        let price = 0;
        let pixPrice: number | null = null;
        
        if (isLavagemFormat) {
          price = parsePrice(fields[6] || '0');
          const pixInt = fields[7]?.replace(/\./g, '').trim() || '';
          const pixDec = fields[8]?.replace(',', '').trim() || '00';
          if (pixInt) {
            pixPrice = parseFloat(`${pixInt}.${pixDec}`);
            if (isNaN(pixPrice)) pixPrice = null;
          }
        } else {
          if (fields[6] === 'R$') {
            price = parsePrice(fields[7] || '0');
            const pixInt = fields[8]?.replace(/\./g, '').trim() || '';
            const pixDec = fields[10]?.replace(',', '').trim() || '00';
            if (pixInt) {
              pixPrice = parseFloat(`${pixInt}.${pixDec}`);
              if (isNaN(pixPrice)) pixPrice = null;
            }
          } else {
            price = parsePrice(fields[6] || '0');
            const pixInt = fields[7]?.replace(/\./g, '').trim() || '';
            const pixDec = fields[8]?.replace(',', '').trim() || '00';
            if (pixInt) {
              pixPrice = parseFloat(`${pixInt}.${pixDec}`);
              if (isNaN(pixPrice)) pixPrice = null;
            }
          }
        }
        
        let discountPercent = 5;
        if (price > 0 && pixPrice && pixPrice < price) {
          discountPercent = Math.round(((price - pixPrice) / price) * 100);
        }
        
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
  
  return products;
}

function parseCsvProducts(csvContent: string, category: string): ProductData[] {
  const lines = csvContent.split('\n');
  console.log(`Total lines in CSV: ${lines.length}`);
  
  const header = lines[0] || '';
  const format = detectCsvFormat(header);
  console.log(`CSV format detected: ${format}`);
  
  let products: ProductData[];
  
  if (format === 'new') {
    products = parseNewFormatCsv(csvContent, category);
  } else {
    const isLavagemFormat = format === 'lavagem';
    products = parseLegacyCsv(csvContent, category, isLavagemFormat);
  }
  
  console.log(`Found ${products.length} valid products`);
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
    console.log(`First 500 chars: ${csvContent.substring(0, 500)}`);
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Parse CSV
    const products = parseCsvProducts(csvContent, category);
    
    if (products.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "No products found in CSV", debug: { csvLength: csvContent.length } }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Get all existing products to check for duplicates
    const productNames = products.map(p => p.name);
    const { data: existingProducts, error: fetchError } = await supabase
      .from('products')
      .select('id, name, category')
      .in('name', productNames);
    
    if (fetchError) {
      console.error('Error fetching existing products:', fetchError);
    }
    
    // Create a map of existing products by name
    const existingMap = new Map<string, { id: string; category: string | null }>();
    if (existingProducts) {
      for (const p of existingProducts) {
        existingMap.set(p.name, { id: p.id, category: p.category });
      }
    }
    
    // Separate new products from existing ones that need category update
    const newProducts: ProductData[] = [];
    const productsToUpdateCategory: { id: string; newCategory: string }[] = [];
    
    for (const product of products) {
      const existing = existingMap.get(product.name);
      
      if (existing) {
        // Product exists - check if we need to add the new category
        const currentCategories = existing.category ? existing.category.split(',').map(c => c.trim()) : [];
        
        if (!currentCategories.includes(category)) {
          // Add the new category to the existing ones
          const updatedCategory = [...currentCategories, category].join(', ');
          productsToUpdateCategory.push({ id: existing.id, newCategory: updatedCategory });
          console.log(`Product "${product.name.substring(0, 40)}..." already exists - adding category "${category}"`);
        } else {
          console.log(`Product "${product.name.substring(0, 40)}..." already has category "${category}" - skipping`);
        }
      } else {
        // New product - add to insert list
        newProducts.push(product);
      }
    }
    
    // Insert new products in batches
    const batchSize = 100;
    let insertedCount = 0;
    let updatedCount = 0;
    let errors: string[] = [];
    
    // Insert new products
    for (let i = 0; i < newProducts.length; i += batchSize) {
      const batch = newProducts.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('products')
        .insert(batch);
      
      if (error) {
        console.error('Batch insert error:', error);
        errors.push(`Insert batch ${Math.floor(i/batchSize)}: ${error.message}`);
      } else {
        insertedCount += batch.length;
        console.log(`Inserted batch ${Math.floor(i/batchSize) + 1}: ${batch.length} products`);
      }
    }
    
    // Update existing products with new category
    for (const update of productsToUpdateCategory) {
      const { error } = await supabase
        .from('products')
        .update({ category: update.newCategory })
        .eq('id', update.id);
      
      if (error) {
        console.error(`Error updating product ${update.id}:`, error);
        errors.push(`Update ${update.id}: ${error.message}`);
      } else {
        updatedCount++;
      }
    }
    
    const productsWithImages = newProducts.filter(p => p.image_url).length;
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        products_found: products.length,
        products_inserted: insertedCount,
        products_updated: updatedCount,
        products_with_images: productsWithImages,
        category,
        errors: errors.length > 0 ? errors : undefined,
        sample: newProducts.slice(0, 3).map(p => ({ name: p.name, price: p.price, image_url: p.image_url }))
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
