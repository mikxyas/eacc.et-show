
"use client"
import React from 'react'
// import Comment from "@/components/Comment";
// import Post from "@/components/Post";
// import ReplyInput from "@/components/ReplyInput";
import dynamic from 'next/dynamic';
import { useQuery } from "@tanstack/react-query";
const Comment = dynamic(() => import('@/components/Comment'))
const Post = dynamic(() => import('@/components/Post'))
const ReplyInput = dynamic(() => import('@/components/ReplyInput'))

// import usePostQuery from "@/hooks/use-post-query";
import { createClient } from "@/utils/supabase/client";
import { getPost } from '@/queries/get-post';
import ContentContainer from './ContentContainer';
import { useUserContext } from '@/context/user';


export default function PostWComments({ id, zapped_posts }: any) {
    const client = createClient()
    // const viewedPost = useQuery(usePostQuery({ client: client, id: id, prefetch: prefetch }))

    const {isTelegramMiniApp} = useUserContext()

    const viewedPost = useQuery({
        queryKey: ['post', { id: id }],
        queryFn: () => getPost({ client, id }),
        // initialData: prefetch
    })

    // console.log(viewedPost.data)
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
        return <div className="flex flex-col  items-center lg:mx-44 justify-center">
            <ContentContainer tailwindstyle='' styles={{}}>
                Loading...
            </ContentContainer>
        </div>;
    }

    if (viewedPost.data == null) {
        return <div className="flex flex-col  items-center lg:mx-44 justify-center">
            <ContentContainer tailwindstyle='' styles={{}}>
                the post does not exist
            </ContentContainer>
        </div>;
    }

    // (viewedPost)
    return (

        <div className="items-center justify-center flex flex-col  lg:mx-44">
            <ContentContainer styles={{ paddingTop: "10px", minHeight: '85vh'}} tailwindstyle=''>
                <div className="">
                    <Post data={viewedPost.data.data} zapped_posts={zapped_posts} num={null} page={null} />
                </div>
                <div className="ml-6 mb-0">
                    <ReplyInput showReply={true} post_id={viewedPost.data?.data?.id} parent_id={null} />
                </div>
                <div className="">
                    {viewedPost.data.data?.comments != null && nestComments(viewedPost.data.data.comments).map((comment: object, index: number) => (
                        <Comment key={index} zapped_comments={viewedPost.data?.zapped_comments} comment={comment} post_id={viewedPost.data?.data.id} />
                    ))}
                </div>
            </ContentContainer>
        </div>


    );
}
