const https = require('https');
const axios = require('axios');
const twilio = require('twilio');

exports.handler = async (event) => {
  try {
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

    const client = twilio(accountSid, authToken);

    const panadaResponse = await axios.post('https://api.panadadoc.com/public/v1/documents', {
      // PanadaDoc API request payload
    }, {
      headers: {
        'Authorization': 'API-Key your_panadadoc_api_key',
        'Content-Type': 'application/json'
      }
    });

    const aliResponse = await axios.get('https://your-alibaba-gateway-endpoint', {
      headers: {
        'Authorization': 'APPCODE your_app_code'
      }
    });

    const smsMessage = await client.messages.create({
      body: 'Your process has completed successfully',
      from: fromNumber, // Your Twilio number
      to: phoneNumber // Recipient's phone number
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        panada: panadaResponse.data,
        ali: aliResponse.data,
        smsSid: smsMessage.sid
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};