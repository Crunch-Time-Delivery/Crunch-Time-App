const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY; //  actual key
const supabase = createClient(supabaseUrl, supabaseKey)
const userId = localStorage.getItem('user_id');

// Fetch vendor data
async function fetchUser() {
  const { data: user, error } = await supabase
    .from('user')
    .select(
      `
      id,
      username,
      email,
      name,
      role,
      order_cart,
      checkout_cart,
      pick_up_point,
      drop_off_point,
      longitude,
      latitude,
      location_name,
      ORDER_ID
    `
    );

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }
  return user;

}

window.openProfile = () => {
  document.getElementById('profileModal').style.display = 'flex';
  loadProfile();
}

window.closeProfile = () => {
  document.getElementById('profileModal').style.display = 'none';
}

window.updatePassword = async () => {
  const password = document.getElementById('password').value;
  const { error } = await supabase
    .from('User')
    .update({ password })
    .eq('id', userId);
  alert(error ? 'Password update failed' : 'Password updated');
}

window.saveCardDetails = async () => {
  const data = {
    card_type: document.getElementById('cardType').value,
    card_number: document.getElementById('cardNumber').value,
    cvv: document.getElementById('cvv').value,
    security_code: document.getElementById('securityCode').value
  };
  const { error } = await supabase.from('User').update(data).eq('id', userId);
  alert(error ? 'Card save failed' : 'Card saved');
}

window.deleteUser = async () => {
  if (!confirm('Delete account permanently?')) return;
  await supabase.from('User').delete().eq('id', userId);
  localStorage.clear();
  location.href = 'http://127.0.0.1:5501/user-app/register_home.html';
}
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('server_worker.js')
      .then(reg => console.log('Service Worker registered', reg))
      .catch(err => console.log('Service Worker registration failed', err));
  });
}