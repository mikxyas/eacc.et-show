import { supabase } from "@/libs/supabase";

export async function initUser() {
    const sesh = await supabase.auth.getSession()
    if (sesh) {
        return sesh.data
    } else {
        return null
    }
}