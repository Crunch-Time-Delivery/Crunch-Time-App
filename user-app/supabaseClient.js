import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

async function fetchUser() {
  const { data: User, error } = await supabase
    .from('User')
    .select(`
      id,
      password,
      email,
      role,
      order_cart,
      checkout_cart
    `)

  if (error) {
    console.error('Error fetching user:', error)
    return null
  }

  return User
}

// Call the function to fetch user data
fetchUser().then(user => {
  console.log(user)
})