import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

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
      order_tota_amount
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


