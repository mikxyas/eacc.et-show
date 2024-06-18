// components/Comment.js
import { MessageCircle, Spline, X, Zap } from 'lucide-react';
import React, { useState } from 'react';
import ReplyInput from './ReplyInput';
import { useUserContext } from '@/context/user';
import Link from 'next/link';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { zapComment, unzapComment, delete_comment } from '@/functions/comments';
import useCommentsZapped from '@/hooks/use-comments-zapped';
import { createClient } from '@/utils/supabase/client';


const Comment = ({ post_id, comment }: any) => {
    const [showReply, setShowReply] = useState<any>({});
    const [showDelete, setShowDelete] = useState<any>({})
    const { user } = useUserContext()
    const client = useQueryClient()
    const supabase = createClient()
    // const zappedComments: any = client.getQueryData(['upvoted_comments', { id: post_id }])
    const ZappedComments = useQuery(useCommentsZapped({ client: supabase, user_id: user?.id, post_id: post_id }))

    // console.log(zappedComments)
    const toggleReply = (commentId: any) => {
        setShowReply((prev: any) => ({ ...prev, [commentId]: !prev[commentId] }));
    };

    const zap_comment = useMutation({
        mutationFn: (zap: any) => {
            const obg = {
                ...zap,
                zapper: user.id
            }
            return zapComment(obg)
        },
        onMutate: async (comment) => {
            // mutate the zapped_posts query


            const prevState = client.setQueryData(['upvoted_comments', { id: post_id }], [...ZappedComments.data, comment.comment_zapped])
            // update zap_count on the comment 
            const post: any = client.getQueryData(['post', { id: post_id }])
            const updateCount = post.comments.map((c: any) => {
                if (c.id == comment.comment_zapped) {
                    c.zap_count += 1
                }
                return c
            })
            client.setQueryData(['post', { id: post_id }], { ...post, comments: updateCount })

            // Optionally return a context containing data to use when for example rolling back
            return prevState
        },
        onSuccess: () => {

        }
    })

    const unzapCommentMutation = useMutation({
        mutationFn: (comment_id) => {
            return unzapComment(comment_id)
        },
        onMutate: async (comment_id) => {
            // mutate the zapped_posts query
            // const zappedComments: any = client.getQueryData(['upvoted_comments', { id: post_id }])
            const prevState = client.setQueryData(['upvoted_comments', { id: post_id }], ZappedComments.data.filter((id: any) => id != comment_id))
            const post: any = client.getQueryData(['post', { id: post_id }])
            const updateCount = post.comments.map((c: any) => {
                if (c.id == comment_id) {
                    c.zap_count -= 1
                }
                return c
            })
            client.setQueryData(['post', { id: post_id }], { ...post, comments: updateCount })
            // A mutation is about to happen!
            // Optionally return a context containing data to use when for example rolling back
            return prevState
        }
    })

    const deleteComment = useMutation({
        mutationFn: (comment_id) => {
            return delete_comment(comment_id)
        },
        // onMutate: async (comment_id) => {
        //     // mutate the zapped_posts query
        //     const post: any = client.getQueryData(['post', { id: post_id }])
        //     const updateCount = post.comments.filter((c: any) => c.id != comment_id)
        //     client.setQueryData(['post', { id: post_id }], { ...post, comments: updateCount })
        //     // A mutation is about to happen!
        //     // Optionally return a context containing data to use when for example rolling back
        //     return updateCount
        // }
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ['post', { id: post_id }] })
            client.invalidateQueries({ queryKey: ['posts', { page: 1, sortByNew: false }] })
        }
    })

    const toggleDelete = (commentId: any) => {
        setShowDelete((prev: any) => ({ ...prev, [commentId]: !prev[commentId] }));
    }

    const timeAgo = (createdAt: any) => {
        const now: any = new Date();
        const created: any = new Date(createdAt);
        const diffInSeconds = Math.floor((now - created) / 1000);

        const intervals = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'minute', seconds: 60 },
            { label: 'second', seconds: 1 }
        ];

        for (const interval of intervals) {
            const count = Math.floor(diffInSeconds / interval.seconds);
            if (count >= 1) {
                return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
            }
        }
        return 'just now';
    };

    const renderComment = (comment: any) => {
        const isReplyVisible = showReply[comment.id];
        return (
            <div key={comment.id} className='mt-2'>
                <div className=' gap-1 flex items-start text-white  text-opacity-55 text-xs ' style={{ fontSize: '8pt', flexBasis: '' }}>

                    {user == null
                        ? <div className=''>
                            <Link href='/login'>
                                <div className=' p-0 flex flex-col items-center justify-center gap-1 '>
                                    <Zap className='cursor-pointer ' size={13} />
                                    {comment.zap_count > 0 && <p className='hover:underline cursor-pointer'>{comment.zap_count}</p>}
                                </div>
                            </Link>
                        </div>
                        : ZappedComments.data?.includes(comment.id) ? (
                            <div onClick={() => unzapCommentMutation.mutate(comment.id)} className='p-0 flex  flex-col items-center justify-center gap-1'>
                                <Zap className='text-green-600 hover:text-green-600 cursor-pointer zapppp' size={13} />
                                {comment.zap_count > 0 && <p className='hover:underline  cursor-pointer'>{comment.zap_count}</p>}
                            </div>
                        ) : (
                            <div onClick={() => zap_comment.mutate({ comment_zapped: comment.id, zapped: comment.replier })} className='p-0 flex  flex-col items-center justify-center gap-1'>
                                <Zap className='hover:text-green-600 cursor-pointer zapppp' size={13} />
                                {comment.zap_count > 0 && <p className='hover:underline  cursor-pointer'>{comment.zap_count}</p>}
                            </div>
                        )
                    }
                    <Link href={`/user/${comment.profiles.username}`}>
                        <p className='hover:underline  cursor-pointer ' >{comment.profiles.username}</p>
                    </Link>
                    <p>{timeAgo(comment.created_at)}</p>
                    {comment.replier == user?.id &&
                        <p
                            className='hover:underline cursor-pointer '
                            onClick={() => toggleDelete(comment.id)}
                        >delete</p>

                    }
                    {/* <p>delete</p> */}
                </div>
                <div className={comment.zap_count > 0 ? ' mt-comment ' : 'mt-0'} style={{ fontSize: '10pt' }} >
                    <div className='ml-5 md:w-2/3 inline-flex items-baseline  pr-1 md:pr-0'>
                        <p className='h-fit '>
                            {comment.content}
                            <span className='ml-1'>
                                <MessageCircle style={{ display: 'inherit' }} onClick={() => toggleReply(comment.id)} className='text-gray-400 cursor-pointer hover:text-green-600' size={13} />
                            </span>
                        </p>
                    </div>
                    {showDelete[comment.id] &&
                        <div className='ml-5 mt-1  '>
                            <p className='text-gray-200'>Are you sure you want to delete this comment?</p>
                            <div className='mt-1'>
                                <button onClick={() => deleteComment.mutate(comment.id)} className=' bg-gray-200  bg-opacity-10 hover:bg-opacity-20 border-black border-2 border-opacity-40  px-2 py-1 text-xs'>delete comment</button>
                                <button onClick={() => setShowDelete((prev: any) => ({ ...prev, [comment.id]: !prev[comment.id] }))} className=' bg-gray-200  bg-opacity-10 hover:bg-opacity-20 border-black border-2 border-opacity-40 py-1 px-2 text-xs'>Cancel</button>
                            </div>
                        </div>
                    }
                    <div className='ml-6'>
                        <ReplyInput showReply={isReplyVisible} toggleReply={() => toggleReply(comment.id)} parent_id={comment.id} post_id={post_id} />
                    </div>
                </div>
                {comment.children && comment.children.length > 0 && (
                    <div className='ml-5 mt-2'>
                        {comment.children.map((child: any) => renderComment(child))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div>
            {renderComment(comment)}
        </div>
    );
}

export default Comment