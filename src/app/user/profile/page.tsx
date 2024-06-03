"use client"
import { useUserContext } from '@/context/user'
import { supabase } from '@/libs/supabase'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function UserProfile() {
    const [formData, setFormData] = useState({} as any)
    const { profile, setProfile } = useUserContext()
    const router = useRouter()
    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const updateProfile = async () => {
        const { data, error } = await supabase.from('profiles').update({ name: formData.name, username: formData.username, about: formData.about }).eq('user_id', profile.user_id).select()
        if (error) {
            console.log(error)
        } else {
            console.log(data)
            setProfile(data[0])
            router.push('/')
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
            <div className="flex flex-col items-center justify-center">
                <div style={{ background: 'transparent', alignSelf: 'center' }} className=" px-6 py-2 border-gray-500 border-dashed border-4 md:w-2/3">
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
                        <div className='w-full md:w-1/2'>
                            <input style={{ background: '#1e1e1e' }} value={formData.username} placeholder='Username' onChange={(e) => handleChange(e)} className=' outline-none p-2 w-full' width={200} type="text" name="username" />
                        </div>
                        <div className='w-full md:w-1/2'>
                            <textarea style={{ background: '#1e1e1e' }} value={formData.about} placeholder='bio' onChange={(e) => handleChange(e)} className='w-full h-20 outline-none p-2' name="about" />
                        </div>
                        <button onClick={updateProfile} className='py-2 px-2 bg-green-700 border border-dashed border-gray-700 ' >Update Profile</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
