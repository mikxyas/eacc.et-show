import { createClient } from '@/utils/supabase/client'
import { useMemo } from 'react';


function useSupabase() {
    return useMemo(createClient, []);
}

export default useSupabase;