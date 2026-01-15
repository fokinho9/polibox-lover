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
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    const payload = await req.json();

    console.log('StreetPay webhook received:', JSON.stringify(payload));

    // Extract transaction data from webhook
    const transactionId = payload.data?.id || payload.id;
    const status = payload.data?.status || payload.status;
    const orderId = payload.data?.metadata?.orderId || payload.metadata?.orderId;

    if (!transactionId && !orderId) {
      console.error('No transaction ID or order ID in webhook payload');
      return new Response(
        JSON.stringify({ success: false, error: 'Missing transaction or order ID' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Map StreetPay status to our status
    let paymentStatus = 'pending';
    if (status === 'paid' || status === 'approved') {
      paymentStatus = 'paid';
    } else if (status === 'failed' || status === 'refused' || status === 'canceled') {
      paymentStatus = 'failed';
    } else if (status === 'refunded') {
      paymentStatus = 'refunded';
    } else if (status === 'pending' || status === 'processing') {
      paymentStatus = 'pending';
    }

    console.log(`Updating order status to: ${paymentStatus}`);

    // Update order by transaction ID or order ID
    let query = supabase.from('orders').update({ payment_status: paymentStatus });
    
    if (orderId) {
      query = query.eq('id', orderId);
    } else {
      query = query.eq('streetpay_transaction_id', transactionId);
    }

    const { error: updateError, data: updateData } = await query.select();

    if (updateError) {
      console.error('Error updating order:', updateError);
      throw updateError;
    }

    console.log('Order updated:', updateData);

    return new Response(
      JSON.stringify({ success: true, status: paymentStatus }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
