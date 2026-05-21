import { serve } from 'https://deno.land/x/supabase_deno@0.1.0/mod.ts';

serve(async (req) => {
  try {
    // Parse request body
    const { paymentId } = await req.json();

    // Validate input
    if (!paymentId || typeof paymentId !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid or missing paymentId' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Your server-side logic here
    // For example: mark payment as processed in your database
    // await supabase
    //   .from('payment_history')
    //   .update({ status: 'Processed' })
    //   .eq('payment_id', paymentId);

    // Respond with success message
    return new Response(
      JSON.stringify({ message: 'Payment processed', paymentId }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    // Log error and respond with error message
    console.error('Error processing payment:', err);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});