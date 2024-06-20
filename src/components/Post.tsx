
import { useUserContext } from '@/context/user';
import { UUID } from 'crypto';
import { Zap } from 'lucide-react';
// import { Inter, Roboto, Source_Code_Pro } from 'next/font/google';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
// const inter = Source_Code_Pro({ subsets: ["latin"], weight: '300' });
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { zapPost as zap_the_post, unzapPost as unzappPost } from '@/functions/posts';
import { delete_post } from '@/functions/posts';
const Post = ({ data, num, page, zapped_posts }: any) => {
    // const { deletePost } = usePostsContext();
    const deletePost = useMutation({
        mutationFn: (post_id) => {
            return delete_post(post_id)
        },
        onSuccess: (post_id) => {
            try {
                if (page != null) {
                    // const posts: any = client.getQueryData(['posts', { page: 1, sortByNew: false }])
                    client.invalidateQueries({ queryKey: ['posts', { page: 1, sortByNew: false }] })
                } else {
                    client.setQueryData(['post', { id: post_id }], null)
                    router.push('/')
                }
            }
            catch (e) {
                console.log(e)
            }
        }
    })

    const zapp_post = useMutation({
        mutationFn: (zap) => {
            return zap_the_post(zap)
        },

        onMutate: async (zap: any) => {
            try {
                if (page != null) {
                    const posts: any = client.getQueryData(['posts', { sortByNew: false, page: page }])
                    const updated_post = {
                        data: posts.data.map((post: any) => {
                            if (post.id == zap.post_zapped) {
                                post.zap_count += 1
                            }
                            return post
                        }),
                        zapped_posts: [...zapped_posts, zap.post_zapped]
                    }
                    // console.log(updated_post)
                    client.setQueryData(['posts', { page: page, sortByNew: false }], updated_post)
                } else {
                    const post: any = client.getQueryData(['post', { id: zap.post_zapped }])
                    post.data.zap_count += 1
                    client.setQueryData(['post', { id: zap.post_zapped }], post)
                    // const zaps: any = client.getQueryData(['posts_zapped'])
                    // client.setQueryData(['posts_zapped'], [...zaps, zap.post_zapped])
                }
            }
            catch (e) {
                console.log(e)
            }
        }
    })

    const unzapp_post = useMutation({
        mutationFn: (post_id) => {
            return unzappPost(post_id)
        },
        onMutate: async (post_id: string) => {
            try {
                // if page null user is in post page so we dont need to update the posts query we update the post query
                if (page != null) {
                    const posts: any = client.getQueryData(['posts', { sortByNew: false, page: page }])
                    const updated_post = {
                        data: posts.data.map((post: any) => {
                            if (post.id == post_id) {
                                post.zap_count -= 1
                            }
                            return post
                        }),
                        zapped_posts: zapped_posts.filter((id: string) => id != post_id)
                    }
                    // TODO: update with zustand by making page and sortbyenw a zustand state
                    client.setQueryData(['posts', { page: page, sortByNew: false }], updated_post)
                } else {
                    const post: any = client.getQueryData(['post', { id: post_id }])
                    const new_post = {
                        ...post,
                        data: {
                            ...post.data,
                            zap_count: post.data.zap_count - 1
                        },
                        zapped_posts: zapped_posts.filter((id: string) => id != post_id)
                    }

                    client.setQueryData(['post', { id: post_id }], post)
                }
            }
            catch (e) {
                console.log(e)
            }
        },
    })

    const client = useQueryClient()

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
    function isTextEmptyOrWhitespace(text: string) {
        if (text == 'null') return true
        return text.trim().length === 0;
    }
    async function zapPost(post_id: any, zapped: any) {

        const zap_object = {
            post_zapped: post_id,
            zapper: user?.id,
            zapped: zapped,
        }

        zapp_post.mutate(zap_object)
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
                                {zapped_posts?.includes(data.id)
                                    ? <div onClick={() => unzapp_post.mutate(data.id)} className='p-1 '>
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
                                    {isTextEmptyOrWhitespace(data.link)
                                        // make this a Link
                                        ? <span className='no-select' onClick={num != null ? postClicked : () => { }}>{data.title}</span>
                                        : <a href={data.link} target='_blank' className='hover:underline no-select'>{data.title}</a>
                                    }

                                    {!isTextEmptyOrWhitespace(data.link) &&
                                        <a href={data.link} target='_blank'> <span className="text-gray-300 text-xs ">({data.link})</span></a>
                                    }
                                </div>
                            </div>
                        </div>
                        {/* </Link> */}
                        <div className='flex gap-x-1 text-white text-opacity-55 text-xs flex-wrap   pt-0.5'>
                            <p className='hover:underline cursor-pointer'>{data.zap_count} zaps</p>
                            <Link href={'/user/' + data.profiles.username} >
                                <p className='hover:underline cursor-pointer'>by {data.profiles.username} |</p>
                            </Link>
                            <p>{timeAgo(data.created_at)}</p>
                            <Link href={'/post/' + data.id}>
                                <p className='hover:underline cursor-pointer'>| {data.comment_count} comment{data.comment_count != 1 && 's'}</p>
                            </Link>
                            {data.hackerlink &&
                                <Link href={data.hackerlink} target='_blank'>
                                    <p className='hover:underline cursor-pointer'>| hackerlink</p>
                                </Link>
                            }

                            {data.creator == user?.id &&
                                <div className='flex gap-x-1'>
                                    <p onClick={() => setShowDelete(true)} className='cursor-pointer  hover:underline'>| delete post</p>
                                    <p onClick={() => router.push('/post/edit/' + data.id)} className='cursor-pointer  hover:underline'>| edit post</p>
                                </div>
                            }
                        </div>
                        {data.text != null && data.text != 'null' &&
                            <div className='mt-2 md:w-8/12 w-full'>
                                <p style={{ fontSize: '10pt' }} >{data.text}</p>
                            </div>
                        }
                    </div>

                </div>
                {deletePost.isPending &&
                    <p className='text-xs'>deleting post...</p>
                }
                {showDelete &&
                    <div className='ml-5 mt-1  '>
                        <p className='text-gray-200'>Are you sure you want to delete post?</p>
                        <div className='mt-1'>
                            <button onClick={() => deletePost.mutate(data.id)} className=' bg-gray-800 px-2 text-sm'>Yes</button>
                            <button onClick={() => setShowDelete(false)} className=' bg-gray-700 px-2 text-sm'>No</button>
                        </div>
                    </div>
                }

            </div>
        </div>
    );
};

export default Post;