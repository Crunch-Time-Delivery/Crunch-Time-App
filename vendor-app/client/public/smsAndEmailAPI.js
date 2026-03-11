const express = require("express");
const twilio = require("twilio");
const path = require("path");

// Load environment variables (consider using 'dotenv' for local dev)
// For production, securely store these credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'AC031642049dd74fcc581b0fd106936a4f';
const authToken = process.env.TWILIO_AUTH_TOKEN || '1447e415a2fc483bd2bfbea57451d55d';
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || '+27795349327';

const client = twilio(accountSid, authToken);
const app = express();
const port = 3000;

app.use(express.json());
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
        .create({ body, to, from: twilioPhoneNumber })
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
 * Send multiple SMS messages concurrently
 */
app.post("/send-multiple", (req, res) => {
    const { messages } = req.body; // array of { to, body }
    if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ success: false, message: "Invalid 'messages' array." });
    }
    const sendPromises = messages.map(({ to, body }) => {
        return client.messages.create({ body, to, from: twilioPhoneNumber });
    });
    Promise.all(sendPromises)
        .then((results) => {
            const sids = results.map((msg) => msg.sid);
            res.json({ success: true, messageSids: sids });
        })
        .catch((error) => {
            console.error("Error sending messages:", error);
            res.status(500).json({ success: false, error: error.message });
        });
});

/**
 * Schedule a message to be sent after a delay (in seconds)
 * Note: For production, consider using a task queue or scheduler
 */
app.post("/schedule-message", (req, res) => {
    const { to, body, delaySeconds } = req.body;
    if (!to || !body || typeof delaySeconds !== "number") {
        return res.status(400).json({ success: false, message: "Missing or invalid parameters." });
    }
    setTimeout(() => {
        client.messages
            .create({ body, to, from: twilioPhoneNumber })
            .then((msg) => {
                console.log(`Scheduled message sent. SID: ${msg.sid}`);
                // Optionally, store scheduled message info in a database
            })
            .catch((err) => {
                console.error("Error sending scheduled message:", err);
            });
    }, delaySeconds * 1000);
    res.json({ success: true, message: `Message scheduled in ${delaySeconds} seconds.` });
});

/**
 * Get the status of a message by SID
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

/**
 * Bulk send messages with concurrency control
 */
app.post("/send-bulk", async (req, res) => {
    const { messages } = req.body; // array of { to, body }
    if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ success: false, message: "Invalid 'messages' array." });
    }
    const maxConcurrency = 5; // limit concurrent sends
    const results = [];
    for (let i = 0; i < messages.length; i += maxConcurrency) {
        const chunk = messages.slice(i, i + maxConcurrency);
        const promises = chunk.map(({ to, body }) => client.messages.create({ to, body, from: twilioPhoneNumber }));
        try {
            const sentMessages = await Promise.all(promises);
            results.push(...sentMessages);
        } catch (err) {
            console.error("Error in bulk message:", err);
            // handle retries if needed
        }
    }
    const sids = results.map(m => m.sid);
    res.json({ success: true, messageSids: sids });
});

/**
 * Dummy endpoint for cancelling scheduled messages
 * Note: Twilio does not support canceling messages once sent.
 */
app.post("/cancel-scheduled", (req, res) => {
    const { scheduleId } = req.body;
    // Implement your own scheduling system to support cancellations
    res.json({ success: false, message: "Cancellation not supported in this demo." });
});

/**
 * Send templated messages
 */
app.post("/send-template", (req, res) => {
    const { to, templateId, variables } = req.body;
    const templates = {
        welcome: "Hello {name}, welcome to our service!",
        reminder: "Hi {name}, your order is on {orderId}."
    };
    const template = templates[templateId];
    if (!template) {
        return res.status(400).json({ success: false, message: "Invalid template ID." });
    }
    let messageBody = template;
    for (const key in variables) {
        messageBody = messageBody.replace(`{${key}}`, variables[key]);
    }
    client.messages
        .create({ to, body: messageBody, from: twilioPhoneNumber })
        .then((msg) => res.json({ success: true, messageSid: msg.sid }))
        .catch((err) => {
            console.error("Error sending template message:", err);
            res.status(500).json({ success: false, error: err.message });
        });
});

// Start server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});