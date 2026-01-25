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
    const publicKey = Deno.env.get('STREETPAY_PUBLIC_KEY');
    const secretKey = Deno.env.get('STREETPAY_SECRET_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!publicKey || !secretKey) {
      throw new Error('StreetPay API keys not configured');
    }

    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    const { orderId } = await req.json();

    if (!orderId) {
      throw new Error('Order ID is required');
    }

    // Get order from database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      throw new Error('Order not found');
    }

    // If no transaction ID, return current status
    if (!order.streetpay_transaction_id) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          status: order.payment_status,
          order 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check payment status with StreetPay
    const credentials = btoa(`${publicKey}:${secretKey}`);
    
    const response = await fetch(
      `https://api.streetpayments.com.br/v1/transactions/${order.streetpay_transaction_id}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    console.log('StreetPay status check:', JSON.stringify(data));

    if (!response.ok) {
      // Return current DB status if API fails
      return new Response(
        JSON.stringify({ 
          success: true, 
          status: order.payment_status,
          order 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get status from response
    const streetPayStatus = data.data?.status || data.status;
    
    // Map StreetPay status to our status
    let paymentStatus = order.payment_status;
    if (streetPayStatus === 'paid' || streetPayStatus === 'approved') {
      paymentStatus = 'paid';
    } else if (streetPayStatus === 'failed' || streetPayStatus === 'refused' || streetPayStatus === 'canceled') {
      paymentStatus = 'failed';
    } else if (streetPayStatus === 'refunded') {
      paymentStatus = 'refunded';
    }

    // Update order if status changed
    if (paymentStatus !== order.payment_status) {
      await supabase
        .from('orders')
        .update({ payment_status: paymentStatus })
        .eq('id', orderId);
      
      console.log(`Order ${orderId} status updated to: ${paymentStatus}`);
    }

    // Refetch updated order
    const { data: updatedOrder } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    return new Response(
      JSON.stringify({ 
        success: true, 
        status: paymentStatus,
        order: updatedOrder || order
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error checking payment status:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
