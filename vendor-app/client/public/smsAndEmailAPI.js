// send-sms.js - The backend server file
const express = require("express");
const twilio = require("twilio");
const path = require("path");

// Load environment variables (consider using the 'dotenv' package for local development)
const accountSid = AC031642049dd74fcc581b0fd106936a4f ;
const authToken ="1447e415a2fc483bd2bfbea57451d55d"     ;
const twilioPhoneNumber = +27795349327;

const client = twilio(accountSid, authToken);
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
// Serve static files (your HTML, CSS, JS) from a 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Endpoint to handle SMS sending requests
app.post("/send-notification", (req, res) => {
    const { to, body } = req.body;

    if (!to || !body) {
        return res.status(400).json({ success: false, message: "Missing 'to' or 'body' parameter." });
    }

    client.messages
        .create({
            body: body,
            to: to,
            from: twilioPhoneNumber,
        })
        .then((message) => {
            console.log(`Message SID: ${message.sid}`);
            res.json({ success: true, messageSid: message.sid });
        })
        .catch((error) => {
            console.error("Twilio Error:", error);
            res.status(500).json({ success: false, error: error.message });
        });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});