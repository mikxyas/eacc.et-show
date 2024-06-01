import { usePostsContext } from '@/context/posts'
import { Zap } from 'lucide-react'
import React, { useEffect } from 'react'

export default function ReplyInput({ post_id, parent_id }: any) {
    const [showReply, setShowReply] = React.useState(false)
    const [reply, setReply] = React.useState('')
    const { sendReply } = usePostsContext()

    const Send_Reply = async () => {
        const formdata = new FormData()
        formdata.append('content', reply)
        formdata.append('post', post_id)
        formdata.append('parent', parent_id)
        await sendReply(formdata)
        // fetch('/api/comment/new', {
        //     method: 'POST',
        //     body: formdata
        // }
        // ).then(res => res.json()).then(data => {
        //     console.log(data)
        // })
    }

    useEffect(() => {
        parent_id === null && setShowReply(true)
    }, [])

    return (
        <div className=' w-full' style={{ fontSize: '9pt' }}>
            {parent_id != null &&
                <button className='underline ' onClick={() => setShowReply(!showReply)}>
                    {showReply
                        ? 'hide'
                        : 'reply'
                    }
                </button>
            }

            {
                showReply == true
                && <div style={{ width: '90%' }} className='mt-2 flex flex-col '>
                    <textarea value={reply} onChange={(e) => setReply(e.target.value)} className=' h-20  p-2 outline-none caret-green-500 ' placeholder='write your reply'></textarea>
                    <button disabled={reply.length == 0} onClick={Send_Reply} className=' bg-green-700 md:self-start self-end  text-white px-2 py-1  mb-3  rounded-none '>send</button>
                </div>
            }
        </div >
    )
}
