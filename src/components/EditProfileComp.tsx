"use client"
import { useUserContext } from '@/context/user'
import { createClient } from '@/utils/supabase/client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import ContentContainer from './ContentContainer'

export default function EditProfileComp() {

    const [OldData, setOldData] = useState({} as any)
    const [newUsername, setNewUsername] = useState('')
    const [newBio, setNewBio] = useState('')
    const [newName, setNewName] = useState('')
    const { profile, setProfile } = useUserContext()
    const [isDuplicate, setIsDuplicate] = useState(false)
    const [invalidUsername, setInvalidUsername] = useState(false)
    const [usernameIsAvailable, setUsernameIsAvailable] = useState(false)
    const [availableUsername, setAvailableUsername] = useState('')
    const { user } = useUserContext()
    const router = useRouter()

    const IsUsernameTaken = async (username: string) => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('profiles')
            .select('username')
            .eq('username', username.toLowerCase())
            .select()
        if (error) {
            console.log(error)
            // (error)
        } else {
            if (data[0]) {
                setIsDuplicate(true)
                setUsernameIsAvailable(false)
                return true
            } else {
                setIsDuplicate(false)
                setAvailableUsername(username)
                setUsernameIsAvailable(true)
                return false
            }
        }
    }

    function isValidUsername(username: string) {
        const regex = /^[a-zA-Z0-9_]{4,15}$/;
        return regex.test(username);
    }

    function handleUserNameChange(username: string) {
        setNewUsername(username)
        // console.log(username)
        // console.log(isValidUsername(username))
        setUsernameIsAvailable(false)
        setInvalidUsername(!isValidUsername(username))
    }

    const updateUsername = async () => {
        const supabase = createClient()

        const { data, error } = await supabase.from('profiles').update({ username: availableUsername }).eq('user_id', profile.user_id).select()
        if (error) {
            console.log(error)
        } else {
            console.log(data)
            setProfile(data[0])
            router.push('/user/' + availableUsername)
        }
    }

    const updateProfile = async () => {

        // chekc if user changed username
        const supabase = createClient()
        const { data, error } = await supabase
            .from('profiles')
            .update({ name: newName, about: newBio })
            .eq("user_id", profile.user_id)
            .select('*')
        if (error) {
            console.log(error)
        } else {
            console.log(data)
            setProfile(data[0])
            router.push('/user/' + profile.username)
        }
    }
    useEffect(() => {

        if (profile != null) {
            setOldData({ name: profile.name, username: profile.username, about: profile.about })
            setNewBio(profile.about)
            setNewName(profile.name)
            setNewUsername(profile.username)
        }

    }, [profile])
    if (profile == null) {
        return (
            <div className="flex flex-col items-center justify-center lg:mx-44">
                <ContentContainer tailwindstyle='' styles={{}}>
                    Loading...
                </ContentContainer>
            </div>
        )
    }

    return (
        <div>
            <div className='flex ' >
                <div className='flex self-center flex-col items-center justify-center w-full lg:mx-44  ' >
                    <ContentContainer styles={{ minHeight: "55vh", }} tailwindstyle='justify-center '>
                        <div className=' my-2 w-full items-center px-4 md:px-1 justify-center flex flex-col gap-2'>
                            {/* <p className='text-xs text-opacity-50 text-white'>changing username is paused</p> */}
                            {isDuplicate == false && usernameIsAvailable && newUsername == availableUsername &&
                                <p>its available 🎊</p>
                            }
                            {user.app_metadata.provider == 'github'
                                ? <div className='w-full md:w-1/2 flex'>
                                    <input value={newUsername} onChange={(e) => handleUserNameChange(e.target.value)} placeholder='Username' className={`outline-none ${isDuplicate ? 'border border-yellow-400 border-opacity-40' : ''}  p-2 flex w-full bg-input ${invalidUsername ? 'border border-red-400' : ''}`} width={200} type="text" name="username" />
                                    {newUsername != OldData.username && !invalidUsername && !usernameIsAvailable &&
                                        <button onClick={() => IsUsernameTaken(newUsername)} className='py-1 px-2 bg-gray-200  bg-opacity-10 hover:bg-opacity-20 border-white border-2 border-opacity-10'>check</button>
                                    }
                                    {isDuplicate == false && usernameIsAvailable && newUsername == availableUsername &&
                                        <button onClick={updateUsername} className='py-1 px-2 bg-gray-200  bg-opacity-10 hover:bg-opacity-20 border-green-300  border-2 border-opacity-10'>claim</button>
                                    }
                                </div>
                                : <div>
                                    <p className='text-xs text-gray-200 mb-3'>Only Users that logged in through github can change their usernames</p>
                                    <input disabled defaultValue={OldData.username} className={`outline-none  p-2 flex w-full bg-input bg-opacity-60 text-gray-300`} width={200} type="text" name="username" />
                                </div>
                            }

                            <div className='w-full mt-6 md:w-1/2 '>
                                <input value={newName} placeholder='Name' onChange={(e) => setNewName(e.target.value)} className='outline-none p-2 w-full  bg-input' type="text" name="name" />
                            </div>
                            <div className='w-full md:w-1/2'>
                                <textarea value={newBio} placeholder='bio' onChange={(e) => setNewBio(e.target.value)} className='w-full h-20 outline-none p-2  bg-input' name="about" />
                            </div>
                            <div className='flex'>
                                <button onClick={updateProfile} className='py-2 px-2 bg-gray-200  bg-opacity-10 hover:bg-opacity-20 border-black border-2 border-opacity-40 ' >Update Profile</button>
                                <Link href={'/user/' + profile.username}>
                                    <button className='py-2 px-2 bg-gray-200  bg-opacity-10 hover:bg-opacity-20 border-black border-2 border-opacity-40'>View Profile</button>
                                </Link>
                            </div>
                        </div>
                    </ContentContainer>
                </div>
            </div>
        </div>
    )
}
