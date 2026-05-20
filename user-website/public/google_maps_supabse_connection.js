import { supabase } from '../lib/supabaseClient'; // Adjust path as needed

let map;
const markers = [];

// Initialize the map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });
  fetchLocationsAndAddMarkers();
}

// Fetch locations and add markers
async function fetchLocationsAndAddMarkers() {
  // Clear existing markers before adding new ones
  clearMarkers();

  const { data, error } = await supabase
    .from('locations') // Your table name
    .select('id, name, latitude, longitude');

  if (error) {
    console.error('Error fetching locations:', error);
    return;
  }

  data.forEach(location => {
    const marker = new google.maps.Marker({
      position: { lat: location.latitude, lng: location.longitude },
      map,
      title: location.name,
    });
    markers.push(marker);
  });
}

// Clear all markers from map
function clearMarkers() {
  markers.forEach(marker => marker.setMap(null));
  markers.length = 0;
}

// Add a new location
export async function addLocation(name, latitude, longitude) {
  const { data, error } = await supabase
    .from('locations')
    .insert([{ name, latitude, longitude }])
    .single();

  if (error) {
    console.error('Error adding location:', error);
    return null;
  }
  // Refresh markers
  await fetchLocationsAndAddMarkers();
  return data;
}

// Update a location by ID
export async function updateLocation(id, updates) {
  const { data, error } = await supabase
    .from('locations')
    .update(updates)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error updating location:', error);
    return null;
  }
  await fetchLocationsAndAddMarkers();
  return data;
}

// Delete a location by ID
export async function deleteLocation(id) {
  const { error } = await supabase
    .from('locations')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting location:', error);
    return false;
  }
  await fetchLocationsAndAddMarkers();
  return true;
}

// Get location by ID
export async function getLocationById(id) {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching location by ID:', error);
    return null;
  }
  return data;
}

// Get location by name
export async function getLocationByName(name) {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('name', name)
    .single();

  if (error) {
    console.error('Error fetching location by name:', error);
    return null;
  }
  return data;
}

// Optional: Function to remove all markers
function clearMarkers() {
  markers.forEach(marker => marker.setMap(null));
  markers.length = 0;
}

// Make sure your HTML includes the Google Maps script with callback:
// <script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap"></script>