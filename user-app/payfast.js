const axios = require('axios');

const payfastConfig = {
  merchant_id: 'YOUR_MERCHANT_ID',
  merchant_key: 'YOUR_MERCHANT_KEY',
  passphrase: 'YOUR_PASSPHRASE', // optional
  // Add other necessary configurations
};

async function initiatePayment(data) {
  const payload = {
    merchant_id: payfastConfig.merchant_id,
    merchant_key: payfastConfig.merchant_key,
    amount: data.amount,
    item_name: data.item_name,
    // add other required fields
  };

  try {
    const response = await axios.post('https://api.payfast.co.za/eng/process', payload);
    return response.data;
  } catch (error) {
    console.error('Error initiating PayFast payment:', error);
    throw error;
  }
}

module.exports = { initiatePayment };