// import { supabase } from "@/libs/supabase";
import { createClient } from "@/utils/supabase/client";

export async function initUser() {
    const supabase = createClient()
    const sesh = await supabase.auth.getSession()
    if (sesh) {
        return sesh.data
    } else {
        return null
    }
}