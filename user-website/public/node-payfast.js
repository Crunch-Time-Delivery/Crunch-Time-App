// server.js (Node.js/Express example)
const express = require('express');
const { PayFast } = require('node-payfast');
require('dotenv').config(); // Load environment variables

const app = express();
app.use(express.json()); // Parse JSON request bodies

// Initialize PayFast with environment variables
const pf = new PayFast({
  sandbox: true, // Set to false in production
  merchant_id: process.env.MERCHANT_ID,
  merchant_key: process.env.MERCHANT_KEY,
  passphrase: process.env.PASSPHRASE, // Optional but recommended
});

// Endpoint to create payment UUID
app.post('/create-payment-uuid', async (req, res) => {
  const paymentData = req.body;

  // Basic validation of required fields
  if (
    !paymentData ||
    typeof paymentData !== 'object' ||
    !paymentData.merchant_reference ||
    !paymentData.amount ||
    !paymentData.item_name ||
    !paymentData.return_url ||
    !paymentData.notify_url
  ) {
    return res.status(400).json({ error: 'Missing required payment data fields.' });
  }

  try {
    const paymentUrl = await pf.generatePaymentUrl(paymentData);
    // Extract UUID from URL (assuming last segment)
    const uuid = paymentUrl.split('/').pop();
    res.json({ uuid });
  } catch (error) {
    console.error('Error generating payment URL:', error);
    res.status(500).json({ error: 'Failed to create payment.' });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});