import { usePostsContext } from '@/context/posts'
import { MessageCircle, MessageCircleDashed, MessageCircleOff, MessageCircleX, X, Zap } from 'lucide-react'
import React, { useEffect } from 'react'

export default function ReplyInput({ post_id, parent_id, showReply, toggleReply }: any) {
    // const [showReply, setShowReply] = React.useState(false)
    const [reply, setReply] = React.useState('')
    const { sendReply } = usePostsContext()
    const [replying, setReplying] = React.useState(false)

    const Send_Reply = async () => {
        setReplying(true)
        const formdata = new FormData()
        formdata.append('content', reply)
        formdata.append('post', post_id)
        formdata.append('parent', parent_id)
        await sendReply(formdata)
        if (parent_id != null) {
            toggleReply()
        }
        setReply('')
        setReplying(false)
        // fetch('/api/comment/new', {
        //     method: 'POST',
        //     body: formdata
        // }
        // ).then(res => res.json()).then(data => {
        //     console.log(data)
        // })
    }

    // useEffect(() => {
    //     if (parent_id === null && showReply === false) {
    //         setShowReply(true)
    //     }
    // }, [showReply])

    return (
        <div className='' style={{ fontSize: '9pt' }}>
            {
                showReply == true
                && <div style={{ width: '90%' }} className='mt-2 w-full flex  flex-col '>
                    <textarea style={{ background: '#1e1e1e' }} value={reply} onChange={(e) => setReply(e.target.value)} className=' h-20  p-2 outline-none border-gray-500 border caret-green-500 ' placeholder='write your reply'></textarea>
                    <div className='flex  flex-row justify-between'>
                        <div className='gap-1 mt-2'>
                            {parent_id !== null &&
                                <button onClick={toggleReply} className='text-white px-2 py-1 bg-gray-200 hover:bg-opacity-20 bg-opacity-10 mb-3  rounded-none cursor-pointer border-black border-2 border-opacity-40'>cancel</button>
                            }
                            <button disabled={reply.length == 0} onClick={Send_Reply} className=' bg-gray-200  bg-opacity-10 hover:bg-opacity-20 border-black border-2 border-opacity-40   text-white px-2 py-1  mb-3  rounded-none cursor-pointer '>add comment</button>
                        </div>
                        {replying
                            ? <p className='mt-1'>...sending</p>
                            : <p></p>
                        }
                    </div>
                </div>
            }
        </div >
    )
}
