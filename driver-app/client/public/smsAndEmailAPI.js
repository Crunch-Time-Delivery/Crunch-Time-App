const express = require("express");
const twilio = require("twilio");
const path = require("path");

// Load environment variables (consider using 'dotenv' for local dev)
// For production, securely store these credentials
const accountSid = 'AC031642049dd74fcc581b0fd106936a4f';
const authToken = '1447e415a2fc483bd2bfbea57451d55d';
const twilioPhoneNumber = '+27795349327';

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
 */
app.post("/schedule-message", (req, res) => {
    const { to, body, delaySeconds } = req.body;
    if (!to || !body || typeof delaySeconds !== "number") {
        return res.status(400).json({ success: false, message: "Missing or invalid parameters." });
    }
    // Schedule via setTimeout (for demo; for production, consider a job queue)
    setTimeout(() => {
        client.messages
            .create({ body, to, from: twilioPhoneNumber })
            .then((msg) => {
                console.log(`Scheduled message sent. SID: ${msg.sid}`);
                // Optionally, store scheduled message info in database for management
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
    const maxConcurrency = 5; // limit concurrent sends to avoid rate limits
    const results = [];
    for (let i = 0; i < messages.length; i += maxConcurrency) {
        const chunk = messages.slice(i, i + maxConcurrency);
        const promises = chunk.map(({ to, body }) => client.messages.create({ to, body, from: twilioPhoneNumber }));
        try {
            const sentMessages = await Promise.all(promises);
            results.push(...sentMessages);
        } catch (err) {
            console.error("Error in bulk message:", err);
            // Optionally handle retries or partial success
        }
    }
    const sids = results.map(m => m.sid);
    res.json({ success: true, messageSids: sids });
});

/**
 * Cancel a scheduled message (if stored and cancellable)
 * Note: Twilio doesn't support canceling messages once sent.
 * You need to implement your own scheduling and storage to cancel.
 */
app.post("/cancel-scheduled", (req, res) => {
    const { scheduleId } = req.body;
    // Implement your own storage and cancellation logic
    // For demo, just respond with a message
    res.json({ success: false, message: "Cancellation not supported in this demo." });
});

// Additional utility: Send templated messages
app.post("/send-template", (req, res) => {
    const { to, templateId, variables } = req.body;
    // For example, you might have predefined templates
    const templates = {
        welcome: "Hello {name}, welcome to our service!",
        reminder: "Hi {name}, your appointment is on {date}."
    };
    const template = templates[templateId];
    if (!template) {
        return res.status(400).json({ success: false, message: "Invalid template ID." });
    }
    // Replace variables
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
app.listen(3000, () => {
  console.log("Server listening at http://localhost:3000");
});