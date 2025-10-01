import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
export const supabase = createClient(supabaseUrl, supabaseKey)


let { data: vendor, error } = await supabase
  .from('vendor')
  .select('id')
  .select('vendor')
  .select('item')
  .select('price')
  .select('stock')
  .select('email')
  .select('password')
  .select('manage_item')
  .select('manage_orders_Customer name')
  .select('manage_order_total')
  .select('manage_order_status')
  .select('manage_users')
  .select('manage_payment')
