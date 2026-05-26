// orderEvents.js
import { updateOrderStatus, addOrderHistoryAction } from './orderAPI.js';
import { showNotificationMessage } from './notifications.js';

export async function handleOrderStatusChange(orderId, newStatus) {
  const result = await updateOrderStatus(orderId, newStatus);
  if (result.error) {
    showNotificationMessage('Failed to update status', '#f44336');
  } else {
    await addOrderHistoryAction(orderId, `Status changed to ${newStatus}`);
    showNotificationMessage(`Order status updated to ${newStatus}`, '#4CAF50');
  }
}

// Example: attach event listener to a button
export function initOrderStatusButtons(orderId) {
  document.getElementById('btnDeliver').addEventListener('click', () => {
    handleOrderStatusChange(orderId, 'Delivered');
  });
  document.getElementById('btnCancel').addEventListener('click', () => {
    handleOrderStatusChange(orderId, 'Cancelled');
  });
}