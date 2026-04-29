 import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Replace with your actual Supabase URL and API key
const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY; // Ensure this is set as an environment variable
const supabase = createClient(supabaseUrl, supabaseKey);

// Error handler
async function handleError(operation, error) {
  console.error(`Error during ${operation}:`, error.message || error);
  // Optionally, notify the user or log to an external service
}

// ========================= Vendor CRUD + Version + Edge Function ========================= //

// Fetch specific vendor fields, ordered by creation date (latest first)
export async function fetchVendor() {
  try {
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
    if (error) throw error;
    return data;
  } catch (error) {
    await handleError('fetchVendor', error);
    return null;
  }
}

// Fetch all vendors
export async function fetchAllVendors() {
  try {
    const { data, error } = await supabase.from('vendor').select('*');
    if (error) throw error;
    return data;
  } catch (error) {
    await handleError('fetchAllVendors', error);
    return null;
  }
}

// Create new vendor
export async function createVendor(vendorData) {
  try {
    const { data, error } = await supabase.from('vendor').insert([vendorData]);
    if (error) throw error;
    return data;
  } catch (error) {
    await handleError('createVendor', error);
    return null;
  }
}

// Update vendor by ID
export async function updateVendor(id, updateData) {
  try {
    const { data, error } = await supabase
      .from('vendor')
      .update(updateData)
      .eq('id', id);
    if (error) throw error;
    return data;
  } catch (error) {
    await handleError('updateVendor', error);
    return null;
  }
}

// Delete vendor by ID
export async function deleteVendor(id) {
  try {
    const { data, error } = await supabase
      .from('vendor')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return data;
  } catch (error) {
    await handleError('deleteVendor', error);
    return null;
  }
}

// Batch insert vendors
export async function insertMultipleVendors(vendorsArray) {
  try {
    const { data, error } = await supabase.from('vendor').insert(vendorsArray);
    if (error) throw error;
    return data;
  } catch (error) {
    await handleError('insertMultipleVendors', error);
    return null;
  }
}

// Batch update vendors concurrently
export async function updateMultipleVendors(updatesArray) {
  try {
    const updatePromises = updatesArray.map(({ id, ...fields }) =>
      updateVendor(id, fields)
    );
    const results = await Promise.all(updatePromises);
    return results;
  } catch (error) {
    await handleError('updateMultipleVendors', error);
    return [];
  }
}

// Update vendor version
export async function updateVendorVersion(id, newVersion) {
  return await updateVendor(id, { version: newVersion });
}

// ========================= Edge Functions ========================= //

// Call a Supabase Edge Function with timeout
export async function callEdgeFunction(functionName, payload, timeout = 15000) {
  const url = `${supabaseUrl}/functions/v1/${functionName}`;
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apiKey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(id);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error calling ${functionName}: ${errorText}`);
    }
    return await response.json();
  } catch (err) {
    await handleError(`callEdgeFunction: ${functionName}`, err);
    throw err;
  }
}

// ========================= Usage Examples ========================= //

// Example usage:
// fetchVendor().then(console.log);
// createVendor({ vendor: 'VendorX', item: 'ItemY', price: 100 });
// updateVendor(1, { price: 120 });
// deleteVendor(1);
// callEdgeFunction('processOrder', { orderId: 123 }).then(console.log);