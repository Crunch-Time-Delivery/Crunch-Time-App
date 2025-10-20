async function initGoogleMap() {
  const config = await fetchConfig('googleMapsConfig.json');
  const { apiKey, mapOptions } = config;

  // Load Google Maps script dynamically
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
  document.head.appendChild(script);
  script.onload = () => {
    const map = new google.maps.Map(document.getElementById('map'), mapOptions);
    return map;
  };
}