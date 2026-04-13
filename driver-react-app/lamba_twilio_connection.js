const https = require('https');

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { phoneNumber, message } = body;

  // Twilio credentials (preferably store in environment variables or Secrets Manager)
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER; // Twilio sandbox number

  if (!accountSid || !authToken || !fromNumber) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Twilio credentials not configured' }),
    };
  }

  const postData = new URLSearchParams({
    To: phoneNumber,
    From: fromNumber,
    Body: message,
  }).toString();

  const options = {
    hostname: 'api.twilio.com',
    port: 443,
    path: `/2010-04-01/Accounts/${accountSid}/Messages.json`,
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({
            statusCode: 200,
            body: JSON.stringify({ message: 'SMS sent', data: JSON.parse(data) }),
          });
        } else {
          reject(new Error(`Status code: ${res.statusCode}, body: ${data}`));
        }
      });
    });

    req.on('error', (e) => {
      reject({ statusCode: 500, body: JSON.stringify({ error: e.message }) });
    });

    req.write(postData);
    req.end();
  });
};