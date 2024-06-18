"use server"
import { HydrationBoundary, QueryClient, dehydrate, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/server";
// import PostWComments from "@/components/PostWComments";
import dynamic from "next/dynamic";
import usePostQuery from "@/hooks/use-post-query";
import { cookies } from "next/headers";
import useCommentsZapped from "@/hooks/use-comments-zapped";
import queryClient from "@/utils/globalClientQuery";

const PostWComments = dynamic(() => import('@/components/PostWComments'), { ssr: true })

export default async function Post(event: any) {
    // console.log(event)
    const id = event.params.id
    const cookieStore = cookies()
    const supabase = createClient()

    // const { viewedPost, openPost } = usePostsContext();
    // invalidate the posts zapped query when the post is viewed
    const user = await supabase.auth.getUser()

    // client.invalidateQueries(['posts_zapped'])
    // console.log('hi')
    const prefetch = await queryClient.prefetchQuery(usePostQuery({ client: supabase, id: id }))

    let user_id = null
    let post_id = id
    if (user.data.user) {
        user_id = user.data.user.id
    }
    console.log('user', user_id)
    await queryClient.prefetchQuery(useCommentsZapped({ client: supabase, user_id: user_id, post_id: post_id }))

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <PostWComments id={id} prefetch={prefetch} />
        </HydrationBoundary>

    );
};

