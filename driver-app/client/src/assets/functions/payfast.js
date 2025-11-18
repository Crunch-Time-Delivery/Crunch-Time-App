// payfast.js

const express = require('express');
const axios = require('axios');
const crypto = require('crypto');

const router = express.Router();

// PayFast configuration - replace with your actual details
const PAYFAST_MERCHANT_ID = 'your-merchant-id';
const PAYFAST_MERCHANT_KEY = 'your-merchant-key';
const PAYFAST_PASS_PHRASE = 'your-passphrase'; // Optional
const PAYFAST_SANDBOX = true; // Set to false for production

// Generate PayFast payment URL
function generatePayFastUrl(data) {
  const baseUrl = PAYFAST_SANDBOX
    ? 'https://sandbox.payfast.co.za/eng/process'
    : 'https://www.payfast.co.za/eng/process';

  const queryString = Object.keys(data)
    .map(key => `${key}=${encodeURIComponent(data[key])}`)
    .join('&');

  return `${baseUrl}?${queryString}`;
}

// Generate signature for PayFast
function generateSignature(data) {
  const stringToSign = Object.keys(data)
    .sort()
    .map(key => `${key}=${data[key]}`)
    .join('&');

  const hash = crypto.createHash('md5').update(stringToSign).digest('hex');
  return hash;
}

// Route to create a payment request
router.post('/pay', async (req, res) => {
  const { amount, itemName, itemDescription, customStr1 } = req.body;

  // Basic validation
  if (!amount || !itemName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Prepare data for PayFast
  const data = {
    merchant_id: PAYFAST_MERCHANT_ID,
    merchant_key: PAYFAST_MERCHANT_KEY,
    return_url: 'https://yourdomain.com/payfast/return', // Your return URL
    cancel_url: 'https://yourdomain.com/payfast/cancel', // Your cancel URL
    notify_url: 'https://yourdomain.com/payfast/notify', // Your notify URL
    amount: amount.toString(),
    item_name: itemName,
    item_description: itemDescription || '',
    custom_str1: customStr1 || '', // Optional custom data
    // Additional required fields...
  };

  // Generate signature
  data['signature'] = generateSignature(data);

  // Send user to PayFast payment page
  const paymentUrl = generatePayFastUrl(data);
  res.json({ paymentUrl });
});

// Webhook endpoint for PayFast notifications
router.post('/notify', async (req, res) => {
  const data = req.body;

  // Verify signature
  const receivedSignature = data['signature'];
  delete data['signature'];
  const expectedSignature = generateSignature(data);

  if (receivedSignature !== expectedSignature) {
    return res.status(400).send('Invalid signature');
  }

  // Process payment status
  const paymentStatus = data['payment_status'];
  const customStr1 = data['custom_str1']; // Your custom data, e.g., driver ID

  if (paymentStatus === 'COMPLETE') {
    // Update driver income, mark as paid, etc.
    // Your logic here...

    res.status(200).send('Payment verified and processed');
  } else {
    // Handle other statuses
    res.status(200).send('Payment not completed');
  }
});

module.exports = router;