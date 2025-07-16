    
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wfemcjmdkcoxiuadxyrq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmZW1jam1ka2NveGl1YWR4eXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNTEzMzYsImV4cCI6MjA2NzgyNzMzNn0.Gyy1tZbius_jtTJ-3Pba8ftI6eszVQ-TPeYcsMPQKk8'
export const supabase = createClient(supabaseUrl, supabaseKey)