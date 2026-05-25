// orderActions.js
import supabase from './supabase.js';

export async function confirmOrderDelivery(orderId) {
  const success = await updateOrderStatus(orderId, 'Delivered');
  if (success) {
    await addOrderAction(orderId, 'Order marked as delivered.');
    alert('Order delivery confirmed.');
  }
}

export async function cancelOrder(orderId) {
  const success = await updateOrderStatus(orderId, 'Cancelled');
  if (success) {
    await addOrderAction(orderId, 'Order cancelled.');
    alert('Order cancelled.');
  }
}

export async function assignDriver(orderId, driverName) {
  // Assuming you have a field like 'driver_name' in order_status
  const { data, error } = await supabase
    .from('order_status')
    .update({ driver_name: driverName })
    .eq('order_id', orderId);

  if (error) {
    console.error('Error assigning driver:', error);
    alert('Failed to assign driver.');
    return false;
  }
  await addOrderAction(orderId, `Driver ${driverName} assigned.`);
  alert(`Driver ${driverName} assigned.`);
  return true;
}

// Reuse functions from order.js if needed
async function updateOrderStatus(orderId, status) {
  const { error } = await supabase
    .from('order_status')
    .update({ status })
    .eq('order_id', orderId);
  return !error;
}

async function addOrderAction(orderId, action) {
  const { error } = await supabase
    .from('order_history')
    .insert([{ order_id: orderId, action, created_at: new Date().toISOString() }]);
  return !error;
}