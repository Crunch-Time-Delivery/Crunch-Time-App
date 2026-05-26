// orderAPI.js
import supabase from './supabase.js';

export async function fetchOrderStatus(orderId) {
  return await supabase
    .from('order_status')
    .select('*')
    .eq('order_id', orderId)
    .single();
}

export async function fetchOrderHistory(orderId) {
  return await supabase
    .from('order_history')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: false });
}

export async function updateOrderStatus(orderId, status, estimatedTime = null) {
  return await supabase
    .from('order_status')
    .update({ status, estimated_time: estimatedTime })
    .eq('order_id', orderId);
}

export async function addOrderHistoryAction(orderId, action) {
  return await supabase
    .from('order_history')
    .insert([{ order_id: orderId, action, created_at: new Date().toISOString() }]);
}