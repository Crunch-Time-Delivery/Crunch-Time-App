import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY; // Ensure this is set in your environment
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
      ORDER_ID
    `);

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }
  return User;
}

fetchUser().then(user => {
  console.log('User:', user);
});

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

fetchAdmin().then(admin => {
  console.log('Admin:', admin);
});

// Initialize Google Map
let map;
let marker;

function initMap() {
  // Default center (e.g., San Francisco)
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 37.7749, lng: -122.4194 },
    zoom: 12,
  });
}

// Call initMap when Google Maps script loads in your HTML with callback=initMap

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
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=YOUR_GOOGLE_MAPS_API_KEY`
    );
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const firstResult = data.results[0];
      const lat = firstResult.geometry.location.lat;
      const lon = firstResult.geometry.location.lng;

      // Center map
      map.setCenter({ lat, lng: lon });
      map.setZoom(15);

      // Add or move marker
      if (marker) {
        marker.setPosition({ lat, lng: lon });
      } else {
        marker = new google.maps.Marker({
          position: { lat, lng: lon },
          map: map,
        });
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
      .insert([{ address: address, latitude: lat, longitude: lon }]);
    if (error) {
      console.error('Error saving to Supabase:', error);
      alert('Failed to save location to database.');
    } else {
      console.log('Location saved:', data);
    }
  }
}