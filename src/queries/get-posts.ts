import { SupabaseClient } from "@supabase/supabase-js";

export async function getPosts(client: any, page: any, sortByNew: any) {

    let response;
    // const [_key, { page, sortByNew }] = queryKey as [string, { page: any, sortByNew: boolean }];
    const itemsPerPage = 30;
    // figure out what this does lol
    const currentPage = parseInt(page, itemsPerPage);
    // Calculate limit and offset for pagination
    const p_limit = itemsPerPage;
    const p_offset = itemsPerPage * (currentPage - 1);
    // console.log('YOOOOOOOOO we black holing')

    if (sortByNew) {
        const resp = await client.rpc('get_newest_posts', { p_limit, p_offset });
        console.log(resp)
        return resp;
    } else {
        const resp = await client.rpc('get_posts_with_zap_counts', { p_limit, p_offset });
        console.log(resp)
        return resp;
    }



}