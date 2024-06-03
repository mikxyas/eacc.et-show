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
            <div style={{ background: 'transparent', alignSelf: 'center' }} className="pt-1 w-full md:px-1 pb-3 border-2 border-dashed  border-gray-500  md:w-2/3">
                <Post data={viewedPost} num={null} />
                <div className="ml-10 -mt-1 mb-2">
                    <ReplyInput showReply={true} post_id={viewedPost.id} parent_id={null} />
                </div>
                <div className="ml-4">
                    {viewedPost.comments.length != 0 && nestComments(viewedPost.comments).map((comment: object, index: number) => (
                        <Comment key={index} comment={comment} post_id={viewedPost.id} />
                    ))}
                </div>
                {/* <Comment post_id={post.id} /> */}
            </div>
        </div>

    );
};

export default PostPage;