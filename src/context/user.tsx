"use client"
import { supabase } from '@/libs/supabase';
import { createContext, useContext, useEffect, useState } from 'react';

// Define the shape of your user context
interface UserContextType {
    user: any | null;
    setUser: (user: any) => void;
    profile: any | null;
    setProfile: (profile: any) => void;
    logout: () => void;
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
    async function init() {
        const session: any = await supabase.auth.getSession()
        if (session.data.session) {
            setUser(session.data.session?.user)
            const { data, error } = await supabase.from('profiles').select().eq('user_id', session.data.session?.user.id).single()
            if (data) {
                console.log(data)
                setProfile(data)
            } else {
                setProfile(null)
            }
        }
    }

    const logout = async () => {
        await supabase.auth.signOut()
        setUser(null)
        setProfile(null)
    }

    useEffect(() => {
        init()
    }, [])

    return (
        <UserContext.Provider value={{ logout, profile, setProfile, user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};