import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function MyMap() {
  return (
    <MapContainer style={{ height: '400px', width: '100%' }} center={[51.505, -0.09]} zoom={13}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Marker position={[51.505, -0.09]}>
        <Popup>Hello from London!</Popup>
      </Marker>
    </MapContainer>
  );
}

export default MyMap;