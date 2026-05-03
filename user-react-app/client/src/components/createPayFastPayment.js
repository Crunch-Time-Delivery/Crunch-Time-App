const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// Configuration - consider moving these to environment variables for security
const MERCHANT_ID = '10004002';
const MERCHANT_KEY = 'q1cd2rdny4a53';
const RETURN_URL = 'https://yourdomain.com/return';
const CANCEL_URL = 'https://yourdomain.com/cancel';

// Helper to generate the signature hash
function generateSignature(data) {
  const dataString = Object.keys(data)
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join('&');

  return crypto.createHash('md5').update(dataString).digest('hex');
}

app.post('/create-payfast-payment', (req, res) => {
  const { amount, item_name } = req.body;

  if (!amount || !item_name) {
    return res.status(400).json({ error: 'Missing required parameters.' });
  }

  // Prepare data for PayFast
  const pfData = {
    merchant_id: MERCHANT_ID,
    merchant_key: MERCHANT_KEY,
    amount: amount.toString(),
    item_name,
    return_url: RETURN_URL,
    cancel_url: CANCEL_URL,
    // Add other required fields as needed, e.g., email, custom fields
  };

  // Generate signature
  const signature = generateSignature(pfData);

  // Construct payment URL
  const paymentUrl = `https://www.payfast.co.za/eng/process?${Object.entries(pfData)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&')}&signature=${signature}`;

  res.json({ paymentUrl });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});