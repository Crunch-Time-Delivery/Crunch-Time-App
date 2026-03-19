import React, { useState } from 'react';
import ReactDOM from 'react-dom';

// Import components
import { Auth } from './components/Auth';
import { AdminPopup } from './components/AdminPopup';
import { RolePopup } from './components/RolePopup';
import { RoleInfoPopup } from './components/RoleInfoPopup';
import { FilterSearch } from './components/FilterSearch';
import { InfoBoxes } from './components/InfoBoxes';
import { useNotification } from './components/Utilities';
import { useSms } from './components/Utilities';
import { Header } from './components/Header';
import { TopBar } from './components/TopBar';
import { FilterSearch } from './components/FilterSearch';
import { ContentContainer } from './components/ContentContainer';
import { AddButton } from './components/AddButton';
import { useMenuToggle } from './hooks/useMenuToggle';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [showAdminPopup, setShowAdminPopup] = useState(false);
  const [showRolePopup, setShowRolePopup] = useState(false);
  const [showRoleInfoPopup, setShowRoleInfoPopup] = useState(false);
  const [currentRole, setCurrentRole] = useState({ email: '', roleType: '' });
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [adminName, setAdminName] = useState('Admin');

  const { showNotificationMessage } = useNotification();
  const { sendTwilioSms } = useSms();

  const handleLoginSuccess = (username) => {
    setIsAuthenticated(true);
    setShowLogin(false);
    setAdminName(username);
  };

  // Handlers to show modals/popups
  const handleShowAdminPopup = () => setShowAdminPopup(true);
  const handleShowRolePopup = () => setShowRolePopup(true);
  const handleShowRoleInfo = (role) => {
    setCurrentRole(role);
    setShowRoleInfoPopup(true);
  };

  // Example: Send SMS
  const handleSendSms = () => {
    sendTwilioSms('+1234567890', 'Hello from the dashboard!');
  };

  return (
    <div>
      {/* Login Modal */}
      {showLogin && <Auth onSuccess={handleLoginSuccess} />}

      {/* Main Dashboard after login */}
      {isAuthenticated && (
        <>
          <header>
            <h1>React Dashboard</h1>
            {/* Demo buttons */}
            <button onClick={handleShowAdminPopup}>Admin Popup</button>
            <button onClick={handleShowRolePopup}>Role Management</button>
            <button
              onClick={() =>
                handleShowRoleInfo({ email: 'user@example.com', roleType: 'Admin' })
              }
            >
              Role Info
            </button>
            <button onClick={handleSendSms}>Send SMS</button>
          </header>

          {/* Main section placeholder */}
          <div>
            {currentSection === 'dashboard' && <h2>Dashboard</h2>}
            {/* Other sections can be added here */}
          </div>
        </>
      )}

      {/* Modals & Popups */}
      {showAdminPopup && (
        <AdminPopup
          onClose={() => setShowAdminPopup(false)}
          onSave={(data) => {
            setAdminName(data.username);
            showNotificationMessage('Credentials updated and email sent.');
            setShowAdminPopup(false);
          }}
        />
      )}
      {showRolePopup && (
        <RolePopup onClose={() => setShowRolePopup(false)} />
      )}
      {showRoleInfoPopup && (
        <RoleInfoPopup role={currentRole} onClose={() => setShowRoleInfoPopup(false)} />
      )}
    </div>
  );const { dropdownRef, toggleDropdown } = useMenuToggle();

  // Your state and logic here

  return (
    <>
      <Header toggleMenu={toggleDropdown} />
      <div className="top-bar">
        <TopBar />
      </div>
      <FilterSearch />
      <ContentContainer />
      <AddButton />
    </>
  );
} 

ReactDOM.render(<App />, document.getElementById('root'));import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import { Auth } from './components/Auth';
import { AdminPopup } from './components/AdminPopup';
import { RolePopup } from './components/RolePopup';
import { RoleInfoPopup } from './components/RoleInfoPopup';

import { useNotification } from './hooks/useNotification';
import { useSms } from './hooks/useSms';

import { Header } from './components/Header';
import { TopBar } from './components/TopBar';
import { FilterSearch } from './components/FilterSearch';
import { InfoBoxes } from './components/InfoBoxes';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [showAdminPopup, setShowAdminPopup] = useState(false);
  const [showRolePopup, setShowRolePopup] = useState(false);
  const [showRoleInfoPopup, setShowRoleInfoPopup] = useState(false);
  const [currentRole, setCurrentRole] = useState({ email: '', roleType: '' });
  const [infoBoxes, setInfoBoxes] = useState([]);
  const [adminName, setAdminName] = useState('Admin');

  const { showNotificationMessage } = useNotification();
  const { sendTwilioSms } = useSms();

  const handleLogin = (username) => {
    setIsAuthenticated(true);
    setShowLogin(false);
    setAdminName(username);
  };

  const handleShowRoleInfo = (role) => {
    setCurrentRole(role);
    setShowRoleInfoPopup(true);
  };

  const handleSendSms = () => {
    sendTwilioSms('+1234567890', 'Hello from the dashboard!');
  };

  return (
    <div>
      {showLogin && <Auth onSuccess={handleLogin} />}

      {isAuthenticated && (
        <>
          <Header toggleMenu={() => { /* implement toggle if needed */ }} />
          <TopBar />
          <FilterSearch />
          <div id="info-container">
            <InfoBoxes infoBoxes={infoBoxes} setInfoBoxes={setInfoBoxes} />
          </div>
          <button onClick={() => {
            const newBox = {
              id: Date.now(),
              name: 'New Restaurant',
              link: '#',
              icon: '🏢',
            };
            setInfoBoxes([...infoBoxes, newBox]);
          }} id="add-btn">
            Add Restaurant Info
          </button>
        </>
      )}

      {showAdminPopup && (
        <AdminPopup
          onClose={() => setShowAdminPopup(false)}
          onSave={(data) => {
            setAdminName(data.username);
            showNotificationMessage('Credentials updated and email sent.');
            setShowAdminPopup(false);
          }}
        />
      )}
      {showRolePopup && (
        <RolePopup onClose={() => setShowRolePopup(false)} />
      )}
      {showRoleInfoPopup && (
        <RoleInfoPopup role={currentRole} onClose={() => setShowRoleInfoPopup(false)} />
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));