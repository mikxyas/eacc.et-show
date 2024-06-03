import { usePostsContext } from '@/context/posts'
import { MessageCircle, MessageCircleDashed, MessageCircleOff, MessageCircleX, X, Zap } from 'lucide-react'
import React, { useEffect } from 'react'

export default function ReplyInput({ post_id, parent_id, showReply, toggleReply }: any) {
    // const [showReply, setShowReply] = React.useState(false)
    const [reply, setReply] = React.useState('')
    const { sendReply } = usePostsContext()

    const Send_Reply = async () => {
        const formdata = new FormData()
        formdata.append('content', reply)
        formdata.append('post', post_id)
        formdata.append('parent', parent_id)
        await sendReply(formdata)
        if (parent_id != null) {
            toggleReply()
        }
        setReply('')
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
                    <textarea style={{ background: '#1e1e1e' }} value={reply} onChange={(e) => setReply(e.target.value)} className=' h-20  p-2 outline-none caret-green-500 ' placeholder='write your reply'></textarea>
                    <div className='gap-1 self-end'>
                        {parent_id !== null &&
                            <button onClick={toggleReply} className=' bg-gray-700 md:self-start self-end  text-white px-2 py-1  mb-3  rounded-none cursor-pointer'>cancel</button>
                        }
                        <button disabled={reply.length == 0} onClick={Send_Reply} className=' bg-green-700 md:self-start self-end  text-white px-2 py-1  mb-3  rounded-none cursor-pointer '>send</button>


                    </div>
                </div>
            }
        </div >
    )
}
