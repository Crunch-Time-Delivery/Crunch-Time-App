
   // Function to send SMS via backend API
  function sendSms(toNumber, message) {
  fetch('http://localhost:3000/send-sms', {
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
async function sendOTP() {
    const phone = document.getElementById('phone').value;
    await fetch('/send-verification', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ phoneNumber: phone })
    });
    alert('Code Sent!');
}

async function verifyOTP() {
    const phone = document.getElementById('phone').value;
    const code = document.getElementById('code').value;
    const response = await fetch('/verify-otp', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ phoneNumber: phone, code: code })
    });
    const result = await response.json();
    alert(result.verified ? 'Verified!' : 'Invalid Code');
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
  }, 3000);
}



  // Admin credentials
  const adminUsername = 'crunchtimeadmin';
  const adminPassword = 'crunchtimeadmin12';

  // Load driver data
  const driverData = JSON.parse(localStorage.getItem('registeredUser')) || {};
  let driverApproved = false; // For demo, default false; set true when approved
  let generatedOtp = '';
  let otpVerified = false;

  // Variable to track login type
  let userType = null;

  function loadLoginPage() {
    showModal('loginModal');
  }

  // Utility functions to show/hide modals
  function showModal(modalId) {
    document.getElementById(modalId).style.display='block';
  }

  function hideModal(modalId) {
    document.getElementById(modalId).style.display='none';
  }

  // Generate and send OTP
  function generateAndSendOtp() {
    generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    alert(`OTP sent to Email: ${driverData.email}. (OTP: ${generatedOtp})`);

    // Send OTP via your backend endpoint (which uses Twilio)
  fetch('/send-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      phoneNumber: driverData.contact, // or the phone number you want to send to
      otp: generatedOtp
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert(`OTP sent to ${driverData.contact}.`);
    } else {
      alert('Failed to send OTP.');
    }
  })
  .catch(() => {
    alert('Error sending OTP.');
  });

  }

  // Show OTP modal
  function showOtpModal() {
    document.getElementById('otpModal').style.display='block';
    document.getElementById('otpInput').value='';
    otpVerified=false;
  }

  // Hide OTP modal
  function hideOtpModal() {
    document.getElementById('otpModal').style.display='none';
  }

  // OTP verification handlers
  document.getElementById('verifyOtpBtn')?.addEventListener('click', () => {
    const enteredOtp = document.getElementById('otpInput').value.trim();
    if (enteredOtp===generatedOtp) {
      otpVerified=true;
      alert('OTP verified! Awaiting admin approval...');
      hideOtpModal();

      if (driverApproved) {
        alert('Login successful! Accessing driver dashboard...');
        // Redirect based on userType
        if (userType === 'driver') {
          window.location.href='http://127.0.0.1:5501/user-app/client/public/mainpage.html                 ';
        } 
      } else {
        alert('Your account is still pending approval. Please wait.');
      }
    } else {
      alert('Incorrect OTP. Please try again.');
    }
  });

  document.getElementById('resendOtpBtn')?.addEventListener('click', () => {
    generateAndSendOtp();
    alert('OTP resent.');
  });

  // Handle login button click
document.getElementById('loginBtn').addEventListener('click', () => {
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value.trim();

  if (!userType) {
    alert('Please select Driver or Admin login.');
    return;
  }

  if (userType === 'driver') {
    // Check driver credentials
    if (userData.email && userData.email.toLowerCase() === email && userData.password === password) {
      localStorage.setItem('currentUser', JSON.stringify(userData));
      if (userApproved) {
        // Redirect directly if approved
        window.location.href='http://127.0.0.1:5500/user-app/mainpage.html';
      } else {
        generateAndSendOtp();
        showOtpModal();
      }
    } else {
      alert('Invalid driver credentials.');
    }
  } 
  // Reset userType after login attempt
  userType = null;
});
// Buttons for Driver and Admin
document.getElementById('driverBtn')?.addEventListener('click', () => {
  // Redirect directly to driver app page
  window.location.href='http://127.0.0.1:5501/user-app/client/public/mainpage.html';
});
document.getElementById('adminBtn')?.addEventListener('click', () => {
  userType = 'admin';
  showModal('loginModal');
});

// Initialize
window.onload = () => {
  loadLoginPage();
};

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
    alert('Please select User login.');
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
    if (userData.email && userData.email.toLowerCase() === email && userData.password === password) {
      localStorage.setItem('currentUser', JSON.stringify(userData));
      if (driverApproved) {
        window.location.href='http://127.0.0.1:5500/user-app/mainpage.html';
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

// Fetch vendor data
async function fetchUser() {
  const { data: user, error } = await supabase
    .from('user')
    .select(
      `
      username,
      password
    `
    );

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }
  return user;

}