import React, { useState } from 'react';
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
import { AddButton } from './components/AddButton';

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
              };
              setInfoBoxes([...infoBoxes, newBox]);
            }}
          />
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