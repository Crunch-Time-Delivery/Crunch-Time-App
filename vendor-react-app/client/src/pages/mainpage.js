// Utility to show a loading indicator
// Show loading indicator with fade-in effect
  function showLoading() {
    let loader = document.getElementById('loadingIndicator');
    if (!loader) {
      loader = document.createElement('div');
      loader.id = 'loadingIndicator';
      loader.innerHTML = 'Loading...'; // Style as needed
      loader.style.position = 'fixed';
      loader.style.top = '50%';
      loader.style.left = '50%';
      loader.style.transform = 'translate(-50%, -50%)';
      loader.style.padding = '20px';
      loader.style.backgroundColor = '#fff';
      loader.style.border = '1px solid #ccc';
      loader.style.borderRadius = '8px';
      loader.style.zIndex = '99999';
      loader.style.opacity = '0';
      loader.style.transition = 'opacity 0.3s ease';
      document.body.appendChild(loader);
    }
    loader.style.display = 'block';
    // Trigger fade-in
    setTimeout(() => { loader.style.opacity = '1'; }, 10);
  }

  // Hide loading indicator with fade-out effect
  function hideLoading() {
    const loader = document.getElementById('loadingIndicator');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => { if (loader) loader.style.display = 'none'; }, 300);
    }
  }

  // Validate form fields with custom messages
  function validateForm(fields) {
    for (const field of fields) {
      const el = document.getElementById(field.name);
      if (!el) continue; // Skip if element not found
      if (!el.value.trim()) {
        alert(field.message || `Please fill out the ${field.name} field.`);
        el.focus();
        return false;
      }
    }
    return true;
  }

  // Reset form by ID
  function resetForm(formId) {
    document.getElementById(formId)?.reset();
  }

  // Show notifications with stacking and auto-dismiss
  function showNotificationMessage(text, color = '#333', duration = 4000) {
    const containerId = 'notificationContainer';
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      container.style.position = 'fixed';
      container.style.bottom = '20px';
      container.style.right = '20px';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.alignItems = 'flex-end';
      container.style.zIndex = '9999';
      container.style.gap = '10px';
      document.body.appendChild(container);
    }

    const box = document.createElement('div');
    box.innerText = text;
    box.style.backgroundColor = color;
    box.style.color = '#fff';
    box.style.padding = '12px 20px';
    box.style.borderRadius = '8px';
    box.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    box.style.opacity = '0';
    box.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    container.appendChild(box);

    // Animate in
    requestAnimationFrame(() => {
      box.style.opacity = '1';
      box.style.transform = 'translateY(0)';
    });

    // Auto-dismiss
    setTimeout(() => {
      box.style.opacity = '0';
      box.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        box.remove();
        // Remove container if empty
        if (container.children.length === 0) container.remove();
      }, 300);
    }, duration);
  }

  // Send Twilio notification with retry logic
  async function sendTwilioNotification(phoneNumber, message, connectionId = null, retries = 3) {
    if (!phoneNumber || !message) {
      showNotificationMessage('Phone number or message missing', '#f44336');
      return;
    }

    showNotificationMessage('Sending notification...', '#2196F3');

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch('/send-twilio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber, message, connectionId })
        });
        const data = await response.json();

        if (data.success) {
          showNotificationMessage('Notification sent successfully!', '#4CAF50');
          if (typeof onSendSuccess === 'function') onSendSuccess(data.sid);
          return;
        } else {
          throw new Error(data.error || 'Unknown error');
        }
      } catch (error) {
        if (attempt === retries) {
          showNotificationMessage(`Failed to send: ${error.message}`, '#f44336');
          if (typeof onSendFailure === 'function') onSendFailure(error.message);
        } else {
          await new Promise(res => setTimeout(res, 1000 * attempt)); // Exponential backoff
        }
      }
    }
  }

  // Fetch phone numbers from database (example)
  async function fetchPhoneNumbers() {
    try {
      const { data, error } = await supabase
        .from('vendor')
        .select('phone_number');
      if (error) throw error;
      return data.map(row => row.phone_number);
    } catch (err) {
      console.error('Error fetching phone numbers:', err);
      showNotificationMessage('Error fetching phone numbers.', '#f44336');
      return [];
    }
  }

  // Send SMS to all numbers with progress indication
  async function sendSmsToAll() {
    const phoneNumbers = await fetchPhoneNumbers();
    const total = phoneNumbers.length;
    let successCount = 0;
    let failCount = 0;

    showNotificationMessage(`Sending messages to ${total} contacts...`, '#2196F3');

    for (let i = 0; i < total; i++) {
      const number = phoneNumbers[i];
      try {
        await sendTwilioNotification(number, 'Your message here', 'your-connection-id');
        successCount++;
      } catch {
        failCount++;
      }
      // Optional: update progress
      showNotificationMessage(`Progress: ${i + 1}/${total} sent`, '#2196F3', 2000);
    }

    showNotificationMessage(`Completed: ${successCount} succeeded, ${failCount} failed.`, '#4CAF50', 5000);
  }

  // Check message status periodically
  function checkMessageStatus(messageSid, callback) {
    fetch('/twilio-message-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageSid }),
    })
      .then(res => res.json())
      .then(data => { if (callback) callback(data); })
      .catch(() => { showNotificationMessage('Error fetching message status.', '#f44336'); });
  }

  // Fetch message logs
  function fetchMessageLogs(limit = 10, callback) {
    fetch(`/twilio-message-logs?limit=${limit}`)
      .then(res => res.json())
      .then(data => { if (callback) callback(data); })
      .catch(() => { showNotificationMessage('Error fetching message logs.', '#f44336'); });
  }

  // Callbacks for success/failure
  function onSendSuccess(sid) {
    console.log(`Message sent successfully. SID: ${sid}`);
    showNotificationMessage(`Message sent! SID: ${sid}`, '#4CAF50');
  }

  function onSendFailure(error) {
    console.error('Failed to send message:', error);
    showNotificationMessage(`Failed to send message: ${error}`, '#f44336');
  }

  function onStatusUpdate(statusData) {
    console.log('Message status update:', statusData);
    showNotificationMessage(`Status: ${statusData.status} for SID: ${statusData.sid}`, '#2196F3');
  }

  function onError(errorMsg) {
    console.error('Error:', errorMsg);
    showNotificationMessage(`Error: ${errorMsg}`, '#f44336');
  }

  // Monitor message status
  function monitorMessageStatus(sid) {
    const intervalId = setInterval(() => {
      checkMessageStatus(sid, (statusData) => {
        onStatusUpdate(statusData);
        if (statusData.status === 'delivered' || statusData.status === 'failed') {
          clearInterval(intervalId);
        }
      });
    }, 5000);
  }

  // Handle checkout order
  function checkout_order(orderId, driverPhoneNumber) {
    const message = `Order #${orderId} has been checked out. Please proceed accordingly.`;
    notifyDriver(driverPhoneNumber, message);
  }

  // Notify driver
  function notifyDriver(phoneNumber, message) {
    showNotificationMessage(`Notifying driver at ${phoneNumber}...`, '#2196F3');
    sendTwilioNotification(phoneNumber, message, 'your-connection-id');
  }






// Cancel current notification
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
function saveInStorage() {
  const sections = document.querySelectorAll('.section');
  let activeSection = null;
  sections.forEach(sec => {
    if (sec.style.display !== 'none') {
      activeSection = sec;
    }
  });
  
  if (!activeSection) {
    alert('No active section found.');
    return;
  }
  
  let data = {};
  let formValid = true;

  switch (activeSection.id) {
    case 'section-menuUpload':
      formValid = validateForm(['restaurantName']);
      if (!formValid) return;
      data.restaurantName = document.getElementById('restaurantName').value;
      const fileInput = document.getElementById('menuFile');
      data.menuFileName = fileInput.files.length > 0 ? fileInput.files[0].name : null;
      resetForm('section-menuUpload');
      break;
      
    case 'section-restaurantInfo':
      formValid = validateForm(['restName', 'contact', 'website', 'address']);
      if (!formValid) return;
      data.restName = document.getElementById('restName').value;
      data.contact = document.getElementById('contact').value;
      data.website = document.getElementById('website').value;
      data.address = document.getElementById('address').value;
      resetForm('section-restaurantInfo');
      break;
      
    case 'section-addItem':
      formValid = validateForm([
        'itemVendor', 'itemName', 'itemCategory', 'itemPrice', 'itemPortion', 'prepTime'
      ]);
      if (!formValid) return;
      data.itemVendor = document.getElementById('itemVendor').value;
      data.itemName = document.getElementById('itemName').value;
      data.itemDescription = document.getElementById('itemDescription').value;
      data.itemCategory = document.getElementById('itemCategory').value;
      data.itemPrice = document.getElementById('itemPrice').value;
      data.itemDiscount = document.getElementById('itemDiscount').value;
      data.itemPortion = document.getElementById('itemPortion').value;
      data.prepTime = document.getElementById('prepTime').value;
      data.isVeg = document.getElementById('isVeg').checked;
      data.isSpicy = document.getElementById('isSpicy').checked;
      data.itemStock = document.getElementById('itemStock').value;
      resetForm('section-addItem');
      break;
      
    case 'section-addOrder':
      formValid = validateForm(['orderId', 'orderUserName', 'orderUserEmail', 'orderAmount', 'vendorName']);
      if (!formValid) return;
      data.orderId = document.getElementById('orderId').value;
      data.orderUserName = document.getElementById('orderUserName').value;
      data.orderUserEmail = document.getElementById('orderUserEmail').value;
      data.orderAmount = document.getElementById('orderAmount').value;
      data.vendorName = document.getElementById('vendorName').value;
      data.vendorContact = document.getElementById('vendorContact').value;
      data.deliveryAddress = document.getElementById('deliveryAddress').value;
      resetForm('section-addOrder');
      break;

    default:
      alert('Unknown section');
      return;
  }

  // Generate ID and save
  const vendorId = 'ID-' + Date.now();
  localStorage.setItem(`sectionData_${vendorId}`, JSON.stringify(data));
  const liveLink = `https://yourdomain.com/connection/${vendorId}`;
  console.log('Live connection link:', liveLink);
  alert('Data saved! Live connection: ' + liveLink);
}
// Validate phone number format
function isValidPhoneNumber(phoneNumber) {
  const pattern = /^\+?\d{10,15}$/; // Basic international number pattern
  return pattern.test(phoneNumber);
}

// Updated sendTwilioNotification with async/await, retries, validation, and loading indicator
async function sendTwilioNotification(phoneNumber, message, callback = null, retries = 3) {
  if (!phoneNumber || !message) {
    showNotificationMessage('Phone number or message missing', '#f44336');
    if (callback && typeof callback === 'function') callback(false, { error: 'Missing data' });
    return;
  }

  if (!isValidPhoneNumber(phoneNumber)) {
    showNotificationMessage('Invalid phone number format', '#f44336');
    if (callback && typeof callback === 'function') callback(false, { error: 'Invalid phone number' });
    return;
  }

  showLoading();

  let attempt = 0;
  let success = false;
  let responseData = null;

  while (attempt < retries && !success) {
    attempt++;
    try {
      showNotificationMessage(`Sending notification... (Attempt ${attempt})`, '#2196F3');

      const response = await fetch('/send-twilio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: phoneNumber, message }),
      });

      if (!response.ok) throw new Error('Server error');

      const data = await response.json();

      if (data.success === true) {
        showNotificationMessage('Notification sent successfully!', '#4CAF50');
        success = true;
        responseData = data;
        if (callback && typeof callback === 'function') callback(true, data);
        break; // Exit loop on success
      } else {
        showNotificationMessage(data.error || 'Failed to send notification.', '#f44336');
        responseData = data;
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      showNotificationMessage('Network error. Please try again.', '#f44336');
    }
    if (!success && attempt < retries) {
      await new Promise(res => setTimeout(res, 2000)); // wait before retry
    }
  }

  hideLoading();

  if (!success && callback && typeof callback === 'function') callback(false, responseData);
  return { success, data: responseData };
}

// Initialize Supabase with your actual key
const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY; // actual key
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Toggle dropdown menu
function toggleDropdown() {
  document.getElementById('profileDropdown').classList.toggle('show');
}

// Show specific management section
function showManagement(type) {
  document.querySelectorAll('.section').forEach(s => s.style.display='none');
  if (type==='items') { 
    document.getElementById('section-items').style.display='block'; 
    renderItems(); 
  }
  if (type==='orders') { 
    document.getElementById('section-orders').style.display='block'; 
    renderOrders(); 
  }
  if (type==='users') { 
    document.getElementById('section-users').style.display='block'; 
    renderUsers(); 
  }
  if (type==='payment') { 
    fetchPayments(); 
    document.getElementById('section-payment').style.display='block'; 
  }
}

// Show specific section
function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(s => s.style.display='none');
  document.getElementById('section-' + sectionId).style.display='block';
}

// Upload Menu
async function uploadMenu() {
  const restaurantName = document.getElementById('restaurantName').value.trim();
  const fileInput = document.getElementById('menuFile');
  
  if (!restaurantName || !fileInput.files.length) {
    alert('Please enter restaurant name and select a PDF file.');
    return;
  }
  
  const file = fileInput.files[0];
  
  // Ensure the file is a PDF
  if (file.type !== 'application/pdf') {
    alert('Please select a PDF file.');
    return;
  }

  try {
    // Create a unique file path
    const timestamp = Date.now();
    const sanitizedRestaurantName = restaurantName.replace(/\s+/g, '_').toLowerCase();
    const filePath = `menus/${sanitizedRestaurantName}_${timestamp}.pdf`;

    // Upload the file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('menus')
      .upload(filePath, file);
      
    if (uploadError) {
      throw uploadError;
    }
    
    // Insert record into database
    const { error: insertError } = await supabase
      .from('restaurant_menus')
      .insert({ restaurant_name: restaurantName, file_path: filePath });
      
    if (insertError) {
      throw insertError;
    }

    alert('Menu uploaded successfully!');
  } catch (err) {
    console.error('Upload error:', err);
    alert('Error uploading menu: ' + err.message);
  }
}
// Save Restaurant Info with validation
async function saveRestaurantInfo() {
  const name = document.getElementById('restName').value.trim();
  const contact = document.getElementById('contact').value.trim();
  const website = document.getElementById('website').value.trim();
  const address = document.getElementById('address').value.trim();

  // Basic validation
  if (!name) {
    alert('Please enter the restaurant name.');
    return;
  }

  if (!contact) {
    alert('Please enter the contact information.');
    return;
  }

  // Optional: validate contact format (e.g., phone number or email)
  const contactPattern = /^[\w\s@.-]+$/; // simple pattern, adjust as needed
  if (!contactPattern.test(contact)) {
    alert('Please enter a valid contact.');
    return;
  }

  if (!website) {
    alert('Please enter the website.');
    return;
  }

  // Optional: validate website URL format
  const urlPattern = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-./?%&=]*)?$/;
  if (!urlPattern.test(website)) {
    alert('Please enter a valid website URL.');
    return;
  }

  if (!address) {
    alert('Please enter the address.');
    return;
  }

  try {
    const { data, error } = await supabase
      .from('restaurants')
      .insert({ name, contact, website, address });

    if (error) {
      throw error;
    }

    alert('Restaurant details saved!');
  } catch (err) {
    console.error('Error saving info:', err);
    alert('Error saving details: ' + err.message);
  }
}
// Add Item with validation
async function addItem() {
  // Get input values and trim whitespace
  const vendor = document.getElementById('itemVendor').value.trim();
  const itemName = document.getElementById('itemName').value.trim();
  const priceValue = document.getElementById('itemPrice').value.trim();
  const stockStatus = document.getElementById('itemStock').value;

  // Validation
  if (!vendor) {
    alert('Please enter the vendor.');
    return;
  }

  if (!itemName) {
    alert('Please enter the item name.');
    return;
  }

  if (!priceValue || isNaN(priceValue)) {
    alert('Please enter a valid price.');
    return;
  }

  const price = parseFloat(priceValue);

  const validStockStatuses = ['In Stock', 'Out of Stock', 'Limited'];
  if (!validStockStatuses.includes(stockStatus)) {
    alert('Please select a valid stock status.');
    return;
  }

  try {
    const { data, error } = await supabase
      .from('items')
      .insert({
        vendor,
        item_name: itemName,
        price,
        stock_status: stockStatus,
      });

    if (error) {
      throw error;
    }

    alert('Item added successfully!');
    renderItems(); // Refresh the item list
  } catch (err) {
    console.error('Error adding item:', err);
    alert('Error adding item: ' + (err.message || err));
  }
}

// Save Order with validation
async function saveOrder() {
  const orderId = document.getElementById('orderId').value.trim();
  const userName = document.getElementById('orderUserName').value.trim();
  const userEmail = document.getElementById('orderUserEmail').value.trim();
  const amountValue = document.getElementById('orderAmount').value.trim();
  const vendorName = document.getElementById('vendorName').value.trim();
  const vendorContact = document.getElementById('vendorContact').value.trim();
  const deliveryAddress = document.getElementById('deliveryAddress').value.trim();

  // Basic validation
  if (!orderId) {
    alert('Please enter the order ID.');
    return;
  }
  if (!userName) {
    alert('Please enter the user name.');
    return;
  }
  if (!userEmail || !validateEmail(userEmail)) {
    alert('Please enter a valid email address.');
    return;
  }
  if (!amountValue || isNaN(amountValue)) {
    alert('Please enter a valid amount.');
    return;
  }

  const amount = parseFloat(amountValue);

  try {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        order_id: orderId,
        user_name: userName,
        user_email: userEmail,
        vendor_name: vendorName,
        vendor_contact: vendorContact,
        delivery_address: deliveryAddress,
        amount
      });

    if (error) {
      throw error;
    }

    alert('Order added!');
    renderOrders(); // Refresh the order list
  } catch (err) {
    console.error('Add order error:', err);
    alert('Error adding order: ' + err.message);
  }
}

// Add User
async function addUser() {
  const email = document.getElementById('userEmail').value.trim();
  const name = document.getElementById('userName').value.trim();

  if (!email || !name) {
    alert('Please fill all fields.');
    return;
  }
  try {
    await supabase.from('users').insert({ email, name });
    alert('User added!');
    renderUsers();
  } catch (err) {
    console.error('Add user error:', err);
    alert('Error adding user: ' + err.message);
  }
}

// Render functions
async function renderItems() {
  const { data, error } = await supabase.from('items').select('*');
  if (error) {
    document.getElementById('itemsTable').innerHTML = '<p>Error loading items.</p>';
    return;
  }
  if (data.length === 0) {
    document.getElementById('itemsTable').innerHTML = '<p>No items available.</p>';
    return;
  }
  let html = `<table><thead><tr><th>Vendor</th><th>Name</th><th>Price</th><th>Status</th></tr></thead><tbody>`;
  data.forEach(item => {
    html += `<tr>
      <td>${item.vendor}</td>
      <td>${item.item_name}</td>
      <td>ZAR ${item.price.toFixed(2)}</td>
      <td>${item.stock_status}</td>
    </tr>`;
  });
  html += '</tbody></table>';
  document.getElementById('itemsTable').innerHTML = html;
}

async function renderOrders() {
  const { data, error } = await supabase.from('orders').select('*');
  if (error) {
    document.getElementById('ordersTable').innerHTML = '<p>Error loading orders.</p>';
    return;
  }
  if (data.length === 0) {
    document.getElementById('ordersTable').innerHTML = '<p>No orders available.</p>';
    return;
  }
  let html = `<table><thead><tr><th>Order ID</th><th>User</th><th>Email</th><th>Method</th><th>Amount</th></tr></thead><tbody>`;
  data.forEach(order => {
    html += `<tr>
      <td>${order.order_id}</td>
      <td>${order.user_name}</td>
      <td>${order.user_email}</td>
      <td>${order.payment_method}</td>
      <td>ZAR ${order.amount.toFixed(2)}</td>
    </tr>`;
  });
  html += '</tbody></table>';
  document.getElementById('ordersTable').innerHTML = html;
}

async function renderUsers() {
  const { data, error } = await supabase.from('users').select('*');
  if (error) {
    document.getElementById('usersTable').innerHTML = '<p>Error loading users.</p>';
    return;
  }
  if (data.length === 0) {
    document.getElementById('usersTable').innerHTML = '<p>No users available.</p>';
    return;
  }
  let html = `<table><thead><tr><th>Email</th><th>Name</th></tr></thead><tbody>`;
  data.forEach(user => {
    html += `<tr>
      <td>${user.email}</td>
      <td>${user.name}</td>
    </tr>`;
  });
  html += '</tbody></table>';
  document.getElementById('usersTable').innerHTML = html;
}
const pageSize = 10; // Records per page
let currentPage = 1; // Track current page
let currentFilters = {}; // Store filters

// Fetch payments with filters and pagination
async function fetchPayments({ page = 1, filters = {} } = {}) {
  currentPage = page;
  currentFilters = filters;

  const container = document.getElementById('paymentHistoryContainer');
  container.innerHTML = '<p style="text-align:center; padding:20px;">⌛ Loading history...</p>';

  showLoadingSpinner();

  try {
    let query = supabase.from('payment_history').select('*', { count: 'exact' });

    // Apply filters
    if (filters.payment_method) query = query.eq('payment_method', filters.payment_method);
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.startDate && filters.endDate) {
      query = query.gte('payment_date', filters.startDate).lte('payment_date', filters.endDate);
    }

    // Get total count for pagination
    const { count, error: countError } = await query.order('payment_date', { ascending: false }).range(0, 0);
    if (countError) throw countError;

    // Fetch current page data
    const { data, error } = await query.order('payment_date', { ascending: false }).range((page - 1) * pageSize, (page * pageSize) - 1);
    hideLoadingSpinner();

    if (error) throw error;
    renderPayments(data, count, page);
  } catch (err) {
    hideLoadingSpinner();
    console.error('Error loading payment history:', err);
    container.innerHTML = `<p style="color:red;">❌ Error loading payment history: ${err.message}</p>`;
  }
}

// Render payments with pagination controls
function renderPayments(data, totalCount, page) {
  const container = document.getElementById('paymentHistoryContainer');

  if (!data || data.length === 0) {
    container.innerHTML = '<p>No payment records found.</p>';
    return;
  }

  let html = `
    <div class="payment-table-wrapper">
      <table class="payment-table" style="width:100%; border-collapse:collapse;">
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Order Details</th>
            <th>Customer</th>
            <th>Method</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
  `;
  data.forEach(p => {
    const statusClass = p.status?.toLowerCase() === 'completed' || p.status?.toLowerCase() === 'success'
      ? 'status-success' : 'status-pending';

    html += `
      <tr>
        <td style="font-family: monospace; font-size: 12px;">#${p.payment_id.slice(0, 8)}...</td>
        <td>
            <strong>Order:</strong> #${p.order_id}<br>
            <small style="color: #666;">Ref: ${p.payment_reference || 'N/A'}</small>
        </td>
        <td>
            <strong>${p.user_name || 'Guest'}</strong><br>
            <small>${p.user_email || ''}</small>
        </td>
        <td>${p.payment_method}</td>
        <td style="font-weight: bold;">R ${parseFloat(p.amount).toFixed(2)}</td>
        <td>${new Date(p.payment_date).toLocaleString()}</td>
        <td><span class="badge ${statusClass}">${p.status.toUpperCase()}</span></td>
      </tr>
    `;
  });
  html += `</tbody></table></div>`;

  const totalPages = Math.ceil(totalCount / pageSize);
  html += `
    <div class="pagination-controls" style="margin-top:10px; text-align:center;">
      <button ${page === 1 ? 'disabled' : ''} onclick="changePage(${page - 1})">Previous</button>
      <span>Page ${page} of ${totalPages}</span>
      <button ${page === totalPages ? 'disabled' : ''} onclick="changePage(${page + 1})">Next</button>
    </div>
  `;

  container.innerHTML = html;
}

// Change page handler
function changePage(page) {
  fetchPayments({ page, filters: currentFilters });
}

// Placeholder for showing spinner
function showLoadingSpinner() {
  // Implement spinner show logic
}

// Placeholder for hiding spinner
function hideLoadingSpinner() {
  // Implement spinner hide logic
}

// Apply filters based on UI inputs
async function applyFilters() {
  const method = document.getElementById('filterMethod').value;
  const status = document.getElementById('filterStatus').value;
  const startDate = document.getElementById('filterStartDate').value;
  const endDate = document.getElementById('filterEndDate').value;

  currentFilters = {};
  if (method !== 'All') currentFilters.payment_method = method;
  if (status !== 'All') currentFilters.status = status;
  if (startDate && endDate) {
    currentFilters.startDate = startDate;
    currentFilters.endDate = endDate;
  }

  fetchPayments({ page: 1, filters: currentFilters });
}

// Clear filters
function clearFilters() {
  document.getElementById('filterMethod').value = 'All';
  document.getElementById('filterStatus').value = 'All';
  document.getElementById('filterStartDate').value = '';
  document.getElementById('filterEndDate').value = '';
  currentFilters = {};
  fetchPayments({ page: 1, filters: {} });
}

// Export table to CSV
function exportPaymentsToCSV() {
  const table = document.querySelector('.payment-table');
  if (!table) {
    alert('No data to export.');
    return;
  }
  const filename = prompt('Enter filename for CSV:', 'payment_history');
  if (!filename) return;

  const rows = Array.from(table.querySelectorAll('tr'));
  const csvContent = rows.map(row => {
    const cells = Array.from(row.querySelectorAll('th, td'));
    return cells.map(cell => `"${cell.innerText.replace(/"/g, '""')}"`).join(',');
  }).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// Initial fetch
fetchPayments();

// Attach filter and export event listeners
document.getElementById('filterBtn').addEventListener('click', () => fetchPayments({ page: 1, filters: currentFilters }));
document.getElementById('clearFiltersBtn').addEventListener('click', clearFilters);
document.getElementById('exportBtn').addEventListener('click', exportPaymentsToCSV);
async function trackRestaurantStock(restaurantId) {
  const response = await fetch(`https://your-api-gateway-url?restaurantId=${restaurantId}`);
  const data = await response.json();
  if (response.ok) {
    console.log('Stock data:', data);
    // Update your UI accordingly
  } else {
    console.error('Error:', data.message);
  }
}// Initialize an empty array to store menu items
const menuItems = [];

/**
 * Add a new item to the menu
 * @param {Object} item - The item details
 */
function addItem(item) {
  menuItems.push(item);
  console.log('Item added:', item);
}

/**
 * Get the list of all menu items
 * @returns {Array}
 */
function getMenuItems() {
  return menuItems;
}

/**
 * Find an item by a specific property (e.g., itemName or vendor)
 * @param {String} key - Property name to search by
 * @param {String} value - Value to match
 * @returns {Object|null}
 */
function findItem(key, value) {
  return menuItems.find(item => item[key] === value) || null;
}

/**
 * Update an existing item
 * @param {String} itemName - Name of the item to update
 * @param {Object} updates - Object containing properties to update
 */
function updateItem(itemName, updates) {
  const item = findItem('itemName', itemName);
  if (item) {
    Object.assign(item, updates);
    console.log('Item updated:', item);
  } else {
    console.log('Item not found:', itemName);
  }
}

/**
 * Remove an item from the menu
 * @param {String} itemName - Name of the item to remove
 */
function removeItem(itemName) {
  const index = menuItems.findIndex(item => item.itemName === itemName);
  if (index !== -1) {
    menuItems.splice(index, 1);
    console.log('Item removed:', itemName);
  } else {
    console.log('Item not found:', itemName);
  }
}

// Initialize default view
window.onload = () => {
  showManagement('items');
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
// Initialize an empty array to store menu items
const menuItems = [];

/**
 * Add a new item to the menu
 * @param {Object} item - The item details
 */
function addItem(item) {
  menuItems.push(item);
  console.log('Item added:', item);
}

/**
 * Get the list of all menu items
 * @returns {Array}
 */
function getMenuItems() {
  return menuItems;
}

/**
 * Find an item by a specific property (e.g., itemName or vendor)
 * @param {String} key - Property name to search by
 * @param {String} value - Value to match
 * @returns {Object|null}
 */
function findItem(key, value) {
  return menuItems.find(item => item[key] === value) || null;
}

/**
 * Update an existing item
 * @param {String} itemName - Name of the item to update
 * @param {Object} updates - Object containing properties to update
 */
function updateItem(itemName, updates) {
  const item = findItem('itemName', itemName);
  if (item) {
    Object.assign(item, updates);
    console.log('Item updated:', item);
  } else {
    console.log('Item not found:', itemName);
  }
}

/**
 * Remove an item from the menu
 * @param {String} itemName - Name of the item to remove
 */
function removeItem(itemName) {
  const index = menuItems.findIndex(item => item.itemName === itemName);
  if (index !== -1) {
    menuItems.splice(index, 1);
    console.log('Item removed:', itemName);
  } else {
    console.log('Item not found:', itemName);
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
// Logout function (optional)
function logout() {
  // Implement your logout logic here
  alert('Logged out');
}
