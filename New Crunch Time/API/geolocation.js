const axios = require('axios');

const BASE_URL = 'http://ip-api.com/json/';

async function getGeolocationByDomain(domain) {
  const response = await axios.get(`${BASE_URL}${domain}?fields=61439`);
  return response.data;
}

async function getGeolocationByCallerIP() {
  const response = await axios.get(`${BASE_URL}?fields=61439`);
  return response.data;
}

// Usage
getGeolocationByDomain('google.com').then(data => console.log(data));
getGeolocationByCallerIP().then(data => console.log(data));
