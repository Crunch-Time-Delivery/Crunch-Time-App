async function initGoogleMap() {
  const config = await fetchConfig('googleMapsConfig.json');
  const { apiKey, mapOptions } = config;

  // Load Google Maps script dynamically
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${AIzaSyB9sNhi824hNncjfW7HHzaI_s8JtWGfM0Q}`;
  document.head.appendChild(script);
  script.onload = () => {
    const map = new google.maps.Map(document.getElementById('map'), mapOptions);
    return map;
  };
}