import { useUserContext } from '@/context/user'
import Link from 'next/link'
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
export default function TelegramProfileCard() {
    const {telegramProfile, profile, setTelegramProfile, getProfile} = useUserContext()
    const [showDisconnect, setShowDisconnect] = useState(false);

    async function deleteTelegramProfile() {
        const supabase = createClient();
       const {error} = await  supabase.from('telegram_profiles').delete().eq('user_id', profile.user_id)
       if(error){
           console.log(error)
       }else{
        setShowDisconnect(false)
        getProfile(profile.user_id)
        // window.location.reload()
       } 
    }

    if(!telegramProfile){
        return
    }

  return (
    <div className='w-full md:w-5/12'>
        <div  className='border font-sans w-full border-white border-opacity-20 py-2'>
            <div className='w-full flex flex-col px-3'>
                <div className='flex flex-col items-start'>
                    <p className='text-white text-opacity-70 text-base '>{telegramProfile.first_name + ' '+ telegramProfile.last_name} </p>
                    <p className='text-white text-opacity-70 text-base '>@{telegramProfile.tg_username}</p>
                </div>
                {profile.user_id == telegramProfile.user_id 
                ?   <button  className='py-2 px-2 bg-gray-200  w-full  bg-opacity-10 hover:bg-opacity-20 border-red-400 mt-2 border-2 border-opacity-40 text-white text-opacity-70' onClick={() => setShowDisconnect(true)}>disconnect account</button>
                    :<Link href={"https://t.me/"+ telegramProfile.tg_username} target='__blank'>
                    <button  className='py-2 px-2 bg-gray-200  w-full  bg-opacity-10 hover:bg-opacity-20 mt-2 border-black border-2 border-opacity-40  text-white text-opacity-70'>say hi on telegram</button>
                    </Link>
            }
                {/* </div> */}
                {showDisconnect &&
                    <div>
                    <div className='mt-1  flex items-end flex-col'>
                            <p className=' text-base text-white text-opacity-70'>sure you wanna disconnect?</p>
                            <div className='self-end'>
                                <button onClick={() => deleteTelegramProfile()} className=' bg-gray-200  bg-opacity-10 hover:bg-opacity-20 border-black border-2 border-opacity-40  px-2 py-1 text-base'>yes</button>
                                <button onClick={() => setShowDisconnect(false)} className=' bg-gray-200  bg-opacity-10 hover:bg-opacity-20 border-black border-2 border-opacity-40 py-1 px-2 text-base'>cancel</button>
                            </div>
                        </div>
                    </div>
                }
            </div>  
        </div>
    </div>
  )
}
