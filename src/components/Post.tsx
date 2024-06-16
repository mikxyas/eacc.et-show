
import { usePostsContext } from '@/context/posts';
import { useUserContext } from '@/context/user';
import { supabase } from '@/libs/supabase';
import { UUID } from 'crypto';
import { Zap } from 'lucide-react';
// import { Inter, Roboto, Source_Code_Pro } from 'next/font/google';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
// const inter = Source_Code_Pro({ subsets: ["latin"], weight: '300' });



const Post = ({ data, num, page }: any) => {
    const { zap_post, zappedPosts, unZapPost, deletePost } = usePostsContext();
    const [showDelete, setShowDelete] = useState(false)
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
        // (zappp)

    }

    return (

        <div className={num === null ? 'flex  mb-6 ' : 'flex  mb-1.5'}>
            <div className='w-full'>
                <div className='flex gap-1 w-full '>


                    <div className={`flex items-center self-start mt-1  flex-col ${page == null ? 'justify-start mt-1' : 'justify-center'}`}>
                        {page != null &&
                            <p className=' text-2xs mr-1'>{(num + 1) + ((page - 1) * 30)}.</p>
                        }
                        {user != null
                            ? <>
                                {zappedPosts.includes(data.id)
                                    ? <div onClick={() => unZapPost(data.id)} className='p-1 '>
                                        <Zap className='text-green-600 hover:text-green-600 cursor-pointer zapppp' size={13} />
                                    </div>
                                    :
                                    <div onClick={() => zapPost(data.id, data.creator)} className='p-1 '>
                                        <Zap className='hover:text-green-600 cursor-pointer zapppp' size={13} />
                                    </div>
                                }
                            </>
                            :
                            <Link href='/login'>
                                <div className='p-1'>
                                    <Zap className='cursor-pointer ' size={13} />
                                </div>
                            </Link>
                        }

                    </div>
                    <div className='w-full'>
                        {/* <Link href={`/post/${data.id}`}> */}
                        <div className="inline-flex  w-full items-baseline ">

                            <div className=" leading-5 mb-0 cursor-pointer flex  no-select">

                                <div>
                                    {data.link == null || data.link == "null"
                                        ? <span onClick={num != null ? postClicked : () => { }}> {data.title}</span>
                                        : <a href={data.link} target='_blank' className='hover:underline'>{data.title}</a>
                                    }

                                    {data.link != 'null' &&
                                        <a href={data.link} target='_blank'> <span className="text-gray-300 text-xs">({data.link})</span></a>
                                    }
                                </div>

                            </div>
                        </div>
                        {/* </Link> */}
                        <div className='flex gap-2 text-white text-opacity-55 text-xs   pt-0.5'>
                            <p className='hover:underline cursor-pointer'>{data.zap_count} zaps</p>
                            <Link href={'/user/' + data.profiles.username} >
                                <p className='hover:underline cursor-pointer'>by {data.profiles.username}</p>
                            </Link>
                            <p>{timeAgo(data.created_at)}</p>
                            <Link href={'/post/' + data.id}>
                                <p className='hover:underline cursor-pointer'>{data.comment_count} comment{data.comment_count != 1 && 's'}</p>
                            </Link>
                            {data.creator == user?.id &&
                                <p onClick={() => setShowDelete(true)} className='cursor-pointer hover:underline'>delete post</p>
                            }
                        </div>
                        {data.text != null && data.text != 'null' &&
                            <div className='mt-2 md:w-8/12 w-full'>
                                <p style={{ fontSize: '10pt' }} >{data.text}</p>
                            </div>
                        }
                    </div>

                </div>
                {showDelete &&
                    <div className='ml-5 mt-1  '>
                        <p className='text-gray-200'>Are you sure you want to delete this post</p>
                        <div className='mt-1'>
                            <button onClick={() => deletePost(data.id)} className=' bg-gray-800 px-2 text-sm'>Yes</button>
                            <button onClick={() => setShowDelete(false)} className=' bg-gray-700 px-2 text-sm'>No</button>
                        </div>
                    </div>
                }

            </div>
        </div>
    );
};

export default Post;