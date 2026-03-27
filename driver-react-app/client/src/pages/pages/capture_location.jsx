const { createClient } = supabase; // Assuming supabase is globally available

// Replace with your actual Supabase project info
const supabaseUrl = 'YOUR_SUPABASE_URL'; // e.g., 'https://xyzcompany.supabase.co'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // e.g., 'public-anonymous-key'
const supabase = createClient(supabaseUrl, supabaseKey);

class CaptureLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      map: null,
      marker: null,
      currentPosition: null,
      loading: true,
      message: '',
    };
    this.initMap = this.initMap.bind(this);
    this.handleSaveLocation = this.handleSaveLocation.bind(this);
  }

  componentDidMount() {
    // Expose reference for callback
    if (window.CaptureLocationRef !== this) {
      window.CaptureLocationRef = this;
    }
  }

  initMap() {
    const defaultPos = { lat: 0, lng: 0 };
    const mapDiv = document.getElementById('map');

    const map = new google.maps.Map(mapDiv, {
      center: defaultPos,
      zoom: 2,
    });

    // Try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map.setCenter(pos);
          map.setZoom(14);
          this.setState({ currentPosition: pos, map: map, loading: false });
          this.placeMarker(pos);
        },
        () => {
          this.setState({ message: 'Could not get your location', loading: false });
        }
      );
    } else {
      this.setState({ message: 'Geolocation not supported', loading: false });
    }

    // Add click listener to map
    map.addListener('click', (e) => {
      const clickedPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      this.setState({ currentPosition: clickedPos });
      this.placeMarker(clickedPos);
    });
  }

  placeMarker(position) {
    if (this.state.marker) {
      this.state.marker.setPosition(position);
    } else {
      const marker = new google.maps.Marker({
        position: position,
        map: this.state.map,
      });
      this.setState({ marker });
    }
  }

  async handleSaveLocation() {
    const { currentPosition } = this.state;
    if (!currentPosition) {
      alert('Please select a location on the map.');
      return;
    }

    const { data, error } = await supabase
      .from('locations') // Ensure your table exists
      .insert([
        {
          latitude: currentPosition.lat,
          longitude: currentPosition.lng,
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      alert('Error saving location: ' + error.message);
    } else {
      alert('Location saved successfully!');
    }
  }

  render() {
    return React.createElement(
      'div',
      { style: { maxWidth: '800px', margin: '0 auto', padding: '10px' } },
      React.createElement('h2', null, 'Capture Location'),
      this.state.loading && React.createElement('p', null, 'Loading map...'),
      this.state.message && React.createElement('p', { style: { color: 'red' } }, this.state.message),
      React.createElement('div', {
        id: 'map',
        style: { width: '100%', height: '400px', border: '1px solid #ccc' },
      }),
      this.state.currentPosition &&
        React.createElement(
          'div',
          { style: { marginTop: '10px' } },
          React.createElement(
            'p',
            null,
            'Selected Coordinates: Latitude: ',
            this.state.currentPosition.lat.toFixed(5),
            ', Longitude: ',
            this.state.currentPosition.lng.toFixed(5)
          ),
          React.createElement(
            'button',
            { onClick: this.handleSaveLocation },
            'Save Location'
          )
        )
    );
  }
}