import { usePostsContext } from '@/context/posts';
import { useUserContext } from '@/context/user';
import { supabase } from '@/libs/supabase';
import { UUID } from 'crypto';
import { Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const Post = ({ data, num }: any) => {
    const { zap_post, zappedPosts, unZapPost, page } = usePostsContext();
    const { user } = useUserContext()
    const router = useRouter()
    const postClicked = () => {
        // openPost(data.id);
        // redirect to post page
        router.push(`/post/${data.id}`)
    }

    function timeAgo(createdAt: Date) {
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
    }



    async function zapPost(post_id: number, zapped: UUID) {

        const zappp = {
            post_zapped: post_id,
            zapper: user?.id,
            zapped: zapped,
        }

        await zap_post(zappp)
        console.log(zappp)

    }

    return (

        <div className={num === null ? 'flex  mb-6 ' : 'flex  mb-2'}>

            <div className='font-sans w-full'>
                <div className='flex gap-1 w-full'>
                    {user != null
                        ? <>
                            {zappedPosts.includes(data.id)
                                ? <div onClick={() => unZapPost(data.id)} className='p-1'>
                                    <Zap className='text-green-600 hover:text-green-600 cursor-pointer zapppp' size={15} />
                                </div>
                                :
                                <div onClick={() => zapPost(data.id, data.creator)} className='p-1'>
                                    <Zap className='hover:text-green-600 cursor-pointer zapppp' size={15} />
                                </div>
                            }
                        </>
                        :
                        <Link href='/login'>
                            <div className='p-1'>
                                <Zap className='  cursor-pointer ' size={15} />
                            </div>
                        </Link>
                    }


                    <div className='w-full'>
                        {/* <Link href={`/post/${data.id}`}> */}
                        <div onClick={num != null ? postClicked : () => { }} className="inline-flex  w-full items-baseline mb-1">
                            <p className=" leading-5 mb-0 cursor-pointer">
                                <span className=' text-2xs'>{(num + 1) + ((page - 1) * 10)}.</span> {data.title}
                                {data.link != 'null' &&
                                    <span className="text-gray-300 text-xs"> ({data.link})</span>
                                }
                            </p>
                        </div>
                        {/* </Link> */}
                        <div style={{ color: "#828282" }} className='flex gap-2 text-xs   '>
                            <p className='hover:underline cursor-pointer'>{data.zap_count} zaps</p>
                            <Link href={'/user/' + data.profiles.username} >
                                <p className='hover:underline cursor-pointer'>by @{data.profiles.username}</p>
                            </Link>
                            <p>{timeAgo(data.created_at)}</p>
                            <Link href={'/post/' + data.id}>
                                <p className='hover:underline cursor-pointer'>{data.comment_count} comment{data.comment_count != 1 && 's'}</p>
                            </Link>
                        </div>
                        {data.text != null &&
                            <div className='mt-2'>
                                <p style={{ fontSize: '10pt' }} >{data.text}</p>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Post;