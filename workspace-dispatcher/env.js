/**
 * Global environment bootstrap
 * Must be required BEFORE any other app code
 */

require('dotenv').config({
    path: '/home/ibr-ai-agent/.openclaw/.env',
});

// Hard fail early (this saves hours of debugging)
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error('❌ ENV NOT LOADED');
    console.error('CWD:', process.cwd());
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
}

// Optional but useful while stabilizing
console.log('✅ ENV LOADED');
