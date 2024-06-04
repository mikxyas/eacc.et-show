"use client"
import { useUserContext } from "@/context/user"
import { supabase } from "@/libs/supabase"
import { Github } from "lucide-react"
import { useState } from "react"

// import { login, signup } from './actions'
const LoginPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [usernameTaken, setUsernameTaken] = useState(false)

    const { createUser } = useUserContext()

    const signInWithGithub = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'github'
        })
        console.log(data, error)
    }

    const handleSignup = () => {
        const resp = createUser(username, password).then((resp: any) => {
            console.log(resp)
            if (resp === "username taken") {
                setUsernameTaken(true)
            }
            if (resp === "sign up success") {
                window.location.reload()
            }
        })
    }
    return (
        // craete a login page

        <div className="flex items-center justify-center flex-col mt-10" style={{ width: '100%' }}>
            <div className="flex items-center gap-1 mt-3 justify-center flex-col">
                <input style={{ background: '#1e1e1e' }} type="text" className={usernameTaken ? 'border border-red-500 px-2 py-2 outline-none' : `px-2 py-2 outline-none`} onChange={(e) => setUsername(e.currentTarget.value)} placeholder="username" />
                {usernameTaken &&
                    <p className="text-sm text-gray-400">username already exists</p>
                }

                <input style={{ background: '#1e1e1e' }} type='password' className="px-2 py-2 outline-none" onChange={(e) => setPassword(e.currentTarget.value)} placeholder="password" />
                <button onClick={() => handleSignup()} className="px-3 py-1 mt-1 flex gap-2 border border-dashed border-green-700">Signup</button>
            </div>
            <div className="flex  items-center gap-1 mt-3 justify-center flex-col">
                <input style={{ background: '#1e1e1e' }} type="text" className="px-2 py-2 outline-none" onChange={(e) => setUsername(e.currentTarget.value)} placeholder="username" />
                <input style={{ background: '#1e1e1e' }} type='password' className="px-2 py-2 outline-none" onChange={(e) => setPassword(e.currentTarget.value)} placeholder="password" />
                <button className='px-3 py-1 mt-1 flex gap-2 border border-dashed border-green-700'>Login</button>
            </div>

            <button onClick={signInWithGithub} style={{ background: '#1e1e1e' }} className="
            px-3 
            py-1
            mt-7
            flex 
            gap-2
            border border-dashed border-gray-700
            ">
                Login With Github <Github />
            </button>
        </div >
    )

}



export default LoginPage