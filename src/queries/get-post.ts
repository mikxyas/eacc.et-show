import { SupabaseClient } from "@supabase/supabase-js";

export async function getPost({ client, id }: { id: string, client: SupabaseClient }) {
    try {
        // console.log(id)
        const response = await client.rpc('get_comments_with_zap_counts_for_post', { 'post_id': id })
        // console.log(response.data)
        return response.data;
    }
    catch (e) {

        console.log(e)
    }
}