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
                <div className="terminal-container  ">
                    <div className="terminal-prompt">
                        <span className="prompt-text">user@eacc.et-mikiyas:~$</span>
                        <input
                            className="terminal-input"
                            type="text"
                        />
                    </div>
                </div>
            </div>


        </div>

    );
};

export default Navbar;