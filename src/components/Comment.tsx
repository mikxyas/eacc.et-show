// components/Comment.js
import { MessageCircle, Spline, X, Zap } from 'lucide-react';
import React, { useState } from 'react';
import ReplyInput from './ReplyInput';
import { usePostsContext } from '@/context/posts';

export default function Comment({ post_id, comment }) {
    const { zapComment, zappedComments, unZapComment } = usePostsContext();
    const [showReply, setShowReply] = useState({});

    const toggleReply = (commentId) => {
        setShowReply(prev => ({ ...prev, [commentId]: !prev[commentId] }));
    };

    const timeAgo = (createdAt) => {
        const now = new Date();
        const created = new Date(createdAt);
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

    const renderComment = (comment) => {
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
                        <div onClick={() => zapComment(comment.id, comment.replier)} className='p-0 flex flex-col gap-1'>
                            <Zap className='hover:text-green-600 cursor-pointer zapppp' size={15} />
                            {comment.zap_count > 0 && <p className='hover:underline cursor-pointer'>{comment.zap_count}</p>}
                        </div>
                    )}
                    <p className='hover:underline cursor-pointer'>@{comment.profiles.username}</p>
                    <p>{timeAgo(comment.created_at)}</p>
                </div>
                <div>
                    <div style={{ fontSize: '9pt' }} className={comment.zap_count > 0 ? ' -mt-5 ml-5 md:w-2/3 flex items-center gap-1' : 'ml-5  md:w-2/3 flex items-center gap-1'}>
                        <p className='h-fit'>{comment.content}</p>

                        <MessageCircle onClick={() => toggleReply(comment.id)} className='text-gray-400 cursor-pointer hover:text-green-600' size={13} />

                    </div>
                    <div className='ml-6'>
                        <ReplyInput showReply={isReplyVisible} toggleReply={() => toggleReply(comment.id)} parent_id={comment.id} post_id={post_id} />
                    </div>
                </div>
                {comment.children && comment.children.length > 0 && (
                    <div className='ml-4'>
                        {comment.children.map((child) => renderComment(child))}
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
