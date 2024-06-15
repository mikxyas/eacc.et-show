
"use client"

import Post from "@/components/Post";
import TelegramLoginButton from "@/components/TelegramLoginButton";
import { usePostsContext } from "@/context/posts";
import { supabase } from "@/libs/supabase";
import { ChevronLeft, ChevronRight, Key } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";

export default function Home() {

  // const [posts, setPosts] = React.useState([] as any);
  const { posts, setViewedPost, page, setPage, setPosts, loading, sortByNew, setSortByNew } = usePostsContext();

  // 

  useEffect(() => {
    setViewedPost(null)
  }, [setViewedPost])


  const incrementPage = async () => {
    console.log(page)
    if (page > 0) {
      await setPage(page + 1)
      setPosts(null)
    } else {
      setPage(1)
    }

  }

  async function updateSort() {
    setSortByNew(!sortByNew)
    setPage(1)
    const url = new URL(window.location.href)
    const search_params = url.searchParams
    search_params.set('p', '1')
    window.history.pushState({}, '', url.toString())
  }

  const SendUserBack = async () => {
    setPage(1)

    await setPosts([])
    await setPosts(null)
    // setPosts(null)
  }

  const decrementPage = async () => {
    console.log(page)
    if (page > 1) {
      await setPage(page - 1)
      setPosts(null)
    } else {
      setPage(1)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center md:mx-44">
        <div style={{ background: '#1e1e1e', alignSelf: 'center' }} className=" px-6 py-2  w-full">
          Loading...
        </div>
      </div>
    )
  }

  if (posts == null) {
    return (
      <div>
        <div className="flex flex-col items-center justify-center md:mx-44">
          <div style={{ background: '#1e1e1e', alignSelf: 'center' }} className=" px-6 py-2  w-full">
            No posts found
          </div>
        </div>
        <div className='flex justify-center items-center gap-1 mt-2'>
          <Link href={`/?p=${page > 1 ? page - 1 : 1}`}>
            <button disabled={page == 1} onClick={() => SendUserBack()} className={page === 1 ? ` p-1 text-gray-50 bg-gray-600` : ' p-1 text-gray-50 bg-green-900'}>go back</button>
          </Link>
        </div>
      </div>


    )
  }

  return (
    <div className='md:mx-44 itmes-center font-mono flex flex-col'>
      <div className="md:relative fixed bottom-0 w-full md:border-none border-t border-white border-opacity-60 flex-col">
        <div style={{ background: '#191919' }} className="text-gray-200 px-2 py-1 items-center flex justify-between">
          <div>
            <span>sort by </span>
            <button onClick={() => updateSort()} className="self-start underline">
              {!sortByNew ? ' new' : ' top'}
            </button>
          </div>
          <div className="justify-center gap-1 items-center flex">
            <Link href={`/?p=${page > 1 ? page - 1 : 1}`}>
              <span onClick={() => decrementPage()} className={'text-gray-50 '}><ChevronLeft /></span>
            </Link>
            <p>{page}</p>
            <Link href={`/?p=${page > 0 ? page + 1 : 1}`}>
              <span onClick={() => incrementPage()} className='  text-gray-50 '><ChevronRight /></span>
            </Link>
          </div>
        </div>
      </div>
      <div style={{ background: '#1e1e1e', alignSelf: 'center', minHeight: '86vh' }} className="mt-0 mb-7 flex flex-col md:mb-0 px-3 md:py-1 py-4 w-full">
        {
          posts?.map((post: any, index: number) => (
            <Post key={post.id} data={post} num={index} page={page} />
          ))
        }
        <div className="justify-center gap-1 items-center flex mt-auto ">
          <Link href={`/?p=${page > 1 ? page - 1 : 1}`}>
            <span onClick={() => decrementPage()} className={'text-gray-50 '}><ChevronLeft /></span>
          </Link>
          <p>{page}</p>
          <Link href={`/?p=${page > 0 ? page + 1 : 1}`}>
            <span onClick={() => incrementPage()} className='  text-gray-50 '><ChevronRight /></span>
          </Link>
        </div>
      </div>
    </div>
  );
}
