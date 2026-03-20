
import React, { useState } from 'react';

// Import all your pages/components
import MainPage from './MainPage.jsx';
import LoginUser from './LoginUser.jsx';
import RegisterHome from './RegisterHome.jsx';
import ForgotPassword from './ForgotPassword.jsx';
import Checkout from './Checkout.jsx';
import ChatBot from './ChatBot.jsx';
import TrackingDriver from './TrackingDriver.jsx';
import RestaurantInfo from './RestaurantInfo.jsx';
import SearchLocation from './SearchLocation.jsx';
import MyOrder from './MyOrder.jsx';

function App() {
  const [page, setPage] = useState('main');
 const [showLogin, setShowLogin] = useState(true)


  const handleLogin = (username) => {
    setIsAuthenticated(true)
    setShowLogin(false)
  }


  const renderPage = () => {
    switch (page) {
      case 'main':
        return <MainPage />;
      case 'login':
        return <LoginUser />;
      case 'register':
        return <RegisterHome />;
      case 'forgot':
        return <ForgotPassword />;
      case 'checkout':
        return <Checkout />;
      case 'chat':
        return <ChatBot />;
      case 'track':
        return <TrackingDriver />;
      case 'restaurant':
        return <RestaurantInfo />;
      case 'search':
        return <SearchLocation />;
      case 'orders':
        return <MyOrder />;
      default:
        return <MainPage />;
    }
  };

  return (
    <div>
      {/* Navigation Buttons */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setPage('main')}>Main</button>
        <button onClick={() => setPage('login')}>Login</button>
        <button onClick={() => setPage('register')}>Register</button>
        <button onClick={() => setPage('forgot')}>Forgot Password</button>
        <button onClick={() => setPage('checkout')}>Checkout</button>
        <button onClick={() => setPage('chat')}>Chat</button>
        <button onClick={() => setPage('track')}>Track Driver</button>
        <button onClick={() => setPage('restaurant')}>Restaurant Info</button>
        <button onClick={() => setPage('search')}>Search Location</button>
        <button onClick={() => setPage('orders')}>My Orders</button>
      </div>
      
      {/* Render selected page */}
      {renderPage()}
    </div>
  );
}

export default App;