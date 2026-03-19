import React, { useState } from 'react'
// Import your components & hooks here
import { Auth } from './components/Auth.jsx'
import { Header } from './components/Header.jsx'
import { TopBar } from './components/TopBar.jsx'
import { FilterSearch } from './components/FilterSearch.jsx'
import { InfoBoxes } from './components/InfoBoxes.jsx'
import { AddButton } from './components/AddButton.jsx'
import { useNotification } from './hooks/useNotification.js'
import { useSms } from './hooks/useSms.js'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLogin, setShowLogin] = useState(true)
  const [showAdminPopup, setShowAdminPopup] = useState(false)
  const [showRolePopup, setShowRolePopup] = useState(false)
  const [showRoleInfoPopup, setShowRoleInfoPopup] = useState(false)
  const [currentRole, setCurrentRole] = useState({ email: '', roleType: '' })
  const [infoBoxes, setInfoBoxes] = useState([])
  const { showNotificationMessage } = useNotification()
  const { sendTwilioSms } = useSms()

  const handleLogin = (username) => {
    setIsAuthenticated(true)
    setShowLogin(false)
  }

  const handleShowRoleInfo = (role) => {
    setCurrentRole(role)
    setShowRoleInfoPopup(true)
  }

  const handleSendSms = () => {
    sendTwilioSms('+1234567890', 'Hello from the dashboard!')
  }

  return (
    <div>
      {showLogin && <Auth onSuccess={handleLogin} />}
      {isAuthenticated && (
        <>
          <Header toggleMenu={() => {}} />
          <TopBar />
          <FilterSearch />
          <div id="info-container">
            <InfoBoxes infoBoxes={infoBoxes} setInfoBoxes={setInfoBoxes} />
          </div>
          <AddButton
            onAdd={() => {
              const newBox = {
                id: Date.now(),
                name: 'New Restaurant',
                link: '#',
                icon: '🏢',
              }
              setInfoBoxes([...infoBoxes, newBox])
            }}
          />
        </>
      )}
    </div>
  )
}

export default App