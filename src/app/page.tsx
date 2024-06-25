

import React from "react";
import { HydrationBoundary, QueryClient, dehydrate, useQuery } from "@tanstack/react-query";

import usePostsQuery from "@/hooks/use-posts-query";

import { cookies } from "next/headers";

import { createClient } from "@/utils/supabase/server";
import usePostsZapped from "@/hooks/use-posts-zapped";
import queryClient from "@/utils/globalClientQuery";

import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

const DynamicPostLists = dynamic(() => import('@/components/PostsList'))

export default async function Home(event: any) {


  const cookieStore = cookies()
  const client = await createClient()

  // check if url has redirect_to and redirect to that page

  // const redirect_to = event.searchParams.redirect_to
  // if (redirect_to) {
  //   redirect(redirect_to)
  // }

  const user = await client.auth.getUser()

  const page = 1
  const sortByNew = false

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
