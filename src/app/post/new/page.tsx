"use client"

import TelegramLoginButton from '@/components/TelegramLoginButton'
import { usePostsContext } from '@/context/posts'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export default function NewPost() {
    const [formData, setFormData] = useState({} as any)
    const { create_post } = usePostsContext()
    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const router = useRouter()

    const Post = async () => {
        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }
        const id = await create_post(formDataToSend)
        router.push('/post/' + id)
    }

    return (
        <div className='flex flex-col ' >
            <div className='flex self-center flex-col items-center justify-center  w-full md:w-2/3 mt-40 md:mt-2' >
                <div className='mx-4 my-2 w-full items-center px-4 md:px-1 justify-center flex flex-col gap-2'>
                    <div className='w-full md:w-1/2 '>
                        <input style={{ background: '#1e1e1e' }} placeholder='Title' onChange={(e) => handleChange(e)} className='outline-none p-2 w-full' type="text" name="title" />
                    </div>
                    <div className='w-full md:w-1/2'>
                        <input style={{ background: '#1e1e1e' }} placeholder='Link (link to blog or tg post)' onChange={(e) => handleChange(e)} className=' outline-none p-2 w-full' width={200} type="text" name="link" />
                    </div>
                    <div className='w-full md:w-1/2'>
                        <textarea style={{ background: '#1e1e1e' }} placeholder='text' onChange={(e) => handleChange(e)} className='w-full h-20 outline-none p-2' name="text" />
                    </div>
                    <button type="submit" className='py-2 px-2 bg-green-700 border border-dashed border-gray-700 ' onClick={Post}>Create Post</button>

                </div>
            </div>
        </div>
    )
}
