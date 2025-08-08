import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_KEY'; // replace with your env or directly
const supabase = createClient(supabaseUrl, supabaseKey);

function Orders() {
  const [orderType, setOrderType] = useState('inProgress');
  const [mealOptions, setMealOptions] = useState([]);
  const [cart, setCart] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchMealOptions = async () => {
      const { data, error } = await supabase.from('meal_option').select('*');
      if (!error) setMealOptions(data);
    };
    fetchMealOptions();
  }, []);

  useEffect(() => {
    const total = Object.entries(cart).reduce((sum, [mealId, qty]) => {
      const meal = mealOptions.find(m => m.id === mealId);
      return meal ? sum + meal.price * qty : sum;
    }, 0);
    setTotalPrice(total);
  }, [cart, mealOptions]);

  const handleAdd = (mealId) => {
    setCart(prev => ({ ...prev, [mealId]: (prev[mealId] || 0) + 1 }));
  };

  const handleRemove = (mealId) => {
    setCart(prev => {
      const newCart = { ...prev };
      const qty = newCart[mealId];
      if (qty <= 1) delete newCart[mealId];
      else newCart[mealId] = qty - 1;
      return newCart;
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>My Order</h1>
      {/* Split Buttons */}
      <div className="split-buttons">
        <button
          className={orderType === 'inProgress' ? 'active' : ''}
          onClick={() => setOrderType('inProgress')}
        >
          In Progress
        </button>
        <button
          className={orderType === 'completed' ? 'active' : ''}
          onClick={() => setOrderType('completed')}
        >
          Completed
        </button>
      </div>

      {/* Cart */}
      <div className="cart-box">
        <h2>My Cart</h2>
        {Object.keys(cart).length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          Object.entries(cart).map(([mealId, qty]) => {
            const meal = mealOptions.find(m => m.id === mealId);
            return (
              <div key={mealId} className="cart-item">
                <div>
                  <p>{meal?.name}</p>
                  <p>Price: ${meal?.price}</p>
                </div>
                <div>
                  <button onClick={() => handleRemove(mealId)}>-</button>
                  <span>{qty}</span>
                  <button onClick={() => handleAdd(mealId)}>+</button>
                </div>
              </div>
            );
          })
        )}
        <h3>Total: ${totalPrice.toFixed(2)}</h3>
        <button className="checkout-btn">Go To Checkout</button>
      </div>
    </div>
  );
}

export default Orders;
