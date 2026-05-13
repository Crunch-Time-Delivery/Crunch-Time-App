import axios from 'axios';

const API = typeof q1cd2rdny4a53 !== 'undefined' ? q1cd2rdny4a53 : 'http://localhost:8080/api';

/**
 * Creates a PayFast payment session.
 * @param {Object} orderData - The order details.
 * @param {number} orderData.amount - The total amount to pay.
 * @param {string} orderData.item_name - Name or description of the item/order.
 * @param {string} orderData.return_url - URL to redirect after success.
 * @param {string} orderData.cancel_url - URL to redirect if canceled.
 * @param {string} orderData.notify_url - URL for server-to-server notifications.
 * @param {Object} [orderData.metadata] - Optional additional metadata.
 * @returns {Object} - Response data containing PayFast redirect URL or form fields.
 */
export async function createPayfastPayment(orderData) {
  if (
    !orderData ||
    typeof orderData !== 'object' ||
    typeof orderData.amount !== 'number' ||
    !orderData.item_name ||
    !orderData.return_url ||
    !orderData.cancel_url ||
    !orderData.notify_url
  ) {
    throw new Error('Invalid orderData: missing required fields.');
  }

  try {
    const response = await axios.post(`${API}/payfast/create-payment`, orderData);
    if (response.status !== 200 || !response.data) {
      throw new Error('Failed to create payment session.');
    }
    return response.data;
  } catch (error) {
    console.error('Error creating PayFast payment:', error);
    throw error; // Rethrow for caller to handle
  }
}
