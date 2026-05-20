// supabase.js

import { createClient } from '@supabase/supabase-js';

// Your Supabase URL and anon key
const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_KEY;
// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Uploads a driver photo to Supabase Storage and returns the public URL.
 * @param {File} file - The photo file to upload.
 * @returns {Promise<string|null>} - The public URL or null on failure.
 */
async function uploadDriverPhoto(file) {
  if (!file) {
    console.error('No file provided for upload.');
    return null;
  }

  const filename = `photos/${Date.now()}_${file.name}`;

  try {
    // Upload the file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('driver-photos')
      .upload(filename, file);

    if (uploadError) {
      console.error('Error uploading photo:', uploadError);
      return null;
    }

    // Get the public URL for the uploaded photo
    const { data: urlData, error: urlError } = supabase
      .storage
      .from('driver-photos')
      .getPublicUrl(filename);

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

/**
 * Inserts driver data into the database.
 * @param {string} driverName - Driver's name.
 * @param {string} plateNumber - Vehicle plate number.
 * @param {string} photoUrl - URL of the uploaded photo.
 * @returns {Promise<Object|null>} - The inserted data or null on failure.
 */
async function addDriver(driverName, plateNumber, photoUrl) {
  if (!driverName || !plateNumber || !photoUrl) {
    console.error('Missing required driver data.');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('drivers')
      .insert([{ name: driverName, plate_no: plateNumber, photo_url: photoUrl }]);

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

/**
 * Main function to handle the driver save process.
 * @param {Object} options - Options object.
 * @param {string} options.driverName - Driver's name.
 * @param {string} options.plateNumber - Vehicle plate number.
 */
async function saveDriver({ driverName = 'Unknown', plateNumber = 'Unknown' } = {}) {
  try {
    const fileInput = document.getElementById('driverPhoto');
    if (!fileInput || !fileInput.files || !fileInput.files[0]) {
      console.error('No file selected.');
      alert('Please select a photo before saving.');
      return;
    }
    const file = fileInput.files[0];

    // Upload photo and get URL
    const photoUrl = await uploadDriverPhoto(file);
    if (!photoUrl) {
      alert('Photo upload failed. Please try again.');
      return;
    }

    // Save driver info into database
    const driverData = await addDriver(driverName, plateNumber, photoUrl);
    if (driverData) {
      console.log('Driver saved successfully:', driverData);
      alert('Driver saved successfully.');
    } else {
      alert('Failed to save driver data.');
    }
  } catch (err) {
    console.error('Error in saveDriver:', err);
    alert('An unexpected error occurred. Please try again.');
  }
}

// Example usage:
// saveDriver({ driverName: 'John Doe', plateNumber: 'XYZ 123' });
// Or call saveDriver() to use defaults