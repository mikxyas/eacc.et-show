import { MessageCircle, MessageCircleDashed, MessageCircleOff, MessageCircleX, X, Zap } from 'lucide-react'
import React, { useEffect } from 'react'
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { create_comment } from '@/functions/comments'

import { createClient } from '@/utils/supabase/client'

export default function ReplyInput({ post_id, parent_id, showReply, toggleReply }: any) {
    // const [showReply, setShowReply] = React.useState(false)
    const [reply, setReply] = React.useState('')
    const [replying, setReplying] = React.useState(false)
    const client = useQueryClient()

    const createComment = useMutation({
        mutationFn: (comment: object) => {
            return create_comment(comment)
        },
        // onMutate: async (comment: object) => {
        //     const prevState: any = client.getQueryData(['post', { id: post_id }])
        //     console.log(prevState)
        //     const newComment = {
        //         ...comment,
        //         temp: true,
        //         children: [],
        //         profiles: {
        //             username: '...sending',
        //             id: 0,
        //         }
        //     }
        //     const updatedComments = [...prevState.comments, newComment]
        //     client.setQueryData(['post', { id: post_id }], { ...prevState, comments: updatedComments })
        //     return prevState
        // },
        onSuccess: (data) => {
            client.invalidateQueries({ queryKey: ['post', { id: post_id }] })
            setReply('')
            if (parent_id !== null) {
                toggleReply()
            }

        }
    })

    const Send_Reply = async () => {
        setReplying(true)
        const supabase = createClient()
        const formdata = new FormData()
        const session = await supabase.auth.getSession()
        const obj = {
            content: reply,
            post: post_id,
            parent: parent_id,
            replier: session.data.session?.user.id
        }

        await createComment.mutate(obj)


    }



    return (
        <div className='' style={{ fontSize: '10pt' }}>
            {
                showReply == true
                && <div className='mt-2 w-full lg:w-reply-pc flex pr-4 flex-col '>
                    <textarea style={{ background: '#1e1e1e' }} value={reply} onChange={(e) => setReply(e.target.value)} className=' h-20  p-2 outline-none border-white border-opacity-10 border-2  ' placeholder='write your reply'></textarea>
                    <div className='flex  flex-row justify-between'>
                        <div className='gap-1 mt-2'>
                            {parent_id !== null &&
                                <button onClick={toggleReply} className='text-white px-2 py-1 bg-gray-200 hover:bg-opacity-20 bg-opacity-10 mb-3  rounded-none cursor-pointer border-black border-2 border-opacity-40'>cancel</button>
                            }
                            <button disabled={reply.length == 0} onClick={Send_Reply} className=' bg-gray-200  bg-opacity-10 hover:bg-opacity-20 border-black border-2 border-opacity-40   text-white px-2 py-1  mb-3  rounded-none cursor-pointer '>add comment</button>
                        </div>
                        {createComment.isPending
                            ? <p className='mt-1'>...sending</p>
                            : <p></p>
                        }
                    </div>
                </div>
            }
        </div >
    )
}
