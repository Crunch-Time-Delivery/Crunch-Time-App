  // Function to send SMS via backend API
  function sendSms(toNumber, message) {
  fetch('http://localhost:5501/send-sms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ to: toNumber, message: message })
  })
  .then(response => response.json())
  .then(data => {
    if(data.success) {
      // Show success notification
      showNotification('SMS sent successfully.', 'success');
    } else {
      // Show failure notification with error message
      showNotification('Failed to send SMS: ' + data.error, 'error');
    }
  })
  .catch(() => {
    // Show error notification if fetch fails
    showNotification('Error sending SMS.', 'error');
  });
}

// Helper function to display notifications
function showNotification(message, type) {
  // Create a notification element
  const notification = document.createElement('div');
  notification.innerText = message;
  notification.className = `notification ${type}`; // style based on type
  
  // Append to body or a specific container
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    document.body.removeChild(notification);
  }, 5501);
}

  // Generate OTP
  let currentOTP = '';

  function generateOTP() {
    currentOTP = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated OTP:', currentOTP); // For demo purposes

    // Send OTP via your backend endpoint (simulate here)
    fetch('/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber: 'dummy-phone', // Replace with actual contact if available
        otp: currentOTP
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert(`OTP sent to your email/phone.`);
      } else {
        alert('Failed to send OTP.');
      }
    })
    .catch(() => {
      alert('Error sending OTP.');
    });
  }

  // On page load
  window.onload = () => {
    showLogin();

    document.getElementById('vendorBtn').addEventListener('click', () => {
      window.location.href = 'http://127.0.0.1:5501/vendor-app/client/public/mainpage.html';
    });

    document.getElementById('adminBtn').addEventListener('click', () => {
      const username = prompt('Enter admin username:');
      const pass = prompt('Enter admin password:');
      const adminUsername = 'crunchtimeadmin';
      const adminPassword = 'crunchtimeadmin';
      if (username === adminUsername && pass === adminPassword) {
        alert('Admin login success!');
        window.location.href='http://127.0.0.1:5500/vendor-app/admin/admin_dashboard.html';
      } else {
        alert('Invalid admin credentials.');
      }
    });

    generateOTP();
  };

  function showLogin() {
    document.getElementById('loginModal').style.display='flex';
  }

  function verifyLogin() {
    const username = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();

    const adminUsername = 'crunchtimeadmin';
    const adminPassword = 'crunchtimeadmin';

    if (username === adminUsername && pass === adminPassword) {
      alert('Admin login success!');
      window.location.href='http://127.0.0.1:5500/vendor-app/admin/admin_dashboard.html';
      return;
    }

    // Here, verify vendor credentials (e.g., from localStorage or backend)
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email===username && u.pass===pass);
    if (user) {
      // Save login status if needed
      localStorage.setItem('vendorLoggedIn', 'true');
      // Show OTP modal
      generateOTP();
      showOTP();
    } else {
      alert('Invalid credentials.');
    }
  }

  function showOTP() {
    document.getElementById('otpModal').style.display='flex';
  }

  function verifyOTP() {
    const inputOTP = document.getElementById('otpInput').value.trim();
    if (inputOTP === currentOTP) {
      alert('OTP verified! Redirecting...');
      document.getElementById('otpModal').style.display='none';
      // Redirect to vendor page
      alert('Login successful!');
      window.location.href='http://127.0.0.1:5501/vendor-app/client/public/mainpage.html';
    } else {
      alert('Incorrect OTP.');
    }
  }

  // Validation functions
function validateUsername(username) {
  if (!username) {
    alert('Username cannot be empty.');
    return false;
  }
  // Example: username must be at least 4 characters
  if (username.length < 4) {
    alert('Username must be at least 4 characters long.');
    return false;
  }
  // Add more rules if needed
  return true;
}

function validatePassword(password) {
  if (!password) {
    alert('Password cannot be empty.');
    return false;
  }
  // Example rules for password:
  // At least 8 characters, contains uppercase, lowercase, number, special char
  const minLength = 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#\$%\^&\*]/.test(password);

  if (password.length < minLength) {
    alert('Password must be at least 8 characters long.');
    return false;
  }
  if (!hasUpper) {
    alert('Password must contain at least one uppercase letter.');
    return false;
  }
  if (!hasLower) {
    alert('Password must contain at least one lowercase letter.');
    return false;
  }
  if (!hasNumber) {
    alert('Password must contain at least one number.');
    return false;
  }
  if (!hasSpecial) {
    alert('Password must contain at least one special character (!@#$%^&*).');
    return false;
  }
  return true;
}

document.getElementById('loginBtn').addEventListener('click', () => {
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value.trim();

  if (!userType) {
    alert('Please select Driver or Admin login.');
    return;
  }
  
  // Validate username/email
  if (!validateUsername(email)) {
    return;
  }
  // Validate password
  if (!validatePassword(password)) {
    return;
  }

  // Existing credential checks...
  if (userType === 'driver') {
    if (driverData.email && driverData.email.toLowerCase() === email && driverData.password === password) {
      localStorage.setItem('currentUser', JSON.stringify(driverData));
      if (driverApproved) {
        window.location.href='http://127.0.0.1:5501/vendor-app/client/public/mainpage.html';
      } else {
        generateAndSendOtp();
        showOtpModal();
      }
    } else {
      alert('Invalid driver credentials.');
    }
  } 
  userType = null;
});