"use client"

import { createClient } from '@/utils/supabase/client';
import { UUID } from 'crypto';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

// Define the shape of your user context
interface UserContextType {
    user: any | null;
    setUser: (user: any) => void;
    profile: any | null;
    setProfile: (profile: any) => void;
    logout: () => void;
    createUser: (username: string, password: string) => any;
    createNewProfile: (name: string, username: string, email: string, userId: UUID) => any;
    telegramProfile: any | null;
    isTelegramMiniApp: boolean;
    testobj: any,
    getProfile: (user_id: string) => void,
    setTelegramProfile: (s:any) => void
}

// Create the user context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a custom hook to access the user context
export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};

// Create the user provider component
export const UserProvider = ({ children }:
    Readonly<{
        children: React.ReactNode;
    }>
) => {
    const [user, setUser] = useState<any | null>(null);
    const [profile, setProfile] = useState<any | null>(null);
    const [telegramProfile, setTelegramProfile] = useState<any | null>(null);
    const [isTelegramMiniApp, setISTelegramMiniApp] = useState(false)
    const [telegramScriptLoaded, setTelegramScriptLoaded] = useState(false)
    const hasProfileBeenCreated = useRef(false);
    const [testobj, setTestobj] = useState('')
    const createNewProfile = useCallback(async (name: any, username: any, userId: any) => {
        const supabase = createClient();
        console.log('req');
        const { data, error } = await supabase
            .from('profiles')
            .insert({ name, username, user_id: userId })
            .select();
        if (error) {
            console.log(error);
        } else {
            setProfile(data[0]);
        }
    }, []);



const getProfile = async(user_id:string | undefined) => {
    const supabase = createClient();
    const { data, error } = await supabase
    .from('profiles')
    .select()
    .eq('user_id', user_id)
    .select('*, telegram_profiles(*)');
    if(error){
        console.log(error)
    }else{
        setProfile(data[0])
        setTelegramProfile(data[0].telegram_profiles[0])
    }
}

    const init = useCallback(async () => {
        const supabase = createClient();
        const user = await supabase.auth.getUser();
        // console.log(session.data.session)
        if (user.data.user) {
            setUser(user.data.user);
            const { data, error } = await supabase
                .from('profiles')
                .select()
                .eq('user_id', user.data.user.id)
                .select('*, telegram_profiles(*)');
            if (error) {
                console.log(error);
            } else {
                const random = Math.floor(Math.random() * 1000);
                if (data.length === 0 && !hasProfileBeenCreated.current) {
                    hasProfileBeenCreated.current = true;
                    await createNewProfile(
                        user.data.user.user_metadata.full_name,
                        user.data.user?.user_metadata.user_name + random,
                        user.data.user.id
                    );
                } else {
                    setTelegramProfile(data[0].telegram_profiles[0]);
                    setProfile(data[0]);
                }
            }
        }
    }, [createNewProfile]);

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
                return true
            } else {
                return false
            }
        }
    }


    const createUser = async (username: string, password: string) => {
        // first check if username exists 
        // (username)
        const supabase = createClient();

        // (password)
        const usernametaken = await IsUsernameTaken(username)
        if (usernametaken) {
            return "username taken"
        } else {
            const tempEmail = username + '@eacc.et'
            // (tempEmail)
            const { data, error } = await supabase.auth.signUp({
                email: tempEmail,
                password: password
            })
            if (data.session) {
                const new_profile = await supabase.from('profiles').insert({ username: username, user_id: data.user?.id }).select()
                if (new_profile.error) {
                    // (error)
                } else {
                    // (new_profile.data[0])
                    setProfile(new_profile.data[0])
                }
                const sesh = await supabase.auth.setSession({
                    access_token: data.session?.access_token,
                    refresh_token: data.session?.refresh_token
                });

                return "sign up success"
            } else {
                console.log(error)
                return ("username taken")
            }
        }
    }

    const logout = async () => {
        const supabase = createClient();
        if(isTelegramMiniApp){
            window.Telegram.WebApp.CloudStorage.removeItem('session')
        }
        const { error } = await supabase.auth.signOut()
        // (error)
        await setUser(null)
        await setProfile(null)
    }

    const getStorageItem = async (key: string) => {

        return new   Promise((resolve, reject) => {
            window.Telegram.WebApp.CloudStorage.getItem(key, (err, value:any) => {
                if(err || !value){
                    console.log('IT IS NOT STORED')
                    return reject(new Error('Data is not stored'))
                }else{

                    resolve(value)
                }
                
            })
        })
    }
    const setStorageItem = (key :any, value: any) => {
        window.Telegram.WebApp.CloudStorage.setItem(key, value)
    }
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://telegram.org/js/telegram-web-app.js";
        script.async = true;
    
        script.onload = async() => {
          // Check if WebApp is defined
          if (typeof window.Telegram !== "object" || window.Telegram === null) {
            console.error(
              "Error: Telegram Web App script has not run, see https://core.telegram.org/bots/webapps#initializing-web-apps",
            );
            setISTelegramMiniApp(false)
            setTelegramScriptLoaded(false)
          } else {
            // WebApp is defined
            setTelegramScriptLoaded(true)
            if(window.Telegram.WebApp.platform !== 'unknown'){
                // get session from window.Telegram.WebApp.CloudStorage.session
                setISTelegramMiniApp(true)
                const supabase = createClient();

                const resp = await supabase.auth.getUser()
    // console.log(getStorageItem('refresh_token'))
                // window.Telegram.WebApp.CloudStorage.removeItems(['accessToken', 'refresh_token'])
              
                let refresh_token= null 
                let access_token= null
               await  getStorageItem("session").then((session: any) => {
                    const unstrigify = JSON.parse(session)
                    refresh_token = unstrigify.refresh_token
                    access_token = unstrigify.access_token
                 }).catch((err) => {
                    console.log(err)
                    access_token = null
                    refresh_token=null
                 })

                 // if their is a user but session not stored in telegram cloud store the session
                 if(resp.data.user && !refresh_token && !access_token){
                    const { data, error } = await supabase.auth.getSession()
                    if(data){
                        const seshObj = {
                            access_token: data.session?.access_token,
                            refresh_token: data.session?.refresh_token
                        }
                        await setStorageItem("session", seshObj)
                    }else{
                        console.log(error)
                    }
                 }
            
             

                if(!resp.data.user){
                  
                    // setTestobj(access_token)
                    if(refresh_token  && access_token ){
                        const { data, error } = await supabase.auth.setSession({
                            access_token: access_token,
                            refresh_token: refresh_token
                          })
                          if(data){

                            setUser(data.user)
                            getProfile(data.user?.id)
                          }else{
                            console.log(error)
                          }
                    }
                }else{
                    setUser(resp.data.user)
                    getProfile(resp.data.user.id)
                }
                
            }else{
                init()
                setISTelegramMiniApp(false)
            }
          }
        };
    
        document.head.appendChild(script);
     
        return () => {
          document.head.removeChild(script);
        };
      }, []);


    return (
        <UserContext.Provider value={{ getProfile, setTelegramProfile,testobj,isTelegramMiniApp,telegramProfile,createNewProfile, createUser, logout, profile, setProfile, user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};