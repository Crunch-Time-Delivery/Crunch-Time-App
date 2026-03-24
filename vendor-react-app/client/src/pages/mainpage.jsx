import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY; // store your key in env variable
const supabase = createClient(supabaseUrl, supabaseKey);

function VendorApp() {
  // State management
  const [activeSection, setActiveSection] = useState('items');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notification, setNotification] = useState({ message: '', color: '#333', visible: false });
  const [paymentData, setPaymentData] = useState([]);
  const [paymentTotal, setPaymentTotal] = useState(0);
  const [paymentPage, setPaymentPage] = useState(1);
  const [paymentTotalCount, setPaymentTotalCount] = useState(0);
  const [filters, setFilters] = useState({ method: 'All', status: 'All', startDate: '', endDate: '' });
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  const pageSize = 10;

  // Refs for form inputs
  const menuFileRef = useRef(null);
  const notificationTimeoutRef = useRef(null);

  // Helper functions for notifications
  const showNotification = (message, color = '#333') => {
    setNotification({ message, color, visible: true });
    if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);
    notificationTimeoutRef.current = setTimeout(() => {
      setNotification({ ...notification, visible: false });
    }, 4000);
  };

  // Toggle dropdown
  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  // Handle section switching
  const showSection = (section) => setActiveSection(section);

  // Toggle dropdown menu
  const handleProfileMenu = () => {
    toggleDropdown();
  };

  // Fetch items
  const fetchItems = async () => {
    const { data, error } = await supabase.from('items').select('*');
    if (error) {
      showNotification('Error loading items.', '#f44336');
    } else {
      setItems(data);
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    const { data, error } = await supabase.from('orders').select('*');
    if (error) {
      showNotification('Error loading orders.', '#f44336');
    } else {
      setOrders(data);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
      showNotification('Error loading users.', '#f44336');
    } else {
      setUsers(data);
    }
  };

  // Fetch payments with pagination and filters
  const fetchPayments = async (page = 1, filtersObj = filters) => {
    setLoading(true);
    try {
      let query = supabase.from('payment_history').select('*', { count: 'exact' });
      if (filtersObj.method !== 'All') query = query.eq('payment_method', filtersObj.method);
      if (filtersObj.status !== 'All') query = query.eq('status', filtersObj.status);
      if (filtersObj.startDate && filtersObj.endDate) {
        query = query.gte('payment_date', filtersObj.startDate).lte('payment_date', filtersObj.endDate);
      }
      const { count, error: countError } = await query.order('payment_date', { ascending: false }).range(0, 0);
      if (countError) throw countError;

      const { data, error } = await query.order('payment_date', { ascending: false }).range((page - 1) * pageSize, page * pageSize - 1);
      if (error) throw error;
      setPaymentData(data);
      setPaymentTotalCount(count);
      setPaymentTotal(data.reduce((sum, p) => sum + parseFloat(p.amount), 0));
      setPaymentPage(page);
    } catch (err) {
      showNotification(`Error loading payments: ${err.message}`, '#f44336');
    } finally {
      setLoading(false);
    }
  };

  // Use effect to load initial data
  useEffect(() => {
    if (activeSection === 'items') fetchItems();
    if (activeSection === 'orders') fetchOrders();
    if (activeSection === 'users') fetchUsers();
    if (activeSection === 'payment') fetchPayments(paymentPage);
  }, [activeSection]);

  // Save section data to local storage
  const saveSectionData = () => {
    // Collect data based on active section
    let data = {};
    switch (activeSection) {
      case 'menuUpload':
        data.restaurantName = document.getElementById('restaurantName')?.value;
        data.menuFileName = menuFileRef.current?.files[0]?.name;
        break;
      case 'restaurantInfo':
        data.restName = document.getElementById('restName')?.value;
        data.contact = document.getElementById('contact')?.value;
        data.website = document.getElementById('website')?.value;
        data.address = document.getElementById('address')?.value;
        break;
      case 'addItem':
        data.itemVendor = document.getElementById('itemVendor')?.value;
        data.itemName = document.getElementById('itemName')?.value;
        data.itemDescription = document.getElementById('itemDescription')?.value;
        data.itemCategory = document.getElementById('itemCategory')?.value;
        data.itemPrice = document.getElementById('itemPrice')?.value;
        data.itemDiscount = document.getElementById('itemDiscount')?.value;
        data.itemPortion = document.getElementById('itemPortion')?.value;
        data.prepTime = document.getElementById('prepTime')?.value;
        data.isVeg = document.getElementById('isVeg')?.checked;
        data.isSpicy = document.getElementById('isSpicy')?.checked;
        data.itemStock = document.getElementById('itemStock')?.value;
        break;
      case 'addOrder':
        data.orderId = document.getElementById('orderId')?.value;
        data.orderUserName = document.getElementById('orderUserName')?.value;
        data.orderUserEmail = document.getElementById('orderUserEmail')?.value;
        data.orderAmount = document.getElementById('orderAmount')?.value;
        data.vendorName = document.getElementById('vendorName')?.value;
        data.vendorContact = document.getElementById('vendorContact')?.value;
        data.deliveryAddress = document.getElementById('deliveryAddress')?.value;
        break;
      default:
        break;
    }

    const vendorId = 'ID-' + Date.now();
    localStorage.setItem(`sectionData_${vendorId}`, JSON.stringify(data));
    const liveLink = `https://yourdomain.com/connection/${vendorId}`;
    alert('Data saved! Live connection: ' + liveLink);
  };

  // Upload menu
  const uploadMenu = async () => {
    const restaurantName = document.getElementById('restaurantName')?.value;
    const file = menuFileRef.current?.files[0];
    if (!restaurantName || !file) {
      alert('Enter restaurant name and select a PDF file.');
      return;
    }
    try {
      const filePath = `menus/${restaurantName}_${Date.now()}.pdf`;
      const { data, error } = await supabase.storage.from('menus').upload(filePath, file);
      if (error) throw error;
      await supabase.from('restaurant_menus').insert({ restaurant_name: restaurantName, file_path: filePath });
      alert('Menu uploaded successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading menu: ' + err.message);
    }
  };

  // Save restaurant info
  const saveRestaurantInfo = async () => {
    const name = document.getElementById('restName')?.value;
    const contact = document.getElementById('contact')?.value;
    const website = document.getElementById('website')?.value;
    const address = document.getElementById('address')?.value;
    if (!name || !contact || !website || !address) {
      alert('Fill all fields');
      return;
    }
    try {
      await supabase.from('restaurants').insert({ name, contact, website, address });
      alert('Details saved!');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // Add item
  const addItem = async () => {
    const vendor = document.getElementById('itemVendor')?.value;
    const itemName = document.getElementById('itemName')?.value;
    const price = parseFloat(document.getElementById('itemPrice')?.value);
    const stockStatus = document.getElementById('itemStock')?.value;
    if (!vendor || !itemName || isNaN(price)) {
      alert('Fill all required fields');
      return;
    }
    try {
      await supabase.from('items').insert({ vendor, item_name: itemName, price, stock_status: stockStatus });
      alert('Item added!');
      fetchItems();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // Save order
  const saveOrder = async () => {
    const orderId = document.getElementById('orderId')?.value;
    const userName = document.getElementById('orderUserName')?.value;
    const userEmail = document.getElementById('orderUserEmail')?.value;
    const amount = parseFloat(document.getElementById('orderAmount')?.value);
    const vendorName = document.getElementById('vendorName')?.value;
    const vendorContact = document.getElementById('vendorContact')?.value;
    const deliveryAddress = document.getElementById('deliveryAddress')?.value;
    if (!orderId || !userName || !userEmail || isNaN(amount)) {
      alert('Fill all required fields');
      return;
    }
    try {
      await supabase.from('orders').insert({ order_id: orderId, user_name: userName, user_email: userEmail, vendor_name: vendorName, vendor_contact: vendorContact, delivery_address: deliveryAddress, amount });
      alert('Order added!');
      fetchOrders();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // Render functions for tables
  const renderItemsTable = () => (
    <table>
      <thead>
        <tr><th>Vendor</th><th>Name</th><th>Price</th><th>Status</th></tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={index}><td>{item.vendor}</td><td>{item.item_name}</td><td>ZAR {item.price.toFixed(2)}</td><td>{item.stock_status}</td></tr>
        ))}
      </tbody>
    </table>
  );

  const renderOrdersTable = () => (
    <table>
      <thead>
        <tr><th>Order ID</th><th>User</th><th>Email</th><th>Method</th><th>Amount</th></tr>
      </thead>
      <tbody>
        {orders.map((order, index) => (
          <tr key={index}><td>{order.order_id}</td><td>{order.user_name}</td><td>{order.user_email}</td><td>{order.payment_method}</td><td>ZAR {order.amount.toFixed(2)}</td></tr>
        ))}
      </tbody>
    </table>
  );

  const renderUsersTable = () => (
    <table>
      <thead>
        <tr><th>Email</th><th>Name</th></tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr key={index}><td>{user.email}</td><td>{user.name}</td></tr>
        ))}
      </tbody>
    </table>
  );

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  // Fetch payments on filters change
  useEffect(() => {
    if (activeSection === 'payment') fetchPayments(paymentPage, filters);
  }, [filters, paymentPage, activeSection]);

  // UI rendering
 return (
   <div style={{ fontFamily: 'sans-serif', background: '#f0f0f0', margin: 0 }}>
     {/* Notification */}
     {notification.visible && (
       <div style={{
         position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
         padding: 12, backgroundColor: notification.color, color: '#fff', borderRadius: 8, zIndex: 9999
       }}>
         {notification.message}
       </div>
     )}

     {/* Header */}
     <div style={{
       position: 'fixed', top: 0, width: '100%', height: 60, background: '#fff',
       display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 999
     }}>
       <div style={{ fontWeight: 'bold', color: 'red', fontSize: '1.2em' }}>Vendor</div>
       <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
         <button style={{ background: '#ff0000', color: '#fff', padding: '8px 12px', border: 'none', borderRadius: '50px', cursor: 'pointer' }} onClick={handleProfileMenu}>
           <i className="fas fa-user-circle"></i> Menu
         </button>
         {dropdownOpen && (
           <div style={{
             position: 'absolute', right: 0, top: '60px', background: '#fff', border: '1px solid #ddd', borderRadius: 8,
             boxShadow: '0 4px 8px rgba(0,0,0,0.2)', minWidth: 200, zIndex: 1000
           }}>
             <a href="#" onClick={() => { setActiveSection('items'); setDropdownOpen(false); }}>Manage Items</a>
             <a href="#" onClick={() => { setActiveSection('orders'); setDropdownOpen(false); }}>Manage Orders</a>
             <a href="#" onClick={() => { setActiveSection('payment'); setDropdownOpen(false); }}>Payment History</a>
             <a href="#" onClick={() => { alert('Logged out'); setDropdownOpen(false); }}>Logout</a>
           </div>
         )}
       </div>
     </div>

     {/* Container */}
     <div style={{ marginTop: 80, padding: 20, maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto', background: '#fff', borderRadius: 8, boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
       {/* Management Buttons */}
       <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
         <button className="red-button" onClick={() => showSection('menuUpload')}>Upload Restaurant Menu</button>
         <button className="red-button" onClick={() => showSection('restaurantInfo')}>Enter Restaurant Info</button>
         <button className="red-button" onClick={() => showSection('addItem')}>Add Item</button>
         <button className="red-button" onClick={() => showSection('addOrder')}>Add Order</button>
         <button className="red-button" onClick={() => showSection('payment')}>Payment History</button>
       </div>

       {/* Sections */}
       {activeSection === 'menuUpload' && (
         <div style={{ marginTop: 20 }}>
           <h3>Upload Restaurant Menu (PDF)</h3>
           <div style={{ background: '#fff', padding: 20, borderRadius: 8, maxWidth: 500, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
             <input type="text" id="restaurantName" placeholder="Restaurant Name" style={{ width: '100%', padding: 10, margin: 10, border: '1px solid #ccc', borderRadius: 4 }} />
             <input type="file" accept="application/pdf" ref={menuFileRef} style={{ width: '100%', padding: 10, margin: 10 }} />
             <button className="red-button" onClick={uploadMenu}>Upload Menu</button>
           </div>
         </div>
       )}

       {activeSection === 'restaurantInfo' && (
         <div style={{ marginTop: 20 }}>
           <h3>Enter Restaurant Details</h3>
           <div style={{ background: '#fff', padding: 20, borderRadius: 8, maxWidth: 500, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
             <input id="restName" placeholder="Restaurant Name" style={{ width: '100%', padding: 10, margin: 10, border: '1px solid #ccc', borderRadius: 4 }} />
             <input id="contact" placeholder="Contact" style={{ width: '100%', padding: 10, margin: 10 }} />
             <input id="website" placeholder="Website" style={{ width: '100%', padding: 10, margin: 10 }} />
             <input id="address" placeholder="Address" style={{ width: '100%', padding: 10, margin: 10 }} />
             <button className="red-button" onClick={saveRestaurantInfo}>Save Details</button>
           </div>
         </div>
       )}

       {activeSection === 'addItem' && (
         <div style={{ marginTop:20 }}>
           <h3>Add Menu Item</h3>
           <div style={{ background: '#fff', padding: 20, borderRadius: 8, maxWidth: 500, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
             <input id="itemVendor" placeholder="Restaurant / Vendor Name" style={{ width: '100%', padding: 10, margin: 10 }} />
             <input id="itemName" placeholder="Item Name" style={{ width: '100%', padding: 10, margin: 10 }} />
             <textarea id="itemDescription" placeholder="Item Description" style={{ width: '100%', padding: 10, margin: 10 }}></textarea>
             <select id="itemCategory" style={{ width: '100%', padding: 10, margin: 10 }}>
               <option value="">Select Category</option>
               <option value="Fast Food">Fast Food</option>
               <option value="Burgers">Burgers</option>
               <option value="Pizza">Pizza</option>
               <option value="Healthy">Healthy</option>
               <option value="Asian">Asian</option>
             </select>
             <input id="itemPrice" type="number" placeholder="Price (ZAR)" style={{ width: '100%', padding: 10, margin: 10 }} />
             <input id="itemDiscount" type="number" placeholder="Discount %" style={{ width: '100%', padding: 10, margin: 10 }} />
             <input id="itemPortion" placeholder="Portion Size" style={{ width: '100%', padding: 10, margin: 10 }} />
             <input id="prepTime" type="number" placeholder="Prep Time (minutes)" style={{ width: '100%', padding: 10, margin: 10 }} />
             <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
               <label><input type="checkbox" id="isVeg" /> Vegetarian</label>
               <label><input type="checkbox" id="isSpicy" /> Spicy</label>
             </div>
             <select id="itemStock" style={{ width: '100%', padding: 10, margin: 10 }}>
               <option value="In Stock">In Stock</option>
               <option value="Out of Stock">Out of Stock</option>
             </select>
             <button className="red-button" onClick={addItem}>Save Item</button>
           </div>
           <h2>Update Categories</h2>
           <form id="categoryForm" onSubmit={(e) => {
             e.preventDefault();
             const category = document.getElementById('category')?.value.trim();
             const listId = document.getElementById('listId')?.value.trim();
             // Save to local storage
             let categoriesData = JSON.parse(localStorage.getItem('categoriesData')) || {
               'Fast Food': 'fastfoodList',
               'Burgers': 'burgersList',
               'Asian': 'asianList',
               'Pizza': 'pizzaList'
             };
             categoriesData[category] = listId;
             localStorage.setItem('categoriesData', JSON.stringify(categoriesData));
             alert(`Category "${category}" updated to list ID "${listId}"`);
           }}>
             <label htmlFor="category">Category Name:</label>
             <input id="category" name="category" required />
             <label htmlFor="listId">List Element ID:</label>
             <input id="listId" name="listId" required />
             <button type="submit">Update Category</button>
           </form>
         </div>
       )}

       {activeSection === 'addOrder' && (
         <div style={{ marginTop:20 }}>
           <h3>Add Order</h3>
           <div style={{ background: '#fff', padding: 20, borderRadius: 8, maxWidth: 500, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
             <input id="orderId" placeholder="Order ID" style={{ width: '100%', padding: 10, margin: 10 }} />
             <input id="orderUserName" placeholder="User Name" style={{ width: '100%', padding: 10, margin: 10 }} />
             <input id="orderUserEmail" placeholder="User Email" style={{ width: '100%', padding: 10, margin: 10 }} />
             <input id="orderAmount" type="number" placeholder="Amount" style={{ width: '100%', padding: 10, margin: 10 }} />
             <input id="vendorName" placeholder="Vendor Name" style={{ width: '100%', padding: 10, margin: 10 }} />
             <input id="vendorContact" placeholder="Vendor Contact Number" style={{ width: '100%', padding: 10, margin: 10 }} />
             <input id="deliveryAddress" placeholder="Delivery Address" style={{ width: '100%', padding: 10, margin: 10 }} />
             <button className="red-button" onClick={saveOrder}>Save Order</button>
           </div>
         </div>
       )}

       {activeSection === 'payment' && (
         <div style={{ marginTop:20 }}>
           <h3>Payment History</h3>
           <button className="red-button" onClick={() => fetchPayments(paymentPage)}>
             Refresh
           </button>
           <div>
             {loading ? (
               <p>Loading...</p>
             ) : (
               <div>
                 {/* Render payment table */}
                 <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}>
                   <thead>
                     <tr>
                       <th>Payment ID</th>
                       <th>Order Details</th>
                       <th>Customer</th>
                       <th>Method</th>
                       <th>Amount</th>
                       <th>Date</th>
                       <th>Status</th>
                     </tr>
                   </thead>
                   <tbody>
                     {paymentData.map((p, index) => {
                       const statusClass = p.status?.toLowerCase() === 'completed' || p.status?.toLowerCase() === 'success' ? 'status-success' : 'status-pending';
                       return (
                         <tr key={index}>
                           <td style={{ fontFamily: 'monospace', fontSize: 12 }}>#{p.payment_id.slice(0,8)}...</td>
                           <td>
                             <strong>Order:</strong> #{p.order_id}
                             <br />
                             <small style={{ color: '#666' }}>Ref: {p.payment_reference || 'N/A'}</small>
                           </td>
                           <td>
                             <strong>{p.user_name || 'Guest'}</strong>
                             <br />
                             <small>{p.user_email || ''}</small>
                           </td>
                           <td>{p.payment_method}</td>
                           <td style={{ fontWeight: 'bold' }}>R {parseFloat(p.amount).toFixed(2)}</td>
                           <td>
                             {new Date(p.payment_date).toLocaleDateString()}
                             <br />
                             <small>
                               {new Date(p.payment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </small>
                           </td>
                           <td>
                             <span className={`badge ${statusClass}`}>{p.status.toUpperCase()}</span>
                           </td>
                         </tr>
                       );
                     })}
                   </tbody>
                 </table>
                 {/* Pagination */}
                 <div style={{ marginTop: 10, textAlign: 'center' }}>
                   {paymentPage > 1 && (
                     <button onClick={() => setPaymentPage(paymentPage - 1)}>Previous</button>
                   )}
                   <span style={{ margin: '0 10px' }}>Page {paymentPage} of {Math.ceil(paymentTotalCount / pageSize)}</span>
                   {paymentPage < Math.ceil(paymentTotalCount / pageSize) && (
                     <button onClick={() => setPaymentPage(paymentPage + 1)}>Next</button>
                   )}
                 </div>
               </div>
             )}
           </div>
         </div>
       )}

       {/* Render dynamic sections based on activeSection */}
       {/* Other sections like manage items, orders, users can be added similarly */}
     </div>
   </div>
 );
}

export default VendorApp;