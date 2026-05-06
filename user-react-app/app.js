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
  try {
    // Fetch user info
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('phone_number', phoneNumber)
      .single();

    if (userError || !userData) {
      console.error('Error fetching user:', userError || 'User data not found');
      return;
    }

    // Fetch vendor info
    const { data: vendorData, error: vendorError } = await supabase
      .from('vendors')
      .select('*')
      .eq('phone_number', userData.vendor_phone)
      .single();

    if (vendorError || !vendorData) {
      console.error('Error fetching vendor:', vendorError || 'Vendor data not found');
      return;
    }

    // Fetch driver info
    const { data: driverData, error: driverError } = await supabase
      .from('drivers')
      .select('*')
      .eq('phone_number', userData.driver_phone)
      .single();

    if (driverError || !driverData) {
      console.error('Error fetching driver:', driverError || 'Driver data not found');
      return;
    }

    // Compose message
    const fullMessage = `${message} Vendor: ${vendorData.name}, Driver: ${driverData.name}`;

    // Send SMS (assuming sendSms is defined elsewhere)
    await sendSms(phoneNumber, fullMessage);
  } catch (err) {
    console.error('Unexpected error in sendSms:', err);
  }
}

// fetchDirections method implementation
async function fetchDirections(userId, pickupLocation) {
  try {
    // Fetch user location
    const { data: userLocationData, error: userLocError } = await supabase
      .from('user_locations')
      .select('latitude, longitude')
      .eq('user_id', userId)
      .single();

    if (userLocError || !userLocationData) {
      console.error('Error fetching user location:', userLocError || 'No data');
      return;
    }

    // Fetch pickup details
    const { data: pickupData, error: pickupError } = await supabase
      .from('pickups')
      .select('location')
      .eq('pickup_id', pickupLocation)
      .single();

    if (pickupError || !pickupData) {
      console.error('Error fetching pickup location:', pickupError || 'No data');
      return;
    }

    const userCoords = `${userLocationData.latitude},${userLocationData.longitude}`;
    const pickupCoords = pickupData.location; // assuming "lat,lng" format

    // Call getDirections (assumed to be defined)
    const directions = await getDirections(userCoords, pickupCoords);
    return directions;
  } catch (err) {
    console.error('Unexpected error in fetchDirections:', err);
  }
}


