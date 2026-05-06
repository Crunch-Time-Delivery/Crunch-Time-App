// errorHandler.js

// Define helpline number or contact info
const HELPLINE_NUMBER = '+1234567890'; // Replace with your actual helpline number
const RELOAD_MESSAGE = 'The system is experiencing heavy load or an error. Please try reloading or contact support.';

// Function to show alert and optionally reload or redirect
function handleCriticalError() {
  alert(
    `System overload or error detected.\n` +
    `Please contact our helpline: ${HELPLINE_NUMBER}\n` +
    `The system will now attempt to reboot.`
  );

  // Optionally, redirect to a support or error info page
  // window.location.href = 'https://your-support-page.com';

  // Reload the page to attempt recovery
  window.location.reload();
}

// Global error handler for uncaught exceptions
window.onerror = function (message, source, lineno, colno, error) {
  console.error('Unhandled error:', {
    message,
    source,
    lineno,
    colno,
    error,
  });
  handleCriticalError();
  return true; // Prevent default handling
};

// Handle unhandled promise rejections
window.onunhandledrejection = function (event) {
  console.error('Unhandled promise rejection:', event.reason);
  handleCriticalError();
};

// Optional: Implement custom resource monitoring if needed
// Note: Browser limitations restrict resource monitoring capabilities
// You can add custom checks here if you implement specific heavy-load detection