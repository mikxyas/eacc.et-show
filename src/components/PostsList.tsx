
"use client"

// import Post from "@/components/Post";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import React, { use } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsersZappedPosts } from "@/functions/posts";
import usePosts from "@/hooks/use-posts-query";
import usePostsQuery from "@/hooks/use-posts-query";
import useSupabase from "@/hooks/use-supabase";
import usePostsZapped from "@/hooks/use-posts-zapped";
import { getPosts } from "@/queries/get-posts";
import { get_zapped_posts } from "@/queries/get-zapped-posts";
const Post = dynamic(() => import('@/components/Post'))
export default function PostsList({ prefetchedPosts, prefetchedZaps, user_id }: { prefetchedPosts: any, prefetchedZaps: any, user_id: string }) {
    const [feedPage, setFeedPage] = React.useState(1)
    const [sortFeedByNew, setSortFeedByNew] = React.useState(false)
    const supabase = useSupabase()
    const client = useQueryClient()
    // const post_feed = useQuery({
    //   queryKey: ['posts', { sortByNew: sortFeedByNew, page: feedPage }],
    //   queryFn: getPosts,
    // },
    // )
    const post_feed = useQuery({
        queryKey: ['posts', { sortByNew: sortFeedByNew, page: feedPage }],
        queryFn: () => getPosts(supabase, feedPage, sortFeedByNew),
        initialData: prefetchedPosts
    })

    const zaps = useQuery({
        queryKey: ['posts_zapped', { user_id: null }],
        queryFn: () => get_zapped_posts(supabase, user_id),
        initialData: prefetchedZaps
    })
    // const post_feed = useQuery(usePostsQuery({ client: supabase, page: feedPage, sortByNew: sortFeedByNew }))
    // const user = await supabase.auth.getSession()
    // const zaps = useQuery(usePostsZapped({ client: supabase, user_id: null }))

    // console.log(zaps.data)




    const incrementPage = async () => {
        // (page)
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
            <div className="flex flex-col items-center justify-center md:mx-44">
                <div style={{ background: '#1e1e1e', alignSelf: 'center' }} className=" px-6 py-2  w-full">
                    Loading...
                </div>
            </div>
        )
    }

    if (post_feed.data?.data == null) {
        return (
            <div>
                <div className="flex flex-col items-center justify-center md:mx-44">
                    <div style={{ background: '#1e1e1e', alignSelf: 'center' }} className=" px-6 py-2  w-full">
                        No posts found
                    </div>
                </div>
                <div style={{ height: '80vh' }} className='flex justify-center  md:items-center items-end gap-1 mt-2'>
                    <Link href={`/?p=${feedPage > 1 ? feedPage - 1 : 1}`}>
                        <button disabled={feedPage == 1} onClick={() => decrementPage()} className={' px-2 py-1 text-gray-50 bg-gray-200 hover:bg-opacity-20 bg-opacity-10 mb-3  mt-auto rounded-none cursor-pointer border-black border-2 border-opacity-40'}>go back</button>
                    </Link>
                </div>
            </div>
        )
    }

    // if (post_feed.error) {
    //     return (
    //         <div>
    //             <div className="flex flex-col items-center justify-center md:mx-44">
    //                 <div style={{ background: '#1e1e1e', alignSelf: 'center' }} className=" px-6 py-2  w-full">
    //                     An error occurred
    //                     {post_feed.error.message}
    //                 </div>
    //             </div>
    //             <div style={{ height: '80vh' }} className='flex justify-center  md:items-center items-end gap-1 mt-2'>
    //                 <Link href={`/?p=${feedPage > 1 ? feedPage - 1 : 1}`}>
    //                     <button disabled={feedPage == 1} onClick={() => decrementPage()} className={' px-2 py-1 text-gray-50 bg-gray-200 hover:bg-opacity-20 bg-opacity-10 mb-3  mt-auto rounded-none cursor-pointer border-black border-2 border-opacity-40'}>go back</button>
    //                 </Link>
    //             </div>
    //         </div>
    //     )
    // }

    return (
        <div className='md:mx-44 itmes-center font-mono flex flex-col'>
            <div className="md:relative fixed bottom-0 w-full md:border-none border-t border-white border-opacity-60 flex-col">
                <div style={{ background: '#191919' }} className="text-gray-200 px-2 py-1 items-center flex justify-between">
                    <div>
                        <span>sort by </span>
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
            <div style={{ background: '#1e1e1e', alignSelf: 'center', minHeight: '86vh' }} className="mt-0 mb-7 flex flex-col md:mb-0 px-3 md:py-1 py-4 w-full">
                {
                    post_feed.data.data?.map((post: any, index: number) => (
                        <Post key={post.id} data={post} num={index} page={feedPage} />
                    ))
                }
                <div className="justify-center gap-1 items-center flex mt-auto ">
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
    );
}
