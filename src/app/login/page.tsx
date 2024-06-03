import TelegramLoginButton from "@/components/TelegramLoginButton"

// import { login, signup } from './actions'
const LoginPage = () => {

    return (
        // craete a login page

        <div className="flex items-center justify-center flex-col mt-10" style={{ width: '100%' }}>
            {/* <TelegramLoginButton /> */}
            {/* <div className="grid" style={{ background: 'green', width: '200px', padding: '10px' }}>
                <form action="/auth/login" method="post">
                    <label htmlFor="email">Email</label>
                    <input name='email' type="text" placeholder="Email" />
                    <label htmlFor="password">Password</label>
                    <input name='password' type="password" placeholder="Password" />
                    <button style={{ marginRight: '5px' }}>Login</button>
                </form>
            </div>
            <div className="grid" style={{ background: 'green', width: '200px', padding: '10px' }}>
                <form action="/auth/signup" method="post">
                    <label htmlFor="email">Email</label>
                    <input name='email' type="text" placeholder="Email" />
                    <label htmlFor="password">Password</label>
                    <input name='password' type="password" placeholder="Password" />
                    <button style={{ marginRight: '5px' }}>Signup</button>
                </form>
            </div> */}
            {/* <div className="grid" style={{ background: 'green', width: '200px', padding: '10px' }}>
                <form method="post" action="/auth/signup">
                    <input name='email'  type="text" placeholder="Email" />
                    <input name='password'  type="password" placeholder="Password" />
                    <button style={{ marginRight: '5px' }} >Sign up</button>
                </form>
            </div> */}
        </div>
    )

}



export default LoginPage