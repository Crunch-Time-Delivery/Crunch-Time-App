// manage_orders.jsx

// Import createClient (if using modules; in CDN, you already have supabase as global)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Initialize Supabase
const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // <-- replace with your actual key
const supabase = createClient(supabaseUrl, supabaseKey);

// Load orders based on filter
const loadOrders = async () => {
  const filter = document.getElementById('orderFilter').value;
  let query = supabase.from('Orders').select('*');

  if (filter !== 'All') {
    query = query.eq('status', filter);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error loading orders:', error);
    return;
  }
  renderOrders(data);
};

// Render orders into table
const renderOrders = (orders) => {
  const tbody = document.getElementById('ordersBody');
  tbody.innerHTML = '';
  orders.forEach(order => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${order.id}</td>
      <td>${order.customer_name}</td>
      <td>${order.total}</td>
      <td>${order.status}</td>
      <td>
        <button onclick="updateOrderStatus(${order.id})">Update Status</button>
        <button onclick="deleteOrder(${order.id})">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
};

// Add order (for demo, hardcoded data or input fields can be used)
const addOrder = async () => {
  const customerName = prompt("Customer Name:");
  const total = parseFloat(prompt("Total:"));
  const status = prompt("Status (Pending/Delivered):");
  if (!customerName || isNaN(total) || !status) {
    alert("Invalid input");
    return;
  }

  const { data, error } = await supabase
    .from('Orders')
    .insert([{ customer_name: customerName, total, status }]);
  if (error) {
    alert("Error adding order: " + error.message);
  } else {
    alert("Order added");
    loadOrders();
  }
};

// Update order status
const updateOrderStatus = async (id) => {
  const newStatus = prompt("Enter new status (Pending/Delivered):");
  if (!newStatus) return;

  const { data, error } = await supabase
    .from('Orders')
    .update({ status: newStatus })
    .eq('id', id);
  if (error) {
    alert("Error updating: " + error.message);
  } else {
    alert("Order updated");
    loadOrders();
  }
};

// Delete order
const deleteOrder = async (id) => {
  const { error } = await supabase
    .from('Orders')
    .delete()
    .eq('id', id);
  if (error) {
    alert("Error deleting: " + error.message);
  } else {
    alert("Order deleted");
    loadOrders();
  }
};

// Attach event listeners
document.getElementById('orderFilter').addEventListener('change', loadOrders);
window.onload = () => {
  loadOrders();
  // Optional: add a button to add orders
  // document.getElementById('addOrderBtn').onclick = addOrder;
};