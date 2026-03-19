import { useState } from 'react';
import { useNotification } from './useNotification';

export function useSms() {
  const { showNotificationMessage } = useNotification();

  const sendTwilioSms = async (to, message) => {
    if (!to || !message) {
      showNotificationMessage('Phone number or message missing', '#f44336');
      return;
    }
    const phonePattern = /^\+?\d{10,15}$/;
    if (!phonePattern.test(to)) {
      showNotificationMessage('Invalid phone number format', '#f44336');
      return;
    }

    // Show loading indicator
    showNotificationMessage('Sending SMS...');
    try {
      const response = await fetch('/notify/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, message }),
      });
      const data = await response.json();
      if (data.success) {
        showNotificationMessage('SMS sent successfully!', '#4CAF50');
      } else {
        showNotificationMessage(`Failed to send SMS: ${data.error || 'Unknown error'}`, '#f44336');
      }
    } catch (err) {
      showNotificationMessage('Error sending SMS.', '#f44336');
    }
  };

  return { sendTwilioSms };
}