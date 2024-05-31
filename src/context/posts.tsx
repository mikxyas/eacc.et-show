
"use client"

import { supabase } from '@/libs/supabase';
import { createContext, useContext, useEffect, useState } from 'react';

// Define the shape of your user context
interface UserContextType {
    posts: [];
    viewedPost: any;
    openPost: (id: number) => void;
    setPosts: (posts: []) => void;
    sendReply: (formData: FormData) => void;
    setViewedPost: (post: any) => void;
}

// Create the user context
const PostsContext = createContext<UserContextType | undefined>(undefined);

// Create a custom hook to access the user context
export const usePostsContext = () => {
    const context = useContext(PostsContext);
    if (!context) {
        throw new Error('usePostsContext must be used within a PostsProvider');
    }
    return context;
};

// Create the user provider component
export const PostsProvider = ({ children }
    : Readonly<{
        children: React.ReactNode;
    }>
) => {
    const [posts, setPosts] = useState<[]>([]);
    const [viewedPost, setViewedPost] = useState<any>(null)

    async function openPost(id: number) {
        // fetch with the comments nested

        fetch('/api/post/' + id, { method: 'GET' }).then(res => res.json()).then(data => {
            setViewedPost(data);
            console.log(data)
        })

    };


    async function sendReply(formData: FormData) {
        const res = await fetch('/api/comment/new', {
            method: 'POST',

            body: formData
        })

        const data = await res.json();
        if (data.error) {
            console.log(data.error)
        } else {
            console.log(data.data[0])
            const newPosts: any = posts.map((post: any) => {
                if (post.id === data.data[0].post) {
                    viewedPost.comments.push(data.data[0])
                }
                return post
            })
            setPosts(newPosts)
        }
        // add new reply to post

        // console.log(data)
    }

    async function getPosts() {
        const sesh = await supabase.auth.getSession();
        if (sesh.data) {
            const res = await fetch('/api/post/get')
            const data = await res.json()
            console.log(data)
            setPosts(data)
        }
    }

    useEffect(() => {
        getPosts();
    }, [])

    return (
        <PostsContext.Provider value={{ setViewedPost, viewedPost, openPost, posts, setPosts, sendReply }}>
            {children}
        </PostsContext.Provider>
    );
};