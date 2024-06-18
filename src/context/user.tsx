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

    const hasProfileBeenCreated = useRef(false);

    const createNewProfile = useCallback(async (name: any, username: any, email: any, userId: any) => {
        const supabase = createClient();
        console.log('req');
        const { data, error } = await supabase
            .from('profiles')
            .insert({ name, username, email, user_id: userId })
            .select();
        if (error) {
            console.log(error);
        } else {
            setProfile(data[0]);
        }
    }, []);

    const init = useCallback(async () => {
        const supabase = createClient();

        const session = await supabase.auth.getSession();
        // console.log(session.data.session)
        if (session.data.session) {
            setUser(session.data.session?.user);
            const { data, error } = await supabase
                .from('profiles')
                .select()
                .eq('user_id', session.data.session?.user.id)
                .select('*');
            if (error) {
                console.log(error);
            } else {
                const random = Math.floor(Math.random() * 1000);
                if (data.length === 0 && !hasProfileBeenCreated.current) {
                    hasProfileBeenCreated.current = true;
                    await createNewProfile(
                        session.data.session?.user.user_metadata.full_name,
                        session.data.session?.user.user_metadata.user_name + random,
                        session.data.session?.user.email,
                        session.data.session?.user.id
                    );
                } else {
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
                // (sesh)
                // (data)
                return "sign up success"
            } else {
                console.log(error)

                return ("username taken")
            }

            // create a function that when a user is created a profile is also created with the first @ found before the username
            // then becuase the profile gets created just set the session and reload the page
        }
    }

    const logout = async () => {
        const supabase = createClient();

        const { error } = await supabase.auth.signOut()
        // (error)
        await setUser(null)
        await setProfile(null)
    }

    useEffect(() => {
        init()
    }, [])

    return (
        <UserContext.Provider value={{ createNewProfile, createUser, logout, profile, setProfile, user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};