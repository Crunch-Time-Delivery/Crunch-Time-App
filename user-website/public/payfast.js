import axios from 'axios';

// PayFast configuration - consider moving to environment variables for security
const payfastConfig = {
  merchant_id: process.env.PAYFAST_MERCHANT_ID || '10004002',
  merchant_key: process.env.PAYFAST_MERCHANT_KEY || 'q1cd2rdny4a53',
  passphrase: process.env.PAYFAST_PASSPHRASE || 'test_payfast', // optional
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
  // Validate required fields
  if (data.amount === undefined || !data.item_name) {
    throw new Error('Missing required payment data: amount and item_name');
  }

  // Build payload with optional URLs
  const payload = {
    merchant_id: payfastConfig.merchant_id,
    merchant_key: payfastConfig.merchant_key,
    amount: data.amount,
    item_name: data.item_name,
    return_url: data.return_url,
    cancel_url: data.cancel_url,
    notify_url: data.notify_url,
    // Add other fields if needed
  };

  try {
    const response = await axios.post('https://api.payfast.co.za/eng/process', payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error initiating PayFast payment:', error.response.data);
    } else {
      console.error('Error initiating PayFast payment:', error.message);
    }
    throw error;
  }
}

/**
 * Optional: Verify payment status with PayFast (if API available)
 * @param {string} paymentId - The ID of the payment to verify
 * @returns {Promise<Object>} - Verification response
 */
async function verifyPayment(paymentId) {
  try {
    const response = await axios.get(`https://api.payfast.co.za/eng/verify/${paymentId}`, {
      params: {
        merchant_id: payfastConfig.merchant_id,
        merchant_key: payfastConfig.merchant_key,
        // Include other required params
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

export { initiatePayment, verifyPayment };