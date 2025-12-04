import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY; // Actual key
const supabase = createClient(supabaseUrl, supabaseKey);

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
       longitude,
       latitude,
       location_name,
       ORDER_ID
    `); // Added semicolon

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  } return User;
}

// Call the function to fetch user data
fetchUser().then(user => {
  console.log('User:', user);
});

// Call the function to fetch Admin data
async function fetchAdmin() {
  const { data, error } = await supabase
    .from('Admins') // Make sure this matches your table name
    .select('*');
  if (error) {
    console.error('Error fetching admin data:', error);
    return null;
  }
  return data;
}

fetchAdmin().then(admin => {
  console.log('Admin:', admin);
});

// Initialize map
let map = L.map('map').setView([37.7749, -122.4194], 12); // Default to San Francisco
let marker;

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Event listener for form submission
document.getElementById('locationForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const address = document.getElementById('locationInput').value;
  geocodeAddress(address);
});

// Geocode address and update map, localStorage, and Supabase
async function geocodeAddress(address) {
  try {
    const response = await fetch(
'https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyB9sNhi824hNncjfW7HHzaI_s8JtWGfM0Q'               `
    );
    const data = await response.json();
    if (data && data.length > 0) {
      const firstResult = data[0];
      const lat = parseFloat(firstResult.lat);
      const lon = parseFloat(firstResult.lon);
      // Center map
      map.setView([lat, lon], 15);
      // Add or move marker
      if (marker) {
        marker.setLatLng([lat, lon]);
      } else {
        marker = L.marker([lat, lon]).addTo(map);
      }
      // Save locally
      localStorage.setItem('deliveryAddress', address);
      localStorage.setItem('deliveryCoords', JSON.stringify({ lat, lon }));
      
      // Save/update in Supabase
      await saveLocationToSupabase(address, lat, lon);
      alert('Location set successfully!');
    } else {
      alert('Location not found. Please try another address.');
    }
  } catch (err) {
    console.error('Error during geocoding:', err);
    alert('Error fetching location data. Please try again.');
  }
}

// Save new location or update existing one in Supabase
async function saveLocationToSupabase(address, lat, lon) {
  // Check if the address already exists
  const { data: existing, error: fetchError } = await supabase
    .from('DeliveryLocations')
    .select('id')
    .eq('address', address)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // handle no rows found
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
      .insert([{ address: address, latitude: lat, longitude: lon }]);
    if (error) {
      console.error('Error saving to Supabase:', error);
      alert('Failed to save location to database.');
    } else {
      console.log('Location saved:', data);
    }
  }
  }