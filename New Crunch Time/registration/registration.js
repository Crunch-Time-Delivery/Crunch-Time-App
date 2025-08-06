const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // replace with your actual key
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.getElementById('registerBtn').addEventListener('click', async () => {
  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const password = document.getElementById('password').value;
  const messageDiv = document.getElementById('message');
  messageDiv.innerHTML = '';

  const { data, error } = await supabase
    .from('users')  // your table name
    .insert([{ full_name: fullName, email: email, phone_number: phone, password: password }]);

  if (error) {
    messageDiv.innerHTML = '<p class="error">' + error.message + '</p>';
  } else {
    messageDiv.innerHTML = '<p class="success">Registration successful!</p>';
  }
});
