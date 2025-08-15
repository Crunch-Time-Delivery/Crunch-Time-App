// src/user/order_process/orders.jsx (updated example)
import './orders.css';
import { useAppContext } from './AppContext';
import { useNavigate } from 'react-router-dom';

function Orders() {
  const { cart, placeOrder } = useAppContext();
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    const orderId = placeOrder();
    if (orderId) navigate(`/order-detail/${orderId}`);
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="orders-container">
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p className="empty-cart">Cart is empty</p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item.id}>{item.name} x{item.quantity} - ${item.price * item.quantity}</li>
            ))}
          </ul>
          <p className="total">Total: ${total}</p>
          <button onClick={handlePlaceOrder}>Place Order</button>
        </>
      )}
    </div>
  );
}

export default Orders;