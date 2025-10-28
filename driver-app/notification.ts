// notification.ts

// Function to show notification with sound
function showNotification(message: string, soundFile: string): void {
  // Play ringing sound
  const audio = new Audio(soundFile);
  audio.play();

  // Display notification message
  const container = document.getElementById('notificationContainer');
  if (container) {
    container.innerHTML = `<p>${message}</p>`;
  }
}

// Example: automatically trigger a notification (for testing)
// showNotification("You have a new notification!", "notification.mp3");