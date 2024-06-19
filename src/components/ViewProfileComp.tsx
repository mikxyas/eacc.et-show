"use client"


import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default function ViewProfileComp({ id }: any) {
    const [profile, setProfile] = useState<any>(null)
    const fetchUser = async () => {
        const res = await fetch('/api/user/' + id)
        const data = await res.json()
        setProfile(data)
        // (data)
    }

    useEffect(() => {
        fetchUser()
    }, [])

    if (!profile)
        return (<div className="flex md:mx-44 flex-col items-center justify-center">
            <div style={{ background: '#1e1e1e', alignSelf: 'center' }} className=" px-6 py-2  w-full">
                Loading...
            </div>
        </div>)
    return (
        <div>
            <div style={{ background: '#1e1e1e' }} className='font-mono gap-4 md:mx-44 px-3 py-5 flex-col items-center flex  justify-center'>
                <p>{profile.name}</p>
                @{profile.username}

                <div style={{ background: '#1e1e1e' }} className='px-2  '>
                    {profile.about != null && <p>{profile.about}</p>}
                </div>
                <div className='flex'>
                    <Link href={'/post/user/' + profile.user_id}>
                        <button className=' px-4  bg-gray-200  bg-opacity-10 hover:bg-opacity-20 border-black border-2 border-opacity-40 '>sumbissions</button>
                    </Link>
                    {/* <Link href={'/comments/user/' + profile.user_id}>
                    <button className='py-1 px-4  border border-dashed border-gray-700'>Comments</button>
                </Link> */}
                </div>
            </div>
        </div>
    )
}
