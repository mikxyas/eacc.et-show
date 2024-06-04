"use client"
import { supabase } from '@/libs/supabase';
import { UUID } from 'crypto';
import { createContext, useContext, useEffect, useState } from 'react';

// Define the shape of your user context
interface UserContextType {
    user: any | null;
    setUser: (user: any) => void;
    profile: any | null;
    setProfile: (profile: any) => void;
    logout: () => void;
    createUser: (username: string, password: string) => any;
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

    async function createNewProfile(name: string, username: string, email: string, userId: UUID) {
        const { data, error } = await supabase.from('profiles').insert({ name: name, username: username, email: email, user_id: userId }).select()
        if (error) {
            console.log(error)
        } else {
            console.log(data)
            setProfile(data[0])
        }
    }

    async function init() {
        const session: any = await supabase.auth.getSession()
        if (session.data.session) {
            setUser(session.data.session?.user)
            console.log(session.data.session?.user)
            const { data, error } = await supabase.from('profiles').select().eq('user_id', session.data.session?.user.id).select()
            if (error) {
                setProfile(null)
            } else {
                if (data) {
                    console.log(data)
                    setProfile(data[0])
                } else {
                    // console.log('creating new profile ')
                    createNewProfile(session.data.session?.user.name, session.data.session?.user.username, session.data.session?.user.email, session.data.session?.user.id)
                }
            }
        }
    }

    const IsUsernameTaken = async (username: string) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('username')
            .eq('username', username)
            .select()
        if (error) {
            console.log(error)
        } else {
            if (data[0]) {
                return true
            } else {
                false
            }
        }
    }


    const createUser = async (username: string, password: string) => {
        // first check if username exists 
        console.log(username)
        console.log(password)
        const usernametaken = await IsUsernameTaken(username)
        if (usernametaken) {
            return "username taken"
        } else {
            const tempEmail = username + '@eacc.et'
            console.log(tempEmail)
            const { data, error } = await supabase.auth.signUp({
                email: tempEmail,
                password: password
            })
            if (data.session) {
                const new_profile = await supabase.from('profiles').insert({ username: username, user_id: data.user?.id }).select()
                if (new_profile.error) {
                    console.log(error)
                } else {
                    console.log(new_profile.data[0])
                    setProfile(new_profile.data[0])
                }
                const sesh = await supabase.auth.setSession({
                    access_token: data.session?.access_token,
                    refresh_token: data.session?.refresh_token
                });
                console.log(sesh)
                console.log(data)
                return "sign up success"
            } else {
                console.log(error)
            }

            // create a function that when a user is created a profile is also created with the first @ found before the username
            // then becuase the profile gets created just set the session and reload the page
        }
    }

    const logout = async () => {
        const { error } = await supabase.auth.signOut()
        console.log(error)
        await setUser(null)
        await setProfile(null)
    }

    useEffect(() => {
        init()
    }, [])

    return (
        <UserContext.Provider value={{ createUser, logout, profile, setProfile, user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};