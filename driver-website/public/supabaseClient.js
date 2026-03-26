 import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Your Supabase URL and key
const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY; // Ensure this is set securely
const supabase = createClient(supabaseUrl, supabaseKey);

// ======================== CRUD FUNCTIONS ============================ //

// Create a new record
async function createRecord(table, data) {
  const { data: createdData, error } = await supabase.from(table).insert([data]);
  if (error) {
    console.error(`Create error in ${table}:`, error);
  }
  return { createdData, error };
}

// Read records with optional filters
async function readRecords(table, filters = {}) {
  let query = supabase.from(table).select('*');
  Object.entries(filters).forEach(([field, value]) => {
    query = query.eq(field, value);
  });
  const { data, error } = await query;
  if (error) {
    console.error(`Read error in ${table}:`, error);
  }
  return { data, error };
}

// Update a record by ID
async function updateRecord(table, id, updates) {
  const { data, error } = await supabase
    .from(table)
    .update(updates)
    .eq('id', id);
  if (error) {
    console.error(`Update error in ${table} (ID: ${id}):`, error);
  }
  return { data, error };
}

// Delete a record by ID
async function deleteRecord(table, id) {
  const { data, error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);
  if (error) {
    console.error(`Delete error in ${table} (ID: ${id}):`, error);
  }
  return { data, error };
}

// ======================== Version Control ============================ //
// Example: Update version number for a record
async function updateVersion(table, id, newVersion) {
  return await updateRecord(table, id, { version: newVersion });
}

// ======================== Edge Function Calls ============================ //

// Call a Supabase Edge Function
async function callEdgeFunction(functionName, payload) {
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
    const result = await response.json();
    return result;
  } catch (err) {
    console.error(`Error calling Edge Function ${functionName}:`, err);
    return null;
  }
}

// ======================== Example Usage ============================ //

// Load Drivers
async function loadDrivers() {
  const { data: drivers, error } = await readRecords('Drivers');
  document.getElementById('output').textContent = error
    ? 'Error: ' + error.message
    : JSON.stringify(drivers, null, 2);
}

// Add a new Driver
async function addDriver() {
  const newDriver = {
    driver_name: 'New Driver',
    contact: '1234567890',
    // Add other fields as needed
  };
  const { createdData, error } = await createRecord('Drivers', newDriver);
  console.log('Created Driver:', createdData);
}

// Update Driver by ID
async function updateDriver(id) {
  const updates = { rating: 4.8 }; // Example update
  const { data, error } = await updateRecord('Drivers', id, updates);
  console.log('Updated Driver:', data);
}

// Delete Driver by ID
async function deleteDriver(id) {
  const { data, error } = await deleteRecord('Drivers', id);
  console.log('Deleted Driver:', data);
}

// Call an Edge Function
async function processOrder(orderId) {
  const result = await callEdgeFunction('processOrder', { orderId });
  console.log('Edge Function Result:', result);
}

// Example on page load or button click
// loadDrivers();
// addDriver();
// updateDriver(1);
// deleteDriver(1);
// processOrder(123);