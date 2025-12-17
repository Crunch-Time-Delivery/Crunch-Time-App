import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY; // Make sure this environment variable is set
export const supabase = createClient(supabaseUrl, supabaseKey);

// Storage configuration
const storageBucket = 'crunchtime'; // Your storage bucket name
const storageKeyId = 'e14f15dbd3a60e1e4b2e2f90a19b7587'; // Your storage key ID
const storageEndpoint = 'https://wbpgmgtoyzlnawvsfeiu.storage.supabase.co/storage/v1/s3';

// Upload profile picture
async function uploadProfilePicture(file, filename) {
  const filePath = `profile_pictures/${filename}`;
  const { data, error } = await supabase.storage
    .from(storageBucket)
    .upload(filePath, file, {
      headers: {
        'x-amz-meta-key': storageKeyId,
        'x-amz-meta-endpoint': storageEndpoint,
      },
    });
  if (error) {
    console.error('Error uploading profile picture:', error);
    return null;
  }
  // Generate public URL
  const publicUrl = `${storageEndpoint.replace('/storage/v1/s3', '')}/storage/v1/object/public/${filePath}`;
  return publicUrl;
}

// Fetch Admin data
async function fetchAdmin() {
  const { data: admin, error } = await supabase
    .from('Admin')
    .select(`
      id, username, password, Change_Username, Change_Password,
      "New Admin_Email", "New Admin_Username", income_amount,
      expense_amount, withdraw_amount, total_income_amount,
      order_total_amount, restaurant_name, restaurant_menu, establishment
    `);
  if (error) {
    console.error('Error fetching admin:', error);
    return null;
  }
  return admin;
}

// Load Drivers and populate UI
async function loadDrivers() {
  const { data, error } = await supabase.from('Driver').select('*');
  if (error) {
    console.error('Error fetching drivers:', error);
    return;
  }
  if (data.length >= 2) {
    document.getElementById('driverName1').innerText = data[0].driver_name;
    document.getElementById('rideHistory1').innerText = data[0].driver_ride_history;
    document.getElementById('driverPayment1').innerText = data[0].driver_payment;
    document.getElementById('driverName2').innerText = data[1].driver_name;
    document.getElementById('rideHistory2').innerText = data[1].driver_ride_history;
    document.getElementById('driverPayment2').innerText = data[1].driver_payment;
  }
}

// Load Vendors and populate UI
async function loadVendors() {
  const { data, error } = await supabase.from('Vendor').select('*');
  if (error) {
    console.error('Error fetching vendors:', error);
    return;
  }
  if (data.length >= 2) {
    document.getElementById('vendorName1').innerText = data[0].vendor_name;
    document.getElementById('vendorItems1').innerText = data[0].items;
    document.getElementById('vendorHistory1').innerText = data[0].history_orders;
    document.getElementById('vendorName2').innerText = data[1].vendor_name;
    document.getElementById('vendorItems2').innerText = data[1].items;
    document.getElementById('vendorHistory2').innerText = data[1].history_orders;
  }
}

// Fetch role management data
async function fetchRoleManagement() {
  const { data: roleData, error } = await supabase
    .from('role_management')
    .select('user_accounts_email, vendor_accounts_email, driver_accounts_email');

  if (error) {
    console.error('Error fetching role management:', error);
    return null;
  }

  const roleEmails = roleData.map(item => ({
    userEmail: item.user_accounts_email,
    vendorEmail: item.vendor_accounts_email,
    driverEmail: item.driver_accounts_email,
  }));

  return roleEmails;
}

// Handle driver cancellation (or update status)
async function cancelDriver(driverName) {
  alert('Cancel driver: ' + driverName);
  // Example: update driver status in database
  // await supabase.from('Driver').update({ status: 'canceled' }).eq('driver_name', driverName);
}

// Call functions on page load
window.onload = () => {
  if (!isAuthenticated) {
    document.getElementById('loginModal').style.display='flex';
  } else {
    document.getElementById('loginModal').style.display='none';
  }
  initCharts();
  updateMonthlyData('January');
  loadDrivers();
  loadVendors();
  // Fetch role management data if needed
  fetchRoleManagement().then(roleEmails => {
    if (roleEmails) {
      console.log('Role Emails:', roleEmails);
      // You can process or display role email info here
    }
  });
};