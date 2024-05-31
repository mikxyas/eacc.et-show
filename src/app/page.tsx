
"use client"

import Post from "@/components/Post";
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
    <div className=' md:ml-10 ml-2 font-mono flex flex-col'>
      {/* <div>{user?.email}</div> */}

      <div style={{ background: 'black', alignSelf: 'center' }} className=" md:w-2/3">
        <nav style={{ alignSelf: 'center' }} className=' font-mono mb-1'>
          <div className=' p-1  flex gap-2 justify-between'>
            <div className='flex gap-5 '>
              <a className='underline  cursor-pointer hover:underline'>day</a>
              <a className=' cursor-pointer hover:underline'>week</a>
              <a className=' cursor-pointer hover:underline'>month</a>
              <a className=' cursor-pointer hover:underline'>year</a>
              <Link href='/post/new'>
                <p className=' cursor-pointer hover:underline'>submit</p>
              </Link>
            </div>
            <button onClick={() => fetch('/auth/logout')}>logout</button>


          </div>
        </nav>
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
