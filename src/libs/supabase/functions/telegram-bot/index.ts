// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";

console.log(`Function "telegram-bot" up and running!`);

import { Bot, webhookCallback } from "https://deno.land/x/grammy@v1.8.3/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.8.0";

const bot = new Bot(Deno.env.get("BOT_TOKEN") || "");
const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
);
bot.command("start", async (ctx) => {
    // check if the user is in the database
    // if not request to create an account or login
    // if the user is in the database then welcome them
    const userId = ctx.from?.id;
    const username = ctx.from?.username;
    const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('telegram_id', userId)
    if (error) {
        console.log(error)
    } else {
        // ctx.reply("Welcome! Up and running.")
        if (data.length === 0) {
            ctx.reply("You are not in the database, please create an account.")
        }
        else {
            ctx.reply(`Welcome back ${username}`)
            ctx.reply(data[0].id.toString())
        }
    }

});

bot.command("ping", (ctx) => ctx.reply(`Pong! ${new Date()} ${Date.now()}`));

bot.command("login", (ctx) => {
    const userId = ctx.from?.id;
    const username = ctx.from?.username;
    if (userId) {
        ctx.reply(`Logged in as ${userId} and ${username}`);
    }
});

const handleUpdate = webhookCallback(bot, "std/http");

serve(async (req) => {
    try {
        const url = new URL(req.url);
        if (url.searchParams.get("secret") !== Deno.env.get("FUNCTION_SECRET")) {
            return new Response("not allowed", { status: 405 });
        }

        return await handleUpdate(req);
    } catch (err) {
        console.error(err);
    }
});