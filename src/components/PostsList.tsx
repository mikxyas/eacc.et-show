
"use client"

import Post from "@/components/Post";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import React, { use } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import useSupabase from "@/hooks/use-supabase";
import { getPosts } from "@/queries/get-posts";
import ContentContainer from "./ContentContainer";
import usePostsQuery from "@/hooks/use-posts-query";
import { useUserContext } from "@/context/user";
// const Post = dynamic(() => import('@/components/Post'))
export default function PostsList({ user_id }: { user_id: string }) {
    const [feedPage, setFeedPage] = React.useState(1)
    const [sortFeedByNew, setSortFeedByNew] = React.useState(false)
    const supabase = useSupabase()
    const client = useQueryClient()
    const {isTelegramMiniApp, testobj} = useUserContext()

    // const post_feed = useQuery({
    //     queryKey: ['posts', { sortByNew: sortFeedByNew, page: feedPage }],
    //     queryFn: () => getPosts(supabase, feedPage, sortFeedByNew),
    // })
    const post_feed = useQuery(usePostsQuery({ client: supabase, page: feedPage, sortByNew: sortFeedByNew }))

    const incrementPage = async () => {
        if (feedPage > 0) {
            await setFeedPage(feedPage + 1)
            client.invalidateQueries({ queryKey: ['posts'] })
            // client.invalidateQuery(['posts'])

        } else {
            await setFeedPage(1)
            client.invalidateQueries({ queryKey: ['posts'] })
            // client.invalidateQueries(['posts'])
        }

    }


    async function updateSort() {
        await setSortFeedByNew(!sortFeedByNew)
        await setFeedPage(1)
        client.invalidateQueries({ queryKey: ['posts'] })
        // client.refetchQueries({ queryKey: ['posts'] })

        const url = new URL(window.location.href)
        const search_params = url.searchParams
        search_params.set('p', '1')
        window.history.pushState({}, '', url.toString())
    }



    const decrementPage = async () => {
        if (feedPage > 1) {
            await setFeedPage(feedPage - 1)
            client.invalidateQueries({ queryKey: ['posts'] })

        } else {
            await setFeedPage(1)
            client.invalidateQueries({ queryKey: ['posts'] })

        }
    }

    if (post_feed.isLoading) {
        return (
            <div className="flex flex-col items-center justify-center lg:mx-44">
                <ContentContainer styles={{}} tailwindstyle="">
                    Loading...
                </ContentContainer>
            </div>
        )
    }

    if (post_feed.data?.data == null) {
        return (
            <div>
                <div className="flex  flex-col items-center justify-center lg:mx-44">
                    <ContentContainer styles={{}} tailwindstyle="">

                        No posts found
                    </ContentContainer>
                </div>
                <div style={{ height: '80vh' }} className='flex justify-center  md:items-center items-end gap-1 mt-2'>
                    <Link href={`/?p=${feedPage > 1 ? feedPage - 1 : 1}`}>
                        <button disabled={feedPage == 1} onClick={() => decrementPage()} className={' px-2 py-1 text-gray-50 bg-gray-200 hover:bg-opacity-20 bg-opacity-10 mb-3  mt-auto rounded-none cursor-pointer border-black border-2 border-opacity-40'}>go back</button>
                    </Link>
                </div>
            </div>
        )
    }



    return (
        <div className='lg:mx-44 itmes-center  flex flex-col'>
            <div className="md:relative border border-white  fixed bottom-0 w-full  border-opacity-light  lg:border-t-0 border-b-0 flex-col">
                <div style={{ background: '#191919'}} className="text-gray-200 px-2 py-1 text-xs items-center flex justify-between">
                    <div>
                        <span >sort by </span>
                        <button onClick={() => updateSort()} className="self-start underline">
                            {!sortFeedByNew ? ' new' : ' top'}
                        </button>
                    </div>
                    <div className="justify-center gap-1 items-center flex">
                        <Link href={`/?p=${feedPage > 1 ? feedPage - 1 : 1}`}>
                            <span onClick={() => decrementPage()} className={'text-gray-50 '}><ChevronLeft /></span>
                        </Link>
                        <p>{feedPage}</p>
                        <Link href={`/?p=${feedPage > 0 ? feedPage + 1 : 1}`}>
                            <span onClick={() => incrementPage()} className='  text-gray-50 '><ChevronRight /></span>
                        </Link>
                    </div>
                </div>
            </div>
            <ContentContainer tailwindstyle="" styles={{ minHeight: '85vh' }} >
               {/* <p className="text-3xl">{isTelegramMiniApp}</p>  */}
                {
                    post_feed.data.data?.map((post: any, index: number) => (
                        <Post key={post.id} zapped_posts={post_feed.data?.zapped_posts} data={post} num={index} page={feedPage} />
                    ))
                }
              <p className="text-xl text-white">{testobj}</p>  
                {post_feed.data.data.length >= 30
                    && <div className="justify-center gap-1 items-center flex mt-auto ">
                        <Link href={`/?p=${feedPage > 1 ? feedPage - 1 : 1}`}>
                            <span onClick={() => decrementPage()} className={'text-gray-50 '}><ChevronLeft /></span>
                        </Link>
                        <p>{feedPage}</p>
                        <Link href={`/?p=${feedPage > 0 ? feedPage + 1 : 1}`}>
                            <span onClick={() => incrementPage()} className='  text-gray-50 '><ChevronRight /></span>
                        </Link>
                    </div>
                }

            </ContentContainer>
        </div>
    );
}
