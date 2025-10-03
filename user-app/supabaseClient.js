import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

  const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
  const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your actual key or set as environment variable
  const supabase = createClient(supabaseUrl, supabaseKey);

  let map = L.map('map').setView([37.7749, -122.4194], 12); // Default to San Francisco
  let marker;

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  document.getElementById('locationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const address = document.getElementById('locationInput').value;
    geocodeAddress(address);
  });

  async function geocodeAddress(address) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
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
        // Save address and coords locally
        localStorage.setItem('deliveryAddress', address);
        localStorage.setItem('deliveryCoords', JSON.stringify({ lat, lon }));
        
        // Save to Supabase database
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

  async function saveLocationToSupabase(address, lat, lon) {
    const { data, error } = await supabase
      .from('DeliveryLocations') // Replace with your actual table name
      .insert([
        { address: address, latitude: lat, longitude: lon }
      ]);
    if (error) {
      console.error('Error saving to Supabase:', error);
      alert('Failed to save location to database.');
    } else {
      console.log('Location saved:', data);
    }
  }
// Call the function to fetch Admin data
fetchAdmin().then(admin => {
  console.log(admin)
})