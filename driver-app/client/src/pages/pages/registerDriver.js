/* ===== NOTIFICATION ===== */
function showNotificationMessage(message, color = '#4CAF50') {
  const notif = document.getElementById('notification');
  notif.innerHTML = `<div style="background:${color}">${message}</div>`;
  notif.style.display = 'block';

  setTimeout(() => {
    notif.style.display = 'none';
  }, 3000);
}

/* ===== BANK TOGGLE ===== */
document.getElementById('bankName').addEventListener('change', e => {
  document.getElementById('otherBankDiv')
    .classList.toggle('hidden', e.target.value !== 'Other');
});

/* ===== FORM SUBMIT (UI ONLY) ===== */
document.getElementById('driverForm').addEventListener('submit', e => {
  e.preventDefault();
  showNotificationMessage('Submitting registration...');
});