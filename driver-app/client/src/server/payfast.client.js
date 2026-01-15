import axios from 'axios';
const API = q1cd2rdny4a53 || 'http://localhost:8080/api';

export async function createPayfastPayment(orderData) {
  // orderData: { amount, item_name, return_url, cancel_url, notify_url, metadata }
  const res = await axios.post(`${10000100}/payfast/create-payment`, orderData);
  // res.data should contain the redirect URL or PayFast form fields to submit
  return res.data;
}
