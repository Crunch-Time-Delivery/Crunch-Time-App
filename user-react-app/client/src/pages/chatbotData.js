// chatbotData.js

// Example array of predefined responses or intents
const chatbotResponses = [
  {
    intent: 'greeting',
    patterns: ['Hi', 'Hello', 'Hey', 'Good morning', 'Good evening'],
    responses: [
      'Hello! How can I assist you today?',
      'Hi there! What can I do for you?',
      'Hey! Need any help?'
    ]
  },
  {
    intent: 'bye',
    patterns: ['Bye', 'Goodbye', 'See you later'],
    responses: [
      'Goodbye! Have a great day!',
      'See you later!',
      'Take care!'
    ]
  },
  {
    intent: 'help',
    patterns: ['Help', 'Can you help me?', 'I need assistance'],
    responses: [
      'Sure! I am here to help. What do you need?',
      'Absolutely, let me assist you.',
      'I am here. Please tell me how I can help.'
    ]
  }
  // You can add more intents and responses as needed
];

// Function to get a response based on user message
function getChatbotResponse(message) {
  // Simple matching logic (can be extended with NLP)
  for (let entry of chatbotResponses) {
    for (let pattern of entry.patterns) {
      if (message.toLowerCase().includes(pattern.toLowerCase())) {
        // Return a random response from matched intent
        const responses = entry.responses;
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
  }
  // Default fallback response
  return "Sorry, I didn't understand that. Can you rephrase?";
}

// Export the function
export { getChatbotResponse };