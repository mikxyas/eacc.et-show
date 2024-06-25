import { createClient } from "@/utils/supabase/client"



export async function zapComment(zap: any) {
    const supabase = createClient()
    // console.log(zap)
    try {
        // const session = await supabase.auth.getSession()
        const { data, error } = await supabase
            .from('zaps')
            .insert(zap)
            .select()
        if (error) {
            console.log(error)
        } else {
            // console.log(data)
        }

    } catch (e) {
        console.log(e)
        return e
    }


}

export const unzapComment = async (comment_id: any) => {
    const supabase = createClient()

    const session = await supabase.auth.getSession()
    // console.log(zap_id)
    try {
        const { data, error } = await supabase
            .from('zaps')
            .delete()
            .eq('comment_zapped', comment_id)
            .eq('zapper', session?.data?.session?.user.id)
        if (error) {
            console.log(error)
        } else {
            return comment_id

        }
    }
    catch (e) {
        return e
    }
}

export const delete_comment = async (comment_id: any) => {
    const supabase = createClient()

    try {
        const { data, error } = await supabase
            .from('comments')
            .delete()
            .eq('id', comment_id)
        if (error) {
            console.log(error)
        } else {
            return comment_id
        }
    }
    catch (e) {
        return e
    }
}

export const create_comment = async (comment: any) => {
    const supabase = createClient()

    try {
        const { data, error } = await supabase
            .from('comments')
            .insert(comment)
            .select("*, profiles(*)")
        if (error) {
            console.log(error)
        } else {
            return data[0]
        }
    }
    catch (e) {
        return e
    }
}