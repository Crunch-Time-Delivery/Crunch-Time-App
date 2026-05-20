const https = require('https');
const axios = require('axios');

exports.handler = async (event) => {
  // Parse request body
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON in request body' }),
    };
  }

  const { phoneNumber, message } = body;

  // Validate input
  if (!phoneNumber || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing phoneNumber or message' }),
    };
  }

  // Validate Twilio credentials from environment variables
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Twilio credentials not configured' }),
    };
  }

  try {
    // Make API call to PandaDoc
    const pandaResponse = await axios.post('https://api.panadadoc.com/public/v1/documents', {
      // Your payload here
    }, {
      headers: {
        'Authorization': 'API-Key your_panadadoc_api_key',
        'Content-Type': 'application/json',
      },
    });

    // Make API call to AliBada
    const aliResponse = await axios.get('https://your-alibada-gateway-endpoint', {
      headers: {
        'Authorization': 'APPCODE your_app_code',
      },
    });

    // Send SMS via Twilio
    const messageResponse = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      new URLSearchParams({
        To: phoneNumber,
        From: fromNumber,
        Body: message,
      }).toString(),
      {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Process completed successfully',
        pandaDocData: pandaResponse.data,
        aliBadaData: aliResponse.data,
        smsSid: JSON.parse(messageResponse.data).sid,
      }),
    };
  } catch (err) {
    console.error('Error occurred:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};