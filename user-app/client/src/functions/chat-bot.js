// chat-bot.js
// ============================
// Google Chat AI Bot using Node.js
// ============================

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies
app.use(bodyParser.json());

// ========== Google Chat Webhook Endpoint ==========
app.post('/', async (req, res) => {
  try {
    const data = req.body;

    // Get user info
    const userName = data?.message?.sender?.displayName || 'User';
    const userText = data?.message?.text || '';

    // Generate AI reply (you can replace this with OpenAI API call)
    const aiReply = await generateAIReply(userText);

    // Create Google Chat card response
    const response = {
      cards: [
        {
          header: {
            title: 'AI Chat Bot 🤖',
            subtitle: `Hello ${userName}!`,
            imageUrl: 'https://i.imgur.com/2Q2p1wA.png',
            imageStyle: 'AVATAR'
          },
          sections: [
            {
              widgets: [
                {
                  textParagraph: {
                    text: `<b>You said:</b> ${userText}`
                  }
                },
                {
                  textParagraph: {
                    text: `<b>AI Response:</b> ${aiReply}`
                  }
                }
              ]
            }
          ]
        }
      ]
    };

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing message');
  }
});

// ========== AI Reply Function (dummy) ==========
async function generateAIReply(message) {
  message = message.toLowerCase();

  if (message.includes('hello') || message.includes('hi')) {
    return 'Hello! How can I assist you today?';
  } else if (message.includes('help')) {
    return 'You can ask me anything about your orders, payments, or account info.';
  } else if (message.includes('bye')) {
    return 'Goodbye! Have a great day! 👋';
  } else {
    return 'I am learning new things every day! Could you rephrase that?';
  }
}

// ========== Start Server ==========
app.listen(PORT, () => {
  console.log(`Google Chat bot running at http://localhost:${PORT}`);
});
