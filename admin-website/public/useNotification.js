import { useRef } from 'react';

export function useNotification() {
  const notificationRef = useRef(null);
  const timeoutRef = useRef(null);

  const showNotificationMessage = (message, color = '#4CAF50') => {
    let notif = notificationRef.current;

    // Create notification container if it doesn't exist
    if (!notif) {
      notif = document.createElement('div');
      notif.id = 'notification';
      notif.style.position = 'fixed';
      notif.style.top = '20px';
      notif.style.right = '20px';
      notif.style.zIndex = '9999';
      notif.style.transition = 'opacity 0.5s ease, transform 0.3s ease';
      notif.style.opacity = '0'; // start hidden
      document.body.appendChild(notif);
      notificationRef.current = notif;
    }

    // Clear previous timeout if exists
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set the notification content
    notif.innerHTML = `
      <div style="
        background-color:${color}; 
        color:#fff; 
        padding:10px; 
        border-radius:4px; 
        max-width:300px; 
        box-shadow:0 2px 8px rgba(0,0,0,0.2);
        font-family:Arial, sans-serif;
      ">
        ${message}
      </div>
    `;

    // Animate in
    notif.style.opacity = '1';

    // Set timeout to hide notification
    timeoutRef.current = setTimeout(() => {
      notif.style.opacity = '0';

      // Remove element after fade out
      setTimeout(() => {
        if (notif) {
          notif.remove();
          notificationRef.current = null;
        }
      }, 500);
    }, 3000);
  };

  // Optional cleanup if component unmounts
  const cleanup = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (notificationRef.current) {
      notificationRef.current.remove();
      notificationRef.current = null;
    }
  };

  return { showNotificationMessage, cleanup };
}