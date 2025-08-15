// src/user/order_process/order_detail.jsx (updated example)
import './order_detail.css';
import { useAppContext } from './AppContext';
import { useParams } from 'react-router-dom';

function OrderDetail() {
  const { placedOrders } = useAppContext();
  const { id } = useParams();
  const order = placedOrders.find((o) => o.id === parseInt(id));

  if (!order) return <p>Order not found</p>;

  return (
    <div className="order-detail-container">
      <h1>Order #{order.id} Confirmed</h1>
      <p>Delivery to: {order.location}</p>
      <ul>
        {order.items.map((item) => (
          <li key={item.id}>{item.name} x{item.quantity} - ${item.price * item.quantity}</li>
        ))}
      </ul>
      <p className="total">Total: ${order.total}</p>
      <p className="thank-you">Thank you for your order!</p>
    </div>
  );
}

export default OrderDetail;