import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY; // Ensure this is set in your environment
const supabase = createClient(supabaseUrl, supabaseKey);

// Fetch User data
async function fetchUser() {
  const { data: User, error } = await supabase
    .from('User')
    .select(`
      id,
      username,
      password,
      email,
      name,
      role,
      order_cart,
      checkout_cart,
      pick_up_point,
      drop_off_point,
      longitude,
      latitude,
      location_name,
      ORDER_ID
    `);

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }
  return User;
}

// Fetch all users
async function fetchAllUsers() {
  const { data, error } = await supabase
    .from('User')
    .select('*');

  if (error) {
    console.error('Error fetching users:', error);
    return null;
  }
  return data;
}

// Insert a new user
async function insertUser(userData) {
  const { data, error } = await supabase
    .from('User')
    .insert([userData]);

  if (error) {
    console.error('Error inserting user:', error);
    return null;
  }
  return data;
}

// Update existing user
async function updateUser(id, updatedData) {
  const { data, error } = await supabase
    .from('User')
    .update(updatedData)
    .eq('id', id);

  if (error) {
    console.error('Error updating user:', error);
    return null;
  }
  return data;
}

// Delete user by ID
async function deleteUser(id) {
  const { data, error } = await supabase
    .from('User')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting user:', error);
    return null;
  }
  return data;
}

// Fetch Admin data
async function fetchAdmin() {
  const { data, error } = await supabase
    .from('Admins')
    .select('*');
  if (error) {
    console.error('Error fetching admin data:', error);
    return null;
  }
  return data;
}

// Fetch all admins
async function fetchAllAdmins() {
  const { data, error } = await supabase
    .from('Admins')
    .select('*');

  if (error) {
    console.error('Error fetching admins:', error);
    return null;
  }
  return data;
}

// Insert a new admin
async function insertAdmin(adminData) {
  const { data, error } = await supabase
    .from('Admins')
    .insert([adminData]);

  if (error) {
    console.error('Error inserting admin:', error);
    return null;
  }
  return data;
}

// Update admin by ID
async function updateAdmin(id, updatedData) {
  const { data, error } = await supabase
    .from('Admins')
    .update(updatedData)
    .eq('id', id);

  if (error) {
    console.error('Error updating admin:', error);
    return null;
  }
  return data;
}

// Delete admin by ID
async function deleteAdmin(id) {
  const { data, error } = await supabase
    .from('Admins')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting admin:', error);
    return null;
  }
  return data;
}

// Manage Delivery Locations

// Save new location or update existing one
async function saveLocationToSupabase(address, lat, lon) {
  const { data: existing, error: fetchError } = await supabase
    .from('DeliveryLocations')
    .select('id')
    .eq('address', address)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error fetching existing location:', fetchError);
    alert('Failed to check existing location.');
    return;
  }

  if (existing) {
    // Update existing record
    const { error } = await supabase
      .from('DeliveryLocations')
      .update({ latitude: lat, longitude: lon })
      .eq('id', existing.id);
    if (error) {
      console.error('Error updating location:', error);
      alert('Failed to update location.');
    } else {
      console.log('Location updated:', existing.id);
    }
  } else {
    // Insert new record
    const { data, error } = await supabase
      .from('DeliveryLocations')
      .insert([{ address, latitude: lat, longitude: lon }]);
    if (error) {
      console.error('Error saving to Supabase:', error);
      alert('Failed to save location to database.');
    } else {
      console.log('Location saved:', data);
    }
  }
}

// Delete a delivery location by ID
async function deleteLocation(id) {
  const { data, error } = await supabase
    .from('DeliveryLocations')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting location:', error);
    return null;
  }
  return data;
}

// Utility to clear local storage of location data
function clearStoredLocation() {
  localStorage.removeItem('deliveryAddress');
  localStorage.removeItem('deliveryCoords');
  alert('Stored location data cleared.');
}

// Example usage
fetchUser().then(user => console.log('User:', user));
fetchAllUsers().then(users => console.log('All Users:', users));
fetchAdmin().then(admin => console.log('Admin:', admin));
fetchAllAdmins().then(admins => console.log('All Admins:', admins));

// You can call insert, update, delete functions as needed, e.g.:
// insertUser({ username: 'newuser', email: 'new@example.com', ... });
// updateUser(1, { email: 'updated@example.com' });
// deleteUser(2);

// Similarly for admin and location management functions.
