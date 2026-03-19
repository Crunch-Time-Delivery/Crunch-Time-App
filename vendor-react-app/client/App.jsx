import React, { useState } from 'react'

// Import your pages/components here
import MainPage from './MainPage.jsx'
import LoginVendor from './LoginVendor.jsx'
import RegisterVendor from './RegisterVendor.jsx'
import WelcomeVendorPage from './WelcomeVendorPage.jsx'
import ForgotPassword from './ForgotPassword.jsx'

// Example: simple page toggle or routing
function App() {
  const [page, setPage] = useState('main')

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

export default App