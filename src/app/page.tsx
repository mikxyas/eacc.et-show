
"use client"

import Post from "@/components/Post";
import TelegramLoginButton from "@/components/TelegramLoginButton";
import { usePostsContext } from "@/context/posts";
import { supabase } from "@/libs/supabase";
import { Key } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";

export default function Home() {

  // const [posts, setPosts] = React.useState([] as any);

  const { posts, setViewedPost, page, setPage, setPosts, loading } = usePostsContext();

  // 

  useEffect(() => {
    setViewedPost(null)
  }, [setViewedPost])


  // async function getPosts() {

  //   const res = await fetch('/api/post/get')
  //   const data = await res.json()
  //   setPosts(data)
  //   setLoading(false)
  // }

  // async function getSesh() {
  //   const res = await supabase.auth.getSession();
  //   if (res) {
  //     setUser(res.data.session?.user)
  //   }
  // }

  const incrementPage = async () => {
    console.log(page)
    if (page > 0) {
      await setPage(page + 1)
      setPosts(null)
    } else {
      setPage(1)
    }

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
      <div className="flex flex-col items-center justify-center">
        <div style={{ background: 'transparent', alignSelf: 'center' }} className=" px-6 py-2 border-gray-500 border-dashed border-4 md:w-2/3">
          Loading...
        </div>
      </div>
    )
  }

  if (posts == null) {
    return (
      <div>
        <div className="flex flex-col items-center justify-center">
          <div style={{ background: 'transparent', alignSelf: 'center' }} className=" px-6 py-2 border-gray-500 border-dashed border-4 md:w-2/3">
            No posts found
          </div>
        </div>
        <div className='flex justify-center items-center gap-2 mt-2'>
          <Link href={`/?p=${page > 1 ? page - 1 : 1}`}>
            <button disabled={page == 1} onClick={() => decrementPage()} className={page === 1 ? ` p-1 text-gray-50 bg-gray-600` : ' p-1 text-gray-50 bg-green-700'}>prev</button>
          </Link>
          <Link href={`/?p=${page > 0 ? page + 1 : 1}`}>
            <button onClick={() => incrementPage()} className='bg-green-700 p-1 text-gray-50'>next</button>
          </Link>
        </div>
      </div>


    )
  }

  // if (loading) {
  //   return (
  //     <div className="flex flex-col items-center justify-center">
  //       <div className="bg-black md:w-2/3 h-46 p-3 font-mono">
  //         Loading...
  //       </div>

  //     </div>
  //   )
  // }
  return (
    <div className=' md:ml-10  font-mono flex flex-col'>
      {/* <div>{user?.email}</div> */}
      {/* <TelegramLoginButton botId="7499969599:AAEg3y0kbuQW9y0tpGFMj09c6rL442aTWbY" onAuth={handleAuth} /> */}

      <div style={{ background: '#1e1e1e', alignSelf: 'center' }} className=" px-3 py-1 w-full  md:w-2/3 ">
        {/* <nav style={{ alignSelf: 'center' }} className=' font-mono mb-1'> */}
        <div className=' p-1 flex gap-2 justify-between'>
          <div className='flex gap-5 '>
            {/* <a onClick={() => setPostSortDate('day')} className={postSortDate == 'day' ? ' cursor-pointer underline' : ' cursor-pointer hover:underline'}>day</a>
              <a onClick={() => setPostSortDate('week')} className={postSortDate == 'week' ? ' cursor-pointer underline' : ' cursor-pointer hover:underline'}>week</a>
              <a onClick={() => setPostSortDate('month')} className={postSortDate == 'month' ? ' cursor-pointer underline' : ' cursor-pointer hover:underline'}>month</a>
              <a onClick={() => setPostSortDate('year')} className={postSortDate == 'year' ? ' cursor-pointer underline' : ' cursor-pointer hover:underline'}>year</a> */}

            {/* <a className='underline  cursor-pointer hover:underline'>day</a>
              <a className=' cursor-pointer hover:underline'>week</a>
              <a className=' cursor-pointer hover:underline'>month</a>
              <a className=' cursor-pointer hover:underline'>year</a> */}
            {/* <Link href='/post/new'>
                <p className=' cursor-pointer hover:underline'>submit</p>
              </Link> */}
          </div>
          {/* <button onClick={() => fetch('/auth/logout')}>logout</button> */}


        </div>
        {/* </nav> */}
        {posts?.map((post: any, index: number) => (
          <Post key={post.id} data={post} num={index} />
        ))


        }
        {/* <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post /> */}

      </div>
      {/* create buttons to show pagination using the page state */}
      <div className='flex justify-center items-center gap-2 mt-2'>
        <Link href={`/?p=${page > 1 ? page - 1 : 1}`}>
          <button disabled={page == 1} onClick={() => decrementPage()} className={page === 1 ? ` p-1 text-gray-50 bg-gray-600` : ' p-1 text-gray-50 bg-green-700'}>prev</button>
        </Link>
        <Link href={`/?p=${page > 0 ? page + 1 : 1}`}>
          <button onClick={() => incrementPage()} className='bg-green-700 p-1 text-gray-50'>next</button>
        </Link>
      </div>
    </div>
  );
}
