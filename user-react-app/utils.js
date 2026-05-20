// utils.js
// Example: generate a UUID
const { v4: uuidv4 } = require('uuid');

// AWS SDK clients
const AWS = require('aws-sdk');
const location = new AWS.Location({ region: 'your-region' });
const sns = new AWS.SNS({ region: 'your-region' });
const lambda = new AWS.Lambda({ region: 'your-region' });

// Twilio SDK
const twilio = require('twilio');
const twilioClient = twilio('YOUR_TWILIO_ACCOUNT_SID', 'YOUR_TWILIO_AUTH_TOKEN');

// PayFast SDK or API integration (assuming REST API)
const axios = require('axios');

// Generate UUID
function generateUUID() {
  return uuidv4();
}

// Google Maps via AWS Location Service: Calculate route or get map data
async function getLocationMapData(params) {
  const { TrackerName, DeviceId } = params; // example params
  try {
    const data = await location.getDevicePosition({ TrackerName, DeviceId }).promise();
    return data;
  } catch (error) {
    console.error('Error fetching location data:', error);
    throw error;
  }
}

// Send SMS via Twilio
async function sendSms(to, message) {
  try {
    const messageInstance = await twilioClient.messages.create({
      body: message,
      from: 'YOUR_TWILIO_PHONE_NUMBER',
      to: to
    });
    return messageInstance;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
}

// Send Email via AWS SES (assuming SES is configured)
const ses = new AWS.SES({ region: 'your-region' });
async function sendEmail(toAddresses, subject, body) {
  const params = {
    Destination: {
      ToAddresses: toAddresses,
    },
    Message: {
      Body: {
        Text: { Data: body },
      },
      Subject: { Data: subject },
    },
    Source: 'your-email@example.com',
  };
  try {
    const result = await ses.sendEmail(params).promise();
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Invoke AWS Lambda
async function invokeLambda(functionName, payload) {
  const params = {
    FunctionName: functionName,
    Payload: JSON.stringify(payload),
  };
  try {
    const response = await lambda.invoke(params).promise();
    return JSON.parse(response.Payload);
  } catch (error) {
    console.error('Error invoking Lambda:', error);
    throw error;
  }
}

// Publish message to SNS
async function publishSns(topicArn, message) {
  const params = {
    TopicArn: topicArn,
    Message: message,
  };
  try {
    const result = await sns.publish(params).promise();
    return result;
  } catch (error) {
    console.error('Error publishing SNS:', error);
    throw error;
  }
}

// PayFast Payment URL or API call
async function initiatePayFastPayment(paymentData) {
  const payfastUrl = 'https://www.payfast.co.za/eng/process'; // or sandbox URL
  const params = new URLSearchParams(paymentData);
  try {
    const response = await axios.post(payfastUrl, params);
    return response.data; // Or handle response as needed
  } catch (error) {
    console.error('Error initiating PayFast payment:', error);
    throw error;
  }
}

module.exports = {
  generateUUID,
  getLocationMapData,
  sendSms,
  sendEmail,
  invokeLambda,
  publishSns,
  initiatePayFastPayment
};