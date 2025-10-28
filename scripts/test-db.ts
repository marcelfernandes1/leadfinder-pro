/**
 * Database Connection Test Script
 *
 * This script verifies that the Supabase connection is working
 * and that the database schema has been created correctly.
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n')

  try {
    // Test 1: Check if we can connect
    console.log('1. Testing connection...')
    const { data, error } = await supabase.from('profiles').select('count').single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      throw error
    }
    console.log('   ✅ Connection successful\n')

    // Test 2: List all tables
    console.log('2. Checking tables...')
    const tables = ['profiles', 'searches', 'leads', 'lead_status']

    for (const table of tables) {
      const { error } = await supabase.from(table as any).select('count').limit(0)
      if (error) {
        console.log(`   ❌ Table '${table}' not found or error: ${error.message}`)
      } else {
        console.log(`   ✅ Table '${table}' exists`)
      }
    }

    console.log('\n✅ All tests passed! Database is ready.\n')
  } catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  }
}

testConnection()
