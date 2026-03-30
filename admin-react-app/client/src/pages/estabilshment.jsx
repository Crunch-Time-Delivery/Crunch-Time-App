import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey =  process.env.SUPABASE_KEY;// Replace with your key
const supabase = createClient(supabaseUrl, supabaseKey);

function RestaurantDashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch data on load
  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('restaurants').select('*');
    if (error) {
      console.error(error);
    } else {
      setRestaurants(data);
    }
    setLoading(false);
  };

  const handleAdd = () => {
    const newRestaurant = {
      id: Date.now(),
      name: '',
      contact: '',
      website: '',
      address: '',
      imageUrl: '',
    };
    setRestaurants([newRestaurant, ...restaurants]);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this?')) {
      setRestaurants(restaurants.filter(r => r.id !== id));
    }
  };

  const handleChange = (id, field, value) => {
    setRestaurants(
      restaurants.map(r =>
        r.id === id ? { ...r, [field]: value } : r
      )
    );
  };

  const handleSave = (restaurant) => {
    // Implement saving to backend if needed
    alert('Save functionality not implemented');
  };

  const filteredRestaurants = restaurants.filter(r => {
    const searchLower = searchTerm.toLowerCase();
    return (
      r.name.toLowerCase().includes(searchLower) ||
      r.address.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f2f5' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '10px 20px',
        backgroundColor: '#fff', borderBottom: '1px solid #ccc', position: 'relative'
      }}>
        <div style={{ fontSize: '24px', cursor: 'pointer' }} onClick={() => setIsMenuOpen(!isMenuOpen)} title="Menu">
          ☰
        </div>
        {isMenuOpen && (
          <div style={{
            position: 'absolute', top: '40px', left: 0,
            backgroundColor: '#f0e9e9', border: '1px solid #ccc',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px'
          }}>
            <button onClick={() => alert('Dashboard')}>Dashboard</button>
            <button onClick={() => window.location.href='http://127.0.0.1:5500/driver-app/admin/estabilshment.html'}>Establishment</button>
            <button onClick={() => window.location.href='http://127.0.0.1:5500/driver-app/admin/restaurant_menu.html'}>Restaurant Menu</button>
            <button onClick={() => alert('Driver section')}>Driver</button>
            <button onClick={() => alert('Vendor section')}>Vendor</button>
          </div>
        )}
      </div>

      {/* Top Bar */}
      <div style={{
        backgroundColor: 'red', height: '60px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between', padding: '0 20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            backgroundColor: '#fff', marginRight: '10px'
          }}></div>
          <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.2em' }}>Admin Establishment</div>
        </div>
      </div>

      {/* Filter / Search */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '10px 20px',
        gap: '10px', backgroundColor: '#fff'
      }}>
        <select style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}>
          <option value="">Select Establishment</option>
          <option value="Restaurant">Restaurant</option>
          <option value="Cafe">Cafe</option>
          <option value="Bar">Bar</option>
          <option value="Diner">Diner</option>
        </select>
        <input
          style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Info Container */}
      <div id="info-container" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {loading ? (
          <div>Loading...</div>
        ) : (
          filteredRestaurants.map(r => (
            <div key={r.id} style={{
              display: 'flex', backgroundColor: '#fff', padding: '15px',
              borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap'
            }}>
              {/* Image placeholder */}
              <div style={{
                width: '60px', height: '60px', backgroundColor: '#ccc',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                fontSize: '24px', borderRadius: '8px', cursor: 'pointer'
              }} title="Click to change image" onClick={() => alert('Image change placeholder')}>
                📷
              </div>
              {/* Details */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['name', 'contact', 'website', 'address'].map((field) => (
                  <input
                    key={field}
                    style={{ fontWeight: 'bold', outline: 'none', padding: '4px 8px' }}
                    value={r[field]}
                    onChange={(e) => handleChange(r.id, field, e.target.value)}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  />
                ))}
              </div>
              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={() => handleSave(r)} style={{
                  padding: '6px 12px', backgroundColor: '#3498db', color: '#fff',
                  border: 'none', borderRadius: '4px', cursor: 'pointer'
                }}>Save</button>
                <button onClick={() => handleDelete(r.id)} style={{
                  padding: '6px 12px', backgroundColor: '#e74c3c', color: '#fff',
                  border: 'none', borderRadius: '4px', cursor: 'pointer'
                }}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add button */}
      <div style={{ textAlign: 'center', margin: '20px' }}>
        <button
          style={{
            padding: '12px 24px', backgroundColor: 'red', color: '#fff',
            border: 'none', borderRadius: '6px', fontSize: '1em', cursor: 'pointer'
          }}
          onClick={handleAdd}
        >
          Add Restaurant Info
        </button>
      </div>
    </div>
  );
}

export default RestaurantDashboard;