import { Zap } from 'lucide-react'
import React from 'react'
import ReplyInput from './ReplyInput'

export default function Comment({ post_id, comment }) {
    function timeAgo(createdAt: Date) {
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
    }

    return (
        <div className='mt-2'>
            <div className='flex ml-5 gap-1 items-center text-gray-300' style={{ fontSize: '8pt' }}>
                <Zap className='hover:text-green-600  cursor-pointer zapppp' size={13} />
                <p>{comment.profiles.username}</p>
                <p>{timeAgo(comment.created_at)}</p>
            </div>
            <div style={{ fontSize: '9pt' }} className='ml-10 md:w-2/3 '>
                <p>
                    {comment.content}
                </p>
                <ReplyInput parent_id={comment.id} post_id={post_id} />
            </div>
        </div>
    )
}
