"use client"
import { useUserContext } from "@/context/user"
import { supabase } from "@/libs/supabase"
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
    const { createUser, createNewProfile } = useUserContext()
    const router = useRouter()

    const signInWithGithub = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'github'
        })

        // (data, error)
    }

    // create a function that validates the username doesn't contain any symbols other than _ and is a valid username that also doesnt' start with a number also make sure the password is validated with the standards 
    // also return a message saying invalid username or invalid password 
    const validateForm = () => {
        const regex = /^[a-zA-Z0-9_]*$/
        if (username.length < 3) {
            return 'username must be at least 3 characters long'
        }
        if (password.length < 6) {
            return 'password must be at least 6 characters long'
        }

        if (!regex.test(username)) {
            return 'username must only contain letters, numbers and _'
        }
        if (username[0].match(/[0-9]/)) {
            return 'username must start with a letter'
        }

        return 'valid'

    }

    const handleLogin = async () => {
        const validation = validateForm()
        if (validation !== 'valid') {
            setErorMsg(validation)
            setError(true)
            return
        } else {
            setError(false)
            setErorMsg('')
        }
        const tempMail = username + '@eacc.et'
        const login = await supabase.auth.signInWithPassword({
            password: password,
            email: tempMail
        })
        if (login.error) {
            setError(true)
            setErorMsg('invalid username or password')
            // (login.error)
        } else {

            window.location.reload()
            // (login.data)
        }

    }

    const handleSignup = () => {
        const resp = createUser(username, password).then((resp: any) => {
            // (resp)
            if (resp === "username taken") {
                setUsernameTaken(true)
            }
            if (resp === "sign up success") {
                // create a profile for the user
                window.location.reload()
            }
        })
    }
    return (
        // craete a login page

        <div className="flex items-center justify-center flex-col mt-10" style={{ width: '100%' }}>
            <div className="flex items-center gap-1 mt-3 justify-center flex-col">
                {/* make this input only accept lowercase */}

                <input style={{ background: '#1e1e1e' }} type="text" className={usernameTaken ? 'border border-red-500 px-2 py-2 outline-none' : `px-2 py-2 outline-none`} onChange={(e) => setUsername(e.currentTarget.value.toLowerCase())} placeholder="username" />
                {usernameTaken &&
                    <p className="text-sm text-gray-400">username already exists</p>
                }

                <input style={{ background: '#1e1e1e' }} type='password' className="px-2 py-2 outline-none" onChange={(e) => setPassword(e.currentTarget.value)} placeholder="password" />
                <button onClick={() => handleSignup()} className="px-3 py-1 mt-1 flex gap-2 border border-dashed border-green-700">Signup</button>
            </div>
            <div className="flex  items-center gap-1 mt-3 justify-center flex-col">
                {error &&
                    <p className="text-sm text-gray-400">{errorMsg}</p>
                }
                <input style={{ background: '#1e1e1e' }} type="text" className="px-2 py-2 outline-none" onChange={(e) => setUsername(e.currentTarget.value.toLowerCase())} placeholder="username" />
                <input style={{ background: '#1e1e1e' }} type='password' className="px-2 py-2 outline-none" onChange={(e) => setPassword(e.currentTarget.value)} placeholder="password" />
                <button onClick={() => handleLogin()} className='px-3 py-1 mt-1 flex gap-2 border border-dashed border-green-700'>Login</button>
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