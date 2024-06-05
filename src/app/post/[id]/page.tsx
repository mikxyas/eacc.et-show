"use client"

import Comment from "@/components/Comment";
import Post from "@/components/Post";
import ReplyInput from "@/components/ReplyInput";
import { usePostsContext } from "@/context/posts";
import { useEffect, useState } from "react";

const PostPage = (context: any) => {
    const id = context.params.id
    const { viewedPost, openPost } = usePostsContext();

    useEffect(() => {
        openPost(id)
    }, [])
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
    if (viewedPost?.comments) {
        console.log(nestComments(viewedPost?.comments))
    }
    if (!viewedPost) {
        return <div className="flex flex-col items-center justify-center">
            <div style={{ background: 'transparent', alignSelf: 'center' }} className=" px-6 py-2 border-gray-500 border-dashed border-4 md:w-2/3">
                Loading...
            </div>
        </div>;
    }

    return (
        <div className="items-center justify-center flex flex-col ">
            <div style={{ background: '#1e1e1e', alignSelf: 'center' }} className="pt-3 w-full md:px-1 pb-3   md:w-2/3">
                <div className="pl-2">
                    <Post data={viewedPost} num={null} page={null} />

                </div>
                <div className="ml-7  mb-0">
                    <ReplyInput showReply={true} post_id={viewedPost.id} parent_id={null} />
                </div>
                <div className="ml-4">
                    {viewedPost.comments.length != 0 && nestComments(viewedPost.comments).map((comment: object, index: number) => (
                        <Comment key={index} comment={comment} post_id={viewedPost.id} />
                    ))}
                </div>

            </div>
        </div>

    );
};

export default PostPage;