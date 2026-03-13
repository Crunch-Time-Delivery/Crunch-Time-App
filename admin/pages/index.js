// ================== INITIAL VARIABLES ==================
  let adminUsername = 'crunchtimeadmin';
  let adminPassword = 'crunchtimeadmin';

  let isAuthenticated = false;
// ================== UTILITY FUNCTIONS ==================
// Function to simulate sending an email
function sendEmail(to, subject, body) {
  alert(`Simulated Email to ${to}:\nSubject: ${subject}\n${body}`);
}

// Function to simulate sending a notification
function sendNotification(to, message) {
  alert(`Simulated Notification to ${to}:\n${message}`);
}

// Function to show a visual notification message on the webpage
function showNotificationMessage(message, color = '#4CAF50') {
  let notif = document.getElementById('notification');

  if (!notif) {
    notif = document.createElement('div');
    notif.id = 'notification';
    notif.style.position = 'fixed';
    notif.style.top = '20px';
    notif.style.right = '20px';
    notif.style.zIndex = '9999';
    notif.style.transition = 'opacity 0.5s ease';
    document.body.appendChild(notif);
  }

  notif.innerHTML = `<div style="background-color:${color}; color:#fff; padding:10px; border-radius:4px; max-width:300px; box-shadow:0 2px 8px rgba(0,0,0,0.2);">${message}</div>`;
  notif.style.opacity = '1';

  // Clear previous timeout if exists
  if (showNotificationMessage.timeoutId) {
    clearTimeout(showNotificationMessage.timeoutId);
  }

  // Fade out after 3 seconds
  showNotificationMessage.timeoutId = setTimeout(() => {
    notif.style.opacity = '0';
    // Remove element after fade out
    setTimeout(() => {
      if (notif) notif.remove();
    }, 500);
  }, 3000);
}

// Function to cancel current notification immediately
function cancelNotification() {
  if (showNotificationMessage.timeoutId) {
    clearTimeout(showNotificationMessage.timeoutId);
  }
  const notif = document.getElementById('notification');
  if (notif) {
    notif.style.opacity = '0';
    setTimeout(() => notif.remove(), 500);
  }
}

// Utility to show a loading indicator
function showLoading() {
  let loader = document.getElementById('loading');
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'loading';
    loader.innerHTML = 'Loading...';
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

function hideLoading() {
  const loader = document.getElementById('loading');
  if (loader) {
    loader.style.display = 'none';
  }
}

// Validate phone number format
function isValidPhoneNumber(phone) {
  const pattern = /^\+?\d{10,15}$/; // Basic international pattern
  return pattern.test(phone);
}

// Async function to send SMS via Twilio through your backend API
async function sendTwilioSms(to, message) {
  if (!to || !message) {
    showNotificationMessage('Phone number or message missing', '#f44336');
    return;
  }
  if (!isValidPhoneNumber(to)) {
    showNotificationMessage('Invalid phone number format', '#f44336');
    return;
  }

  showLoading();
  showNotificationMessage('Sending SMS...');

  try {
    const response = await fetch('/notify/sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, message }),
    });
    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    if (data.success) {
      showNotificationMessage('SMS sent successfully!', '#4CAF50');
    } else {
      showNotificationMessage(`Failed to send SMS: ${data.error || 'Unknown error'}`, '#f44336');
    }
  } catch (error) {
    console.error('Error sending SMS:', error);
    showNotificationMessage('Error sending SMS.', '#f44336');
  } finally {
    hideLoading();
  }
}

// Usage examples
// sendTwilioSms('+1234567890', 'Hello from the enhanced script!');
// Example usage:
// sendTwilioSms('+1234567890', 'Hello from Twilio!');


  // ================== LOGIN & AUTH ==================
  function verifyLogin() {
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value.trim();
    if (u===adminUsername && p===adminPassword) {
      alert('Login successful!');
      document.getElementById('loginModal').style.display='none';
      isAuthenticated = true;
      showAdminPopup(); // Show admin update popup after login
    } else {
      alert('Invalid credentials.');
    }
  }

  // Show section
  function showSection(id) {
    document.querySelectorAll('.section').forEach(s => s.style.display='none');
    document.getElementById(id).style.display='block';

    // Load driver/vendor info if needed
    if (id === 'Vendor') loadVendors();
    if (id === 'Driver') loadDrivers();
  }

  // ================== Menu & Profile ==================
  function toggleMenuDropdown() {
    const dd = document.getElementById('menuDropdown');
    dd.style.display = (dd.style.display==='block') ? 'none' : 'block';
  }
  document.addEventListener('click', e => {
    if (!e.target.closest('.menu-container')) {
      document.getElementById('menuDropdown').style.display='none';
    }
  });

  function triggerProfileImageUpload() { document.getElementById('profileImageInput').click(); }
  function updateProfileImage(e) {
    const file = e.target.files[0];
    if (file) {
      const reader=new FileReader();
      reader.onload=function(ev) { document.getElementById('profileImage').src=ev.target.result; }
      reader.readAsDataURL(file);
    }
  }

  // ================== Admin Credential Functions ==================
  function showAdminPopup() { document.getElementById('adminPopup').style.display='flex'; }
  function closeAdminPopup() { document.getElementById('adminPopup').style.display='none'; }
  function saveAdminCredentials() {
    const newU = document.getElementById('newUsername').value.trim();
    const newP = document.getElementById('newPassword').value.trim();
    if (newU && newP) {
      adminUsername = newU;
      adminPassword = newP;
      sendEmail('crunchtimedrivein@gmail.com', 'Updated Admin Login', `New Admin Credentials:\nUsername: ${adminUsername}\nPassword: ${adminPassword}`);
      alert('Credentials updated and email sent.');
      document.getElementById('adminName').innerText=adminUsername;
    } else {
      alert('Please provide new credentials.');
    }
    closeAdminPopup();
  }

  // ================== Add New Admin ==================
  function addNewAdmin() {
    const email = document.getElementById('newAdminEmail').value.trim();
    const username = document.getElementById('newAdminUsername').value.trim();
    const password = document.getElementById('newAdminPassword').value.trim();
    if (email && username && password) {
      const recordText = `Admin Email: ${email}\nUsername: ${username}\nPassword: ${password}\n---\n`;
      sendEmail('crunchtimedrivein@gmail.com', 'New Admin Record', recordText);
      alert('New admin added and record sent.');
      document.getElementById('newAdminEmail').value='';
      document.getElementById('newAdminUsername').value='';
      document.getElementById('newAdminPassword').value='';
    } else {
      alert('Please fill all fields for new admin.');
    }
  }

  // ================== Filter & Dropdowns ==================
  function toggleFilterDropdown() {
    const el = document.getElementById('filterDropdown');
    el.style.display = (el.style.display==='block') ? 'none' : 'block';
  }
  function filterEstablishments(type) {
    alert('Filtering by: ' + type);
    document.getElementById('filterDropdown').style.display='none';
  }

  function toggleYearDropdown() {
    const el = document.getElementById('yearOptions');
    el.style.display = (el.style.display==='none' || el.style.display==='') ? 'block' : 'none';
  }
  function selectMonth(month) {
    document.querySelector('.year-button').innerText=month + ' ▼';
    document.getElementById('yearOptions').style.display='none';
    updateMonthlyData(month);
  }

  // ================== Chart Initialization ==================
  function initCharts() {
    // Wave Graphs
    const ctxWaveThisMonth = document.getElementById('waveGraphThisMonth').getContext('2d');
    new Chart(ctxWaveThisMonth, {
      type:'line',
      data:{
        labels:['JAN','FEB','MAR','APR ','MAY ','JUN ','JUL ','AUG ','SEP ','OCT ','NOV ','DEC '],
        datasets:[
          {
            label:'This Month Data',
            data:[20,10,30,50,40,60,70,100,40,90],
            backgroundColor:'rgba(255,159,64,0.2)',
            borderColor:'rgba(255,159,64,1)',
            borderWidth:2,
            tension:0.4,
            fill:true,
          },
          {
            label:'Tracking Sales',
            data:[25,15,35,55,45,65,75,110,50,100],
            backgroundColor:'rgba(75,192,192,0.2)',
            borderColor:'rgba(75,192,192,1)',
            borderWidth:2,
            tension:0.4,
            fill:true,
          },
          {
            label:'Menu Items',
            data:[30,20,40,60,50,70,80,120,60,110],
            backgroundColor:'rgba(153,102,255,0.2)',
            borderColor:'rgba(153,102,255,1)',
            borderWidth:2,
            tension:0.4,
            fill:true,
          }
        ]
      },
      options:{ responsive:true, plugins:{ legend:{ display:true } } }
    });
    // Last Year Wave Graph
    const ctxWaveLastYear = document.getElementById('waveGraphLastYear').getContext('2d');
    new Chart(ctxWaveLastYear, {
      type:'line',
      data:{
        labels:['JAN','FEB','MAR','APR ','MAY ','JUN ','JUL ','AUG ','SEP ','OCT ','NOV ','DEC '],
        datasets:[
          {
            label:'Last Year Data',
            data:[20,10,30,50,40,60,70,100,20,50],
            backgroundColor:'rgba(153,102,255,0.2)',
            borderColor:'rgba(153,102,255,1)',
            borderWidth:2,
            tension:0.4,
            fill:true,
          },
          {
            label:'Tracking Sales',
            data:[22,12,32,52,42,62,72,102,22,52],
            backgroundColor:'rgba(255,99,132,0.2)',
            borderColor:'rgba(255,99,132,1)',
            borderWidth:2,
            tension:0.4,
            fill:true,
          },
          {
            label:'Menu Items',
            data:[28,18,38,58,48,68,78,118,28,58],
            backgroundColor:'rgba(54,162,235,0.2)',
            borderColor:'rgba(54,162,235,1)',
            borderWidth:2,
            tension:0.4,
            fill:true,
          }
        ]
      },
      options:{ responsive:true, plugins:{ legend:{ display:true } } }
    });
    // Draw circle graph
    drawCircleGraph();
  }

  function drawCircleGraph() {
    const ctx = document.getElementById('circleChart').getContext('2d');
    new Chart(ctx, {
      type:'doughnut',
      data:{
        labels:['Fast Food','Asian','Pasta','Mexican','Turkish','Desserts'],
        datasets:[{
          label:'Food Types',
          data:[40,20,15,10,5,10],
          backgroundColor:['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40'],
          hoverOffset:4
        }]
      },
      options:{
        responsive:true,
        plugins:{ legend:{ position:'bottom' } }
      }
    });
  }

  // ================== Role Popup Functions ==================
  function showRolePopup() {
    document.getElementById('rolePopup').style.display='flex';
  }
  function closeRolePopup() {
    document.getElementById('rolePopup').style.display='none';
  }
  let currentRoleEmail='';
  let currentRoleType='';
  function viewRoleInfo(roleType, email) {
    document.getElementById('roleInfoContent').innerHTML= `
      <h4>${roleType} Role Details</h4>
      <p>Email: ${email}</p>
      <p>Role: ${roleType}</p>
      <p>Status: Active</p>
    `;
    window.currentRoleEmail=email;
    window.currentRoleType=roleType;
    showRoleInfo();
  }
  function deleteRole(roleType, email) {
    alert(`Are you sure you want to delete ${roleType} account: ${email}?`);
  }
  function showRoleInfo() {
    document.getElementById('roleInfoPopup').style.display='flex';
  }
  function closeRoleInfo() {
    document.getElementById('roleInfoPopup').style.display='none';
  }
  function sendNotification() {
    if (window.currentRoleEmail) {
      sendEmail(window.currentRoleEmail, 'Notification from Admin', 'You have a new notification from admin.');
    }
  }

  // ================== Driver & Vendor Functions ==================
  function showVendors() { alert('Display all vendors with accept/reject options and history.'); }
  function showPastDeliveries(driverName) { alert('Showing past deliveries for ' + driverName); }
  function showDocuments(driverName) { alert('Showing documents for ' + driverName); }

  // Load driver data (simulate)
  async function loadDrivers() {
    // Example: set static data for demo
    document.querySelectorAll('.driver-profile').forEach((div, index) => {
      if (index === 0) {
        div.querySelector('h4').innerText='John Doe';
        div.querySelectorAll('p')[0].innerText='Contact: 123-456-7890';
        div.querySelectorAll('p')[1].innerText='Plate: ABC-1234';
        div.querySelectorAll('p')[2].innerText='Email: john@gmail.com';
        div.querySelectorAll('p')[3].innerHTML='Ratings: 4.5 &#9733;';
        div.querySelectorAll('p')[4].innerText='Comments: Very punctual.';
      } else if (index===1) {
        div.querySelector('h4').innerText='Jane Smith';
        div.querySelectorAll('p')[0].innerText='Contact: 987-654-3210';
        div.querySelectorAll('p')[1].innerText='Plate: XYZ-5678';
        div.querySelectorAll('p')[2].innerText='Email: jane@gmail.com';
        div.querySelectorAll('p')[3].innerHTML='Ratings: 4.8 &#9733;';
        div.querySelectorAll('p')[4].innerText='Comments: Great driver.';
      }
    });
  }

  // Load vendor data (simulate)
  async function loadVendors() {
    // For demo, static data or fetch from your backend
  }

  // Show all vendors (demo)
  function showVendors() { alert('Display all vendors with accept/reject options and history.'); }

  // When page loads
  window.onload = () => {
    if (!isAuthenticated) {
      document.getElementById('loginModal').style.display='flex';
    } else {
      document.getElementById('loginModal').style.display='none';
    }
    initCharts();
    updateMonthlyData('January');
    loadDrivers();
    loadVendors();
  };// Example: Load admin credentials
async function loadAdmins() {
  const res = await fetch('http://localhost:5501/api/admins');
  const admins = await res.json();
  console.log('Admins:', admins);
  // Use data as needed, e.g., update UI
}

// Example: Add new admin
async function addNewAdmin() {
  const email = document.getElementById('newAdminEmail').value.trim();
  const username = document.getElementById('newAdminUsername').value.trim();
  const password = document.getElementById('newAdminPassword').value.trim();
  if (email && username && password) {
    const res = await fetch('http://localhost:5501/api/admins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const newAdmin = await res.json();
    alert('New admin added: ' + newAdmin.username);
  }
}