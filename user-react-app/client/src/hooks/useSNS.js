

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
        throw new Error(data.error || 'Failed to send SMS');
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { sendSMS, loading, error };
};

export default useSNS;
