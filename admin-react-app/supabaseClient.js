import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY; // Ensure this is set properly
export const supabase = createClient(supabaseUrl, supabaseKey);
// Storage Bucket
const storageBucket = 'crunchtime';
// ======================== CRUD FUNCTIONS ============================ //

/**
 * Creates a new record in the specified table.
 * @param {string} table - The table name.
 * @param {object} data - The data object to insert.
 * @returns {object|null} - The inserted data or null on error.
 */
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

/**
 * Reads records from a table with optional filters.
 * @param {string} table - The table name.
 * @param {object} filters - Optional filters as key-value pairs.
 * @returns {array|null} - Array of records or null on error.
 */
export async function readRecords(table, filters = {}) {
  try {
    let query = supabase.from(table).select('*');
    Object.entries(filters).forEach(([field, value]) => {
      // Extend here for complex filters if needed
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

/**
 * Updates records matching filters with provided updates.
 * @param {string} table - The table name.
 * @param {object} updates - The fields to update.
 * @param {object} filters - Filters to select records.
 * @returns {array|null} - Array of updated records or null on error.
 */
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

/**
 * Deletes records matching filters.
 * @param {string} table - The table name.
 * @param {object} filters - Filters to select records.
 * @returns {array|null} - Deleted records or null on error.
 */
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

/**
 * Batch updates multiple records concurrently.
 * @param {string} table - The table name.
 * @param {Array} updatesArray - Array of objects with id and fields to update.
 * @returns {Array} - Array of results.
 */
export async function updateMultipleRecords(table, updatesArray) {
  try {
    const promises = updatesArray.map(({ id, ...fields }) =>
      updateRecord(table, fields, { id })
    );
    const results = await Promise.all(promises);
    return results;
  } catch (err) {
    console.error(`Batch update error in ${table}:`, err);
    return [];
  }
}

/**
 * Updates the version of a specific record.
 * @param {string} table - The table name.
 * @param {number|string} id - Record ID.
 * @param {string|number} newVersion - The new version value.
 */
export async function updateVersion(table, id, newVersion) {
  return await updateRecord(table, { version: newVersion }, { id });
}

// ======================== Edge Function Calls ============================ //

/**
 * Calls a Supabase Edge Function with optional timeout.
 * @param {string} functionName - The function name.
 * @param {object} payload - Payload to send.
 * @param {number} timeoutMs - Timeout in milliseconds.
 * @returns {object|null} - Response data or null on error.
 */
export async function callEdgeFunction(functionName, payload = {}, timeoutMs = 15000) {
  const url = `${supabaseUrl}/functions/v1/${functionName}`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

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

    clearTimeout(timeoutId);

    if (!response.ok) {
      const text = await response.text();
      console.error(`Edge function ${functionName} error:`, text);
      return null;
    }
    return await response.json();
  } catch (err) {
    console.error(`Error calling edge function ${functionName}:`, err);
    return null;
  }
}

// ======================== Storage Functions ============================ //

/**
 * Uploads a file to storage and returns its public URL.
 * @param {string} folder - Storage folder name.
 * @param {File} file - The file object.
 * @param {string} filename - The filename to save as.
 * @returns {string|null} - Public URL or null on error.
 */
export async function uploadFile(folder, file, filename) {
  try {
    const filePath = `${folder}/${filename}`;
    const { data, error: uploadError } = await supabase.storage
      .from(storageBucket)
      .upload(filePath, file);
    if (uploadError) {
      console.error('Error uploading file:', uploadError);
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
    console.error('Unexpected error in uploadFile:', error);
    return null;
  }
}