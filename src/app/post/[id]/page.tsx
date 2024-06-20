import { HydrationBoundary, QueryClient, dehydrate, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/server";
// import PostWComments from "@/components/PostWComments";
import dynamic from "next/dynamic";
import usePostQuery from "@/hooks/use-post-query";
import { cookies } from "next/headers";
import useCommentsZapped from "@/hooks/use-comments-zapped";
import queryClient from "@/utils/globalClientQuery";
import { get_zapped_posts } from "@/queries/get-zapped-posts";

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
    await queryClient.prefetchQuery(usePostQuery({ client: supabase, id: id }))
    // not clean but gets the job done
    let user_id = null
    let zapped_posts = []
    if (user.data.user) {
        user_id = user.data.user.id
        zapped_posts = await get_zapped_posts(supabase, user_id)
    }
    console.log('user', user_id)
    // await queryClient.prefetchQuery(useCommentsZapped({ client: supabase, user_id: user_id, post_id: post_id }))

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <PostWComments id={id} zapped_posts={zapped_posts} />
        </HydrationBoundary>

    );
};

