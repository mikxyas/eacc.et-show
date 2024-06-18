import { createClient } from '@/utils/supabase/server'

import { useMemo } from 'react'
// import { Database } from './database.types'

export default function useSupabaseServer() {
    return createClient()
}
