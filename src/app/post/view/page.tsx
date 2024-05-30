"use client"

import Comment from "@/components/Comment";
import Post from "@/components/Post";
import ReplyInput from "@/components/ReplyInput";
import { useEffect, useState } from "react";

const PostPage = () => {

    const id = new URLSearchParams(window.location.search).get('id');
    const [post, setPost] = useState(null);

    useEffect(() => {
        if (id) {
            const fetchPost = async () => {
                // fetch with the comments nested
                try {
                    fetch('/api/post/view?id=' + id, { method: 'GET' }).then(res => res.json()).then(data => {
                        setPost(data);
                        console.log(data)
                    })
                } catch (e) {
                    console.log(e)
                }
            };
            fetchPost();
        }
    }, [id]);

    if (!post) {
        return <div>Loading...</div>;
    }
    return (
        <div>

            <Post data={post} num={null} />
            <div className="ml-10 -mt-1 mb-2">
                <ReplyInput post_id={post.id} parent_id={null} />
            </div>
            <div className="ml-4">
                {post.comments.length != 0 && post.comments.map((comment, index) => (
                    <Comment key={index} comment={comment} post_id={post.id} />
                ))}
            </div>
            {/* <Comment post_id={post.id} /> */}
        </div>
    );
};

export default PostPage;