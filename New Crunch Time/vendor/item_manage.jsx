// item_manage.jsx

// Import createClient (if using a build system; for CDN, it's already available as supabase)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Initialize Supabase client
const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your actual key
const supabase = createClient(supabaseUrl, supabaseKey);

// Fetch items and render them into the table
const loadItems = async () => {
  const { data, error } = await supabase.from('Items').select('*');
  if (error) {
    console.error('Error fetching items:', error);
    return;
  }
  renderItems(data);
};

// Render items into the table body
const renderItems = (items) => {
  const tbody = document.getElementById('itemsBody');
  tbody.innerHTML = '';
  items.forEach(item => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.price}</td>
      <td>${item.description}</td>
      <td>
        <button onclick="deleteItem(${item.id})">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
};

// Add new item
const addItem = async () => {
  const name = document.getElementById('newName').value.trim();
  const price = parseFloat(document.getElementById('newPrice').value);
  const description = document.getElementById('newDescription').value.trim();

  if (!name || isNaN(price)) {
    alert('Please enter valid name and price.');
    return;
  }

  const { data, error } = await supabase
    .from('Items')
    .insert([{ name, price, description }]);

  if (error) {
    alert('Error adding item: ' + error.message);
  } else {
    alert('Item added successfully!');
    document.getElementById('newName').value = '';
    document.getElementById('newPrice').value = '';
    document.getElementById('newDescription').value = '';
    loadItems();
  }
};

// Delete item
const deleteItem = async (id) => {
  const { error } = await supabase
    .from('Items')
    .delete()
    .eq('id', id);
  if (error) {
    alert('Error deleting item: ' + error.message);
  } else {
    loadItems();
  }
};

// Attach event to add button
document.getElementById('addItemBtn').addEventListener('click', addItem);

// Load items on page load
window.onload = () => {
  loadItems();
};