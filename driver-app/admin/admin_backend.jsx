import { useState } from 'react'
import './supabaseClient.js';
import '.src/main.jsx';
import '.src/app.jsx';
import '.index.html';
import { useState, useEffect } from 'react';

function DriverManagement() {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);

  // Fetch drivers on mount
  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    const { data, error } = await supabase
      .from('drivers') // your table name
      .select('*');
    if (error) {
      console.error('Error fetching drivers:', error);
    } else {
      setDrivers(data);
    }
  };

  const updateDriverStatus = async (driverId, status) => {
    const { data, error } = await supabase
      .from('drivers')
      .update({ status }) // assuming 'status' field exists
      .eq('id', driverId);
    if (error) {
      console.error('Update error:', error);
    } else {
      alert('Driver status updated');
      fetchDrivers();
    }
  };

  const deleteDriver = async (driverId) => {
    if (!confirm('Delete this driver?')) return;
    const { error } = await supabase
      .from('drivers')
      .delete()
      .eq('id', driverId);
    if (error) {
      console.error('Delete error:', error);
    } else {
      alert('Driver deleted');
      fetchDrivers();
    }
  };

  return (
    <div>
      <h2>Driver Management</h2>
      <button onClick={fetchDrivers}>Refresh</button>
      <table border="1" style={{ width: '100%', marginTop: '10px' }}>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map(driver => (
            <tr key={driver.id}>
              <td>{driver.name}</td>
              <td>{driver.email}</td>
              <td>{driver.status}</td>
              <td>
                <button onClick={() => { setSelectedDriver(driver); }}>View</button>
                <button onClick={() => updateDriverStatus(driver.id, 'Active')}>Activate</button>
                <button onClick={() => updateDriverStatus(driver.id, 'Inactive')}>Deactivate</button>
                <button onClick={() => deleteDriver(driver.id)} style={{ backgroundColor: 'red', color: '#fff' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedDriver && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <h3>Details for {selectedDriver.name}</h3>
          <p>Email: {selectedDriver.email}</p>
          <p>Phone: {selectedDriver.phone}</p>
          <p>Status: {selectedDriver.status}</p>
          {/* Add more fields as needed */}
          <button onClick={() => setSelectedDriver(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default DriverManagement;