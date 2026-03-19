// api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001'; // or your production URL

export const createPayFastPayment = async ({ amount, item_name }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create-payfast-payment.js`, {
      amount,
      item_name,
    });
    return response.data; // { paymentUrl: '...' }
  } catch (error) {
    console.error('Error creating PayFast payment:', error);
    throw error;
  }
};