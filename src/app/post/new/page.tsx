"use client"

import TelegramLoginButton from '@/components/TelegramLoginButton'
import { usePostsContext } from '@/context/posts'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function NewPost() {
    const [formData, setFormData] = useState({} as any)
    const [urlValid, setUrlValid] = useState(true)
    const { create_post } = usePostsContext()
    const [emptyInput, setEmptyInput] = useState(false)
    const [linkPostEmpty, setLinkPostEmpty] = useState(false)
    const [textPostEmpty, setTextPostEmpty] = useState(false)
    const [loading, setLoading] = useState(false)
    const { setViewedPost } = usePostsContext()

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const router = useRouter()

    // create a function that validates the link and checks if its a real link or not
    function isValidUrl(string: string) {
        const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        const domainPattern = new RegExp('\\.[a-z]{2,}$', 'i'); // check for valid domain extension
        setUrlValid(pattern.test(string) && domainPattern.test(string))
        return pattern.test(string) && domainPattern.test(string);
    }

    const Post = async () => {
        setLoading(true)
        setUrlValid(true)
        setEmptyInput(false)
        setLinkPostEmpty(false)
        setTextPostEmpty(false)
        if (formData.link != undefined) {
            const validate = isValidUrl(formData.link)
            if (validate == false) {
                setLoading(false)
                return
            }
        }
        if (formData.title == undefined) {
            setLoading(false)

            setEmptyInput(true)
            return
        }
        if (formData.link == undefined && formData.text == undefined) {
            setLinkPostEmpty(true)
            setTextPostEmpty(true)
            setLoading(false)
            return
        }

        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }
        const id = await create_post(formDataToSend)
        setLoading(false)
        router.push('/post/' + id)
    }

    useEffect(() => {
        setViewedPost(null)
    }, [])

    return (
        <div className='flex flex-col' >
            <div className='flex self-center flex-col items-center justify-center  w-full md:w-2/3 mt-40 md:mt-2' >
                {/* <p className='px-4 font-mono w-full md:w-1/2'>submit high quality content that inspires insightful discussion and learning</p> */}
                <div className='mx-4 my-2 w-full items-center px-4 md:px-1 justify-center flex flex-col gap-2'>
                    {emptyInput &&
                        <p className='text-sm'>Title Cannot be empty</p>
                    }
                    {linkPostEmpty && textPostEmpty &&
                        <p className='text-sm'>Link or Text cannot be empty. Submit either a link post or a text post</p>
                    }
                    <div className='w-full md:w-1/2 '>
                        <input style={{ background: '#1e1e1e' }} placeholder='Title' onChange={(e) => handleChange(e)} className='outline-none p-2 w-full' type="text" name="title" />
                    </div>
                    <div className='w-full md:w-1/2'>
                        {!urlValid &&
                            <p>URL is Invalid</p>
                        }
                        <input style={{ background: '#1e1e1e' }} placeholder='Link (link to blog or tg post) -> (optional)' onChange={(e) => handleChange(e)} className=' outline-none p-2 w-full' width={200} type="text" name="link" />
                    </div>
                    <div className='w-full md:w-1/2'>
                        <textarea style={{ background: '#1e1e1e' }} placeholder='text' onChange={(e) => handleChange(e)} className='w-full h-20 outline-none p-2' name="text" />
                    </div>
                    <p className='w-full md:w-1/2 text-xs text-center text-gray-300'>Leave url blank to submit a question for discussion. If there is a url, text is optional.</p>
                    <button type="submit" className='py-2 px-2 bg-green-700 border border-dashed border-gray-700 ' onClick={Post}>Create Post</button>
                    {loading &&
                        <p>Loading...</p>
                    }
                </div>
            </div>
        </div>
    )
}
