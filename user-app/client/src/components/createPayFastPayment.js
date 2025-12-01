// server.js
const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

app.post('/create-payfast-payment.js', (req, res) => {
  const { amount, item_name } = req.body;

  // Generate the necessary data for PayFast

  
  const merchant_id = '10004002 ';
  const merchant_key = 'q1cd2rdny4a53';
  const return_url = 'https://yourdomain.com/return';
  const cancel_url = 'https://yourdomain.com/cancel';

  const data = {
    merchant_id,
    merchant_key,
    amount,
    item_name,
    return_url,
    cancel_url,
    // Add other required fields
  };

  // Generate a signature hash as per PayFast requirements
  const pfData = {
    merchant_id,
    merchant_key,
    amount,
    item_name,
    // other fields...
  };

  // Create the string to hash
  const dataString = Object.keys(pfData)
    .sort()
    .map((key) => `${key}=${pfData[key]}`)
    .join('&');

  const signature = crypto.createHash('md5').update(dataString).digest('hex');

  // Generate the payment URL (simplified)
  const paymentUrl = `https://www.payfast.co.za/eng/process?${Object.entries(pfData).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')}&signature=${signature}`;

  res.json({ paymentUrl });
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});