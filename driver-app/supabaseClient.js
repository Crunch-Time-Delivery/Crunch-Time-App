import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
export const supabase = createClient(supabaseUrl, supabaseKey)

let { data: Drivers, error } = await supabase
  .from('Drivers')
  .select('id')
  .select('driver_name')
  .select('contact')
  .select('plate_no')
  .select('email')
  .select('rating')
  .select('password')
  .select('Order ID')
  .select('Customer Name')
  .select('Order Date')
  .select('Status')
  .select('GPS location')
  .select('Order Address')
  .select('Total Amount')
  .select('Order_items')
  .select('Order_items_Qty')
  .select('Order_items_Price')
  .select('Order_items_Total')

  