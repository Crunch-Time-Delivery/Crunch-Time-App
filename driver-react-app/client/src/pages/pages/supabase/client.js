import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey =  process.env.SUPABASE_KEY;

export const createClient = () => createClient(supabaseUrl, supabaseKey);