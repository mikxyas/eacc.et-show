
"use client"
import React from 'react'

import dynamic from 'next/dynamic';

import { HydrationBoundary, QueryClient, dehydrate, useQuery, useQueryClient } from "@tanstack/react-query";

import usePostQuery from "@/hooks/use-post-query";
import { createClient } from "@/utils/supabase/client";
import { getPost } from '@/queries/get-post';

const Post = dynamic(() => import('@/components/Post'), { ssr: true })
const Comment = dynamic(() => import('@/components/Comment'), { ssr: true })
const ReplyInput = dynamic(() => import('@/components/ReplyInput'), { ssr: true })

export default function PostWComments({ id, prefetch }: any) {
    const client = createClient()
    // const viewedPost = useQuery(usePostQuery({ client: client, id: id, prefetch: prefetch }))


    const viewedPost = useQuery({
        queryKey: ['post', { id: id }],
        queryFn: () => getPost({ client, id }),
        initialData: prefetch
    })


    // const upvotedComments = useQuery({
    //     queryKey: ['upvoted_comments', { id: id }],
    //     queryFn: getUpvotedComments,
    // })
    // useEffect(() => {
    //     openPost(id)
    // }, [])
    // console.log(viewedPost.data)

    const nestComments = (comments: any) => {
        const commentMap = new Map();

        // Initialize the map with comment IDs as keys
        comments.forEach((comment: any) => {
            comment.children = [];
            commentMap.set(comment.id, comment);
        });

        // Root comments
        const nestedComments: any = [];

        comments.forEach((comment: any) => {
            if (comment.parent === null) {
                // If the comment has no parent, it's a root comment
                nestedComments.push(comment);
            } else {
                // If the comment has a parent, add it to the parent's children array
                const parentComment = commentMap.get(comment.parent);
                if (parentComment) {
                    parentComment.children.push(comment);
                }
            }
        });

        return nestedComments;
    };
    if (viewedPost.isLoading) {
        return <div className="flex flex-col  items-center md:mx-44 justify-center">
            <div style={{ background: '#1e1e1e', alignSelf: 'center' }} className=" px-6 py-2  w-full ">
                Loading...
            </div>
        </div>;
    }

    if (viewedPost.data == null) {
        return <div className="flex flex-col  items-center md:mx-44 justify-center">
            <div style={{ background: '#1e1e1e', alignSelf: 'center' }} className=" px-6 py-2  w-full ">
                the post does not exist
            </div>
        </div>;
    }

    // (viewedPost)
    return (

        <div className="items-center justify-center flex flex-col  md:mx-44">
            <div style={{ background: '#1e1e1e', alignSelf: 'center' }} className="pt-3 w-full md:px-1 pb-3  ">
                <div className="pl-2">
                    <Post data={viewedPost.data} num={null} page={null} />
                </div>
                <div className="ml-7  mb-0">
                    <ReplyInput showReply={true} post_id={viewedPost.data.id} parent_id={null} />
                </div>
                <div className="ml-4">
                    {viewedPost.data?.comments != null && nestComments(viewedPost.data.comments).map((comment: object, index: number) => (
                        <Comment key={index} comment={comment} post_id={viewedPost.data.id} />
                    ))}
                </div>
            </div>
        </div>


    );
}
