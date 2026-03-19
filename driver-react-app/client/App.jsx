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

      {showAdminPopup && (
        <div className="modal" style={{ display: 'flex' }}>
          <div className="modal-box" style={{ width: 400, overflowY: 'auto' }}>
            {/* AdminPopup content */}
            <h3>Admin Update</h3>
            <div>
              <label>Change Username:</label>
              <input id="newUsername" />
            </div>
            <div>
              <label>Change Password:</label>
              <input id="newPassword" type="password" />
            </div>
            <button
              onClick={() => {
                const username = document.getElementById('newUsername').value
                const password = document.getElementById('newPassword').value
                // Save logic
                showNotificationMessage('Credentials updated.')
                setShowAdminPopup(false)
              }}
            >
              Save Credentials
            </button>
            <button onClick={() => setShowAdminPopup(false)} style={{ marginTop: 10, background: 'red', color: '#fff', width: '100%' }}>Close</button>
          </div>
        </div>
      )}
      {showRolePopup && (
        <div className="modal" style={{ display: 'flex' }}>
          <div className="modal-box" style={{ width: '90%', maxHeight: '90%', overflowY: 'auto' }}>
            {/* RolePopup content */}
            <h3>Role Management</h3>
            {/* ... */}
            <button style={{ marginTop: 15, background: 'red', color: '#fff', width: '100%', padding: 10 }} onClick={() => setShowRolePopup(false)}>Close</button>
          </div>
        </div>
      )}
      {showRoleInfoPopup && (
        <div className="modal" style={{ display: 'flex' }}>
          <div className="modal-box" style={{ width: '90%', maxHeight: '90%', overflowY: 'auto' }}>
            {/* RoleInfoPopup content */}
            <h3>Role Information</h3>
            <p>Email: {currentRole.email}</p>
            <p>Role: {currentRole.roleType}</p>
            <button style={{ marginTop: 10, background: 'red', color: '#fff', width: '100%', padding: 10 }} onClick={() => setShowRoleInfoPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App