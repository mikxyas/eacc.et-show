
"use client"

import { supabase } from '@/libs/supabase';
import { createContext, useContext, useEffect, useState } from 'react';
import { useUserContext } from './user';
import { UUID } from 'crypto';

// Define the shape of your user context
interface UserContextType {
    posts: [];
    viewedPost: any;
    openPost: (id: number) => void;
    setPosts: (posts: []) => void;
    sendReply: (formData: FormData) => void;
    setViewedPost: (post: any) => void;
    zap_post: (zappp: object) => void;
    zappedPosts: [];
    unZapPost: (post_id: UUID) => void;
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
    const [zappedPosts, setZappedPosts] = useState<any>([])
    const { user } = useUserContext()
    async function openPost(id: number) {
        // fetch with the comments nested

        fetch('/api/post/' + id, { method: 'GET' }).then(res => res.json()).then(data => {
            setViewedPost(data);
            console.log(data)
        })

    };

    async function unZapPost(post_id: UUID) {
        const { error } = await supabase
            .from('zaps')
            .delete()
            .eq('post_zapped', post_id)
            .eq('zapper', user.id)
        if (error) {
            console.log(error)
        } else {
            // remove post_id from zappedPosts
            const s = zappedPosts.filter((id: UUID) => id != post_id)
            // update posts list 
            const newPostList = posts.map(post => {
                if (post.id === post_id) {
                    post.zap_count -= 1
                }
                return post
            })
            setPosts(newPostList)
            setZappedPosts(s)
        }
    }
    async function zap_post(zappp: object) {
        const { data, error } = await supabase
            .from('zaps')
            .insert(zappp)
            .select()
        if (error) {
            console.log(error)
        } else {
            console.log(data)
            // updated zapped post's zap_count
            const s = [
                ...zappedPosts,
                data[0].post_zapped
            ]
            setZappedPosts(s)
            const newPosts: any = posts.map((post: any) => {
                if (post.id === data[0].post_zapped) {
                    post.zap_count += 1
                }
                return post
            })
            setPosts(newPosts)
        }
    }


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
        if (sesh.data.session) {

            const res = await fetch('/api/post/get')
            const data = await res.json()
            if (data.ids) {
                setZappedPosts(data.ids)
            }
            if (data.data) {
                console.log(data)
                setPosts(data.data)
            } else {
                console.log(data.error)
            }

        }
    }

    useEffect(() => {
        getPosts();
    }, [])

    return (
        <PostsContext.Provider value={{ unZapPost, zappedPosts, zap_post, setViewedPost, viewedPost, openPost, posts, setPosts, sendReply }}>
            {children}
        </PostsContext.Provider>
    );
};