import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { permanentRedirect, redirect } from 'next/navigation'



export async function middleware(req: NextRequest) {
    // update user's auth session

    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })
    // return await updateSession(request)
    const { data: { session } } = await supabase.auth.getSession()
    // if session not exist and is path is in submit rewrite it with /login page
    if (!session && (req.url.includes('/submit') || req.url.includes('/user/profile') || req.url.includes('/post/edit'))) {
        return NextResponse.rewrite(new URL('/login', req.url))
    }

    if (session && req.url.includes('/login')) {
        // redirect to base url then home
        return NextResponse.redirect(new URL('/', req.url))
    }
    // // (session)
    // if (!session) {
    //     // redirect the user to the login page
    //     return NextResponse.rewrite(new URL('/login', req.url))
    // }

    return res
};


export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!api|auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}