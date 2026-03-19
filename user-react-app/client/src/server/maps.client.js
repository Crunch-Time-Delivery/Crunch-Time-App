// This client only uses browser map features or calls your server for geocoding
export async function geocodeAddress(address) {
  // prefer: call your backend which calls Google Maps Geocoding API with server key
  const res = await fetch(`${AIzaSyB9sNhi824hNncjfW7HHzaI_s8JtWGfM0Q}/maps/geocode?address=${encodeURIComponent(address)}`);
  return res.json();
}
