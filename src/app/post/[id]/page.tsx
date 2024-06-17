"use client"

import Comment from "@/components/Comment";
import Post from "@/components/Post";
import ReplyInput from "@/components/ReplyInput";
import { use, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPost } from "@/functions/posts";
import { getUpvotedComments } from "@/functions/comments";

const PostPage = (context: any) => {
    const id = context.params.id


    // const { viewedPost, openPost } = usePostsContext();
    // invalidate the posts zapped query when the post is viewed
    // client.invalidateQueries(['posts_zapped'])
    // console.log('hi')

    const viewedPost = useQuery({
        queryKey: ['post', { id: id }],
        queryFn: getPost,
        // enabled: !!zappedPosts
    })


    const upvotedComments = useQuery({
        queryKey: ['upvoted_comments', { id: id }],
        queryFn: getUpvotedComments,
    })
    // useEffect(() => {
    //     openPost(id)
    // }, [])
    console.log(viewedPost.data)

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
};

export default PostPage;