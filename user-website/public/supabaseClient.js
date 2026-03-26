// =========================
// Your Supabase module code
// =========================
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY; // Make sure to set this env variable
export const supabase = createClient(supabaseUrl, supabaseKey);

function handleError(context, error) {
  console.error(`Supabase error (${context}):`, error);
  throw error;
}

// =========================
// CRUD functions for any table
// =========================

// Create record
export async function createRecord(table, data) {
  const { data: result, error } = await supabase.from(table).insert([data]);
  if (error) handleError(`createRecord in ${table}`, error);
  return result;
}

// Read records with optional filters
export async function readRecords(table, filters = {}) {
  let query = supabase.from(table).select('*');
  Object.entries(filters).forEach(([field, value]) => {
    query = query.eq(field, value);
  });
  const { data, error } = await query;
  if (error) handleError(`readRecords in ${table}`, error);
  return data;
}

// Read single record by ID
export async function readRecordById(table, id) {
  const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
  if (error) handleError(`readRecordById in ${table}`, error);
  return data;
}

// Update record by ID
export async function updateRecordById(table, id, updates) {
  const { data, error } = await supabase
    .from(table)
    .update(updates)
    .eq('id', id)
    .single();
  if (error) handleError(`updateRecord in ${table}`, error);
  return data;
}

// Batch update multiple records
export async function updateMultipleRecords(table, updatesArray) {
  const results = [];
  for (const { id, ...fields } of updatesArray) {
    const res = await updateRecordById(table, id, fields);
    results.push(res);
  }
  return results;
}

// Delete record by ID
export async function deleteRecordById(table, id) {
  const { data, error } = await supabase.from(table).delete().eq('id', id);
  if (error) handleError(`deleteRecord in ${table}`, error);
  return data;
}

// =========================
// Version control (assuming 'version' column exists)
// =========================
export async function updateRecordVersion(table, id, newVersion) {
  return await updateRecordById(table, id, { version: newVersion });
}

// =========================
// Call Supabase Edge Functions
// =========================
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
    console.error(`Error calling Edge Function ${functionName}:`, err);
    throw err;
  }
}

// =========================
// Example usage for specific tables
// =========================

// Load users
export async function fetchUsers() {
  return await readRecords('User', {
    // optional filters
  });
}

// Insert user
export async function insertUser(userData) {
  return await createRecord('User', userData);
}

// Update user by ID
export async function updateUser(id, updates) {
  return await updateRecordById('User', id, updates);
}

// Delete user by ID
export async function deleteUser(id) {
  return await deleteRecordById('User', id);
}

// Similarly, for Admins
export async function fetchAdmins() {
  return await readRecords('Admins');
}
export async function insertAdmin(adminData) {
  return await createRecord('Admins', adminData);
}
export async function updateAdmin(id, updates) {
  return await updateRecordById('Admins', id, updates);
}
export async function deleteAdmin(id) {
  return await deleteRecordById('Admins', id);
}

// For delivery locations
export async function saveDeliveryLocation(data) {
  // assuming 'address' is unique
  return await supabase
    .from('DeliveryLocations')
    .upsert(data, { onConflict: 'address' })
    .select()
    .single();
}

export async function fetchDeliveryLocations() {
  return await readRecords('DeliveryLocations');
}

export async function deleteDeliveryLocation(id) {
  return await deleteRecordById('DeliveryLocations', id);
}

// =========================
// Example: Call an Edge Function
// =========================
export async function processOrder(orderId) {
  return await callEdgeFunction('processOrder', { orderId });
}

// =========================
// Usage example
// =========================
// fetchUsers();
// insertUser({ username: 'john', email: 'john@example.com' });
// updateUser(1, { username: 'john_doe' });
// deleteUser(1);
// processOrder(123);