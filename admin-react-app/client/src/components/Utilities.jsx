import { useState, useRef } from 'react';

// Utility functions as hooks or functions

// Simulate sending email
export function useEmail() {
  const sendEmail = (to, subject, body) => {
    alert(`Simulated Email to ${to}:\nSubject: ${subject}\n${body}`);
  };
  return { sendEmail };
}

// Simulate sending notification
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

  const cancelNotification = () => {
    if (showNotificationMessage.timeoutId) {
      clearTimeout(showNotificationMessage.timeoutId);
    }
    const notif = document.getElementById('notification');
    if (notif) {
      notif.style.opacity = '0';
      setTimeout(() => notif.remove(), 500);
    }
  };

  return { showNotificationMessage, cancelNotification };
}

// Loading indicator
export function useLoading() {
  const showLoading = () => {
    let loader = document.getElementById('loading');
    if (!loader) {
      loader = document.createElement('div');
      loader.id = 'loading';
      loader.innerHTML = 'Loading...';
      loader.style.position = 'fixed';
      loader.style.top = '50%';
      loader.style.left = '50%';
      loader.style.transform = 'translate(-50%, -50%)';
      loader.style.padding = '20px';
      loader.style.backgroundColor = '#fff';
      loader.style.border = '1px solid #ccc';
      loader.style.borderRadius = '8px';
      loader.style.zIndex = '99999';
      document.body.appendChild(loader);
    }
    loader.style.display = 'block';
  };

  const hideLoading = () => {
    const loader = document.getElementById('loading');
    if (loader) loader.style.display = 'none';
  };

  return { showLoading, hideLoading };
}

// Phone validation
export function isValidPhoneNumber(phone) {
  const pattern = /^\+?\d{10,15}$/;
  return pattern.test(phone);
}

// Send SMS via backend API
export function useSms() {
  const { showLoading, hideLoading } = useLoading();
  const { showNotificationMessage } = useNotification();

  const sendTwilioSms = async (to, message) => {
    if (!to || !message) {
      showNotificationMessage('Phone number or message missing', '#f44336');
      return;
    }
    if (!isValidPhoneNumber(to)) {
      showNotificationMessage('Invalid phone number format', '#f44336');
      return;
    }
    showLoading();
    showNotificationMessage('Sending SMS...');
    try {
      const response = await fetch('/notify/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, message }),
      });
      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      if (data.success) {
        showNotificationMessage('SMS sent successfully!', '#4CAF50');
      } else {
        showNotificationMessage(`Failed to send SMS: ${data.error || 'Unknown error'}`, '#f44336');
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
      showNotificationMessage('Error sending SMS.', '#f44336');
    } finally {
      hideLoading();
    }
  };

  return { sendTwilioSms };
}