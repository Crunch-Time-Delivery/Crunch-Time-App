import axios from 'axios';

// PayFast configuration with your merchant details
const payfastConfig = {
  merchant_id: '10004002',
  merchant_key: 'q1cd2rdny4a53',
  passphrase: 'test_payfast', // optional, if used by PayFast
  // Add other necessary configurations if needed
};

/**
 * Initiates a payment request to PayFast
 * @param {Object} data - Payment details
 * @param {number} data.amount
 * @param {string} data.item_name
 * @param {string} [data.return_url]
 * @param {string} [data.cancel_url]
 * @param {string} [data.notify_url]
 * @returns {Promise<Object>} - Response data from PayFast
 */
async function initiatePayment(data) {
  // Basic validation of required fields
  if (data.amount === undefined || !data.item_name) {
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
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error initiating PayFast payment:', error.response.data);
    } else {
      console.error('Error initiating PayFast payment:', error.message);
    }
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
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error verifying PayFast payment:', error.response.data);
    } else {
      console.error('Error verifying PayFast payment:', error.message);
    }
    throw error;
  }
}

module.exports = { initiatePayment, verifyPayment };