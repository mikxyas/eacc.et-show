import { supabase } from '@/libs/supabase';
import { Zap } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect } from 'react';

const Post = ({ data, num }: any) => {
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

        <div className='flex  mb-2'>
            <div className='flex'>
                <p>{num + 1}.</p>
            </div>
            <div className='font-sans '>
                <div className='flex gap-1'>
                    <div className='p-1'>
                        <Zap className='hover:text-green-600  cursor-pointer zapppp' size={15} />
                    </div>
                    <div>
                        <Link href={`/post/view?id=${data.id}`}>
                            <div className="inline-flex items-baseline">
                                <p className=" leading-5 mb-0 cursor-pointer">
                                    {data.title}
                                    <span className="text-gray-300 text-xs"> ({data.link})</span>
                                </p>
                            </div>
                        </Link>
                        <div className='flex gap-2 text-xs text-gray-200 mt-1'>
                            <p className='hover:underline cursor-pointer'>151 zaps</p>
                            <p className='hover:underline cursor-pointer'>by @{data.profiles.username}</p>
                            <p>{timeAgo(data.created_at)}</p>
                            <p className='hover:underline cursor-pointer'>93 comments</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Post;