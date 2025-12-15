// send-sms.js - The backend server file with extended functions
const express = require("express");
const twilio = require("twilio");
const path = require("path");

// Load environment variables (consider using the 'dotenv' package for local development)
const accountSid = 'AC031642049dd74fcc581b0fd106936a4f';
const authToken = '1447e415a2fc483bd2bfbea57451d55d';
const twilioPhoneNumber = '+27795349327';

const client = twilio(accountSid, authToken);
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
// Serve static files (your HTML, CSS, JS) from a 'public' directory
app.use(express.static(path.join(__dirname, "public")));

/**
 * Send a single SMS message
 */
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

/**
 * Send multiple SMS messages
 */
app.post("/send-multiple", (req, res) => {
    const { messages } = req.body; // Expecting an array of { to, body }

    if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ success: false, message: "Invalid 'messages' array." });
    }

    const sendMessages = messages.map(({ to, body }) => {
        return client.messages.create({
            body,
            to,
            from: twilioPhoneNumber,
        });
    });

    Promise.all(sendMessages)
        .then((results) => {
            const sids = results.map(msg => msg.sid);
            res.json({ success: true, messageSids: sids });
        })
        .catch((error) => {
            console.error("Error sending multiple messages:", error);
            res.status(500).json({ success: false, error: error.message });
        });
});

/**
 * Schedule a message to be sent after a delay (in seconds)
 */
app.post("/schedule-message", (req, res) => {
    const { to, body, delaySeconds } = req.body;

    if (!to || !body || typeof delaySeconds !== 'number') {
        return res.status(400).json({ success: false, message: "Missing or invalid parameters." });
    }

    // Schedule the message using setTimeout
    setTimeout(() => {
        client.messages
            .create({
                body: body,
                to: to,
                from: twilioPhoneNumber,
            })
            .then((message) => {
                console.log(`Scheduled message sent. SID: ${message.sid}`);
            })
            .catch((error) => {
                console.error("Error sending scheduled message:", error);
            });
    }, delaySeconds * 1000);

    res.json({ success: true, message: `Message scheduled to be sent in ${delaySeconds} seconds.` });
});

/**
 * Check the status of a message by SID
 */
app.get("/message-status/:sid", (req, res) => {
    const { sid } = req.params;

    client.messages(sid)
        .fetch()
        .then((message) => {
            res.json({ success: true, status: message.status, messageSid: message.sid });
        })
        .catch((error) => {
            console.error("Error fetching message status:", error);
            res.status(500).json({ success: false, error: error.message });
        });
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});