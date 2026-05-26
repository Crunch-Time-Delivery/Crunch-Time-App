// orderUI.js
export function updateOrderStatusUI(statusText) {
  const statusEl = document.getElementById('orderStatus');
  if (statusEl) {
    statusEl.innerText = statusText;
  }
}

export function showOrderHistory(historyItems) {
  const container = document.getElementById('orderHistoryContainer');
  container.innerHTML = '<h4>Order History</h4>';
  historyItems.forEach(item => {
    const div = document.createElement('div');
    div.innerText = `${item.action} at ${new Date(item.created_at).toLocaleString()}`;
    container.appendChild(div);
  });
}