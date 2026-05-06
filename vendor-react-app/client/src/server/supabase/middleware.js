import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY; // Ensure this is set securely
export const createClient = (request) => {
  // Initialize the response object
  let response = NextResponse.next();

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // Set cookies in the request and update the response cookies
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value, options);
          response.cookies.set(name, value, options);
        });
      },
      delete(name) {
        // Delete cookies from request and response
        request.cookies.delete(name);
        response.cookies.delete(name);
      },
    },
  });

  return { supabase, response };
};