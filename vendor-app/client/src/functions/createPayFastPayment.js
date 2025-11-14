const express = require('express');
const crypto = require('crypto');
const axios = require('axios');

const app = express();
app.use(express.json());

const eftVendorApiUrl = 'https://vendor-api.com/eft/transactions'; // Replace with the actual API URL
const eftVendorApiKey = 'YOUR_VENDOR_API_KEY'; // Replace with the actual API key

app.post('/create-eft-payment', (req, res) => {
  const { amount, item_name } = req.body;

  const data = {
    amount,
    item_name,
    // Add other required fields
  };

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${eftVendorApiKey}`,
  };

  axios.post(eftVendorApiUrl, data, { headers })
   .then(response => {
      res.json(response.data);
    })
   .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Failed to create EFT payment' });
    });
});
