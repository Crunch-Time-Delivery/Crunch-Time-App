import { useRef } from 'react';

export function useNotification() {
  const showNotificationMessage = (message, color = '#4CAF50') => {
    let notif = document.getElementById('notification');

    if (!notif) {
      notif = document.createElement('div');
      notif.id = 'notification';
      notif.style.position = 'fixed';
      notif.style.top = '20px';
      notif.style.right = '20px';
      notif.style.zIndex = '9999';
      notif.style.transition = 'opacity 0.5s ease';
      document.body.appendChild(notif);
    }

    notif.innerHTML = `<div style="background-color:${color}; color:#fff; padding:10px; border-radius:4px; max-width:300px; box-shadow:0 2px 8px rgba(0,0,0,0.2);">${message}</div>`;
    notif.style.opacity = '1';

    if (showNotificationMessage.timeoutId) {
      clearTimeout(showNotificationMessage.timeoutId);
    }

    showNotificationMessage.timeoutId = setTimeout(() => {
      notif.style.opacity = '0';
      setTimeout(() => {
        if (notif) notif.remove();
      }, 500);
    }, 3000);
  };

  return { showNotificationMessage };
}