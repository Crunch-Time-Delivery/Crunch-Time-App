import { useRef } from 'react';

export function useNotification() {
  const showNotificationMessage = (text, color = '#333') => {
    let box = document.getElementById('notificationMessage');

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
      document.body.appendChild(box);
    }

    box.style.backgroundColor = color;
    box.innerText = text;
    box.style.opacity = '1';

    if (showNotificationMessage.timeoutId) {
      clearTimeout(showNotificationMessage.timeoutId);
    }

    showNotificationMessage.timeoutId = setTimeout(() => {
      box.style.opacity = '0';
      setTimeout(() => {
        if (box) box.remove();
      }, 300);
    }, 4000);
  };

  return { showNotificationMessage };
}