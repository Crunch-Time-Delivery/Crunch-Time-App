// errorHandler.js

// Define helpline number or contact info
const HELPLINE_NUMBER = '+1234567890'; // Replace with your actual helpline number
const RELOAD_MESSAGE = 'The system is experiencing heavy load or an error. Please try reloading or contact support.';
// Function to show alert and handle system recovery actions
function handleCriticalError() {
  alert(
    `System overload or error detected.\n` +
    `Please contact our helpline: ${HELPLINE_NUMBER}\n` +
    `The system will now attempt to reboot.`
  );

  // Optionally, redirect to a support or info page
  // window.location.href = 'https://your-support-page.com';

  // Reload the page to attempt recovery
  window.location.reload();
}

// Handle uncaught JavaScript errors globally
window.onerror = function (message, source, lineno, colno, error) {
  console.error('Unhandled error:', {
    message,
    source,
    lineno,
    colno,
    error,
  });
  handleCriticalError();

  // Return true to prevent default browser error alert
  return true;
};

// Handle unhandled promise rejections
window.onunhandledrejection = function (event) {
  console.error('Unhandled promise rejection:', event.reason);
  handleCriticalError();
};

// Optional: Custom resource monitoring (browser limitations apply)
// You can add custom checks here if needed, e.g., monitoring CPU/memory via performance APIs
/*
function checkResources() {
  // Example: monitor performance metrics
  const memoryUsage = performance.memory;
  if (memoryUsage && memoryUsage.usedJSHeapSize > someThreshold) {
    handleCriticalError();
  }
}
setInterval(checkResources, 60000); // Check every minute
*/