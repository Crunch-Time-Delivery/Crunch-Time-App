const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // replace with your actual key
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.getElementById('loginBtn').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  document.getElementById('message').innerHTML = '';

  const { user, error } = await supabase.auth.signIn({ email, password });
  if (error) {
    document.getElementById('message').innerHTML = '<p class="error">' + error.message + '</p>';
  } else {
    document.getElementById('message').innerHTML = '<p>Login successful!</p>';
  }
});
