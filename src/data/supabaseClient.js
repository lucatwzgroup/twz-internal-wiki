// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl =process.env.REACT_APP_SUPABASE_URL //"https://dtyotqskqqtvzmslqwof.supabase.co"//
const supabaseAnonKey =process.env.REACT_APP_SUPABASE_ANON_KEY //"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0eW90cXNrcXF0dnptc2xxd29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MDkxMzIsImV4cCI6MjA1OTI4NTEzMn0.mYfph6Xf0U8OsHjdRPt76KuA7FEToh7lTSNIhxtjJKA"//

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
