import axios from 'axios';
const API = process.env.VITE_API_BASE_URL;

export function sendSms(to, message) {
  return axios.post(`${API}/notify/sms`, { to, message });
}
