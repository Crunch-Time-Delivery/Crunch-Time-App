import React from 'react'

export function Auth({ onSuccess }) {
  const handleLogin = () => {
    // Implement login logic
    onSuccess()
  }

  return (
    <div>
      <h2>Login</h2>
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}