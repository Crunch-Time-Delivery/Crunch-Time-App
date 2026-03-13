
document.getElementById('createAccountBtn').addEventListener('click', () => {
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value.trim();

  if (!name || !email || !password) {
    alert('Please fill in all fields');
    return;
  }

  let users = JSON.parse(localStorage.getItem('users')) || [];

  if (users.some(user => user.email === email)) {
    alert('Email already registered');
    return;
  }

  users.push({ name, email, password });
  localStorage.setItem('users', JSON.stringify(users));

  alert('Account created successfully!');
  window.location.href =
    'http://127.0.0.1:5501/vendor-app/client/public/Login/loginVendor.html';
});

function showNotificationMessage(message, color='#4CAF50') {
  const notif = document.getElementById('notification');
  notif.innerHTML = `<div style="background-color:${color}; color:#fff; padding:10px; display:inline-block; border-radius:4px;">${message}</div>`;
  notif.style.display = 'block';

  // Hide after 3 seconds
  setTimeout(() => {
    notif.style.display = 'none';
  }, 3000);
}

function sendTwilioNotification(to, message) {
  // Show sending message
  showNotificationMessage('Sending notification...');
  
  fetch('/notify/sms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to: to, message: message })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      showNotificationMessage('Notification sent successfully!', '#4CAF50');
    } else {
      showNotificationMessage('Failed to send notification.', '#f44336');
    }
  })
  .catch(() => {
    showNotificationMessage('Error sending notification.', '#f44336');
  });
}

// Assuming you have an API endpoint at /notify/sms
function sendSms(to, message) {
  fetch('/notify/sms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ to, message })
  })
  .then(res => res.json())
  .then(data => {
    console.log('SMS sent:', data);
  })
  .catch(err => {
    console.error('Error sending SMS:', err);
  });
}
const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY; // Ensure this is set securely
const supabase = createClient(supabaseUrl, supabaseKey);

// Fetch Vendor data
async function fetchVendor() {
  const { data: Vendor, error } = await supabase
    .from('Vendor')
    .select('*');

  if (error) {
    console.error('Error fetching vendor:', error);
    return null;
  }
  return Vendor;
}

// Fetch Drivers data
async function fetchDrivers() {
  const { data: Drivers, error } = await supabase
    .from('Drivers')
    .select(`
     driver_name
      email,
      password,
  
    `);

  if (error) {
    console.error('Error fetching drivers:', error);
    return null;
  }
  return Drivers;
}