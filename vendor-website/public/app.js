// Import necessary modules
const { createClient } = require('@supabase/supabase-js');
const { sendSms } = require('./twilioService');
const { getDirections } = require('./googleMapsService');

// Initialize Supabase client
const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// sendSms method implementation
async function sendSms(phoneNumber, message) {
  // Fetch user info from Supabase
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('phone_number', phoneNumber)
    .single();

  if (userError) {
    console.error('Error fetching user:', userError);
    return;
  }

  // Fetch vendor contact
  const { data: vendorData, error: vendorError } = await supabase
    .from('vendors')
    .select('*')
    .eq('phone_number', userData.vendor_phone)
    .single();

  if (vendorError) {
    console.error('Error fetching vendor:', vendorError);
    return;
  }

  // Fetch driver info
  const { data: driverData, error: driverError } = await supabase
    .from('drivers')
    .select('*')
    .eq('phone_number', userData.driver_phone)
    .single();

  if (driverError) {
    console.error('Error fetching driver:', driverError);
    return;
  }

  // Compose message including vendor and driver info
  const fullMessage = `${message} Vendor: ${vendorData.name}, Driver: ${driverData.name}`;

  // Send SMS via Twilio
  await sendSms(phoneNumber, fullMessage);
}

// fetchDirections method implementation
async function fetchDirections(userId, pickupLocation) {
  // Fetch user location based on user_id
  const { data: userLocationData, error: userLocError } = await supabase
    .from('user_locations')
    .select('latitude, longitude')
    .eq('user_id', userId)
    .single();

  if (userLocError) {
    console.error('Error fetching user location:', userLocError);
    return;
  }

  // Fetch pickup details
  const { data: pickupData, error: pickupError } = await supabase
    .from('pickups')
    .select('location')
    .eq('pickup_id', pickupLocation)
    .single();

  if (pickupError) {
    console.error('Error fetching pickup location:', pickupError);
    return;
  }

  const userCoords = `${userLocationData.latitude},${userLocationData.longitude}`;
  const pickupCoords = pickupData.location; // assuming format "lat,lng"

  // Fetch directions from Google Maps
  const directions = await getDirections(userCoords, pickupCoords);
  return directions;
}














