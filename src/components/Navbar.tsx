"use client"

import { useUserContext } from '@/context/user';
import useTelegramLogin from '@/hooks/useTelegramLogin';
import { supabase } from '@/libs/supabase';
import Link from 'next/link';
import React, { useEffect, useLayoutEffect } from 'react';

const Navbar: React.FC = () => {

    const { user } = useUserContext()
    const signInWithGithub = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'github' })
        console.log(data, error)
    }

    return (
        <div className=' '>
            <div className='flex flex-col justify-center items-center mt-5'>
                <pre className=' text-4xs md:text-3xs' style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', lineHeight: '1.2', color: 'green' }}>
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
                            ? <Link href='auth/logout'>
                                <button className='hover:bg-green-700 hover:text-gray-50 hover:pl-1 pr-1 pl-1'>logout</button>
                            </Link>
                            :
                            <button onClick={signInWithGithub} className='hover:bg-green-700 hover:text-gray-50 hover:pl-1 pr-1 pl-1'>login(github)</button>

                        }

                    </div>
                </div>
            </div>


        </div>

    );
};

export default Navbar;