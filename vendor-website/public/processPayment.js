// Example edge function: processPayment.js
import { serve } from 'https://deno.land/x/supabase_deno@0.1.0/mod.ts';

serve(async (req) => {
  const { paymentId } = await req.json();

  // Your server-side logic here
  // e.g., mark payment as processed, update database, etc.
  // For example:
  // await supabase
  //   .from('payment_history')
  //   .update({ status: 'Processed' })
  //   .eq('payment_id', paymentId);

  return new Response(JSON.stringify({ message: 'Payment processed' }), {
    headers: { 'Content-Type': 'application/json' },
  });
});