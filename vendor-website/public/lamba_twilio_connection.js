const https = require('https');

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { phoneNumber, message } = body;

  // Twilio credentials (preferably store in environment variables or Secrets Manager)
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER; // Twilio sandbox number
exports.handler =async(event)=> {
try{
const panadaResponse =await
axios.post('https://api.panadadoc.com/public/v1/documents',{
// PanadaDoc API request payload
},{
headers:{
'Authorization':'API-Key your_panadadoc_api_key',
'Content-Type':'appliaction/json'
}
});

const aliResponse = await
axios.get('https://your-alibada-gateway-endpoint',{
headers:{
'Authorization':'APPCODE your_app_code'
}
});

const message =await
client.messages.create({
body:'Your process has completed successfully',
from:'+1234567890',// Your Twilio number
to:'+1987654321'// Recipient's phone number
});

return {
statusCode:200,
body:JSON.stringify({
panada: panadaResponse.data,
ali: aliResponse.data,
smsSid: message.sid
}),
};
}catch(error){
console.error(error);
return{
statusCode:500,
body: JSON.stringify({error: error.message}),
};
}
};
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