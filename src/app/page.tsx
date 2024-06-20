

import React from "react";
import { HydrationBoundary, QueryClient, dehydrate, useQuery } from "@tanstack/react-query";

import usePostsQuery from "@/hooks/use-posts-query";

import { cookies } from "next/headers";
// import PostsList from "@/components/PostsList";

import { createClient } from "@/utils/supabase/server";
import usePostsZapped from "@/hooks/use-posts-zapped";
import queryClient from "@/utils/globalClientQuery";

import dynamic from "next/dynamic";

const DynamicPostLists = dynamic(() => import('@/components/PostsList'))

export default async function Home() {


  const cookieStore = cookies()
  const client = await createClient()
  // const client = useSupabase()
  // const client = useQueryClient()
  // const post_feed = useQuery({
  //   queryKey: ['posts', { sortByNew: sortFeedByNew, page: feedPage }],
  //   queryFn: getPosts,
  // },
  // )
  const user = await client.auth.getUser()

  const page = 1
  const sortByNew = false
  // const post_feed = useQuery(usePostsQuery({ client: supabase, page: 1, sortByNew: false }))
  // check if the user is logged in

  // console.log('cookies', cookieStore)

  // console.log(session)
  await queryClient.prefetchQuery(usePostsQuery({ client, page, sortByNew }))
  let user_id = 'none'
  if (user.data.user) {
    user_id = user.data.user.id
  } else {
    user_id = 'none'
  }

  await queryClient.prefetchQuery(usePostsZapped({ client, user_id }))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DynamicPostLists user_id={user_id} />
    </HydrationBoundary>
  );
}
