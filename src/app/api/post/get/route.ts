import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);
    console.log(params.get('p'))
    console.log(params)
    const cookieStore = cookies();

    const supabase = await createRouteHandlerClient({
        cookies: () => cookieStore,
    })
    // inefficient af will set up hooks later
    const { data: { session } } = await supabase.auth.getSession()
    // console.log(params)
    let newResp

    const page: any = params.get('p')
    const sortbynew = params.get('new')

    const itemsPerPage = 30;
    const currentPage = parseInt(page, itemsPerPage);

    // Calculate limit and offset for pagination
    const p_limit = itemsPerPage;
    const p_offset = itemsPerPage * (currentPage - 1);

    let response;

    if (sortbynew === 'true') {
        response = await supabase.rpc('get_newest_posts', { p_limit, p_offset });
    } else {
        console.log('Getting top posts');
        response = await supabase.rpc('get_posts_with_zap_counts', { p_limit, p_offset });
    }

    if (response.error) {
        console.log(response.error)
    } else {
        newResp = {
            ...response,
            ids: null
        }
        // console.log(response.data)
    }
    if (session) {
        const zappedPosts = await supabase
            .from('zaps')
            .select('post_zapped')
            .eq('zapper', session?.user.id)
            .not('post_zapped', 'is', null) // Ensure the value is not null
        if (zappedPosts.error) {
            console.log(zappedPosts.error)
        } else {
            // turn the ids into lists
            console.log('-----------')
            console.log(zappedPosts.data)
            console.log('---------------')
            const ids: any = []
            const listOfIds = zappedPosts.data.map((id) => {
                ids.push(id.post_zapped)
            })
            newResp = {
                ...response,
                ids: ids
            }
            // console.log(zappedPosts.data)
        }
    }
    // send the user the new post
    // console.log(response)
    return NextResponse.json(newResp, {
        status: 201,
    });
    // return NextResponse.redirect(url.origin, {
    //     status: 301,
    // });


}