import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: any) {
    const username = context.params.id

    const cookieStore = cookies();

    const supabase = await createRouteHandlerClient({
        cookies: () => cookieStore,
    })

    const { data, error } = await supabase.from('profiles').select().eq('username', username).single()
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