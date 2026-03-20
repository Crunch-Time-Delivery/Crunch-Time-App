import React, { useState } from 'react'

// Import your pages/components here
import MainPage from './MainPage.jsx'
import LoginVendor from './LoginVendor.jsx'
import RegisterVendor from './RegisterVendor.jsx'
import WelcomeVendorPage from './WelcomeVendorPage.jsx'
import ForgotPassword from './ForgotPassword.jsx'

function App() {
  const [page, setPage] = useState('main')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = (username) => {
    setIsAuthenticated(true)
    // You can set other login logic here
  }

  const renderPage = () => {
    switch (page) {
      case 'main':
        return <MainPage setPage={setPage} />
      case 'loginVendor':
        return <LoginVendor setPage={setPage} />
      case 'registerVendor':
        return <RegisterVendor setPage={setPage} />
      case 'welcomeVendor':
        return <WelcomeVendorPage setPage={setPage} />
      case 'forgotPassword':
        return <ForgotPassword setPage={setPage} />
      default:
        return <MainPage setPage={setPage} />
    }
  }

  return (
    <div>
      {/* Navigation Buttons */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setPage('main')}>Main</button>
        <button onClick={() => setPage('loginVendor')}>Login Vendor</button>
        <button onClick={() => setPage('registerVendor')}>Register Vendor</button>
        <button onClick={() => setPage('welcomeVendor')}>Welcome Vendor</button>
        <button onClick={() => setPage('forgotPassword')}>Forgot Password</button>
      </div>
      
      {/* Render the current page */}
      {renderPage()}
    </div>
  )
}

export default App