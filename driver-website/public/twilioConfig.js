async function sendNotification() {
  const config = await fetchConfig('twilioConfig.json');

  // Example: Send SMS
  fetch('https://your-backend-api/send-sms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      accountSid: config.accountSid,
      authToken: config.authToken,
      from: config.fromNumber,
      to: config.toNumber,
      message: 'Test SMS message'
    })
  });

  // Example: Send Email (via your backend or email API)
  fetch('https://your-backend-api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: config.email,
      subject: 'Test Email',
      message: 'This is a test email'
    })
  });
}