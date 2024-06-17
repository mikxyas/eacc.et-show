import { supabase } from "@/libs/supabase"



export async function getPosts({ queryKey }: any) {

    try {
        let response;
        const [_key, { page, sortByNew }] = queryKey as [string, { page: any, sortByNew: boolean }];

        const itemsPerPage = 30;
        const currentPage = parseInt(page, itemsPerPage);

        // Calculate limit and offset for pagination
        const p_limit = itemsPerPage;
        const p_offset = itemsPerPage * (currentPage - 1);

        if (sortByNew) {
            response = await supabase.rpc('get_newest_posts', { p_limit, p_offset });
        } else {
            response = await supabase.rpc('get_posts_with_zap_counts', { p_limit, p_offset });
        }

        return response;
    }
    catch (e) {
        console.log(e)
    }
}

export async function getUsersZappedPosts() {
    try {
        const session = await supabase.auth.getSession()
        if (session.data.session) {
            const zappedPosts = await supabase
                .from('zaps')
                .select('post_zapped')
                .eq('zapper', session.data.session?.user.id)
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
        } else {
            return []
        }
    } catch (e) {
        console.log(e)
        return e
    }

}

export async function zapPost(zap: any) {

    try {
        const { data, error } = await supabase
            .from('zaps')
            .insert(zap)
            .select()
        return zap
    }
    catch (e) {
        console.log(e)
    }
}

export const unzapPost = async (zap_id: any) => {

    try {
        // const session = await supabase.auth.getSession()
        const { data, error } = await supabase
            .from('zaps')
            .delete()
            .eq('post_zapped', zap_id)
        // .eq('zapper', session?.data?.session?.user.id)

        if (error) {
            console.log(error)
            // throw error

        } else {
            return zap_id
        }
    }
    catch (e) {
        console.log(e)
        return e
    }
}

export async function getPost({ queryKey }: any) {
    try {
        const [_key, { id }] = queryKey as [string, { id: any }];
        console.log(id)
        const response = await supabase.rpc('get_comments_with_zap_counts_for_post', { 'post_id': id })
        // console.log(response.data)
        return response.data;
    }
    catch (e) {

        console.log(e)
    }
}

export async function create_post(post: any) {
    const session = await supabase.auth.getSession()
    const postWSesh = { ...post, creator: session?.data?.session?.user.id }
    try {
        const { data, error } = await supabase
            .from('posts')
            .insert(postWSesh)
            .select('*, profiles(*)')
        if (error) {
            console.log(error)
        } else {
            return data[0]

        }
    }
    catch (e) {
        console.log(e)
    }
}

export async function delete_post(post_id: any) {
    try {
        const { data, error } = await supabase
            .from('posts')
            .delete()
            .eq('id', post_id)
        if (error) {
            console.log(error)
        } else {
            return post_id
        }
    }
    catch (e) {
        console.log(e)
        return e
    }
}