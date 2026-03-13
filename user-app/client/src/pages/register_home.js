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


  // OTP and registration logic
  let generatedOtp = '';
  let userData = {};

  function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  function sendEmail(to, subject, body) {
    console.log(`Email to ${to}: ${body}`);
    return Promise.resolve();
  }
  function sendSms(to, message) {
    console.log(`SMS to ${to}: ${message}`);
    return Promise.resolve();
  }

  function showOtpPage() {
    document.getElementById('registerPopup').style.display='none';
    document.getElementById('otpPage').style.display='block';
  }

  // Registration form submit
  document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    userData = {
      fullName: document.getElementById('fullName').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      password: document.getElementById('password').value.trim()
    };
    generatedOtp = generateOtp();

    Promise.all([
      sendEmail(userData.email, 'Your OTP Code', `Your OTP is ${generatedOtp}`),
      sendSms(userData.phone, `Your OTP is ${generatedOtp}`)
    ]).then(() => {
      alert('OTP has been sent to your email and phone.');
      showOtpPage();
    });
  });

  // OTP verification
  document.getElementById('submitOtpBtn').addEventListener('click', () => {
    const enteredOtp = document.getElementById('enteredOtp').value.trim();
    if (enteredOtp === generatedOtp) {
      alert('OTP verified! Registration complete.');
      // Save user data
      let users = JSON.parse(localStorage.getItem('users')) || [];
      if (!users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
        users.push({
          email: userData.email,
          password: userData.password,
          fullName: userData.fullName,
          phone: userData.phone
        });
        localStorage.setItem('users', JSON.stringify(users));
      } else {
        alert('Email already registered. Please login.');
      }
      // Send email to admin
      sendEmail('crunchtimedrivein@gmail.com', 'New User Registration', 
        `Name: ${userData.fullName}\nEmail: ${userData.email}\nPhone: ${userData.phone}\nPassword: ${userData.password}`)
        .then(() => {
          console.log('User data sent to admin email.');
        });
      // Redirect or close modal
      window.location.href=''; // Or redirect to login
    } else {
      alert('Incorrect OTP. Please try again.');
    }
  });

  // Resend OTP
  document.getElementById('resendOtp').addEventListener('click', () => {
    generatedOtp = generateOtp();
    Promise.all([
      sendEmail(userData.email, 'Your OTP Code', `Your OTP is ${generatedOtp}`),
      sendSms(userData.phone, `Your OTP is ${generatedOtp}`)
    ]).then(() => {
      alert('OTP resent to your email and phone.');
    });
  });

  // Login link
  document.getElementById('loginBtnCenter').addEventListener('click', () => {
    alert('Redirect to login page.');
    // You can implement redirect if needed
  });