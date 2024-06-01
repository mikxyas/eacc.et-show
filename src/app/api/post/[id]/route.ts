import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: any) {
    const id = context.params.id
    console.log(context)
    console.log('this is the id')
    const cookieStore = cookies();

    const supabase = await createRouteHandlerClient({
        cookies: () => cookieStore,
    })
    // inefficient af will set up hooks later
    const { data: { session } } = await supabase.auth.getSession()

    let newResp



    const response = await supabase.rpc('get_comments_with_zap_counts_for_post', { 'post_id': id })
    // .from('posts')
    // .select('*, profiles(username, name), comments(*, profiles(username, name), parent(*, profiles(username, name)))')
    // .eq('id', id)
    // .single();
    if (response.error) {
        return NextResponse.json(response.error, {
            status: 500,
        });
    } else {
        const zappedComments = await supabase
            .from('comments')
            .select('zaps!inner(comment_zapped)')
            .eq('replier', session?.user.id)
            .eq('post', id)
            .not('zaps.comment_zapped', 'is', null) // Ensure the value is not null


        if (zappedComments.error) {
            console.log(zappedComments.error)
        } else {
            console.log(zappedComments.data)

            const ids: any = []
            if (zappedComments.data.length === 0) {
                newResp = {
                    ...response,
                    ids: null
                }
            } else {
                const listOfIds = zappedComments.data.map((zap) => {
                    console.log(zap.zaps[0].comment_zapped)
                    ids.push(zap.zaps[0].comment_zapped)
                })
                newResp = {
                    ...response,
                    ids: ids
                }
            }
        }
        return NextResponse.json(newResp, {
            status: 201,
        });
    }
    // send the user the new post

    // return NextResponse.redirect(url.origin, {
    //     status: 301,
    // });


}