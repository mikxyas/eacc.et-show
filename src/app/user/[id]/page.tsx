"use client"


import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default function User(context: any) {
    const id = context.params.id
    const [profile, setProfile] = useState<any>(null)
    const fetchUser = async () => {
        const res = await fetch('/api/user/' + id)
        const data = await res.json()
        setProfile(data)
        console.log(data)
    }

    useEffect(() => {
        fetchUser()
    }, [])

    if (!profile)
        return (<div className="flex flex-col items-center justify-center">
            <div style={{ background: 'transparent', alignSelf: 'center' }} className=" px-6 py-2 border-gray-500 border-dashed border-4 md:w-2/3">
                Loading...
            </div>
        </div>)

    return (
        <div className='font-mono gap-4 px-3 mt-10 flex-col items-center flex w-full justify-center'>
            <p>{profile.name}</p>
            @{profile.username}

            <div style={{ background: '#1e1e1e' }} className='px-2 py-1 '>
                {profile.about}
            </div>
            <div className='flex'>
                <Link href={'/post/user/' + profile.user_id}>
                    <button className='py-1 px-4  border border-dashed border-gray-700'>sumbissions</button>
                </Link>
                {/* <Link href={'/comments/user/' + profile.user_id}>
                    <button className='py-1 px-4  border border-dashed border-gray-700'>Comments</button>
                </Link> */}
            </div>
        </div>
    )
}
