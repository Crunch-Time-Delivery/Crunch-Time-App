 import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Replace with your actual Supabase URL and API key
const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY; // Ensure this environment variable is set

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Error handler
 * @param {string} operation - Name of the operation
 * @param {Object} error - Error object
 */
function handleError(operation, error) {
  console.error(`Error during ${operation}:`, error.message || error);
}

/**
 * Fetch specific vendor fields, ordered by creation date (latest first)
 * @returns {Promise<Array|null>}
 */
export async function fetchVendor() {
  const { data, error } = await supabase
    .from('vendor') // Confirm your table name is 'vendor'
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

/**
 * Fetch all vendors (all columns)
 * @returns {Promise<Array|null>}
 */
export async function fetchAllVendors() {
  const { data, error } = await supabase.from('vendor').select('*');
  if (error) {
    handleError('fetchAllVendors', error);
    return null;
  }
  return data;
}

/**
 * Create a new vendor
 * @param {Object} vendorData - Data for the new vendor
 * @returns {Promise<Object|null>}
 */
export async function createVendor(vendorData) {
  const { data, error } = await supabase.from('vendor').insert([vendorData]);
  if (error) {
    handleError('createVendor', error);
    return null;
  }
  return data;
}

/**
 * Update vendor by ID
 * @param {number|string} id - Vendor ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object|null>}
 */
export async function updateVendor(id, updateData) {
  const { data, error } = await supabase
    .from('vendor')
    .update(updateData)
    .eq('id', id);
  if (error) {
    handleError('updateVendor', error);
    return null;
  }
  return data;
}

/**
 * Delete vendor by ID
 * @param {number|string} id - Vendor ID
 * @returns {Promise<Object|null>}
 */
export async function deleteVendor(id) {
  const { data, error } = await supabase
    .from('vendor')
    .delete()
    .eq('id', id);
  if (error) {
    handleError('deleteVendor', error);
    return null;
  }
  return data;
}