let map, marker, geocoder;
const DEFAULT_POS = { lat: -33.9249, lng: 18.4241 }; // Cape Town

function initMap() {
  // Initialize map
  map = new google.maps.Map(document.getElementById("map"), {
    center: DEFAULT_POS,
    zoom: 13
  });

  // Initialize marker
  marker = new google.maps.Marker({
    map: map,
    position: DEFAULT_POS,
    draggable: true
  });

  // Initialize geocoder
  geocoder = new google.maps.Geocoder();

  // Load saved location if available
  loadSavedLocation();

  // Search form submit handler
  document.getElementById("locationForm").addEventListener("submit", e => {
    e.preventDefault();
    const address = document.getElementById("locationInput").value.trim();
    if (!address) return;

    geocoder.geocode({ address }, (results, status) => {
      if (status !== "OK" || !results[0]) {
        alert("Location not found. Please check the address.");
        return;
      }
      const result = results[0];
      const pos = {
        lat: result.geometry.location.lat(),
        lng: result.geometry.location.lng()
      };
      saveLocation(pos, result.formatted_address);
      updateMap(pos, result.formatted_address);
      document.getElementById("user_location_id").value = `${pos.lat},${pos.lng}`;
      alert("Location set and saved!");
    });
  });

  // Use current location button
  document.getElementById("locateBtn").addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      position => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        geocoder.geocode({ location: pos }, (results, status) => {
          if (status !== "OK" || !results[0]) {
            alert("Unable to get address for your location");
            return;
          }
          const address = results[0].formatted_address;
          saveLocation(pos, address);
          updateMap(pos, address);
          document.getElementById("user_location_id").value = `${pos.lat},${pos.lng}`;
        });
      },
      () => alert("Permission denied or error")
    );
  });

  // Reset map button inside initMap
  document.getElementById("resetBtn").addEventListener("click", () => {
    localStorage.removeItem("deliveryCoords");
    localStorage.removeItem("deliveryAddress");
    updateMap(DEFAULT_POS, "");
    document.getElementById("locationInput").value = "";
    document.getElementById("coordinates").innerText = "No location selected.";
    document.getElementById("user_location_id").value = "";
  });
}

// Load saved location from local storage
function loadSavedLocation() {
  const coordsStr = localStorage.getItem("deliveryCoords");
  const address = localStorage.getItem("deliveryAddress");
  if (coordsStr && address) {
    const coords = JSON.parse(coordsStr);
    updateMap(coords, address);
  }
}

// Update map and marker
function updateMap(pos, address) {
  map.setCenter(pos);
  map.setZoom(15);
  marker.setPosition(pos);
  document.getElementById("coordinates").innerText =
    `Lat: ${pos.lat.toFixed(5)}, Lng: ${pos.lng.toFixed(5)}`;
  if (address) document.getElementById("locationInput").value = address;
}

// Save location to local storage
function saveLocation(pos, address) {
  localStorage.setItem("deliveryCoords", JSON.stringify(pos));
  localStorage.setItem("deliveryAddress", address);
}