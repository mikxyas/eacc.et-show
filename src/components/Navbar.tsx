import Link from 'next/link';
import React from 'react';

const Navbar: React.FC = () => {
    return (
        <div className=' flex-col '>
            <div className='flex flex-col '>
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', lineHeight: '1.2', color: 'green', }}>
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
                <div className="terminal-container  flex">
                    <div className="terminal-prompt">
                        <span className="prompt-text">user@eacc.et-mikiyas:~$</span>

                    </div>
                    <div className=' gap-3 flex'>
                        <Link href='/'>
                            <button className='hover:bg-green-700 hover:text-gray-50 hover:pl-1 pl-1 pr-1'>home</button>

                        </Link>
                        <button className='hover:bg-green-700 hover:text-gray-50 hover:pl-1 pr-1 pl-1'>about</button>
                        <button className='hover:bg-green-700 hover:text-gray-50 hover:pl-1 pr-1 pl-1'>help</button>
                    </div>
                </div>
            </div>


        </div>

    );
};

export default Navbar;