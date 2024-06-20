"use client"

import { useUserContext } from '@/context/user';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';


import React, { Suspense, useEffect, useLayoutEffect } from 'react';

const Navbar: React.FC = () => {

    const { user, profile, logout } = useUserContext()



    const logoutUser = async () => {
        // const { error } = await supabase.auth.signOut();
        // if (error) // ('Error logging out:', error.message)
        await logout()
        window.location.reload()
        // refresh the page
    }

    return (
        <div className=' '>
            <div style={{ background: '#2d2d2d' }} className='flex border border-white border-opacity-light border-b-0 px-2 lg:mx-44 flex-col justify-center items-start lg:mt-3'>

                <div className=" text-white  py-1  font-mono w-full   text-sm flex flex-col md:flex-row">

                    <div className=' gap-3 flex '>
                        <Link href='/'>
                            <button className='hover:underline hover:text-gray-50 hover:pl-1 pl-1 pr-1'>home</button>
                        </Link>
                        {user != null
                            ? <Link href='/post/new'>
                                <button className='hover:underline hover:text-gray-50 hover:pl-1 pr-1 pl-1'>submit</button>
                            </Link>
                            : <Link href='/login'>
                                <button className='hover:underline hover:text-gray-50 hover:pl-1 pr-1 pl-1'>submit</button>
                            </Link>
                        }

                        {user != null
                            ?
                            <div className='flex items-center'>
                                <div className='flex items-center self-end'>
                                    <Link href='/user/profile'>
                                        <button className='hover:underline hover:text-gray-50 hover:pl-1 pr-1 pl-1'>{!profile?.username ? 'profile' : profile?.username}</button>
                                    </Link>
                                    |
                                </div>
                                <button onClick={logoutUser} className='hover:underline hover:text-gray-50 hover:pl-1 pr-1 pl-1'>logout</button>
                            </div>
                            :
                            <Link href='/login'>
                                <button className='hover:underline hover:text-gray-50 hover:pl-1 pr-1 pl-1'>login</button>
                            </Link>
                        }

                    </div>

                </div>
            </div>


        </div>

    );
};

export default Navbar;