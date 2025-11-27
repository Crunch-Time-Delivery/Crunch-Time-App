let map;
let marker;

function initMap() {
    // Initialize the map centered at a default location (e.g., San Francisco)
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 37.7749, lng: -122.4194 },
        zoom: 12,
    });

    // Create a marker (initially hidden or at a default location)
    marker = new google.maps.Marker({
        map: map,
        position: { lat: 0, lng: 0 }, // Placeholder
        title: "Current Location",
    });

    // Check if the browser supports Geolocation
    if (navigator.geolocation) {
        // Watch for position changes
        navigator.geolocation.watchPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                // Update marker position and center the map
                marker.setPosition(pos);
                map.setCenter(pos);
                marker.setMap(map); // Ensure marker is visible
            },
            () => {
                handleLocationError(true, map.getCenter());
            }
        );
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, pos) {
    // Handle errors (e.g., user denies location access)
    console.error(
        browserHasGeolocation
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support Geolocation."
    );
    // You might display a message to the user here
}

// Ensure the initMap function is called when the API loads
// This is typically done by adding `callback=initMap` to the API script URL in your HTML