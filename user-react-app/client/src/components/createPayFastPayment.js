const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// Configuration - move these to environment variables for security
const MERCHANT_ID = process.env.MERCHANT_ID || '10004002';
const MERCHANT_KEY = process.env.MERCHANT_KEY || 'q1cd2rdny4a53';
const RETURN_URL = process.env.RETURN_URL || 'https://yourdomain.com/return';
const CANCEL_URL = process.env.CANCEL_URL || 'https://yourdomain.com/cancel';

// Helper to generate the signature hash
function generateSignature(data) {
  const dataString = Object.keys(data)
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join('&');

  return crypto.createHash('md5').update(dataString).digest('hex');
}

app.post('/create-payfast-payment', (req, res) => {
  try {
    const { amount, item_name } = req.body;

    // Validate input
    if (!amount || !item_name) {
      return res.status(400).json({ error: 'Missing required parameters: amount and item_name.' });
    }

    // Prepare data for PayFast
    const pfData = {
      merchant_id: MERCHANT_ID,
      merchant_key: MERCHANT_KEY,
      amount: amount.toString(),
      item_name,
      return_url: RETURN_URL,
      cancel_url: CANCEL_URL,
      // Add other required fields if necessary
    };

    // Generate signature
    const signature = generateSignature(pfData);

    // Build the payment URL
    const baseUrl = 'https://www.payfast.co.za/eng/process';
    const queryString = Object.entries(pfData)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&');

    const paymentUrl = `${baseUrl}?${queryString}&signature=${signature}`;

    res.json({ paymentUrl });
  } catch (err) {
    console.error('Error creating PayFast payment:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});