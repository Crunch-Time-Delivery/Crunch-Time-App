import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

// Storage configuration
const storageBucket = 'crunchtime'; // Actual bucket name
const storageKeyId = 'e14f15dbd3a60e1e4b2e2f90a19b7587'; // Your Key ID
const storageEndpoint = 'https://wbpgmgtoyzlnawvsfeiu.storage.supabase.co/storage/v1/s3';

// Function to upload profile picture
async function uploadProfilePicture(file, filename) {
  const filePath = `profile_pictures/${filename}`

  const { data, error } = await supabase.storage
    .from(storageBucket)
    .upload(filePath, file, {
      headers: {
        'x-amz-meta-key': storageKeyId,
        'x-amz-meta-endpoint': storageEndpoint,
      },
    })

  if (error) {
    console.error('Error uploading profile picture:', error)
    return null
  }

  // Return the public URL or storage path
  const publicUrl = `${storageEndpoint.replace('/storage/v1/s3', '')}/storage/v1/object/public/${filePath}`
  return publicUrl
}

// Fetch Admin data
async function fetchAdmin() {
  const { data: Admin, error } = await supabase
    .from('Admin')
    .select(`
      id,
      username,
      password,
      Change_Username,
      Change_Password,
      New Admin_Email,
      New Admin_Username,
      income_amount,
      expense_amount,
      withdraw_amount,
      total_income_amount,
      order_tota_amount,
      restaurant_name,
       restaurant_menu,
       establishment
    `)

  if (error) {
    console.error('Error fetching admin:', error)
    return null
  }

  return Admin
}

// Call the function to fetch Admin data
fetchAdmin().then(admin => {
  console.log(admin)
})

// Example usage: Upload a profile picture
// (Make sure to get the file object from an input element or other source)
const fileInput = document.getElementById('profilePicInput')
fileInput.addEventListener('change', async (event) => {
  const file = event.target.files[0]
  const filename = file.name

  const url = await uploadProfilePicture(file, filename)
  if (url) {
    console.log('Profile picture uploaded:', url)
    // You can now save this URL to your database or display it
  }
})