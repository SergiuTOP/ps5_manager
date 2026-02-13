import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jmozkifjehgkufuasvgv.supabase.co';
const supabaseKey = 'sb_publishable_acMPiOcWui1ZLlPNli67hA_3jvsuVO1';

export const supabase = createClient(supabaseUrl, supabaseKey);