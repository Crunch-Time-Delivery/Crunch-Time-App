import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;

// Create the Supabase client with cookie management
export const createClient = (request) => {
  // Initialize response object
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create Supabase client with custom cookie handlers
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll(); // Retrieve all cookies from request
      },
      setAll(cookiesToSet) {
        // Set cookies in response
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
      delete(name) {
        // Delete cookie in response
        response.cookies.delete(name);
      },
    },
  });

  return { supabase, response };
};

// Get current session
export async function getSession(supabase) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error fetching session:', error);
    return null;
  }
}

// Refresh session cookies after login/logout
export async function refreshSession(supabase, res) {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      // Set session cookies
      res.cookies.set('sb-access-token', session.access_token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
      });
      res.cookies.set('sb-refresh-token', session.refresh_token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
      });
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

// Utility: Set multiple cookies
export function setCookies(res, cookies) {
  cookies.forEach(({ name, value, options }) => {
    res.cookies.set(name, value, options);
  });
}

// Middleware example: protect route
export async function handleAuth(request) {
  const { supabase, response } = createClient(request);
  const session = await getSession(supabase);
  if (!session) {
    // Redirect to login if not authenticated
    return NextResponse.redirect('/login');
  }
  // Proceed with authenticated response
  return { session, response };
}