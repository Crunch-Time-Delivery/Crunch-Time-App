// orderData.js

// Example order data structure
const createOrderData = (orderId, userId, items, totalAmount, status, createdAt) => {
  return {
    order_id: orderId,             // Unique order ID
    user_id: userId,               // User ID who placed the order
    items: items,                  // Array of ordered items
    total_amount: totalAmount,     // Total price of the order
    status: status,                // e.g., 'inProgress', 'completed'
    created_at: createdAt || new Date().toISOString(), // Order creation timestamp
  };
};


// Export the createOrderData function
export { createOrderData };