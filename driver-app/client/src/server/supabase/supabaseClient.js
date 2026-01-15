import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey)

// Fetch Drivers data
async function fetchDrivers() {
  const { data: Drivers, error } = await supabase
    .from('Drivers')
    .select(`
      id,
      driver_name,
      contact,
      plate_no,
      email,
      rating,
      password,
      Order ID,
      Customer Name,
      Order Date,
      Status,
      GPS location,
      Order Address,
      Total Amount,
      Order_items,
      Order_items_Qty,
      Order_items_Price,
      Order_items_Total,
      pick_up_point,
      drop_up_point
    `);

  if (error) {
    console.error('Error fetching drivers:', error);
    return null;
  }
  return Drivers;
}

// Fetch Admin data (assuming an 'Admin' table)
async function fetchAdmin() {
  const { data: Admins, error } = await supabase
    .from('Admin')
    .select('*');
   
  if (error) {
    console.error('Error fetching admin data:', error);
    return null;
  }
  return Admins;
}


// Update an existing driver by ID
async function updateDriver(id, updatedData) {
  const { data, error } = await supabase
    .from('Drivers')
    .update(updatedData)
    .eq('id', id)
 .select()
 .single();
  if (error) {
    console.error('Error updating driver:', error);
    return null;
  }
  return data;
}

// Delete a driver by ID
async function deleteDriver(id) {
  const { data, error } = await supabase
    .from('Drivers')
    .delete()
    .eq('id', id)
    .select()
 .single();
  if (error) {
    console.error('Error deleting driver:', error);
    return null;
  }
  return data;
}

// Example calls
fetchDrivers().then(drivers => {
  console.log('Drivers:', drivers);
});

fetchAdmin().then(admin => {
  console.log('Admin:', admin);
});

// Example usage of insert, update, delete functions (uncomment to test)
// insertDriver({ driver_name: 'John Doe', contact: '1234567890', plate_no: 'XYZ 123', email: 'john@example.com', rating: 5, password: 'pass123', 'Order ID': 1, 'Customer Name': 'Alice', 'Order Date': '2024-04-27', Status: 'Pending', 'GPS location': 'Lat, Long', 'Order Address': '123 Main St', 'Total Amount': 50, 'Order_items': 'Item1', 'Order_items_Qty': 2, 'Order_items_Price': 25, 'Order_items_Total': 50, pick_up_point: 'Point A', drop_up_point: 'Point B' });

// updateDriver(1, { status: 'Completed' });

// deleteDriver(1);