
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
export const supabase = createClient(supabaseUrl, supabaseKey)


let { data: User, error } = await supabase
  .from('User')
  .select('id')
  .select('password')
  .select('email')
  .select('role')
  .select('order_cart')
  .select('checkout_cart')