import React, { useState } from 'react';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import './geolocation.css'; // Import CSS for styling

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY; // Ensure this is set in .env
const supabase = createClient(supabaseUrl, supabaseKey);

const BASE_URL = 'http://ip-api.com/json/';

const GeolocationPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationData, setLocationData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to fetch geolocation by domain or IP
  const getGeolocation = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}${query}?fields=61439`);
      setLocationData(response.data);
    } catch (err) {
      setError('Failed to fetch location data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await getGeolocation(searchQuery);
    } else {
      await getGeolocation(''); // Fetch caller's IP if no query
    }
  };

  // Function to save location to Supabase
  const saveLocationToSupabase = async () => {
    if (!locationData) return;

    try {
      const { data, error } = await supabase
        .from('Location')
        .insert([
          {
            query: locationData.query,
            country: locationData.country,
            countryCode: locationData.countryCode,
            region: locationData.region,
            regionName: locationData.regionName,
            city: locationData.city,
            zip: locationData.zip,
            lat: locationData.lat,
            lon: locationData.lon,
            timezone: locationData.timezone,
            isp: locationData.isp,
            org: locationData.org,
            as: locationData.as,
          },
        ])
        .select();

      if (error) {
        setError('Failed to save location to database.');
        console.error(error);
      } else {
        alert('Location saved successfully!');
      }
    } catch (err) {
      setError('An error occurred while saving the location.');
      console.error(err);
    }
  };

  return (
    <div className="geolocation-container">
      <header className="header">
        <h1>Geolocation Search</h1>
      </header>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Enter your location (e.g., google.com or IP address)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {locationData && (
        <div className="location-result">
          <h2>Location Details</h2>
          <p><strong>IP/Domain:</strong> {locationData.query}</p>
          <p><strong>Country:</strong> {locationData.country}</p>
          <p><strong>Country Code:</strong> {locationData.countryCode}</p>
          <p><strong>Region:</strong> {locationData.regionName} ({locationData.region})</p>
          <p><strong>City:</strong> {locationData.city}</p>
          <p><strong>ZIP:</strong> {locationData.zip}</p>
          <p><strong>Latitude:</strong> {locationData.lat}</p>
          <p><strong>Longitude:</strong> {locationData.lon}</p>
          <p><strong>Timezone:</strong> {locationData.timezone}</p>
          <p><strong>ISP:</strong> {locationData.isp}</p>
          <p><strong>Organization:</strong> {locationData.org}</p>
          <p><strong>AS:</strong> {locationData.as}</p>
        </div>
      )}

      {locationData && (
        <button className="confirm-button" onClick={saveLocationToSupabase}>
          Confirm Location
        </button>
      )}
    </div>
  );
};

export default GeolocationPage;