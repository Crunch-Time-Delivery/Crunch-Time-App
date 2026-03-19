import { useState } from 'react'

export function useNotification() {
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)

  const showNotificationMessage = (msg, duration = 3000) => {
    setMessage(msg)
    setVisible(true)
    setTimeout(() => setVisible(false), duration)
  }

  return { message, visible, showNotificationMessage }
}