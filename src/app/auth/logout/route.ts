import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);

    const cookieStore = cookies();


    const supabase = await createRouteHandlerClient({
        cookies: () => cookieStore,
    })

    const response = await supabase
        .auth
        .signOut();
    if (response.error) {
        console.log(response.error)
    }
    return NextResponse.redirect(url.origin, {
        status: 301,
    });


}