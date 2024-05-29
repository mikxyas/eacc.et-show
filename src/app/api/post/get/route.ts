import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);

    const cookieStore = cookies();

    const supabase = await createRouteHandlerClient({
        cookies: () => cookieStore,
    })
    // inefficient af will set up hooks later
    // const { data: { session } } = await supabase.auth.getSession()
    console.log(params)
    const response = await supabase
        .from('posts')
        .select('*, profiles(name, username)')
    if (response.error) {
        console.log(response.error)
    } else {
        console.log(response.data)
    }
    // send the user the new post
    return NextResponse.json(response.data, {
        status: 201,
    });
    // return NextResponse.redirect(url.origin, {
    //     status: 301,
    // });


}