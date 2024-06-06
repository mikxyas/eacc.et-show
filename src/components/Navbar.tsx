"use client"

import { useUserContext } from '@/context/user';
import useTelegramLogin from '@/hooks/useTelegramLogin';
import { supabase } from '@/libs/supabase';
import { Bell, Reply } from 'lucide-react';
import Link from 'next/link';

import React, { useEffect, useLayoutEffect } from 'react';

const Navbar: React.FC = () => {

    const { user, profile, logout } = useUserContext()


    const logoutUser = async () => {
        // const { error } = await supabase.auth.signOut();
        // if (error) console.log('Error logging out:', error.message)
        await logout()
        window.location.reload()
        // refresh the page
    }

    return (
        <div className=' '>
            <div className='flex flex-col justify-center items-center mt-5'>
                <pre className=' text-4xs hidden md:flex md:text-3xs whitespace-pre' style={{ fontFamily: 'monospace', lineHeight: '1.2', color: 'green', wordSpacing: 'normal' }}>
                    {`
███████╗██╗  ██╗ ██████╗ ██╗    ██╗   ███████╗    ██╗ █████╗  ██████╗ ██████╗   ███████╗████████╗
██╔════╝██║  ██║██╔═══██╗██║    ██║   ██╔════╝   ██╔╝██╔══██╗██╔════╝██╔════╝   ██╔════╝╚══██╔══╝
███████╗███████║██║   ██║██║ █╗ ██║   █████╗    ██╔╝ ███████║██║     ██║        █████╗     ██║    
╚════██║██╔══██║██║   ██║██║███╗██║   ██╔══╝   ██╔╝  ██╔══██║██║     ██║        ██╔══╝     ██║   
███████║██║  ██║╚██████╔╝╚███╔███╔╝██╗███████╗██╔╝   ██║  ██║╚██████╗╚██████╗██╗███████╗   ██║   
╚══════╝╚═╝  ╚═╝ ╚═════╝  ╚══╝╚══╝ ╚═╝╚══════╝╚═╝    ╚═╝  ╚═╝ ╚═════╝ ╚═════╝╚═╝╚══════╝   ╚═╝
                    `}
                </pre>
                {/* <div className='flex w-full'>
                    <p className='self-start text-green-700 font-mono font-bold w-auto'></p>
                    <input className='bg-gray-900 text-green-700 font-mono font-bold p-2 pl-4 w-auto' type="text" placeholder="Type your command here" />
                </div> */}
                <div className="terminal-container justify-center items-center flex flex-col md:flex-row">
                    {/* <div className="terminal-prompt">
                        <span className="prompt-text">user@eacc.et-mikiyas:~$</span>
                    </div> */}
                    <div className=' gap-3 flex'>
                        <Link href='/'>
                            <button className='hover:bg-green-700 hover:text-gray-50 hover:pl-1 pl-1 pr-1'>home</button>
                        </Link>
                        {user != null
                            ? <Link href='/post/new'>
                                <button className='hover:bg-green-700 hover:text-gray-50 hover:pl-1 pr-1 pl-1'>submit</button>
                            </Link>
                            : <Link href='/login'>
                                <button className='hover:bg-green-700 hover:text-gray-50 hover:pl-1 pr-1 pl-1'>submit</button>
                            </Link>
                        }

                        {user != null
                            ?
                            <div className='flex items-center'>
                                <div className='flex items-center self-end'>
                                    <Link href='/user/profile'>
                                        <button className='hover:bg-green-700 hover:text-gray-50 hover:pl-1 pr-1 pl-1'>{profile?.username.length == 0 ? 'profile' : profile?.username}</button>
                                    </Link>
                                    |
                                </div>

                                <button onClick={logoutUser} className='hover:underline hover:text-gray-50 hover:pl-1 pr-1 pl-1'>logout</button>


                            </div>
                            :
                            <Link href='/login'>
                                <button className='hover:bg-green-700 hover:text-gray-50 hover:pl-1 pr-1 pl-1'>login</button>
                            </Link>

                        }

                    </div>
                </div>
            </div>


        </div>

    );
};

export default Navbar;