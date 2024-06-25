"use client"

import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { create_post as add_post } from '@/functions/posts'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import ContentContainer from './ContentContainer'

export default function CreatePostForm() {

    const [urlValid, setUrlValid] = useState(true)
    const [emptyInput, setEmptyInput] = useState(false)
    const [linkPostEmpty, setLinkPostEmpty] = useState(false)
    const [textPostEmpty, setTextPostEmpty] = useState(false)
    const [loading, setLoading] = useState(false)
    const [hackerlink, setHackerlink] = useState('')
    const [hackerLinkError, setHackerLinkError] = useState(false)
    const [linkError, setLinkError] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [title, setTitle] = useState('')
    const [link, setLink] = useState('')
    const [text, setText] = useState('')
    const router = useRouter()

    const client = useQueryClient()
    const create_post = useMutation({
        mutationFn: (data: any) => {
            return add_post(data)
        },
        onSuccess: (data) => {
            client.invalidateQueries({ queryKey: ['posts'] })
            router.push('/post/' + data.id)
        }
    })

    const isHackerNewsLink = (url: any) => {
        try {
            const parsedUrl = new URL(url);
            const hostname = parsedUrl.hostname;
            const pathname = parsedUrl.pathname;
            // Check if the hostname is news.ycombinator.com
            if (hostname === 'news.ycombinator.com') {
                // Check if the pathname starts with /item (common pattern for post links)
                console.log(pathname.startsWith('/item'))
                return pathname.startsWith('/item');
            } else {
                console.log('Invalid Hacker News URL');
                return false;
            }

        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const handleLink = (e: any) => {
        if (e.target.value == '') {
            setLinkError(false);
            setLink(e.target.value);
            return
        }
        setLink(e.target.value);
        if (isValidUrl(e.target.value)) {
            setLinkError(false);
        } else {
            setLinkError(true);
            setErrorMsg('Invalid URL');
        }
    }

    const handleTitle = (e: any) => {
        // if title is empty, set error to true and also let title be more than 7 characters and less than 80 characters
        // if (e.target.value.length < 7 || e.target.value.length > 80) {
        //     setEmptyInput(true)
        // } else {
        //     setEmptyInput(false)
        // }
        setTitle(e.target.value)
    }

    const handleHackerLink = (e: any) => {
        if (e.target.value == '') {
            setHackerLinkError(false);
            setHackerlink(e.target.value);
            return
        }
        setHackerLinkError(e.target.value);
        if (isHackerNewsLink(e.target.value)) {
            setHackerLinkError(false);
            setHackerlink(e.target.value);
        } else {
            setHackerLinkError(true);
            setHackerlink(e.target.value);
            setErrorMsg('Invalid Hacker News URL');
        }
    }

    // create a function that validates the link and checks if its a real link or not
    function isValidUrl(string: any) {
        const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        const domainPattern = new RegExp('\\.[a-z]{2,}$', 'i'); // check for valid domain extension
        const isValid = pattern.test(string) && domainPattern.test(string.split('/')[2]);
        setUrlValid(isValid);
        return isValid;
    }


    const Post = async () => {
        setLoading(true)
        setEmptyInput(false)
        setLinkPostEmpty(false)
        setTextPostEmpty(false)
        if (title.length < 3 || title.length > 80) {
            setEmptyInput(true)
            setLoading(false)
            return
        }

        if (link == '' && text == '') {
            setLinkPostEmpty(true)
            setTextPostEmpty(true)
            setLoading(false)
            return
        }

        const formDataToSend = {
            title: title,
            link: link,
            text: text,
            hackerlink: hackerlink
        }
        // const actualFormData = new FormData()
        // actualFormData.append('title', title)
        // actualFormData.append('link', link)
        // actualFormData.append('text', text)
        // actualFormData.append('hackerlink', hackerlink)
        create_post.mutate(formDataToSend)
    }


    return (
        <div className='flex'>

            <div className='flex self-center flex-col  justify-center items-start  w-full lg:mx-44  ' >
                {/* <p className='px-4 font-mono w-full md:w-1/2'>submit high quality content that inspires insightful discussion and learning</p> */}
                <ContentContainer styles={{ minHeight: '80vh' }} tailwindstyle='justify-center items-center'>
                    <div className='mx-4 my-2 w-full items-center px-4 md:px-1 justify-center flex flex-col gap-2'>
                        {emptyInput &&
                            <p className='text-sm'>Invalid Title</p>
                        }
                        {linkPostEmpty && textPostEmpty &&
                            <p className='text-sm'>Link or Text cannot be empty. Submit either a link post or a text post</p>
                        }
                        <div className='w-full md:w-1/2 '>
                            <input placeholder='Title' onChange={(e) => handleTitle(e)} value={title} className='outline-none p-2 bg-input w-full' type="text" name="title" />
                        </div>
                        <div className='w-full md:w-1/2'>
                            {linkError &&
                                <p className='text-red-500 text-xs'
                                >URL is Invalid</p>
                            }
                            <input placeholder='Link (link to blog or tg post) -> (optional)' onChange={(e) => handleLink(e)} value={link} className={`outline-none bg-input p-2 w-full ${linkError ? 'border border-red-500' : ''}`} width={200} type="text" name="link" />
                        </div>
                        <div className='w-full md:w-1/2'>
                            {hackerLinkError &&
                                <p
                                    className='text-red-500 text-xs'
                                >{errorMsg}</p>
                            }
                            <input placeholder='Link to post on hacker news' onChange={(e) => handleHackerLink(e)} value={hackerlink} className={`outline-none p-2 bg-input w-full  ${hackerLinkError ? 'border border-red-500' : ''}`} width={200} type="text" name="link" />
                        </div>
                        {/* <div className='w-full md:w-1/2'>
                        {!urlValid &&
                            <p>URL is Invalid</p>
                        }
                        <input style={{ background: '#1e1e1e' }} placeholder='Link (link to blog or tg post) -> (optional)' onChange={(e) => handleChange(e)} className=' outline-none p-2 w-full' width={200} type="text" name="link" />
                    </div> */}
                        <div className='w-full md:w-1/2'>
                            <textarea placeholder='text' onChange={(e) => setText(e.target.value)} className='w-full lg:h-20 h-40 bg-input outline-none p-2' name="text" />
                        </div>
                        <p className='w-full md:w-1/2 text-xs text-center text-gray-300'>Leave url blank to submit a question for discussion. If there is a url, text is optional.</p>
                        {create_post.isPending &&
                            <p>creating post...</p>
                        }
                        <button type="submit" className='py-2 mt-4 w-6/12 px-2  bg-gray-200  bg-opacity-10 hover:bg-opacity-20 border-black border-2 border-opacity-40 ' onClick={Post}>create post</button>

                    </div>

                </ContentContainer>

            </div>

        </div>
    )
}
