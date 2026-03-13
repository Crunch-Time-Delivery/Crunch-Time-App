
ReactDOM.render(<CaptureLocation />, document.getElementById('root'));
   // === Load Google Maps ===
  (function loadGoogleMaps() {
    if (typeof google !== 'undefined') return;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${AIzaSyB9sNhi824hNncjfW7HHzaI_s8JtWGfM0Q}&callback=initMap`;
    script.async = true;
    script.defer = true;


    script.onerror = () => alert('Failed to load Google Maps. Check API key.');
    document.head.appendChild(script);
  })();