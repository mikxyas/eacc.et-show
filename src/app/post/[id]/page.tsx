"use client"

import Comment from "@/components/Comment";
import Post from "@/components/Post";
import ReplyInput from "@/components/ReplyInput";
import { usePostsContext } from "@/context/posts";
import { useEffect, useState } from "react";

const PostPage = (context) => {
    const id = context.params.id
    const { viewedPost, openPost } = usePostsContext();

    useEffect(() => {
        openPost(id)
    }, [])


    if (!viewedPost) {
        return <div className="flex flex-col items-center justify-center">
            <div className="bg-black md:w-2/3 text-green-600 h-46 p-3 font-mono">
                Loading...
            </div>

        </div>;
    }

    return (
        <div className="items-center justify-center flex flex-col">
            <div className="bg-black w-2/3 pt-4">
                <Post data={viewedPost} num={null} />
                <div className="ml-10 -mt-1 mb-2">
                    <ReplyInput post_id={viewedPost.id} parent_id={null} />
                </div>
                <div className="ml-4">
                    {viewedPost.comments.length != 0 && viewedPost.comments.map((comment, index) => (
                        <Comment key={index} comment={comment} post_id={viewedPost.id} />
                    ))}
                </div>
                {/* <Comment post_id={post.id} /> */}
            </div>
        </div>

    );
};

export default PostPage;