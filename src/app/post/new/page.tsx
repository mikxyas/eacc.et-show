"use client"

import TelegramLoginButton from '@/components/TelegramLoginButton'
import React, { useState } from 'react'

export default function NewPost() {
    const [formData, setFormData] = useState({} as any)
    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const Post = async () => {
        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }
        console.log(formData)
        fetch('/api/post/new', {
            method: 'POST',
            body: formDataToSend
        }).then(res => res.json())
            .then(data => console.log(data))
    }


    return (
        <div className='flex flex-col'>
            <div className='flex self-center gap-3 flex-col items-center justify-center px-4 py-10 w-full md:w-2/3' style={{ background: '#1e1e1e' }}>
                <div className='w-full md:w-1/2 '>
                    <input placeholder='Title' onChange={(e) => handleChange(e)} className='outline-none p-1 w-full' type="text" name="title" />
                </div>
                <div className='w-full md:w-1/2'>
                    <input placeholder='Link (link to blog or tg post)' onChange={(e) => handleChange(e)} className=' outline-none p-1 w-full' width={200} type="text" name="link" />
                </div>
                <div className='w-full md:w-1/2'>
                    <textarea placeholder='text' onChange={(e) => handleChange(e)} className='w-full h-20 outline-none p-1' name="text" />
                </div>
                <button type="submit" className='py-2 px-2 bg-green-700 ' onClick={Post}>Create Post</button>
            </div>
        </div>
    )
}
