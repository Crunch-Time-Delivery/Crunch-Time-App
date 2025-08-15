// src/user/order_process/home.jsx
import './home.css';
import { useAppContext } from './AppContext';
import { useNavigate } from 'react-router-dom';

function Home() {
  const { location, cart, addToCart } = useAppContext();
  const navigate = useNavigate();

  // Sample menu items (replace with your data or fetch from API)
  const menu = [
    { id: 1, name: 'Pizza', price: 10 },
    { id: 2, name: 'Burger', price: 8 },
  ];

  return (
    <div className="home-container">
      <h1>Food Menu {location ? `for ${location}` : ''}</h1>
      <ul>
        {menu.map((item) => (
          <li key={item.id}>
            <span>{item.name} - ${item.price}</span>
            <button onClick={() => addToCart(item)}>Add to Cart</button>
          </li>
        ))}
      </ul>
      <button className="view-cart-btn" onClick={() => navigate('/orders')}>
        View Cart ({cart.length})
      </button>
    </div>
  );
}

export default Home;