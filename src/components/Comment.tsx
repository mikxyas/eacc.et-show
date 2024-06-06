// components/Comment.js
import { MessageCircle, Spline, X, Zap } from 'lucide-react';
import React, { useState } from 'react';
import ReplyInput from './ReplyInput';
import { usePostsContext } from '@/context/posts';
import { useUserContext } from '@/context/user';

export default function Comment({ post_id, comment }: any) {
    const { zapComment, zappedComments, unZapComment, deleteComment } = usePostsContext();
    const [showReply, setShowReply] = useState<any>({});
    const [showDelete, setShowDelete] = useState<any>({})
    const { user } = useUserContext()

    const toggleReply = (commentId: any) => {
        setShowReply((prev: any) => ({ ...prev, [commentId]: !prev[commentId] }));
    };

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
                <div className='flex gap-1 items-start text-gray-300' style={{ fontSize: '8pt' }}>
                    {zappedComments?.includes(comment.id) ? (
                        <div onClick={() => unZapComment(comment.id)} className='p-0 flex flex-col items-center justify-center gap-1'>
                            <Zap className='text-green-600 hover:text-green-600 cursor-pointer zapppp' size={15} />
                            {comment.zap_count > 0 && <p className='hover:underline cursor-pointer'>{comment.zap_count}</p>}
                        </div>
                    ) : (
                        <div onClick={() => zapComment(comment.id, comment.replier)} className='p-0 flex flex-col items-center justify-center gap-1'>
                            <Zap className='hover:text-green-600 cursor-pointer zapppp' size={15} />
                            {comment.zap_count > 0 && <p className='hover:underline cursor-pointer'>{comment.zap_count}</p>}
                        </div>
                    )}
                    <p className='hover:underline cursor-pointer'>@{comment.profiles.username}</p>
                    <p>{timeAgo(comment.created_at)}</p>
                    {comment.replier == user?.id &&
                        <p
                            className='hover:underline cursor-pointer '
                            onClick={() => toggleDelete(comment.id)}
                        >delete</p>

                    }
                    {/* <p>delete</p> */}
                </div>
                <div className={comment.zap_count > 0 ? ' -mt-5 ' : ''} style={{ fontSize: '10pt' }} >
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
                                <button onClick={() => deleteComment(comment.id)} className=' bg-gray-800 px-2 text-sm'>Yes</button>
                                <button onClick={() => setShowDelete((prev: any) => ({ ...prev, [comment.id]: !prev[comment.id] }))} className=' bg-gray-700 px-2 text-sm'>No</button>
                            </div>
                        </div>

                    }

                    <div className='ml-6'>
                        <ReplyInput showReply={isReplyVisible} toggleReply={() => toggleReply(comment.id)} parent_id={comment.id} post_id={post_id} />
                    </div>
                </div>
                {comment.children && comment.children.length > 0 && (
                    <div className='ml-4'>
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
