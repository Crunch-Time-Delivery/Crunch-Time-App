import React, { useState, useRef } from 'react';

function AdminDashboard() {
  // State hooks for managing dropdowns, modals, and sections
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [showAdminPopup, setShowAdminPopup] = useState(false);
  const [showRolePopup, setShowRolePopup] = useState(false);
  const [showRoleInfoPopup, setShowRoleInfoPopup] = useState(false);
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/40');

  const profileImageRef = useRef(null);

  // Handlers
  const toggleMenuDropdown = () => setMenuOpen(prev => !prev);
  const triggerProfileImageUpload = () => document.getElementById('profileImageInput').click();
  const updateProfileImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfileImage(url);
    }
  };
  const showSection = (section) => setSelectedSection(section);

  // Placeholder functions for other actions
  const verifyLogin = () => {
    // Implement login logic here
    setShowLoginModal(false); // Example: close modal after login
  };
  const toggleFilterDropdown = () => {
    const dropdown = document.getElementById('filterDropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  };
  const filterEstablishments = (type) => {
    // Implement filtering
  };
  const toggleYearDropdown = () => {
    const dropdown = document.getElementById('yearOptions');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  };
  const selectMonth = (month) => {
    // Implement month selection
  };
  const showRolePopup_ = () => setShowRolePopup(true);
  const closeRolePopup = () => setShowRolePopup(false);
  const viewRoleInfo = (role, email) => {
    // Show role info popup
    setShowRoleInfoPopup(true);
  };
  const deleteRole = (role, email) => {
    // Delete role
  };
  const closeRoleInfo = () => setShowRoleInfoPopup(false);

  return (
    <>
      {/* Meta tags and styles */}
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Admin Dashboard</title>
        <style
          dangerouslySetInnerHTML={{
            __html: `
body {
  font-family: Arial, sans-serif; background:#f0f2f5; margin:0; padding-top:70px;
}
/* Add all your CSS styles here, copied from your style tag */
          `,
          }}
        />
      </head>

      {/* Data/Analytics Section */}
      <div>
        {/* Insert your analytics components here */}
        {/* Example: */}
        {/* <YourAnalyticsComponent /> */}
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div id="loginModal" className="modal" style={{ display: 'flex' }}>
          <div className="modal-box">
            <div
              className="modal-content"
              style={{
                maxWidth: 300,
                padding: 20,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <img
                src="Screenshot (254).jpg"
                alt="Welcome"
                style={{ width: 250, marginBottom: 20 }}
              />
              <h2 style={{ color: 'gray' }}>Welcome</h2>
              <h3>Admin Login</h3>
              <label>Username</label>
              <input
                type="text"
                placeholder="Username"
                style={{ width: '100%', marginBottom: 10, padding: 8 }}
              />
              <label>Password</label>
              <input
                type="password"
                placeholder="Password"
                style={{ width: '100%', marginBottom: 10, padding: 8 }}
              />
              <button
                style={{ width: '100%', backgroundColor: 'red' }}
                onClick={verifyLogin}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Credential Popup */}
      {showAdminPopup && (
        <div id="adminPopup" className="modal" style={{ display: 'flex' }}>
          <div className="modal-box" style={{ width: 400 }}>
            <img
              src="Screenshot (254).jpg"
              alt="Welcome"
              style={{ width: 250, marginBottom: 20 }}
            />
            <h3>Admin Update</h3>
            <div>
              <label>Change Username:</label>
              <input
                type="text"
                style={{ width: '100%', marginBottom: 10 }}
                // add value and onChange as needed
              />
            </div>
            <div>
              <label>Change Password:</label>
              <input
                type="password"
                style={{ width: '100%', marginBottom: 10 }}
                // add value and onChange as needed
              />
            </div>
            <button onClick={() => { /* Save logic */ }}>Save Credentials</button>
            <hr style={{ margin: '10px 0' }} />
            <h4>Add New Admin</h4>
            <div>
              <label>Email:</label>
              <input type="email" style={{ width: '100%', marginBottom: 10 }} />
            </div>
            <div>
              <label>Username:</label>
              <input type="text" style={{ width: '100%', marginBottom: 10 }} />
            </div>
            <div>
              <label>Password:</label>
              <input type="password" style={{ width: '100%', marginBottom: 10 }} />
            </div>
            <button onClick={() => { /* Add admin logic */ }}>Add Admin</button>
            <button
              style={{
                marginTop: 10,
                background: 'red',
                color: '#fff',
                width: '100%',
              }}
              onClick={() => setShowAdminPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Header with Menu & Profile */}
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', position: 'fixed', top: 0, width: '100%', backgroundColor: 'red', height: 60, zIndex: 1000, borderBottom: '1px solid #ccc' }}>
        {/* Menu */}
        <div className="menu-container" style={{ position: 'relative' }}>
          <div
            className="menu-icon"
            title="Menu"
            style={{ cursor: 'pointer', fontSize: 24 }}
            onClick={toggleMenuDropdown}
          >
            ☰
          </div>
          {isMenuOpen && (
            <div id="menuDropdown" style={{ position: 'absolute', top: '100%', left: 0, background: '#fff', border: '1px solid #ccc', padding: 5, boxShadow: '0 2px 8px rgba(0,0,0,0.2)', zIndex: 1001, width: 200 }}>
              <button onClick={() => showSection('dashboard')}>Dashboard</button>
              <button onClick={() => window.location.href='http://127.0.0.1:5501/admin/estabilshment.html'}>Establishment</button>
              <button onClick={() => window.location.href='http://127.0.0.1:5501/admin/restaurant_menu.html'}>Restaurant Menu</button>
              <button onClick={() => showSection('Driver')}>Driver</button>
              <button onClick={() => showSection('Vendor')}>Vendor</button>
            </div>
          )}
        </div>
        {/* Profile */}
        <div
          className="profile-section"
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={triggerProfileImageUpload}
        >
          <img
            src={profileImage}
            ref={profileImageRef}
            id="profileImage"
            alt="Profile"
            style={{ borderRadius: '50%', width: 40, height: 40, objectFit: 'cover' }}
          />
          <input
            type="file"
            id="profileImageInput"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={updateProfileImage}
          />
          <div className="admin-name" id="adminName" style={{ marginLeft: 10 }}>Admin</div>
        </div>
      </div>

      {/* Sections */}
      {selectedSection === 'dashboard' && (
        <div id="dashboard" className="section active" style={{ paddingTop: 70 }}>
          {/* Dashboard content */}
          {/* Insert your dashboard JSX here, I will include the main structure */}
          {/* For brevity, only key parts are included, expand as needed */}
          <div>
            {/* Your previously provided dashboard code */}
            {/* For example, total income, charts, etc. */}
            {/* ... */}
          </div>
        </div>
      )}
      {selectedSection === 'Driver' && (
        <div id="Driver" className="section" style={{ paddingTop: 70, display: 'block' }}>
          {/* Driver info JSX */}
        </div>
      )}
      {selectedSection === 'Vendor' && (
        <div id="Vendor" className="section" style={{ paddingTop: 70, display: 'block' }}>
          {/* Vendor management JSX */}
        </div>
      )}

      {/* Role Info Popup */}
      {showRoleInfoPopup && (
        <div id="roleInfoPopup" className="modal" style={{ display: 'block' }}>
          {/* Role info content */}
          <div className="modal-box" style={{ width: '90%', maxHeight: '90%', overflowY: 'auto' }}>
            <h3>Role Information</h3>
            <div id="roleInfoContent" style={{ marginBottom: 20 }}>
              {/* Insert role info dynamically */}
            </div>
            <button
              style={{
                marginTop: 10,
                background: 'rgb(255, 0, 0)',
                color: '#fff',
                width: '100%',
                padding: 10,
                border: 'none',
                borderRadius: 6,
              }}
              onClick={() => { /* Send notification logic */ }}
            >
              Send Email/Notification
            </button>
            <button
              style={{
                marginTop: 10,
                background: 'red',
                color: '#fff',
                width: '100%',
                padding: 10,
                border: 'none',
                borderRadius: 6,
              }}
              onClick={closeRoleInfo}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Role Management Popup */}
      {showRolePopup && (
        <div
          id="rolePopup"
          className="modal"
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <div
            className="modal-box"
            style={{ width: '90%', maxHeight: '90%', overflowY: 'auto' }}
          >
            <h3>Role Management</h3>
            {/* User Accounts Table */}
            {/* Repeat for Vendor, Driver, etc. */}
            {/* Example: */}
            <h4>User Accounts</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse' }} border={1} cellPadding={5}>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>user1@gmail.com</td>
                  <td>
                    <button onClick={() => viewRoleInfo('User', 'user1@example.com')}>View</button>
                    <button onClick={() => deleteRole('User', 'user1@example.com')}>Delete</button>
                  </td>
                </tr>
                {/* Add more users as needed */}
              </tbody>
            </table>
            {/* Repeat for Vendor and Driver */}
            {/* Close button */}
            <button
              style={{
                marginTop: 15,
                background: 'red',
                color: '#fff',
                width: '100%',
                padding: 10,
                border: 'none',
                borderRadius: 6,
              }}
              onClick={closeRolePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Driver Section */}
      {selectedSection === 'Driver' && (
        <div id="Driver" style={{ paddingTop: 70 }}>
          {/* Driver Info Content */}
        </div>
      )}

      {/* Vendor Section */}
      {selectedSection === 'Vendor' && (
        <div id="Vendor" style={{ paddingTop: 70 }}>
          {/* Vendor Content */}
        </div>
      )}

      {/* Other UI components like charts, performance, popups, etc. */}
      {/* You can insert your existing JSX code for those sections here, adapting inline styles and event handlers */}

    </>
  );
}

export default AdminDashboard;