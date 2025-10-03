import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

async function fetchDrivers() {
  const { data: Drivers, error } = await supabase
    .from('Drivers')
    .select(`
      id,
      driver_name,
      contact,
      plate_no,
      email,
      rating,
      password,
      Order ID,
      Customer Name,
      Order Date,
      Status,
      GPS location,
      Order Address,
      Total Amount,
      Order_items,
      Order_items_Qty,
      Order_items_Price,
      Order_items_Total
    `)

  if (error) {
    console.error('Error fetching drivers:', error)
    return null
  }

  return Drivers
}

// Call the function to fetch data
fetchDrivers().then(drivers => {
  console.log(drivers)
})
// Call the function to fetch Admin data
fetchAdmin().then(admin => {
  console.log(admin)
})