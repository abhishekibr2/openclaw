/**
 * Supabase Client for Dispatcher Agent
 * Initialize and manage database connections
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/home/ibr-ai-agent/.openclaw/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env file');
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Get the authenticated Supabase client
 * @returns {SupabaseClient} Authenticated Supabase client
 */
function getSupabaseClient() {
  return supabase;
}

/**
 * Test the connection to Supabase
 * @returns {Promise<boolean>} true if connection successful
 */
async function testConnection() {
  try {
    const { data, error } = await supabase.from('tasks').select('count()', { count: 'exact' }).limit(1);
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error testing Supabase connection:', err);
    return false;
  }
}

module.exports = {
  getSupabaseClient,
  testConnection,
  supabase
};
