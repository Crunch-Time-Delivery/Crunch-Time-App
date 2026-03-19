import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;

// Create the Supabase client with cookie management
export const createClient = (request) => {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll(); // Get all cookies
      },
      setAll(cookiesToSet) {
        // Set multiple cookies
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value, options);
        });
        // Update response cookies
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  return { supabase, supabaseResponse };
};

// Utility function to get current session
export async function getSession(supabase) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error fetching session:', error);
    return null;
  }
}

// Utility function to refresh session cookies after login/logout
export async function refreshSession(supabase, res) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      // Set session cookies
      res.cookies.set('sb-access-token', session.access_token, { path: '/', httpOnly: true, sameSite: 'lax' });
      res.cookies.set('sb-refresh-token', session.refresh_token, { path: '/', httpOnly: true, sameSite: 'lax' });
    } else {
      // Clear cookies if no session
      res.cookies.delete('sb-access-token');
      res.cookies.delete('sb-refresh-token');
    }
    return res;
  } catch (error) {
    console.error('Error refreshing session:', error);
    return res;
  }
}

// Utility to set multiple cookies
export function setCookies(res, cookies) {
  cookies.forEach(({ name, value, options }) => {
    res.cookies.set(name, value, options);
  });
}

// Example: Middleware to protect route
export async function handleAuth(request) {
  const { supabase, supabaseResponse } = createClient(request);
  const session = await getSession(supabase);
  if (!session) {
    // Redirect or respond with unauthorized
    return NextResponse.redirect('/login');
  }
  return { session, response: supabaseResponse };
}