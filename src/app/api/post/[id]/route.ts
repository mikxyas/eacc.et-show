import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context) {
    const id = context.params.id
    console.log(context)
    console.log('this is the id')
    const cookieStore = cookies();

    const supabase = await createRouteHandlerClient({
        cookies: () => cookieStore,
    })
    // inefficient af will set up hooks later
    // const { data: { session } } = await supabase.auth.getSession()
    const response = await supabase
        .from('posts')
        .select('*, profiles(username, name), comments(*, profiles(username, name), parent(*, profiles(username, name)))')
        .eq('id', id)
        .single();
    if (response.error) {
        return NextResponse.json(response.error, {
            status: 500,
        });
    } else {
        return NextResponse.json(response.data, {
            status: 201,
        });
    }
    // send the user the new post

    // return NextResponse.redirect(url.origin, {
    //     status: 301,
    // });


}