 import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY; // Replace with your actual key
const supabase = createClient(supabaseUrl, supabaseKey);

// Example error handler function
function handleError(operation, error) {
  console.error(`Error during ${operation}:`, error.message);
  // Add more error handling as needed
}

// Fetch all vendors with specific fields
export async function fetchVendor() {
  const { data, error } = await supabase
    .from('vendor') // Ensure your table name is lowercase 'vendor' or 'Vendor'
    .select(`
      id,
      vendor,
      item,
      price,
      stock,
      email,
      password,
      manage_item,
      manage_orders_customer_name,
      manage_order_total,
      manage_order_status,
      manage_users,
      payment_history
    `)
    .order('created_at', { ascending: false });
  
  if (error) {
    handleError('fetchVendor', error);
    return null;
  }
  return data;
}

// Fetch all vendors (simpler)
export async function fetchAllVendors() {
  const { data, error } = await supabase.from('vendor').select('*');
  if (error) {
    console.error('Error fetching vendors:', error);
    return null;
  }
  return data;
}

// Create a new vendor
export async function createVendor(vendorData) {
  const { data, error } = await supabase.from('vendor').insert([vendorData]);
  if (error) {
    console.error('Error creating vendor:', error);
    return null;
  }
  return data;
}

// Update an existing vendor by ID
export async function updateVendor(id, updateData) {
  const { data, error } = await supabase
    .from('vendor')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  if (error) {
    console.error('Error updating vendor:', error);
    return null;
  }
  return data;
}

// Delete a vendor by ID
export async function deleteVendor(id) {
  const { data, error } = await supabase
    .from('vendor')
    .delete()
    .eq('id', id)
    .select()
    .single();
  if (error) {
    console.error('Error deleting vendor:', error);
    return null;
  }
  return data;
}