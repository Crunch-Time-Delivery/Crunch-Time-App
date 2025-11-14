import axios from 'axios';

// PayFast configuration with your merchant details
const payfastConfig = {
  merchant_id: 'YOUR_MERCHANT_ID',
  merchant_key: 'YOUR_MERCHANT_KEY',
  passphrase: 'YOUR_PASSPHRASE', // optional, if used by PayFast
  // Add other necessary configurations if needed
};

// Interface for payment data
interface PaymentData {
  amount: number;
  item_name: string;
  return_url?: string;
  cancel_url?: string;
  notify_url?: string;
  // Add other fields as needed
}

// Response type (can be adjusted based on actual API response)
interface PayFastResponse {
  // Example properties; adjust as per actual API response
  status: string;
  message?: string;
  data?: any;
}

/**
 * Initiates a payment request to PayFast
 * @param {PaymentData} data - Payment details
 * @returns {Promise<PayFastResponse>} - Response data from PayFast
 */
async function initiatePayment(data: PaymentData): Promise<PayFastResponse> {
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
    const response = await axios.post<PayFastResponse>('https://api.payfast.co.za/eng/process', payload);
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
async function verifyPayment(paymentId: string): Promise<PayFastResponse> {
  try {
    const response = await axios.get<PayFastResponse>(`https://api.payfast.co.za/eng/verify/${paymentId}`, {
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

export { initiatePayment, verifyPayment };