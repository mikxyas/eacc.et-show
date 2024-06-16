"use client"
import { useUserContext } from '@/context/user'
import { supabase } from '@/libs/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function UserProfile() {
    const [formData, setFormData] = useState({} as any)
    const { profile, setProfile } = useUserContext()
    const [isDuplicate, setIsDuplicate] = useState(false)
    const router = useRouter()
    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const updateProfile = async () => {

        const { data, error } = await supabase.from('profiles').update({ name: formData.name, username: formData.username, about: formData.about }).eq('user_id', profile.user_id).select()
        if (error && error?.code == '23505') {
            // (error)
            setIsDuplicate(true)
            console.log(error)
        } else {
            // (data)
            setIsDuplicate(false)
            setProfile(data[0])

            router.push('/user/' + data[0].username)
        }

    }

    useEffect(() => {
        // set initial value for name and username 
        if (profile != null) {
            setFormData({ name: profile.name, username: profile.username, about: profile.about })
        }
    }, [profile])
    if (profile == null) {
        return (
            <div className="flex flex-col items-center justify-center md:mx-44">
                <div style={{ background: '#1e1e1e', alignSelf: 'center' }} className=" px-6 py-2  w-full">
                    Loading...
                </div>

            </div>
        )
    }
    return (
        <div>
            <div className='flex flex-col ' >
                <div className='flex self-center flex-col items-center justify-center  w-full md:w-2/3 mt-40 md:mt-2' >
                    <div className='mx-4 my-2 w-full items-center px-4 md:px-1 justify-center flex flex-col gap-2'>
                        <div className='w-full md:w-1/2 '>
                            <input style={{ background: '#1e1e1e' }} value={formData.name} placeholder='Name' onChange={(e) => handleChange(e)} className='outline-none p-2 w-full' type="text" name="name" />
                        </div>
                        {isDuplicate && <p className='text-red-500'>Username already taken</p>}
                        <div className='w-full md:w-1/2'>
                            <input style={{ background: '#1e1e1e' }} value={formData.username} placeholder='Username' onChange={(e) => handleChange(e)} className=' outline-none p-2 w-full' width={200} type="text" name="username" />
                        </div>
                        <div className='w-full md:w-1/2'>
                            <textarea style={{ background: '#1e1e1e' }} value={formData.about} placeholder='bio' onChange={(e) => handleChange(e)} className='w-full h-20 outline-none p-2' name="about" />
                        </div>
                        <div className='flex'>
                            <button onClick={updateProfile} className='py-2 px-2 bg-gray-200  bg-opacity-10 hover:bg-opacity-20 border-black border-2 border-opacity-40 ' >Update Profile</button>
                            <Link href={'/user/' + profile.username}>
                                <button className='py-2 px-2 bg-gray-200  bg-opacity-10 hover:bg-opacity-20 border-black border-2 border-opacity-40  ' >View Profile</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
