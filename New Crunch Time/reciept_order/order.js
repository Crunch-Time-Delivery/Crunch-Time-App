const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // replace with your key
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function fetchOrders() {
  document.getElementById('loading').style.display = 'block';
  document.getElementById('error').innerText = '';
  document.getElementById('ordersTable').style.display = 'none';

  const { data, error } = await supabase
    .from('Reciept_Order')
    .select('*')
    .range(0, 9); // first 10 records

  document.getElementById('loading').style.display = 'none';

  if (error) {
    document.getElementById('error').innerText = error.message;
  } else {
    const tbody = document.querySelector('#ordersTable tbody');
    tbody.innerHTML = '';
    data.forEach(order => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${order.id}</td>
        <td>${order.some_column}</td>
        <td>${order.other_column}</td>
      `;
      tbody.appendChild(row);
    });
    document.getElementById('ordersTable').style.display = 'table';
  }
}

fetchOrders();
