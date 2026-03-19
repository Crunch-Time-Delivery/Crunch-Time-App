import React from 'react';
// Import all your pages/components here
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
  // Example: simple state to toggle pages, or use React Router
  const [page, setPage] = React.useState('main');

  // You can implement routing logic here
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
}

export default App;