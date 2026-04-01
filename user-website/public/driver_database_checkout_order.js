// supabase.js

import { createClient } from '@supabase/supabase-js';

// Your Supabase URL and anon key
const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to upload driver photo
async function uploadDriverPhoto(file) {
  const { data, error } = await supabase
    .storage
    .from('driver-photos')
    .upload(`photos/${file.name}`, file);

  if (error) {
    console.error('Error uploading photo:', error);
    return null;
  }

  // Get public URL
  const { publicURL, error: urlError } = supabase
    .storage
    .from('driver-photos')
    .getPublicUrl(`photos/${file.name}`);

  if (urlError) {
    console.error('Error getting public URL:', urlError);
    return null;
  }

  return publicURL;
}

// Function to insert driver data into database
async function addDriver(driverName, plateNumber, photoUrl) {
  const { data, error } = await supabase
    .from('drivers')
    .insert([
      {
        name: driverName,
        plate_no: plateNumber,
        photo_url: photoUrl,
      },
    ]);

  if (error) {
    console.error('Error inserting driver:', error);
    return null;
  }

  return data;
}

// Example usage
async function saveDriver() {
  const driverName = null;
  const plateNumber = null;

  // Assume you get the file from an input element
  const fileInput = document.getElementById('driverPhoto');
  const file = fileInput.files[0];

  const photoUrl = await uploadDriverPhoto(file);
  if (photoUrl) {
    const driverData = await addDriver(driverName, plateNumber, photoUrl);
    console.log('Driver saved:', driverData);
  }
}