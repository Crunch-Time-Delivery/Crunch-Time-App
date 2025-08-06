import React, { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const handleRegister = async () => {
    setMessage(null)
    setError(null)
    const { data, error } = await supabase
      .from('users') // replace with your actual table name
      .insert([
        {
          full_name: fullName,
          email: email,
          phone_number: phone,
          password: password, // consider hashing passwords in real apps
        },
      ])
    if (error) {
      setError(error.message)
    } else {
      setMessage('Registration successful!')
    }
  }

  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="tel"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  )
}

export default RegisterPage
