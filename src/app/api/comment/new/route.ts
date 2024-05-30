import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const cookieStore = cookies();

    const supabase = await createRouteHandlerClient({
        cookies: () => cookieStore,
    })
    // inefficient af will set up hooks later
    const { data: { session } } = await supabase.auth.getSession()

    const formData = await req.formData()
    const content = String(formData.get('content'))
    const post = String(formData.get('post'))
    let parent = null
    if (String(formData.get('parent')) != 'null') {
        // remove parent from the form data
        parent = String(formData.get('parent'))
    }
    // const parent = formData.get('parent')
    console.log(formData)
    const response = await supabase
        .from('comments')
        .insert({ content: content, post: post, parent: parent, replier: session?.user.id })
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