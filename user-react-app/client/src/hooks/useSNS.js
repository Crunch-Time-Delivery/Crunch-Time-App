
import { useState } from 'react';

const useSNS = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendSMS = async (phoneNumber, message) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Extract error message if available
        const errorMsg = data.error || 'Failed to send SMS';
        throw new Error(errorMsg);
      }

      return data; // e.g., { messageId: '...' }
    } catch (err) {
      setError(err.message);
      throw err; // Re-throw to allow caller to handle error if needed
    } finally {
      setLoading(false);
    }
  };

  return { sendSMS, loading, error };
};

export default useSNS;