import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// In your main server file
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Log error, notify support, then exit or restart
  process.exit(1); // or trigger a restart script
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  // Log error, notify support, then exit or restart
  process.exit(1);
});

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>)