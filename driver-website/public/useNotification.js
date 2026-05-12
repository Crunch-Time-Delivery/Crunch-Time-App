import { useRef } from 'react';

export function useNotification() {
  const notificationRef = useRef(null);
  const timeoutRef = useRef(null);

  const showNotificationMessage = (text, color = '#333') => {
    let box = notificationRef.current;

    // Create notification container if it doesn't exist
    if (!box) {
      box = document.createElement('div');
      box.id = 'notificationMessage';
      box.style.position = 'fixed';
      box.style.bottom = '20px';
      box.style.left = '50%';
      box.style.transform = 'translateX(-50%)';
      box.style.padding = '12px 20px';
      box.style.borderRadius = '8px';
      box.style.color = '#fff';
      box.style.fontSize = '14px';
      box.style.zIndex = '9999';
      box.style.transition = 'opacity 0.3s ease';
      box.style.maxWidth = '80%';
      box.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
      document.body.appendChild(box);
      notificationRef.current = box;
    }

    // Clear any existing timeout to prevent overlapping hide animations
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set styles and text
    box.style.backgroundColor = color;
    box.innerText = text;
    box.style.opacity = '1';

    // Set timeout to hide notification
    timeoutRef.current = setTimeout(() => {
      box.style.opacity = '0';

      // Remove element after fade-out
      setTimeout(() => {
        if (box) {
          box.remove();
          notificationRef.current = null;
        }
      }, 300);
    }, 4000);
  };

  // Optional: cleanup function if needed
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