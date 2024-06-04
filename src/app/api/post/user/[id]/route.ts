import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: any) {
    const id = context.params.id
    console.log(context)
    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);
    const page = params.get('p')
    const cookieStore = cookies();

    const supabase = await createRouteHandlerClient({
        cookies: () => cookieStore,
    })
    // inefficient af will set up hooks later
    // const { data: { session } } = await supabase.auth.getSession()

    // const { data, error } = await supabase.from('posts').select().eq('creator', id)
    let p_offset
    let p_limit
    if (page && parseInt(page) > 0) {
        p_limit = 10 * parseInt(page)
        p_offset = p_limit == 10 ? 0 : 10 * (parseInt(page) - 1)
    } else {
        p_limit = 10
        p_offset = 0
    }
    const { data, error } = await supabase.rpc('get_users_posts_with_zap_counts', { user_id: id, p_limit: p_limit, p_offset: p_offset })

    if (error) {
        return NextResponse.json(error, {
            status: 500,
        });
    } else {
        return NextResponse.json(data, {
            status: 201,
        });
    }
}