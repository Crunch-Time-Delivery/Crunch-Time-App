import axios from 'axios';
const API = process.env.VITE_API_BASE_URL || 'http://localhost:5501/api';

const client = axios.create({
  baseURL: API,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});
export default client;
