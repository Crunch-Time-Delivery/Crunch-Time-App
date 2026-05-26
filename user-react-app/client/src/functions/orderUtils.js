// orderUtils.js
export function formatDateTime(dateStr) {
  return new Date(dateStr).toLocaleString();
}

export function generateOrderID() {
  return 'ORDER-' + Date.now();
}