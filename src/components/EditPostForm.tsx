"use client"

import { useUserContext } from '@/context/user'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import React, { useEffect, useState } from 'react'
import ContentContainer from './ContentContainer'
export default function EditPostForm({ id }: any) {
    const post_id = id
    const [formData, setFormData] = useState({} as any)
    const [urlValid, setUrlValid] = useState(true)
    const [emptyInput, setEmptyInput] = useState(false)
    const [linkPostEmpty, setLinkPostEmpty] = useState(false)
    const [textPostEmpty, setTextPostEmpty] = useState(false)
    const [loading, setLoading] = useState(false)
    const { user } = useUserContext()
    const [postToEdit, setPostToEdit] = useState({} as any)
    const [isNotAllowed, setIsNotAllowed] = useState(false)
    const [title, setTitle] = useState('')
    const [link, setLink] = useState('')
    const [text, setText] = useState('')
    const [hackerlink, setHackerlink] = useState('')
    const [hackerLinkError, setHackerLinkError] = useState(false)
    const [linkError, setLinkError] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [errorEditing, setErrorEditing] = useState(false)

    const router = useRouter()

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
            // If the URL is invalid, return false
            return false;
        }
    };

    const handleLink = (e: any) => {
        const link_value = e.target.value;
        if (isValidUrl(link_value)) {
            setLinkError(false);

            setErrorMsg('');
            setLink(link_value);
        } else {
            setLinkError(true);
            setErrorMsg('Invalid URL');

        }
    }

    const handleHackerLink = (e: any) => {
        const link_value = e.target.value;
        // check if link has any characters 
        if (link_value == '') {
            setHackerLinkError(false);
            setErrorMsg('');
            setHackerlink(link_value);
            return
        }
        if (isHackerNewsLink(link_value)) {
            setHackerLinkError(false);
            setErrorMsg('');
            setHackerlink(link_value);
        } else {
            setHackerlink(link_value);
            setHackerLinkError(true);
            setErrorMsg('Invalid Hacker News link');
        }
    }

    const edit_post = async () => {
        const supabase = createClient()
        setLoading(true)
        setUrlValid(true)
        setEmptyInput(false)
        setLinkPostEmpty(false)
        setTextPostEmpty(false)
        // console.log('title', title)
        // console.log('text', text)
        // console.log('link', link)
        // console.log('hackerlink', hackerlink)
        const { data, error } = await supabase.from('posts').update({ title: title, text: text, link: link, hackerlink: hackerlink }).eq('id', post_id).select('*')
        if (data) {
            router.push('/post/' + post_id)
        } else {
            console.log(error)
            setErrorEditing(true)
        }
        setLoading(false)
    }

    const getPost = async () => {
        const supabase = createClient()

        // use post id and fetch the post data
        const { data, error } = await supabase.from('posts').select('*').eq('id', post_id)
        if (data) {
            // console.log(data)
            // console.log(user)
            if (data[0].creator != user?.id) {
                setIsNotAllowed(true)
            } else {
                setPostToEdit(data[0])
                setTitle(data[0].title)
                setLink(data[0].link)
                setHackerlink(data[0].hackerlink)
                setText(data[0].text)
                setIsNotAllowed(false)
            }
        }
    }


    useEffect(() => {

        // use post id and fetch the post data
        if (user) {
            getPost()
            // setViewedPost(null)
        }
    }, [user])

    if (isNotAllowed) {
        return (
            <div className='flex flex-col items-center justify-center h-screen'>
                <p>this is not your post</p>
            </div>
        )
    }
    return (
        <div>
            <div className='lg:mx-44' >
                <ContentContainer styles={{ minHeight: '80vh' }} tailwindstyle='justify-center'>
                    <div className='flex self-center flex-col items-center justify-center  w-full   ' >
                        {/* <p className='px-4 font-mono w-full md:w-1/2'>submit high quality content that inspires insightful discussion and learning</p> */}
                        {errorEditing &&
                            <p className='text-red-500 text-xs'>Error editing post</p>
                        }
                        <div className='mx-4 my-2 w-full items-center px-4 md:px-1 justify-center flex flex-col gap-2'>
                            {emptyInput &&
                                <p className='text-sm'>Title Cannot be empty</p>
                            }
                            {linkPostEmpty && textPostEmpty &&
                                <p className='text-sm'>Link or Text cannot be empty. Submit either a link post or a text post</p>
                            }
                            <div className='w-full md:w-1/2 '>
                                <input placeholder='Title' onChange={(e) => setTitle(e.target.value)} value={title} className='outline-none bg-input p-2 w-full' type="text" name="title" />
                            </div>
                            <div className='w-full md:w-1/2'>
                                {linkError &&
                                    <p
                                        className='text-red-500 text-xs'
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
                                <input placeholder='Link to post on hacker news' onChange={(e) => handleHackerLink(e)} value={hackerlink} className={`outline-none p-2 w-full bg-input  ${hackerLinkError ? 'border border-red-500' : ''}`} width={200} type="text" name="link" />
                            </div>
                            <div className='w-full md:w-1/2'>
                                <textarea placeholder='text' onChange={(e) => setText(e.target.value)} value={text} className='w-full h-20 bg-input outline-none p-2' name="text" />
                            </div>
                            <p className='w-full md:w-1/2 text-xs text-center text-gray-300'>Leave url blank to submit a question for discussion. If there is a url, text is optional.</p>
                            <button
                                disabled={title == '' || (link == '' && hackerlink == '') && text == '' || linkError || hackerLinkError}
                                type="submit" className='py-2 px-2 bg-gray-200 w-6/12 mt-6  bg-opacity-10 hover:bg-opacity-20 border-black border-2 border-opacity-40  ' onClick={edit_post}>update post</button>
                            {loading &&
                                <p>updating...</p>
                            }
                        </div>
                    </div>
                </ContentContainer>
            </div>t
        </div>
    )
}
