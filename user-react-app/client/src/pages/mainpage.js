const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY; //  actual key
const supabase = createClient(supabaseUrl, supabaseKey)
const userId = localStorage.getItem('user_id');

// Fetch user data with improved error handling
async function fetchUser() {
  try {
    const { data: user, error } = await supabase
      .from('user')
      .select(`
        id,
        username,
        email,
        name,
        role,
        order_cart,
        checkout_cart,
        pick_up_point,
        drop_off_point,
        longitude,
        latitude,
        location_name,
        ORDER_ID
      `)
      .single(); // assuming fetching current user
    if (error) throw error;
    return user;
  } catch (err) {
    console.error('Error fetching user:', err);
    return null; // or handle error appropriately
  }
}

// Setup real-time subscriptions with optional cleanup
function subscribeToTable(tableName, callback) {
  const subscription = supabase
    .from(`${tableName}`)
    .on('*', payload => {
      console.log(`Change received on ${tableName}: `, payload);
      callback(payload);
    })
    .subscribe();

  // Return a function to unsubscribe if needed
  return () => {
    supabase.removeSubscription(subscription);
  };
}

// Initialize all real-time subscriptions
function setupRealtimeUpdates() {
  const unsubscribeItems = subscribeToTable('items', renderItems);
  const unsubscribeOrders = subscribeToTable('orders', renderOrders);
  const unsubscribeUsers = subscribeToTable('users', renderUsers);
  // Store these if you need to unsubscribe later
  // e.g., return [unsubscribeItems, unsubscribeOrders, unsubscribeUsers];
}

// Render functions with improved structure
async function renderItems() {
  try {
    const { data, error } = await supabase.from('items').select('*');
    if (error) throw error;
    if (!data || data.length === 0) {
      document.getElementById('itemsTable').innerHTML = '<p>No items available.</p>';
      return;
    }
    let html = `<table class="table"><thead><tr><th>Vendor</th><th>Name</th><th>Price</th><th>Status</th></tr></thead><tbody>`;
    data.forEach(item => {
      html += `<tr>
        <td>${escapeHTML(item.vendor)}</td>
        <td>${escapeHTML(item.item_name)}</td>
        <td>ZAR ${item.price.toFixed(2)}</td>
        <td>${escapeHTML(item.stock_status)}</td>
      </tr>`;
    });
    html += '</tbody></table>';
    document.getElementById('itemsTable').innerHTML = html;
  } catch (err) {
    document.getElementById('itemsTable').innerHTML = '<p>Error loading items.</p>';
    console.error(err);
  }
}

async function renderOrders() {
  try {
    const { data, error } = await supabase.from('orders').select('*');
    if (error) throw error;
    if (!data || data.length === 0) {
      document.getElementById('ordersTable').innerHTML = '<p>No orders available.</p>';
      return;
    }
    let html = `<table class="table"><thead><tr><th>Order ID</th><th>User</th><th>Email</th><th>Method</th><th>Amount</th></tr></thead><tbody>`;
    data.forEach(order => {
      html += `<tr>
        <td>${escapeHTML(order.order_id)}</td>
        <td>${escapeHTML(order.user_name)}</td>
        <td>${escapeHTML(order.user_email)}</td>
        <td>${escapeHTML(order.payment_method)}</td>
        <td>ZAR ${order.amount.toFixed(2)}</td>
      </tr>`;
    });
    html += '</tbody></table>';
    document.getElementById('ordersTable').innerHTML = html;
  } catch (err) {
    document.getElementById('ordersTable').innerHTML = '<p>Error loading orders.</p>';
    console.error(err);
  }
}

async function renderUsers() {
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    if (!data || data.length === 0) {
      document.getElementById('usersTable').innerHTML = '<p>No users available.</p>';
      return;
    }
    let html = `<table class="table"><thead><tr><th>Email</th><th>Name</th></tr></thead><tbody>`;
    data.forEach(user => {
      html += `<tr>
        <td>${escapeHTML(user.email)}</td>
        <td>${escapeHTML(user.name)}</td>
      </tr>`;
    });
    html += '</tbody></table>';
    document.getElementById('usersTable').innerHTML = html;
  } catch (err) {
    document.getElementById('usersTable').innerHTML = '<p>Error loading users.</p>';
    console.error(err);
  }
}

// Utility to escape HTML to prevent XSS
function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, match => {
    const escapeMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return escapeMap[match];
  });
}

// Call setupRealtimeUpdates after initial load
window.onload = () => {
  setupRealtimeUpdates();
};
window.openProfile = () => {
  document.getElementById('profileModal').style.display = 'flex';
  loadProfile();
}

window.closeProfile = () => {
  document.getElementById('profileModal').style.display = 'none';
}

window.updatePassword = async () => {
  const password = document.getElementById('password').value;
  const { error } = await supabase
    .from('User')
    .update({ password })
    .eq('id', userId);
  alert(error ? 'Password update failed' : 'Password updated');
}
// Function to filter items based on search input
  document.getElementById('searchInput').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const items = document.querySelectorAll('#items-container .item');

    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(query)) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  });

  // Function to filter by category
  function selectCategory(category) {
    const items = document.querySelectorAll('#items-container .item');

    items.forEach(item => {
      const itemCategory = item.getAttribute('data-category');
      if (category === 'All' || itemCategory === category) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  }
window.saveCardDetails = async () => {
  const data = {
    card_type: document.getElementById('cardType').value,
    card_number: document.getElementById('cardNumber').value,
    cvv: document.getElementById('cvv').value,
    security_code: document.getElementById('securityCode').value
  };
  const { error } = await supabase.from('User').update(data).eq('id', userId);
  alert(error ? 'Card save failed' : 'Card saved');
}
// Shared data structure for categories
const categoriesData = {
  'Fast Food': 'fastfoodList',
  'Burgers': 'burgersList',
  'Asian': 'asianList',
  'Pizza': 'pizzaList'
};

// Function to initialize category buttons with live connection
function setupCategoryFilters() {
  Object.keys(categoriesData).forEach(category => {
    const buttons = document.querySelectorAll(`button[onclick="selectCategory('${category}')"]`);
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        selectCategory(category);
      });
    });
  });
}

// Function to handle category selection
function selectCategory(categoryName) {
  // Hide all lists
  Object.values(categoriesData).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  // Show selected category list
  const selectedId = categoriesData[categoryName];
  if (selectedId) {
    document.getElementById(selectedId).style.display = 'block';
  }
}

// Function to update categories dynamically (called from vendor page)
function updateCategory(category, listId) {
  categoriesData[category] = listId;
  // Re-setup the buttons to reflect new categories (optional)
  setupCategoryFilters();
}

// Call setup on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  setupCategoryFilters();
});
function updateVendor(){
const listContainer = document.getElementById('vendorList');
  listContainer.innerHTML = '';
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('sectionData_')) {
      const vendorId = key.substring('sectionData_'.length);
      const data = JSON.parse(localStorage.getItem(key));

      const li = document.createElement('li');
      li.style.padding = '8px';
      li.style.borderBottom = '1px solid #eee';

      let displayText = `ID: ${vendorId}`;
      if (data.restaurantName) {
        displayText += ` | Restaurant: ${data.restaurantName}`;
      } else if (data.restName) {
        displayText += ` | Restaurant: ${data.restName}`;
      } else if (data.itemName) {
        displayText += ` | Item: ${data.itemName}`;
      }

      li.innerText = displayText;
      listContainer.appendChild(li);
    }
  }
}
window.deleteUser = async () => {
  if (!confirm('Delete account permanently?')) return;
  await supabase.from('User').delete().eq('id', userId);
  localStorage.clear();
  location.href = 'http://127.0.0.1:5501/user-app/register_home.html';
}
function updateWiFiStatus() {
      const statusDiv = document.getElementById('connectionStatus');
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

      if (connection) {
        if (connection.type === 'wifi') {
          // Connected to Wi-Fi
          statusDiv.style.display = 'none';
        } else {
          // Not Wi-Fi
          statusDiv.style.display = 'block';
        }
      } else {
        // Browser doesn't support Network Information API
        // fallback to online check only
        if (navigator.onLine) {
          statusDiv.style.display = 'none';
        } else {
          statusDiv.style.display = 'block';
        }
      }
    }

    window.addEventListener('online', updateWiFiStatus);
    window.addEventListener('offline', updateWiFiStatus);

    // For changes in connection type
    if (navigator.connection) {
      navigator.connection.addEventListener('change', updateWiFiStatus);
    }

    window.addEventListener('load', () => {
      updateWiFiStatus();

      // Register service worker
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service_worker.js')
          .then(reg => console.log('Service Worker registered', reg))
          .catch(err => console.log('Service Worker registration failed', err));
      }
    });
