import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY; // Ensure this is set properly
export const supabase = createClient(supabaseUrl, supabaseKey);

// Storage
const storageBucket = 'crunchtime';

// ======================== CRUD FUNCTIONS ============================ //

// -- Create or Insert a new record
export async function createRecord(table, data) {
  try {
    const { data: newData, error } = await supabase.from(table).insert([data]);
    if (error) {
      console.error(`Insert error in ${table}:`, error);
      return null;
    }
    return newData;
  } catch (err) {
    console.error(`Unexpected insert error in ${table}:`, err);
    return null;
  }
}

// -- Read or Select records
export async function readRecords(table, filters = {}) {
  try {
    let query = supabase.from(table).select('*');
    Object.entries(filters).forEach(([field, value]) => {
      query = query.eq(field, value);
    });
    const { data, error } = await query;
    if (error) {
      console.error(`Read error in ${table}:`, error);
      return null;
    }
    return data;
  } catch (err) {
    console.error(`Unexpected read error in ${table}:`, err);
    return null;
  }
}

// -- Update record(s)
export async function updateRecord(table, updates, filters = {}) {
  try {
    let query = supabase.from(table).update(updates);
    Object.entries(filters).forEach(([field, value]) => {
      query = query.eq(field, value);
    });
    const { data, error } = await query;
    if (error) {
      console.error(`Update error in ${table}:`, error);
      return null;
    }
    return data;
  } catch (err) {
    console.error(`Unexpected update error in ${table}:`, err);
    return null;
  }
}

// -- Delete record(s)
export async function deleteRecord(table, filters = {}) {
  try {
    let query = supabase.from(table);
    Object.entries(filters).forEach(([field, value]) => {
      query = query.eq(field, value);
    });
    const { data, error } = await query.delete();
    if (error) {
      console.error(`Delete error in ${table}:`, error);
      return null;
    }
    return data;
  } catch (err) {
    console.error(`Unexpected delete error in ${table}:`, err);
    return null;
  }
}

// -- Version Control Example (assuming a 'version' field exists)
export async function updateVersion(table, id, newVersion) {
  return await updateRecord(table, { version: newVersion }, { id });
}

// ======================== Edge Function Calls ============================ //

// Example: Call a Supabase Edge Function for some server-side logic
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
    const result = await response.json();
    return result;
  } catch (err) {
    console.error(`Error calling Edge Function ${functionName}:`, err);
    return null;
  }
}

// ======================== Storage Functions ============================ //

// Upload profile picture (unchanged)
export async function uploadProfilePicture(file, filename) {
  try {
    const filePath = `profile_pictures/${filename}`;
    const { data, error: uploadError } = await supabase.storage
      .from(storageBucket)
      .upload(filePath, file);
    if (uploadError) {
      console.error('Error uploading profile picture:', uploadError);
      return null;
    }
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

// ======================== Usage Examples ============================ //

// Creating a new driver
// createRecord('Driver', { driver_name: 'John Doe', driver_payment: 100, status: 'active' });

// Reading drivers
// readRecords('Driver', { status: 'active' });

// Updating a driver
// updateRecord('Driver', { driver_payment: 120 }, { driver_name: 'John Doe' });

// Deleting a driver
// deleteRecord('Driver', { driver_name: 'John Doe' });

// Calling an Edge Function
// callEdgeFunction('processOrder', { orderId: 123, action: 'complete' });