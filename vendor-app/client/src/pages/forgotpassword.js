

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
        alert('SMS sent successfully.');
      } else {
        alert('Failed to send SMS: ' + data.error);
      }
    })
    .catch(() => {
      alert('Error sending SMS.');
    });
  }

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

  // Your Supabase credentials
  const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
  const supabaseKey = process.env.SUPABASE_KEY; // actual environment variable or key

  // Initialize Supabase client
  const supabase = supabase.createClient(supabaseUrl, supabaseKey);

  document.getElementById('resetBtn').addEventListener('click', () => {
    const email = document.getElementById('forgotEmail').value.trim();
    const messageDiv = document.getElementById('message');

    if (!email) {
      messageDiv.style.color = 'red';
      messageDiv.textContent = 'Please enter your email address.';
      return;
    }

    handleForgotPassword(email);
  });

  async function handleForgotPassword(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'YOUR_RESET_PASSWORD_PAGE_URL', // Optional: specify where to redirect after clicking the email link
    });

    if (error) {
      console.error('Error sending reset email:', error.message);
      document.getElementById('message').style.color = 'red';
      document.getElementById('message').textContent = 'Error: ' + error.message;
    } else {
      console.log('Password reset email sent successfully!');
      document.getElementById('message').style.color = 'black';
      document.getElementById('message').textContent = `A password reset link has been sent to ${email}.`;
    }
  }

  // Optional: handle password recovery state change (if needed)
  // Note: This part might need to be inside a <script> block with async handling
  // and is more relevant if you have a dedicated page for password recovery.