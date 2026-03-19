export function useSms() {
  const sendTwilioSms = async (to, message) => {
    try {
      const response = await fetch('/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, message }),
      })
      const data = await response.json()
      if (data.success) {
        alert('SMS sent successfully')
      } else {
        alert('Failed to send SMS: ' + data.error)
      }
    } catch (err) {
      alert('Error sending SMS')
    }
  }
  return { sendTwilioSms }
}