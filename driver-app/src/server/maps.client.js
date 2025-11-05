// This client only uses browser map features or calls your server for geocoding
export async function geocodeAddress(address) {
  // prefer: call your backend which calls Google Maps Geocoding API with server key
  const res = await fetch(`${process.env.VITE_API_BASE_URL}/maps/geocode?address=${encodeURIComponent(address)}`);
  return res.json();
}
