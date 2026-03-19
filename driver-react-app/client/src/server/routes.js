// routes.js
const express = require('express');
const crypto = require('crypto');
const config = require('../../../config');

const router = express.Router();

router.post('/create-payfast-payment', (req, res) => {
  const { amount, item_name } = req.body;

  const pfData = {
    merchant_id: config.merchantId,
    merchant_key: config.merchantKey,
    amount,
    item_name,
    return_url: config.returnUrl,
    cancel_url: config.cancelUrl,
    // Add other necessary fields here
  };

  // Create the string to hash
  const dataString = Object.keys(pfData)
    .sort()
    .map((key) => `${key}=${pfData[key]}`)
    .join('&');

  const signature = crypto.createHash('md5').update(dataString).digest('hex');

  const paymentUrl = `${config.payFastUrl}?${Object.entries(pfData).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')}&signature=${signature}`;

  res.json({ paymentUrl });
});

module.exports = router;