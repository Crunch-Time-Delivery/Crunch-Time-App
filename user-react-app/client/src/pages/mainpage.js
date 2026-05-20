// Function to display notification messages
function showNotificationMessage(text, color = '#333') {
  let box = document.getElementById('notificationMessage');

  if (!box) {
    box = document.createElement('div');
    box.id = 'notificationMessage';
    box.style.position = 'fixed';
    box.style.bottom = '20px';
    box.style.left = '50%';
    box.style.transform = 'translateX(-50%)';
    box.style.padding = '12px 20px';
    box.style.borderRadius = '8px';
    box.style.color = '#fff';
    box.style.fontSize = '14px';
    box.style.zIndex = '9999';
    box.style.transition = 'opacity 0.3s ease';
    document.body.appendChild(box);
  }

  box.style.backgroundColor = color;
  box.innerText = text;
  box.style.opacity = '1';

  // Clear previous timeout if exists
  if (showNotificationMessage.timeoutId) {
    clearTimeout(showNotificationMessage.timeoutId);
  }

  // Fade out after 4 seconds
  showNotificationMessage.timeoutId = setTimeout(() => {
    box.style.opacity = '0';
    setTimeout(() => {
      if (box) box.remove();
    }, 300);
  }, 4000);
}

// Function to cancel current notification immediately
function cancelNotification() {
  if (showNotificationMessage.timeoutId) {
    clearTimeout(showNotificationMessage.timeoutId);
  }
  const box = document.getElementById('notificationMessage');
  if (box) {
    box.style.opacity = '0';
    setTimeout(() => box.remove(), 300);
  }
}

// Utility function to validate phone number format
function isValidPhoneNumber(phoneNumber) {
  const pattern = /^\+?\d{10,15}$/; // Basic international phone pattern
  return pattern.test(phoneNumber);
}

// Function to display notification messages (assuming you have this implemented)
function showNotificationMessage(message, color) {
  // Your implementation here
}

// Function to send Twilio notification with async/await
async function sendTwilioNotification(to, message) {
  if (!to || !message) {
    showNotificationMessage('Recipient and message are required.', '#f44336');
    return { success: false, error: 'Invalid input' };
  }

  showNotificationMessage('Sending notification...', '#2196F3');

  try {
    const response = await fetch('/notify/sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, message }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const data = await response.json();

    if (data.success === true) {
      showNotificationMessage('Notification sent successfully!', '#4CAF50');
      console.log('SMS sent:', data);
      return { success: true, data };
    } else {
      showNotificationMessage(data.error || 'Failed to send notification.', '#f44336');
      console.error('SMS failed:', data);
      return { success: false, data };
    }
  } catch (error) {
    console.error('Error sending SMS:', error);
    showNotificationMessage('Network error. Please try again.', '#f44336');
    return { success: false, error: error.message };
  }
}

// Function to send notification with retries
async function sendNotificationWithRetries(to, message, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const result = await sendTwilioNotification(to, message);
    if (result.success) {
      return result;
    }
    if (attempt < retries) {
      showNotificationMessage(`Retrying (${attempt}/${retries})...`, '#FFC107');
      await new Promise((res) => setTimeout(res, 2000)); // wait 2 seconds before retry
    }
  }
  showNotificationMessage('Failed after retries.', '#f44336');
  return { success: false };
}
// Function to send bulk notifications
function sendBulkNotifications(notificationsArray) {
  notificationsArray.forEach(({ to, message }) => {
    if (isValidPhoneNumber(to)) {
      sendTwilioNotification(to, message);
    } else {
      showNotificationMessage(`Invalid phone number: ${to}`, '#f44336');
    }
  });
}

// Loading indicator functions
function showLoadingIndicator() {
  let loader = document.getElementById('loadingIndicator');
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'loadingIndicator';
    loader.innerHTML = 'Loading...'; // Can be styled further
    loader.style.position = 'fixed';
    loader.style.top = '50%';
    loader.style.left = '50%';
    loader.style.transform = 'translate(-50%, -50%)';
    loader.style.padding = '20px';
    loader.style.backgroundColor = '#fff';
    loader.style.border = '1px solid #ccc';
    loader.style.borderRadius = '8px';
    loader.style.zIndex = '99999';
    document.body.appendChild(loader);
  }
  loader.style.display = 'block';
}

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

// Setup real-time subscriptions with cleanup
function subscribeToTable(tableName, callback) {
  const subscription = supabase
    .from(tableName)
    .on('*', payload => {
      console.log(`Change received on ${tableName}: `, payload);
      callback(payload);
    })
    .subscribe();

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

// Render functions with improved error handling and structure
async function renderItems() {
  try {
    const { data, error } = await supabase.from('items').select('*');
    if (error) throw error;

    const container = document.getElementById('itemsTable');
    if (!data || data.length === 0) {
      container.innerHTML = '<p>No items available.</p>';
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
    container.innerHTML = html;
  } catch (err) {
    document.getElementById('itemsTable').innerHTML = '<p>Error loading items.</p>';
    console.error('renderItems error:', err);
  }
}

async function renderOrders() {
  try {
    const { data, error } = await supabase.from('orders').select('*');
    if (error) throw error;

    const container = document.getElementById('ordersTable');
    if (!data || data.length === 0) {
      container.innerHTML = '<p>No orders available.</p>';
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
    container.innerHTML = html;
  } catch (err) {
    document.getElementById('ordersTable').innerHTML = '<p>Error loading orders.</p>';
    console.error('renderOrders error:', err);
  }
}

async function renderUsers() {
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;

    const container = document.getElementById('usersTable');
    if (!data || data.length === 0) {
      container.innerHTML = '<p>No users available.</p>';
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
    container.innerHTML = html;
  } catch (err) {
    document.getElementById('usersTable').innerHTML = '<p>Error loading users.</p>';
    console.error('renderUsers error:', err);
  }
}

// Utility function to escape HTML to prevent XSS
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
};

window.closeProfile = () => {
  document.getElementById('profileModal').style.display = 'none';
};

window.updatePassword = async () => {
  const password = document.getElementById('password').value;
  try {
    const { error } = await supabase
      .from('User')
      .update({ password })
      .eq('id', userId);
    alert(error ? 'Password update failed' : 'Password updated');
  } catch (err) {
    console.error('Update password error:', err);
    alert('Error updating password.');
  }
};

// Function to filter items based on search input
document.getElementById('searchInput').addEventListener('input', function () {
  const query = this.value.toLowerCase();
  const items = document.querySelectorAll('#items-container .item');

  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(query) ? '' : 'none';
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

// Save Card Details
window.saveCardDetails = async () => {
  const data = {
    card_type: document.getElementById('cardType').value,
    card_number: document.getElementById('cardNumber').value,
    cvv: document.getElementById('cvv').value,
    security_code: document.getElementById('securityCode').value
  };
  try {
    const { error } = await supabase.from('User').update(data).eq('id', userId);
    alert(error ? 'Card save failed' : 'Card saved');
  } catch (err) {
    console.error('saveCardDetails error:', err);
    alert('Error saving card details.');
  }
};

// Shared categories data
const categoriesData = {
  'Fast Food': 'fastfoodList',
  'Burgers': 'burgersList',
  'Asian': 'asianList',
  'Pizza': 'pizzaList'
};

// Setup category filters with event listeners
function setupCategoryFilters() {
  Object.keys(categoriesData).forEach(category => {
    const buttons = document.querySelectorAll(`button[onclick="selectCategory('${category}')"]`);
    buttons.forEach(btn => {
      btn.removeEventListener('click', () => selectCategory(category));
      btn.addEventListener('click', () => selectCategory(category));
    });
  });
}

// Handle category selection
function selectCategory(categoryName) {
  Object.values(categoriesData).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  const selectedId = categoriesData[categoryName];
  if (selectedId) {
    document.getElementById(selectedId).style.display = 'block';
  }
}

// Update categories dynamically
function updateCategory(category, listId) {
  categoriesData[category] = listId;
  setupCategoryFilters();
}

// Initialize filters on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  setupCategoryFilters();
});

// Update vendor list
function updateVendor() {
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

// Delete user account
window.deleteUser = async () => {
  if (!confirm('Delete account permanently?')) return;
  try {
    await supabase.from('User').delete().eq('id', userId);
    localStorage.clear();
    window.location.href = 'http://127.0.0.1:5500/user-app/register_home.html';
  } catch (err) {
    console.error('Error deleting user:', err);
    alert('Failed to delete account.');
  }
};
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
