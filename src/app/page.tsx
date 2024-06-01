
"use client"

import Post from "@/components/Post";
import TelegramLoginButton from "@/components/TelegramLoginButton";
import { usePostsContext } from "@/context/posts";
import { supabase } from "@/libs/supabase";
import { Key } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";

export default function Home() {
  const [user, setUser] = React.useState({} as any);
  // const [posts, setPosts] = React.useState([] as any);
  const [loading, setLoading] = React.useState(true);
  const { posts, setViewedPost } = usePostsContext();
  const { postSortDate, setPostSortDate } = usePostsContext()
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
      <TelegramLoginButton />

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
    </div>
  );
}
