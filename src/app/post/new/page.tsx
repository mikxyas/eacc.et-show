"use client"

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
        <div>
            This is where you will create new posts
            <div className='flex gap-3 flex-col items-center'>
                <div>
                    <label htmlFor="title" className='mr-2'>Title</label>
                    <input onChange={(e) => handleChange(e)} className='outline-none p-1' width={200} type="text" name="title" />
                </div>
                <div>
                    <label className='mr-2' htmlFor="title">Link</label>
                    <input onChange={(e) => handleChange(e)} className=' outline-none p-1' width={200} type="text" name="link" />
                </div>
                <div>
                    <label className='mr-2' htmlFor="title">Type</label>
                    <input onChange={(e) => handleChange(e)} className=' outline-none p-1' width={200} type="text" name="type" />
                </div>
                <button type="submit" onClick={Post}>Create Post</button>
            </div>
        </div>
    )
}
