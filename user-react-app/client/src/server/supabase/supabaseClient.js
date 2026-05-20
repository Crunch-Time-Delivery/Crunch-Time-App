// =========================
// Your Supabase module code
// =========================
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY; // Make sure to set this env variable
export const supabase = createClient(supabaseUrl, supabaseKey);
// Error handling helper
function handleError(context, error) {
  console.error(`Supabase error (${context}):`, error);
  throw error; // rethrow after logging
}

// =========================
// CRUD operations for any table
// =========================

// Create a new record
export async function createRecord(table, data) {
  const { data: result, error } = await supabase.from(table).insert([data]);
  if (error) handleError(`createRecord in ${table}`, error);
  return result;
}

// Read records with optional filters
export async function readRecords(table, filters = {}) {
  try {
    let query = supabase.from(table).select('*');
    Object.entries(filters).forEach(([field, value]) => {
      query = query.eq(field, value);
    });
    const { data, error } = await query;
    if (error) handleError(`readRecords in ${table}`, error);
    return data;
  } catch (err) {
    handleError(`readRecords in ${table}`, err);
  }
}

// Read a single record by ID
export async function readRecordById(table, id) {
  const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
  if (error) handleError(`readRecordById in ${table}`, error);
  return data;
}

// Update a record by ID
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

// Delete a record by ID
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
    handleError(`callEdgeFunction ${functionName}`, err);
  }
}

// =========================
// Specific table operations
// =========================

// Users
export async function fetchUsers() {
  return await readRecords('User');
}
export async function insertUser(userData) {
  return await createRecord('User', userData);
}
export async function updateUser(id, updates) {
  return await updateRecordById('User', id, updates);
}
export async function deleteUser(id) {
  return await deleteRecordById('User', id);
}

// Admins
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

// Delivery Locations
export async function saveDeliveryLocation(data) {
  // Assuming 'address' is a unique key
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

// Example: Call a specific edge function
export async function processOrder(orderId) {
  return await callEdgeFunction('processOrder', { orderId });
}

// =========================
// Usage examples (uncomment to test)
// =========================
// fetchUsers();
// insertUser({ username: 'john', email: 'john@example.com' });
// updateUser(1, { username: 'john_doe' });
// deleteUser(1);
// processOrder(123);