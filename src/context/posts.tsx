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
    zapComment: (comment_id: UUID, replier: UUID) => void;
    zappedComments: [];
    unZapComment: (comment_id: UUID) => void;
    postSortDate: string;
    setPostSortDate: (date: string) => void;
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
    const [zappedComments, setZappedComments] = useState<any>([])
    const { user } = useUserContext()
    const [postSortDate, setPostSortDate] = useState<string>('day')
    async function openPost(id: number) {
        // fetch with the comments nested

        fetch('/api/post/' + id, { method: 'GET' }).then(res => res.json()).then(data => {
            if (data.data) {
                if (data.ids != null) {
                    setZappedComments(data.ids)
                }
                console.log(data)
                if (data.data.comments[0] == null) {
                    const post = {
                        ...data.data,
                        comments: []
                    }
                    setViewedPost(post);
                } else {
                    setViewedPost(data.data);
                }
                // setViewedPost(data.data);
            } else {
                console.log(data.error)
            }
            console.log(data)
        })
    };

    async function unZapComment(comment_id: UUID) {

        const { error } = await supabase
            .from('zaps')
            .delete()
            .eq('comment_zapped', comment_id)
            .eq('zapper', user.id)
        if (error) {
            console.log(error)
        } else {
            const s = zappedComments.filter((id: UUID) => id != comment_id)
            setZappedComments(s)
            const newComments = viewedPost.comments.map((comment: any) => {
                if (comment.id === comment_id) {
                    comment.zap_count -= 1
                }
                return comment
            })
            setViewedPost({ ...viewedPost, comments: newComments })
        }
    }

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
            if (viewedPost?.id === post_id) {
                const updatedPost = {
                    ...viewedPost,
                    zap_count: viewedPost.zap_count - 1
                }
                setViewedPost(updatedPost)
            }
            // delete post_id from zappedPosts
            const s = zappedPosts.filter((id: UUID) => id != post_id)
            console.log(s)
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
            if (viewedPost?.id === data[0].post_zapped) {
                const updatedPost = {
                    ...viewedPost,
                    zap_count: viewedPost.zap_count + 1
                }
                setViewedPost(updatedPost)
            }
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

    async function zapComment(comment_id: UUID, replier: UUID) {
        const { data, error } = await supabase
            .from('zaps')
            .insert({
                comment_zapped: comment_id,
                zapper: user.id,
                zapped: replier
            })
            .select()
        if (error) {
            console.log(error)
        } else {
            console.log(data)
            // updated zapped post's zap_count
            console.log(zappedComments)
            if (zappedComments != null) {
                const s = [
                    ...zappedComments,
                    data[0].comment_zapped
                ]
                setZappedComments(s)
            } else {
                setZappedComments([data[0].comment_zapped])
            }
            // update viewedposts.comments find the comment and increment the zap_count
            const newComments = viewedPost.comments.map((comment: any) => {
                if (comment.id === data[0].comment_zapped) {
                    comment.zap_count += 1
                }
                return comment
            })
            setViewedPost({ ...viewedPost, comments: newComments })
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
        <PostsContext.Provider value={{ postSortDate, setPostSortDate, unZapComment, zappedComments, zapComment, unZapPost, zappedPosts, zap_post, setViewedPost, viewedPost, openPost, posts, setPosts, sendReply }}>
            {children}
        </PostsContext.Provider>
    );
};