import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: any) {
    const id = context.params.id
    console.log(context)

    const cookieStore = cookies();

    const supabase = await createRouteHandlerClient({
        cookies: () => cookieStore,
    })
    // inefficient af will set up hooks later
    // const { data: { session } } = await supabase.auth.getSession()

    const { data, error } = await supabase.from('comments').select().eq('user_id', id)
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