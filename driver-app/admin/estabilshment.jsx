import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY; // Make sure to set this in your env
const supabase = createClient(supabaseUrl, supabaseKey);
