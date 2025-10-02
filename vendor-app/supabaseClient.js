const express = require('express');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY; // Make sure this is set securely
const supabase = createClient(supabaseUrl, supabaseKey);

app.post('/create-payfast-payment', async (req, res) => {
  const { amount, item_name } = req.body;

  // Generate the necessary data for PayFast
  const merchant_id = 'YOUR_MERCHANT_ID';
  const merchant_key = 'YOUR_MERCHANT_KEY';
  const return_url = 'https://yourdomain.com/return';
  const cancel_url = 'https://yourdomain.com/cancel';

  const pfData = {
    merchant_id,
    merchant_key,
    amount,
    item_name,
    return_url,
    cancel_url,
    // Add other required fields
  };

  // Create the string to hash
  const dataString = Object.keys(pfData)
    .sort()
    .map((key) => `${key}=${pfData[key]}`)
    .join('&');

  const signature = crypto.createHash('md5').update(dataString).digest('hex');

  // Generate the payment URL
  const paymentUrl = `https://www.payfast.co.za/eng/process?${Object.entries(pfData).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')}&signature=${signature}`;

  // Save the payment record in Supabase
  const { data: paymentRecord, error } = await supabase
    .from('payments')
    .insert([
      {
        amount,
        item_name,
        payment_url: paymentUrl,
        status: 'Pending',
        created_at: new Date(),
      },
    ]);

  if (error) {
    console.error('Error saving payment record:', error);
    return res.status(500).json({ error: 'Failed to create payment record' });
  }

  // Return the payment URL to the client
  res.json({ paymentUrl });
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});