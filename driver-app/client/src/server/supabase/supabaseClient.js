
// Your Supabase URL and key (replace with your actual key; keep secret in server-side)
const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY; // Replace with your actual public anon key
const supabase = createClient(supabaseUrl, supabaseKey);

// Fetch Drivers
async function loadDrivers() {
  const { data: Drivers, error } = await supabase
    .from('Drivers')
    .select(`
      id,
      driver_name,
      contact,
      plate_no,
      email,
      rating,
      password,
      "Order ID",
      "Customer Name",
      "Order Date",
      Status,
      "GPS location",
      "Order Address",
      "Total Amount",
      "Order_items",
      "Order_items_Qty",
      "Order_items_Price",
      "Order_items_Total",
      "pick_up_point",
      "drop_up_point"
    `);
  document.getElementById('output').textContent = error ? 'Error: ' + error.message : JSON.stringify(Drivers, null, 2);
}

// Fetch Admins
async function loadAdmins() {
  const { data: Admins, error } = await supabase
    .from('Admin')
    .select('*');
  document.getElementById('output').textContent = error ? 'Error: ' + error.message : JSON.stringify(Admins, null, 2);
}

// Update a driver by ID
async function updateSampleDriver() {
  const updatedData = { rating: 4.5 }; // Example update
  const { data, error } = await supabase
    .from('Drivers')
    .update(updatedData)
    .eq('id', 1)
    .single();
  document.getElementById('output').textContent = error ? 'Error: ' + error.message : JSON.stringify(data, null, 2);
}

// Delete a driver by ID
async function deleteSampleDriver() {
  const { data, error } = await supabase
    .from('Drivers')
    .delete()
    .eq('id', 1)
    .single();
  document.getElementById('output').textContent = error ? 'Error: ' + error.message : JSON.stringify(data, null, 2);
}

// Update GPS Location (calls a server-side RPC you need to set up)
async function updateGps() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      // Assumes you have a Postgres RPC called 'insert_location'
      const { data, error } = await supabase.rpc('insert_location', {
        user_latitude: latitude,
        user_longitude: longitude
      });
      document.getElementById('output').textContent = error ? 'Error: ' + error.message : JSON.stringify(data, null, 2);
    }, (err) => {
      document.getElementById('output').textContent = 'Geolocation error: ' + err.message;
    });
  } else {
    document.getElementById('output').textContent = 'Geolocation not supported.';
  }
}
