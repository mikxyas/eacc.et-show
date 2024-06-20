"use client"
import ContentContainer from "@/components/ContentContainer"
import { useUserContext } from "@/context/user"

import { createClient } from "@/utils/supabase/client"
import { Github } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

// import { login, signup } from './actions'
const LoginPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [usernameTaken, setUsernameTaken] = useState(false)
    const [errorMsg, setErorMsg] = useState('')
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const { createUser, createNewProfile } = useUserContext()
    const router = useRouter()

    const signInWithGithub = async () => {
        const supabase = createClient();

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'github'
        })

        // (data, error)
    }


    function isValidUsername(username: string) {
        const regex = /^[a-zA-Z0-9_]{4,20}$/;
        return regex.test(username);
    }

    function isValidPassword(password: string) {
        const passwordRegex = /^[A-Za-z\d]{6,20}$/;
        return passwordRegex.test(password);
    }

    // Example usage      
    const validateForm = () => {
        if (!isValidUsername(username)) {
            return 'invalid username'
        }
        if (!isValidPassword(password)) {
            return 'invalid password'
        }
        return 'valid'
    }

    const handleLogin = async () => {
        const supabase = createClient();

        setLoading(true)
        const validation = validateForm()
        if (validation !== 'valid') {
            setErorMsg(validation)
            setLoading(false)
            setError(true)
            return
        } else {
            setLoading(false)
            setError(false)
            setErorMsg('')
        }
        const tempMail = username + '@eacc.et'
        const login = await supabase.auth.signInWithPassword({
            password: password,
            email: tempMail
        })
        if (login.error) {
            setLoading(false)
            setError(true)
            setErorMsg('invalid username or password')
            console.log(login.error)
        } else {
            setLoading(false)
            window.location.reload()

        }
    }

    const handleSignup = () => {
        setLoading(true)

        const validation = validateForm()
        if (validation !== 'valid') {
            setErorMsg(validation)
            setError(true)
            setLoading(false)
            return
        } else {
            setError(false)
            setLoading(false)
            setErorMsg('')
        }
        const resp = createUser(username, password).then((resp: any) => {
            // (resp)
            if (resp === "username taken") {
                setLoading(false)
                setUsernameTaken(true)
            }
            if (resp === "sign up success") {
                setLoading(false)
                // create a profile for the user
                window.location.reload()
            }
        })
    }
    return (
        // craete a login page
        <div className="flex lg:mx-44">
            <ContentContainer styles={{ minHeight: '55vh' }} tailwindstyle="">

                <div className="flex items-center justify-center flex-col " style={{ width: '100%' }}>
                    {
                        loading &&
                        <p className="text-sm text-gray-400">loading...</p>
                    }
                    {error &&
                        <p className="text-sm text-gray-400">{errorMsg}</p>
                    }
                    <div className="flex items-center gap-2 mt-3 justify-center flex-col">
                        {/* make this input only accept lowercase */}
                        <input type="text" className={`${usernameTaken ? "border border-red-500" : ''} bg-input px-2 py-2 outline-none`} onChange={(e) => setUsername(e.currentTarget.value)} placeholder="username" />
                        {usernameTaken &&
                            <p className="text-sm text-gray-400">username already exists</p>
                        }
                        <input type='password' className="px-2 py-2 outline-none bg-input" onChange={(e) => setPassword(e.currentTarget.value)} placeholder="password" />
                        <button onClick={() => handleSignup()} className=' bg-gray-200  bg-opacity-10 hover:bg-opacity-20 w-full border-white border-2  hover:border-opacity-20 border-opacity-10  text-white px-2 py-1  mb-3  rounded-none cursor-pointer '>sign up</button>

                        {/* <button className="px-3 py-1 mt-1 flex gap-2">Signup</button> */}
                    </div>

                    <div className="flex  items-center  gap-2 mt-3 justify-center flex-col">

                        <input type="text" className="px-2 py-2 bg-input outline-none" onChange={(e) => setUsername(e.currentTarget.value)} placeholder="username" />
                        <input type='password' className="px-2 bg-input py-2 outline-none" onChange={(e) => setPassword(e.currentTarget.value)} placeholder="password" />
                        <button onClick={() => handleLogin()} className=' bg-gray-200 w-full  bg-opacity-10 hover:bg-opacity-20 border-white border-2  hover:border-opacity-20 border-opacity-10  text-white px-2 py-1  mb-3  rounded-none cursor-pointer '>login</button>
                        {/* <button onClick={() => handleLogin()} className='px-3 py-1 mt-1 flex gap-2 border border-dashed border-green-700'></button> */}
                        <button onClick={signInWithGithub} className=' bg-gray-200 w-full  flex justify-between  bg-opacity-10 hover:bg-opacity-20 border-white border-2  hover:border-opacity-20 border-opacity-10  text-gray-300 px-2 py-1  mb-3  rounded-none cursor-pointer '> <Github /> login with github </button>

                    </div>
                </div >
            </ContentContainer>
        </div>
    )

}



export default LoginPage