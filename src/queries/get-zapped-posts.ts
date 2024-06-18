import { SupabaseClient } from "@supabase/supabase-js"


export async function get_zapped_posts(client: SupabaseClient, user_id: string | null) {
    try {
        const zappedPosts = await client
            .from('zaps')
            .select('post_zapped')
            .eq('zapper', user_id)
            .not('post_zapped', 'is', null)
        if (zappedPosts.error) {

            console.log(zappedPosts.error)
        } else {
            const ids: any = []
            const listOfIds = zappedPosts.data.map((id) => {
                ids.push(id.post_zapped)
            })
            return ids
        }
    } catch (e) {
        console.log(e)
        return e
    }

}