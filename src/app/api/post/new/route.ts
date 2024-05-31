import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const url = new URL(req.url);
    const cookieStore = cookies();

    const supabase = await createRouteHandlerClient({
        cookies: () => cookieStore,
    })
    // inefficient af will set up hooks later
    const { data: { session } } = await supabase.auth.getSession()

    const formData = await req.formData()
    const title = String(formData.get('title'))
    const type = String(formData.get('type'))
    const link = String(formData.get('link'))
    console.log(formData)

    const response = await supabase
        .from('posts')
        .insert({ title: title, type: type, link: link, creator: session?.user.id })
        .select('*, profiles(*)')
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