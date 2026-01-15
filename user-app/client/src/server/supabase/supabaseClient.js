import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

/* =========================
   SUPABASE CONFIG
========================= */
const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';

/**
 * Use the PUBLIC anon key in frontend code
 * NEVER expose service_role key in browser
 */
const supabaseKey = process.env.SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

/* =========================
   COMMON ERROR HANDLER
========================= */
function handleError(context, error) {
  console.error(`Supabase error (${context}):`, error);
  throw error;
}

/* =========================
   USER QUERIES
========================= */

// Fetch all users (safe fields only)
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

// Fetch single user by ID
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

// Insert new user
export async function insertUser(userData) {
  const { data, error } = await supabase
    .from('User')
    .insert([userData])
    .select()
    .single();

  if (error) handleError('insertUser', error);
  return data;
}

// Update user
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

// Delete user
export async function deleteUser(id) {
  const { error } = await supabase
    .from('User')
    .delete()
    .eq('id', id);

  if (error) handleError('deleteUser', error);
  return true;
}

/* =========================
   ADMIN QUERIES
========================= */

export async function fetchAdmins() {
  const { data, error } = await supabase
    .from('Admins')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) handleError('fetchAdmins', error);
  return data;
}

export async function insertAdmin(adminData) {
  const { data, error } = await supabase
    .from('Admins')
    .insert([adminData])
    .select()
    .single();

  if (error) handleError('insertAdmin', error);
  return data;
}

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

export async function deleteAdmin(id) {
  const { error } = await supabase
    .from('Admins')
    .delete()
    .eq('id', id);

  if (error) handleError('deleteAdmin', error);
  return true;
}

/* =========================
   DELIVERY LOCATIONS
========================= */

// Insert or update location (UPSERT)
export async function saveDeliveryLocation(address, latitude, longitude) {
  const { data, error } = await supabase
    .from('DeliveryLocations')
    .upsert(
      { address, latitude, longitude },
      { onConflict: 'address' }
    )
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

// Delete delivery location
export async function deleteDeliveryLocation(id) {
  const { error } = await supabase
    .from('DeliveryLocations')
    .delete()
    .eq('id', id);

  if (error) handleError('deleteDeliveryLocation', error);
  return true;
}

/* =========================
   LOCAL STORAGE UTIL
========================= */
export function clearStoredLocation() {
  localStorage.removeItem('deliveryAddress');
  localStorage.removeItem('deliveryCoords');
  console.log('Stored location cleared');
}
