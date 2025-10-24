const axios = require('axios');

// PayFast configuration with your merchant details
const payfastConfig = {
  merchant_id: 'YOUR_MERCHANT_ID',
  merchant_key: 'YOUR_MERCHANT_KEY',
  passphrase: 'YOUR_PASSPHRASE', // optional, if used by PayFast
  // Add other necessary configurations if needed
};

/**
 * Initiates a payment request to PayFast
 * @param {Object} data - Payment details
 * @param {number} data.amount - Amount to be paid
 * @param {string} data.item_name - Description or name of the item
 * @param {string} [data.return_url] - URL to redirect after payment success
 * @param {string} [data.cancel_url] - URL to redirect if payment is canceled
 * @param {string} [data.notify_url] - Webhook URL for payment notifications
 * @returns {Object} - Response data from PayFast
 */
async function initiatePayment(data) {
  // Basic validation of required fields
  if (!data.amount || !data.item_name) {
    throw new Error('Missing required payment data: amount and item_name');
  }

  // Construct payload with required and optional fields
  const payload = {
    merchant_id: payfastConfig.merchant_id,
    merchant_key: payfastConfig.merchant_key,
    amount: data.amount,
    item_name: data.item_name,
    // Optional URLs
    return_url: data.return_url,
    cancel_url: data.cancel_url,
    notify_url: data.notify_url,
    // Add other fields as per PayFast API documentation
  };

  try {
    // Send POST request to PayFast API endpoint
    const response = await axios.post('https://api.payfast.co.za/eng/process', payload);
    return response.data; // Return the response data for further processing
  } catch (error) {
    // Log detailed error and rethrow
    console.error('Error initiating PayFast payment:', error.response ? error.response.data : error.message);
    throw error;
  }
}

/**
 * Optional: Function to verify payment status with PayFast
 * (Assuming PayFast provides a verification API)
 */
async function verifyPayment(paymentId) {
  try {
    const response = await axios.get(`https://api.payfast.co.za/eng/verify/${paymentId}`, {
      params: {
        merchant_id: payfastConfig.merchant_id,
        merchant_key: payfastConfig.merchant_key,
        // Include any required verification parameters
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error verifying PayFast payment:', error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports = {
  initiatePayment,
  verifyPayment, // Export verification if needed
};