import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

async function fetchVendor() {
  const { data: vendor, error } = await supabase
    .from('vendor')
    .select(`
      id,
      vendor,
      item,
      price,
      stock,
      email,
      password,
      manage_item,
      manage_orders_Customer_name,
      manage_order_total,
      manage_order_status,
      manage_users,
      manage_payment
    `)

  if (error) {
    console.error('Error fetching vendor:', error)
    return null
  }

  return vendor
}

// Call the function to fetch vendor data
fetchVendor().then(vendor => {
  console.log(vendor)
})
