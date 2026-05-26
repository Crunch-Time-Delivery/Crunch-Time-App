// orderValidation.js
export function validateOrderData(orderData) {
  if (!orderData || !orderData.id) {
    console.error('Invalid order data:', orderData);
    return false;
  }
  if (!orderData.status || typeof orderData.status !== 'string') {
    console.error('Invalid order status:', orderData.status);
    return false;
  }
  // Add more validation rules as needed
  return true;
}