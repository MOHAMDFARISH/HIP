
// NOTE: This file is intended for server-side use within your serverless functions.
// Do not import or use this file on the client-side, as it exposes your service key.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL and service key are required.');
}

// The service_role key has admin privileges and should only be used on the server.
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
