import { Zap } from 'lucide-react'
import React from 'react'

export default function ReplyInput({ post_id, parent_id }) {
    const [showReply, setShowReply] = React.useState(false)
    const [reply, setReply] = React.useState('')

    const sendReply = () => {
        const formdata = new FormData()
        formdata.append('content', reply)
        formdata.append('post', post_id)
        formdata.append('parent', parent_id)
        fetch('/api/comment/new', {
            method: 'POST',
            body: formdata
        }
        ).then(res => res.json()).then(data => {
            console.log(data)
        })
    }

    return (
        <div style={{ fontSize: '9pt' }}>
            <button className='underline' onClick={() => setShowReply(!showReply)}>
                {showReply
                    ? 'hide'
                    : 'reply'
                }
            </button>
            {showReply
                && <div className='mt-1'>
                    <textarea value={reply} onChange={(e) => setReply(e.target.value)} className='w-full h-20 p-2 outline-none caret-green-500 ' placeholder='write your reply'></textarea>
                    <button onClick={sendReply} className='bg-green-600 text-white rounded-md px-2 py-1'>reply</button>
                </div>
            }
        </div>
    )
}
