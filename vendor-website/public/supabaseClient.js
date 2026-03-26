 import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Replace with your actual Supabase URL and API key
const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY; // Ensure this is set as an environment variable
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Error handler
 * @param {string} operation - Name of the operation
 * @param {Object} error - Error object
 */
function handleError(operation, error) {
  console.error(`Error during ${operation}:`, error.message || error);
}

// ========================= Vendor CRUD + Version + Edge Function ========================= //

/**
 * Fetch specific vendor fields, ordered by creation date (latest first)
 */
export async function fetchVendor() {
  const { data, error } = await supabase
    .from('vendor')
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
  if (error) handleError('fetchVendor', error);
  return data;
}

/**
 * Fetch all vendors
 */
export async function fetchAllVendors() {
  const { data, error } = await supabase.from('vendor').select('*');
  if (error) handleError('fetchAllVendors', error);
  return data;
}

/**
 * Create a new vendor
 */
export async function createVendor(vendorData) {
  const { data, error } = await supabase.from('vendor').insert([vendorData]);
  if (error) handleError('createVendor', error);
  return data;
}

/**
 * Update vendor by ID
 */
export async function updateVendor(id, updateData) {
  const { data, error } = await supabase
    .from('vendor')
    .update(updateData)
    .eq('id', id);
  if (error) handleError('updateVendor', error);
  return data;
}

/**
 * Delete vendor by ID
 */
export async function deleteVendor(id) {
  const { data, error } = await supabase
    .from('vendor')
    .delete()
    .eq('id', id);
  if (error) handleError('deleteVendor', error);
  return data;
}

/**
 * Batch insert vendors
 */
export async function insertMultipleVendors(vendorsArray) {
  const { data, error } = await supabase.from('vendor').insert(vendorsArray);
  if (error) handleError('insertMultipleVendors', error);
  return data;
}

/**
 * Batch update vendors
 * updatesArray: [{ id, ...fieldsToUpdate }, ...]
 */
export async function updateMultipleVendors(updatesArray) {
  const results = [];
  for (const { id, ...fields } of updatesArray) {
    const res = await updateVendor(id, fields);
    results.push(res);
  }
  return results;
}

/**
 * Update version of a vendor
 */
export async function updateVendorVersion(id, newVersion) {
  return await updateVendor(id, { version: newVersion });
}

// ========================= Edge Functions ========================= //

/**
 * Call a Supabase Edge Function
 * @param {string} functionName - Name of the function
 * @param {Object} payload - Data to send
 */
export async function callEdgeFunction(functionName, payload) {
  const url = `${supabaseUrl}/functions/v1/${functionName}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apiKey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error calling function: ${errorText}`);
    }
    return await response.json();
  } catch (err) {
    handleError(`callEdgeFunction: ${functionName}`, err);
    throw err;
  }
}

// ========================= Usage Examples ========================= //

// Fetch vendors
// fetchVendor().then(console.log);

// Create a vendor
// createVendor({ vendor: 'VendorX', item: 'ItemY', price: 100, stock: 50, email: 'vendorx@example.com' });

// Update vendor
// updateVendor(1, { price: 120 });

// Delete vendor
// deleteVendor(1);

// Call an Edge Function
// callEdgeFunction('processOrder', { orderId: 123 }).then(console.log);