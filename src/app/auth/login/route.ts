import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const url = new URL(req.url);
    const cookieStore = cookies();

    const supabase = await createRouteHandlerClient({
        cookies: () => cookieStore,
    })
    console.log("trying to login")

    const formData = await req.formData()
    const email = String(formData.get('email'))
    const password = String(formData.get('password'))
    console.log(formData)


    const response = await supabase
        .auth
        .signInWithPassword({
            email, password,
        });
    if (response.error) {
        console.log(response.error)
    } else {
        console.log(response.data)
    }

    return NextResponse.redirect(url.origin, {
        status: 301,
    });


}