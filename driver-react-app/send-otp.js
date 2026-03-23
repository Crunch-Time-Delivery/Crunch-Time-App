// Install: npm install twilio dotenv
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

app.post('/send-verification', (req, res) => {
    const { phoneNumber } = req.body;
    
    client.verify.v2.services(process.env.VERIFY_SERVICE_SID)
        .verifications
        .create({ to: `+${phoneNumber}`, channel: 'sms' }) // Use 'whatsapp' for WA
        .then(verification => res.json({ status: 'pending' }))
        .catch(e => res.status(500).send(e));
});
