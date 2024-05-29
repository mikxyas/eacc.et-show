
"use client"

import Post from "@/components/Post";
import { supabase } from "@/libs/supabase";
import { Key } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";

export default function Home() {
  const [user, setUser] = React.useState({} as any);
  const [posts, setPosts] = React.useState([] as any);
  const [loading, setLoading] = React.useState(true);


  async function getPosts() {

    const res = await fetch('/api/post/get')
    const data = await res.json()
    setPosts(data)
    setLoading(false)
  }

  async function getSesh() {
    const res = await supabase.auth.getSession();
    if (res) {
      setUser(res.data.session?.user)
    }
  }
  useEffect(() => {
    getSesh();
    if (posts.length === 0 && loading === true) {
      getPosts();
    }
  }, [loading, posts])
  if (loading) {
    return (
      <div className='pl-96 pr-96  font-mono'>
        Loading...
      </div>
    )
  }
  return (
    <div className='pl-96 pr-96  font-mono'>
      <div>{user?.email}</div>
      <nav className=' font-mono '>
        <div className=' p-1  flex gap-2'>
          <div className='flex gap-5 '>
            <a className='underline  cursor-pointer hover:underline'>day</a>
            <a className=' cursor-pointer hover:underline'>week</a>
            <a className=' cursor-pointer hover:underline'>month</a>
            <a className=' cursor-pointer hover:underline'>year</a>
            <Link href='/post/new'>
              <p className=' cursor-pointer hover:underline'>submit</p>
            </Link>
          </div>
        </div>
      </nav>
      <div style={{ background: 'transparent' }} className="  ">
        {posts.map((post: any, index: number) => (
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
        <button onClick={() => fetch('/auth/logout')}>Logout</button>
        Logged in
      </div>
    </div>
  );
}
