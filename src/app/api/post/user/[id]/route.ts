import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: any) {
    const id = context.params.id
    console.log(context)
    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);
    // const page = params.get('p')
    const cookieStore = cookies();

    const supabase = await createRouteHandlerClient({
        cookies: () => cookieStore,
    })
    // inefficient af will set up hooks later
    // const { data: { session } } = await supabase.auth.getSession()

    // const { data, error } = await supabase.from('posts').select().eq('creator', id)

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
        response = await supabase.rpc('get_users_posts_with_zap_counts', { requested_users_id: id, p_limit: p_limit, p_offset: p_offset })
    } else {
        console.log('Getting top posts');
        response = await supabase.rpc('get_users_posts_with_zap_counts', { requested_users_id: id, p_limit: p_limit, p_offset: p_offset })
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
    console.log(newResp)
    return NextResponse.json(response.data, {
        status: 201,
    });
    // const { data, error } = await 

    // if (error) {
    //     return NextResponse.json(error, {
    //         status: 500,
    //     });
    // } else {
    //     return NextResponse.json(data, {
    //         status: 201,
    //     });
    // }
}