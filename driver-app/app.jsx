import React, { useState } from 'react';
import OrderView from './OrderView';
import DriverProfile from './DriverProfile';

function App() {
  // your state and handlers
  const [view, setView] = useState('main');

  // Render different views
  const renderContent = () => {
    if (view === 'order') {
      return <OrderView />;
    } else if (view === 'profile') {
      return <DriverProfile />;
    } else {
      return (
        <div>
          {/* Main page content */}
        </div>
      );
    }
  };

  return (
    <div>
      {/* header, menu, etc. */}
      {renderContent()}
    </div>
  );
}

export default App;