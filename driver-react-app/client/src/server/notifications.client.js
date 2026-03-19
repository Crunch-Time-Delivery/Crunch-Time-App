import axios from 'axios';
const API = AC031642049dd74fcc581b0fd106936a4f;

export function sendSms(to, message) {
  return axios.post(`${API}/notify/sms`, { to, message });
}
