import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface CreatePixPaymentRequest {
  orderId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    cpf: string;
  };
  items: OrderItem[];
  total: number; // in BRL (e.g., 99.90)
}

// Generate random product names to avoid exposing real product info
function generateRandomProductName(): string {
  const adjectives = ['Premium', 'Profissional', 'Especial', 'Super', 'Ultra', 'Max', 'Pro', 'Elite'];
  const products = ['Kit', 'Conjunto', 'Pacote', 'Combo', 'Item', 'Produto', 'Serviço', 'Material'];
  const codes = ['A1', 'B2', 'C3', 'D4', 'E5', 'F6', 'G7', 'H8', 'I9', 'J0'];
  
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const prod = products[Math.floor(Math.random() * products.length)];
  const code = codes[Math.floor(Math.random() * codes.length)];
  
  return `${adj} ${prod} ${code}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const publicKey = Deno.env.get('STREETPAY_PUBLIC_KEY');
    const secretKey = Deno.env.get('STREETPAY_SECRET_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!publicKey || !secretKey) {
      throw new Error('StreetPay API keys not configured');
    }

    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    const { orderId, customer, items, total }: CreatePixPaymentRequest = await req.json();

    // Create Basic Auth header
    const credentials = btoa(`${publicKey}:${secretKey}`);
    
    // Convert items to StreetPay format with random names
    const streetPayItems = items.map((item, index) => ({
      title: generateRandomProductName(),
      unitPrice: Math.round(item.price * 100), // Convert to cents
      quantity: item.quantity,
    }));

    // Calculate total in cents
    const amountInCents = Math.round(total * 100);

    // Format phone number (remove non-digits)
    const phoneDigits = customer.phone.replace(/\D/g, '');

    // Build postback URL
    const postbackUrl = `${supabaseUrl}/functions/v1/streetpay-webhook`;

    const payload = {
      amount: amountInCents,
      paymentMethod: 'pix',
      customer: {
        name: customer.name,
        email: customer.email,
        phone: phoneDigits,
        document: {
          type: 'cpf',
          number: customer.cpf.replace(/\D/g, ''),
        },
      },
      items: streetPayItems,
      postbackUrl,
      metadata: {
        orderId,
      },
    };

    console.log('Creating StreetPay PIX payment:', JSON.stringify(payload));

    const response = await fetch('https://api.streetpayments.com.br/v1/transactions', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    console.log('StreetPay response:', JSON.stringify(data));

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Failed to create PIX payment');
    }

    // Extract PIX data
    const pixQrcode = data.data?.pix?.qrcode || data.pix?.qrcode;
    const transactionId = data.data?.id || data.id;

    if (!pixQrcode) {
      throw new Error('PIX QR Code not returned from StreetPay');
    }

    // Update order with StreetPay data
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        streetpay_transaction_id: transactionId,
        pix_qrcode: pixQrcode,
        pix_expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min expiration
        payment_status: 'pending',
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Error updating order:', updateError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        transactionId,
        pixQrcode,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating PIX payment:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
