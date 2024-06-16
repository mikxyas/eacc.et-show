// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
// make typescript ignore the import everything in this page
// @ts-ignore
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";

// (`Function "telegram-bot" up and running!`);
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.8.0";
// @ts-ignore


const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Expose-Headers": "Content-Length, X-JSON",
    "Access-Control-Allow-Headers":
        "apikey, X-Client-Info, Content-Type, Authorization, Accept, Accept-Language, X-Authorization"
};

serve(async (req: Request) => {
    const { username } = await req.json();
    const supabaseClient = createClient(
        // @ts-ignore
        Deno.env.get("SUPABASE_URL") ?? "",
        // @ts-ignore
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data } = await supabaseClient
        .from("usernames")
        .select()
        .eq("username", username);
    if (!data || !data[0]) {
        throw new Error(`no user found with username ${username}`);
    }
    const {
        data: { user },
        error,
    } = await supabaseClient.auth.admin.getUserById(data[0].userid);

    return new Response(JSON.stringify({ email: user.email }), {
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Expose-Headers": "Content-Length, X-JSON",
            "Access-Control-Allow-Headers":
                "apikey, X-Client-Info, Content-Type, Authorization, Accept, Accept-Language, X-Authorization"
        },
        status: 200,
    })

})
