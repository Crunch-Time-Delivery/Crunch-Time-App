// =========================
// Your Supabase module code
// =========================
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY; // Make sure to set your environment variable
export const supabase = createClient(supabaseUrl, supabaseKey);

function handleError(context, error) {
  console.error(`Supabase error (${context}):`, error);
  throw error;
}

// =========================
// User functions
// =========================

// Fetch all users
export async function fetchUsers() {
  const { data, error } = await supabase
    .from('User')
    .select(`
      id,
      username,
      email,
      name,
      role,
      order_cart,
      checkout_cart,
      pick_up_point,
      drop_off_point,
      longitude,
      latitude,
      location_name,
      ORDER_ID,
      created_at
    `)
    .order('created_at', { ascending: false });
  if (error) handleError('fetchUsers', error);
  return data;
}

// Fetch user by ID
export async function fetchUserById(id) {
  const { data, error } = await supabase
    .from('User')
    .select(`
      id,
      username,
      email,
      name,
      role,
      order_cart,
      checkout_cart,
      pick_up_point,
      drop_off_point,
      longitude,
      latitude,
      location_name,
      ORDER_ID
    `)
    .eq('id', id)
    .single();
  if (error) handleError('fetchUserById', error);
  return data;
}

// Insert a new user
export async function insertUser(userData) {
  const { data, error } = await supabase
    .from('User')
    .insert([userData])
    .select()
    .single();
  if (error) handleError('insertUser', error);
  return data;
}

// Batch insert users
export async function insertMultipleUsers(usersArray) {
  const { data, error } = await supabase
    .from('User')
    .insert(usersArray);
  if (error) handleError('insertMultipleUsers', error);
  return data;
}

// Update user by ID
export async function updateUser(id, updates) {
  const { data, error } = await supabase
    .from('User')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) handleError('updateUser', error);
  return data;
}

// Batch update users
export async function updateMultipleUsers(updatesArray) {
  // updatesArray should be [{ id, ...fieldsToUpdate }, ...]
  const results = [];
  for (const update of updatesArray) {
    const { id, ...fields } = update;
    const result = await updateUser(id, fields);
    results.push(result);
  }
  return results;
}

// Delete user by ID
export async function deleteUser(id) {
  const { error } = await supabase
    .from('User')
    .delete()
    .eq('id', id);
  if (error) handleError('deleteUser', error);
  return true;
}

// =========================
// Admin functions
// =========================

// Fetch all admins
export async function fetchAdmins() {
  const { data, error } = await supabase
    .from('Admins')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) handleError('fetchAdmins', error);
  return data;
}

// Fetch admin by ID
export async function fetchAdminById(id) {
  const { data, error } = await supabase
    .from('Admins')
    .select('*')
    .eq('id', id)
    .single();
  if (error) handleError('fetchAdminById', error);
  return data;
}

// Insert admin
export async function insertAdmin(adminData) {
  const { data, error } = await supabase
    .from('Admins')
    .insert([adminData])
    .select()
    .single();
  if (error) handleError('insertAdmin', error);
  return data;
}

// Batch insert admins
export async function insertMultipleAdmins(adminsArray) {
  const { data, error } = await supabase
    .from('Admins')
    .insert(adminsArray);
  if (error) handleError('insertMultipleAdmins', error);
  return data;
}

// Update admin
export async function updateAdmin(id, updates) {
  const { data, error } = await supabase
    .from('Admins')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) handleError('updateAdmin', error);
  return data;
}

// Delete admin
export async function deleteAdmin(id) {
  const { error } = await supabase
    .from('Admins')
    .delete()
    .eq('id', id);
  if (error) handleError('deleteAdmin', error);
  return true;
}

// =========================
// Delivery Location functions
// =========================

// Save or update delivery location (upsert)
export async function saveDeliveryLocation(address, latitude, longitude) {
  const { data, error } = await supabase
    .from('DeliveryLocations')
    .upsert({ address, latitude, longitude }, { onConflict: 'address' })
    .select()
    .single();
  if (error) handleError('saveDeliveryLocation', error);
  return data;
}

// Fetch all delivery locations
export async function fetchDeliveryLocations() {
  const { data, error } = await supabase
    .from('DeliveryLocations')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) handleError('fetchDeliveryLocations', error);
  return data;
}

// Fetch delivery location by address
export async function fetchDeliveryLocationByAddress(address) {
  const { data, error } = await supabase
    .from('DeliveryLocations')
    .select('*')
    .eq('address', address)
    .single();
  if (error) handleError('fetchDeliveryLocationByAddress', error);
  return data;
}

// Delete delivery location by ID
export async function deleteDeliveryLocation(id) {
  const { error } = await supabase
    .from('DeliveryLocations')
    .delete()
    .eq('id', id);
  if (error) handleError('deleteDeliveryLocation', error);
  return true;
}

// =========================
// Utility functions
// =========================

// Clear local storage
export function clearStoredLocation() {
  localStorage.removeItem('deliveryAddress');
  localStorage.removeItem('deliveryCoords');
  console.log('Stored location cleared');
}

// =========================
// Example usage
// =========================
import {
  fetchUsers,
  insertUser,
  updateUser,
  deleteUser,
  fetchAdmins,
  insertAdmin,
  updateAdmin,
  deleteAdmin,
  saveDeliveryLocation,
  fetchDeliveryLocations,
  deleteDeliveryLocation,
   updateMultipleUsers,
  handleError,
  clearStoredLocation
} from './your-script.js'; // Or remove if in the same file

// Example: Load users
fetchUsers().then(users => console.log('Users:', users)).catch(console.error);
