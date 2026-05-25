// order.js
import supabase from './supabase.js';

export async function loadOrderStatus(orderId) {
  const { data, error } = await supabase
    .from('order_status')
    .select('*')
    .eq('order_id', orderId)
    .single();

  if (error) {
    console.error('Error fetching order status:', error);
    return;
  }

  document.getElementById('orderStatus').innerText = data.status || 'Status not available';

  if (data.estimated_time) {
    document.getElementById('deliveryTime').innerText = data.estimated_time;
  }
}

export async function loadOrderHistory(orderId) {
  const { data, error } = await supabase
    .from('order_history')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching order history:', error);
    return;
  }

  const container = document.getElementById('orderHistoryContainer');
  container.innerHTML = '<h4>Order History</h4>';
  data.forEach(item => {
    const div = document.createElement('div');
    div.innerText = `${item.action} at ${new Date(item.created_at).toLocaleString()}`;
    container.appendChild(div);
  });
}

// New functions for managing order data
export async function updateOrderStatus(orderId, newStatus, estimatedTime = null) {
  const { data, error } = await supabase
    .from('order_status')
    .update({ status: newStatus, estimated_time: estimatedTime })
    .eq('order_id', orderId);

  if (error) {
    console.error('Error updating order status:', error);
    return false;
  }
  return true;
}

export async function addOrderAction(orderId, actionDescription) {
  const { data, error } = await supabase
    .from('order_history')
    .insert([{
      order_id: orderId,
      action: actionDescription,
      created_at: new Date().toISOString(),
    }]);

  if (error) {
    console.error('Error adding order action:', error);
    return false;
  }
  return true;
}

export async function clearOrderData(orderId) {
  const { error: errorStatus } = await supabase
    .from('order_status')
    .delete()
    .eq('order_id', orderId);

  const { error: errorHistory } = await supabase
    .from('order_history')
    .delete()
    .eq('order_id', orderId);

  if (errorStatus || errorHistory) {
    console.error('Error clearing order data:', errorStatus || errorHistory);
    return false;
  }
  return true;
}