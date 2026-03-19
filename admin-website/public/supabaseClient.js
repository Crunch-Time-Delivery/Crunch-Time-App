import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY; // Ensure this is set properly
export const supabase = createClient(supabaseUrl, supabaseKey);

// Storage configuration
const storageBucket = 'crunchtime'; // Your storage bucket name

// Upload profile picture
export async function uploadProfilePicture(file, filename) {
  try {
    const filePath = `profile_pictures/${filename}`;

    // Upload file to storage
    const { data, error: uploadError } = await supabase.storage
      .from(storageBucket)
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading profile picture:', uploadError);
      return null;
    }

    // Generate public URL
    const { publicURL, error: urlError } = supabase.storage
      .from(storageBucket)
      .getPublicUrl(filePath);

    if (urlError) {
      console.error('Error generating public URL:', urlError);
      return null;
    }

    return publicURL;
  } catch (error) {
    console.error('Unexpected error in uploadProfilePicture:', error);
    return null;
  }
}

// Fetch Admin data
export async function fetchAdmin() {
  try {
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
  } catch (error) {
    console.error('Unexpected error in fetchAdmin:', error);
    return null;
  }
}

// Load Drivers and populate UI
export async function loadDrivers() {
  try {
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
  } catch (error) {
    console.error('Unexpected error in loadDrivers:', error);
  }
}

// Load Vendors and populate UI
export async function loadVendors() {
  try {
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
  } catch (error) {
    console.error('Unexpected error in loadVendors:', error);
  }
}

// Fetch role management data
export async function fetchRoleManagement() {
  try {
    const { data: roleData, error } = await supabase
      .from('role_management')
      .select('user_accounts_email, vendor_accounts_email, driver_accounts_email');

    if (error) {
      console.error('Error fetching role management:', error);
      return null;
    }

    // Map data to a cleaner format
    return roleData.map(item => ({
      userEmail: item.user_accounts_email,
      vendorEmail: item.vendor_accounts_email,
      driverEmail: item.driver_accounts_email,
    }));
  } catch (error) {
    console.error('Unexpected error in fetchRoleManagement:', error);
    return null;
  }
}

// Handle driver cancellation or status update
export async function cancelDriver(driverName) {
  try {
    alert('Cancel driver: ' + driverName);
    // Example: update driver status in database
    const { error } = await supabase
      .from('Driver')
      .update({ status: 'canceled' })
      .eq('driver_name', driverName);

    if (error) {
      console.error('Error canceling driver:', error);
    }
  } catch (error) {
    console.error('Error in cancelDriver:', error);
  }
}

// Initialization on page load
window.onload = () => {
  const isAuthenticated = true; // Replace with your actual auth logic

  if (!isAuthenticated) {
    document.getElementById('loginModal').style.display = 'flex';
  } else {
    document.getElementById('loginModal').style.display = 'none';
  }

  // Initialize charts, data, etc.
  if (typeof initCharts === 'function') initCharts();
  if (typeof updateMonthlyData === 'function') updateMonthlyData('January');

  // Load data
  loadDrivers();
  loadVendors();

  // Fetch role management data
  fetchRoleManagement().then(roleEmails => {
    if (roleEmails) {
      console.log('Role Emails:', roleEmails);
    }
  });
};