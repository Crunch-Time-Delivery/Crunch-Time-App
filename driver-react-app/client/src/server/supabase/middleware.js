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
          request.cookies.set(name, value, options);
        });
      },
    },
  });

  try {
    // Parse and validate request data
    const { id, newStatus } = await request.json();

    if (!id || typeof newStatus !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid request data' }),
        { status: 400 }
      );
    }

    // Update driver status
    const { data, error } = await supabase
      .from('Drivers')
      .update({ Status: newStatus })
      .eq('id', id);

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No driver found with the specified ID' }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Driver status updated', data }),
      { status: 200 }
    );
  } catch (err) {
    console.error('Error updating driver status:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}