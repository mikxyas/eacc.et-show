"use client"
import Post from '@/components/Post'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default function UserPosts(context: any) {

    const id = context.params.id
    const [posts, setPosts] = useState<any>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [page, setPage] = useState(1)

    const fetchPosts = async () => {
        setLoading(true)
        const res = await fetch('/api/post/user/' + id + '/?p=' + page)
        const data = await res.json()
        // (data)


        setPosts(data)

        setLoading(false)
    }

    const incrementPage = async () => {
        // (page)
        if (page > 0) {
            await setPage(page + 1)
            setPosts(null)
        } else {
            setPage(1)
        }

    }

    const decrementPage = async () => {
        // (page)
        if (page > 1) {
            await setPage(page - 1)
            setPosts(null)
        } else {
            setPage(1)
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [page])
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center md:mx-44">
                <div style={{ background: '#1e1e1e', alignSelf: 'center' }} className=" px-6 py-2  w-full">
                    Loading...
                </div>
            </div>
        )
    }
    if (posts === null) {
        return (
            <div>
                <div className="flex flex-col items-center justify-center md:mx-44">
                    <div style={{ background: '#1e1e1e', alignSelf: 'center' }} className=" px-6 py-2  w-full">
                        user has no posts
                    </div>
                </div>
                <div className='flex justify-center items-center gap-1 mt-2'>
                    <Link href={`/post/user/${id}?p=${page > 1 ? page - 1 : 1}`}>
                        <button disabled={page == 1} onClick={() => decrementPage()} className={page === 1 ? ` p-1 text-gray-50 bg-gray-600` : ' p-1 text-gray-50 bg-green-900'}>prev</button>
                    </Link>
                    <Link href={`/post/user/${id}?p=${page > 0 ? page + 1 : 1}`}>
                        <button onClick={() => incrementPage()} className='bg-green-900 p-1 text-gray-50'>next</button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center md:mx-44">
            <div style={{ background: '#1e1e1e', alignSelf: 'center' }} className=" px-6 py-2  w-full">

                {posts?.map((post: any, index: number) => (
                    <Post key={post.id} data={post} num={index} page={page} />
                ))
                }
            </div>
            <div className='flex justify-center items-center gap-1 mt-2'>
                <Link href={`/post/user/${id}?p=${page > 1 ? page - 1 : 1}`}>
                    <button disabled={page == 1} onClick={() => decrementPage()} className={page === 1 ? ` p-1 text-gray-50 bg-gray-200  bg-opacity-10  border-black border-2 border-opacity-40  px-2 py-1` : ' p-1 px-2 py-1 text-gray-50 bg-green-900'}>prev</button>
                </Link>
                <Link href={`/post/user/${id}?p=${page > 0 ? page + 1 : 1}`}>
                    <button onClick={() => incrementPage()} className='bg-gray-200  bg-opacity-10 hover:bg-opacity-20 border-black border-2 border-opacity-40 px-2 py-1 text-gray-50'>next</button>
                </Link>
            </div>
        </div>
    )
}
