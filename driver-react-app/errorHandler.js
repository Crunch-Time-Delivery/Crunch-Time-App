// errorHandler.js

// Define helpline number or contact info
const HELPLINE_NUMBER = ''; // change to your helpline
const RELOAD_MESSAGE = 'The system is experiencing heavy load or an error. Please try reloading or contact support.';

// Function to show alert or redirect user
function handleCriticalError() {
  alert(`System overload or error detected.\nPlease contact our helpline: ${HELPLINE_NUMBER}\nThe system will now reboot.`);

  // Optionally, redirect to a support page
  // window.location.href = 'https://your-support-page.com';

  // Reload the page to reboot the system
  window.location.reload();
}

// Global error handler for uncaught exceptions
window.onerror = function (message, source, lineno, colno, error) {
  console.error('Unhandled error:', message);
  handleCriticalError();
  return true; // Prevents default handling
};

// Handle unhandled promise rejections
window.onunhandledrejection = function (event) {
  console.error('Unhandled promise rejection:', event.reason);
  handleCriticalError();
};

// Optional: Monitor resource usage or heavy load
// Note: In browsers, resource monitoring is limited,
// but you can implement custom checks if needed.