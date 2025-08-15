// src/user/order_process/search_location.jsx (updated example)
import { useState } from 'react';
import { useAppContext } from './AppContext';
import { useNavigate } from 'react-router-dom';

function SearchLocation() {
  const { setLocation } = useAppContext();
  const navigate = useNavigate();
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocation(input);
    navigate('/home'); // Navigate to Home after setting location
  };

  return (
    <div className="search-location-container">
      <h1>Search Delivery Location</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter address or city"
        />
        <button type="submit">Set Location</button>
      </form>
    </div>
  );
}

export default SearchLocation;