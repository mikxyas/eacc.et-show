import { createClient } from "@/utils/supabase/client";
const supabase = createClient()





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