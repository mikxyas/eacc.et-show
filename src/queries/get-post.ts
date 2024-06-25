import { SupabaseClient } from "@supabase/supabase-js";
import { get_zapped_posts } from "./get-zapped-posts";
import { get_zapped_comments } from "./get-zapped-commets";

export async function getPost({ client, id }: { id: string, client: SupabaseClient }) {
    try {

        const response = await client.rpc('get_comments_with_zap_counts_for_post', { 'post_id': id })
        const { data } = await client.auth.getSession()

        if (data.session) {
            const post_zapped = await get_zapped_comments({ client, user_id: data.session.user.id })
            const newresp = {
                ...response,
                zapped_comments: post_zapped
            }
            // console.log(newresp)
            return newresp
        }
        // console.log(response.data)
        const nozaps = {
            ...response,
            zapped_comments: []
        }
        return nozaps
    }
    catch (e) {

        console.log(e)
    }
}