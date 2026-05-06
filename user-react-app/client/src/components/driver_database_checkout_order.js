// supabase.js

import { createClient } from '@supabase/supabase-js';

// Your Supabase URL and anon key
const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);
// Function to upload driver photo and return public URL
async function uploadDriverPhoto(file) {
  if (!file) {
    console.error('No file provided for upload.');
    return null;
  }

  try {
    // Upload the file to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('driver-photos')
      .upload(`photos/${file.name}`, file);

    if (uploadError) {
      console.error('Error uploading photo:', uploadError);
      return null;
    }

    // Retrieve the public URL for the uploaded photo
    const { data: urlData, error: urlError } = supabase
      .storage
      .from('driver-photos')
      .getPublicUrl(`photos/${file.name}`);

    if (urlError) {
      console.error('Error getting public URL:', urlError);
      return null;
    }

    return urlData.publicUrl;
  } catch (err) {
    console.error('Unexpected error during photo upload:', err);
    return null;
  }
}

// Function to insert driver data into the database
async function addDriver(driverName, plateNumber, photoUrl) {
  if (!driverName || !plateNumber || !photoUrl) {
    console.error('Missing required driver data.');
    return null;
  }

  try {
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
  } catch (err) {
    console.error('Unexpected error during driver insertion:', err);
    return null;
  }
}

// Main function to handle the driver save process
async function saveDriver({ driverName = 'Unknown', plateNumber = 'Unknown' } = {}) {
  try {
    // Get the file from input element
    const fileInput = document.getElementById('driverPhoto');
    if (!fileInput || !fileInput.files || !fileInput.files[0]) {
      console.error('No file selected.');
      return;
    }
    const file = fileInput.files[0];

    // Upload the photo and get URL
    const photoUrl = await uploadDriverPhoto(file);
    if (!photoUrl) {
      console.error('Failed to upload photo.');
      return;
    }

    // Save driver info into database
    const driverData = await addDriver(driverName, plateNumber, photoUrl);
    if (driverData) {
      console.log('Driver saved successfully:', driverData);
    } else {
      console.error('Failed to save driver data.');
    }
  } catch (err) {
    console.error('Error in saveDriver:', err);
  }
}

// Example usage:
// saveDriver({ driverName: 'John Doe', plateNumber: 'XYZ 123' });
// Or call without parameters to use defaults
// saveDriver();