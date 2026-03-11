import { supabase } from '../lib/supabaseClient'; // Adjust path as needed

// Initialize the map
let map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
    });
    fetchLocationsAndAddMarkers();
}

// Fetch all locations and add markers
async function fetchLocationsAndAddMarkers() {
    const { data, error } = await supabase
        .from('locations') // Your table name
        .select('id, name, latitude, longitude');

    if (error) {
        console.error('Error fetching locations:', error);
        return;
    }

    // Clear existing markers if needed
    // (You can manage markers array if you want to clear previous markers)

    data.forEach(location => {
        new google.maps.Marker({
            position: { lat: location.latitude, lng: location.longitude },
            map: map,
            title: location.name,
            // Optionally, store marker references if you want to manipulate later
        });
    });
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
    // Optionally, refresh markers
    fetchLocationsAndAddMarkers();
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
    // Refresh markers to reflect changes
    fetchLocationsAndAddMarkers();
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
    // Refresh markers after deletion
    fetchLocationsAndAddMarkers();
    return true;
}

// Fetch a specific location by ID or name
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

// Optional: function to clear all markers if managing them explicitly
// You can implement marker management if needed for better control

// Make sure to include the Google Maps API script in your HTML with the callback to initMap:
// <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB9sNhi824hNncjfW7HHzaI_s8JtWGfM0Q&callback=initMap"></script>