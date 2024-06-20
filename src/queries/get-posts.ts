import { SupabaseClient } from "@supabase/supabase-js";
import { get_zapped_posts } from "./get-zapped-posts";

export async function getPosts(client: SupabaseClient, page: any, sortByNew: any) {
    const itemsPerPage = 30;
    const currentPage = parseInt(page, itemsPerPage);
    const p_limit = itemsPerPage;
    const p_offset = itemsPerPage * (currentPage - 1);
    const { data } = await client.auth.getSession()
    let zapped_posts = []
    if (data.session) {
        zapped_posts = await get_zapped_posts(client, data.session.user.id)
    }
    if (sortByNew) {
        const resp = await client.rpc('get_newest_posts', { p_limit, p_offset });
        // console.log(resp)
        const withzaps = {
            ...resp,
            zapped_posts: zapped_posts
        }
        return withzaps;
    } else {
        const resp = await client.rpc('get_posts_with_zap_counts', { p_limit, p_offset });
        const withzaps = {
            ...resp,
            zapped_posts: zapped_posts
        }
        return withzaps
    }
}