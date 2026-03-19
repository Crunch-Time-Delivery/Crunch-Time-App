import { createServerClient } from "@supabase/ssr";

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;

export async function updateDriverStatus(request) {
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
        });
      },
    },
  });

  // Parse request data (assuming JSON body with id and new status)
  const { id, newStatus } = await request.json();

  // Perform the update
  const { data, error } = await supabase
    .from('Drivers')
    .update({ Status: newStatus })
    .eq('id', id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: 'Driver status updated', data }), { status: 200 });
}