// components/mapComponent.js or your main application file
import { supabase } from '../lib/supabaseClient'; // Adjust path as needed

function initMap() {
    // Initialize Google Map
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
    });

    // Example: Fetch locations from Supabase and add markers
    fetchLocationsAndAddMarkers(map);
}

async function fetchLocationsAndAddMarkers(map) {
    const { data, error } = await supabase
        .from('locations') // Replace 'locations' with your table name
        .select('name, latitude, longitude'); // Select relevant columns

    if (error) {
        console.error('Error fetching locations:', error);
        return;
    }

    data.forEach(location => {
        new google.maps.Marker({
            position: { lat: location.latitude, lng: location.longitude },
            map: map,
            title: location.name,
        });
    });
}

// Ensure the Google Maps API script is loaded with a callback
// <script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&callback=initMap"></script>
// The initMap function will be called once the API is loaded.