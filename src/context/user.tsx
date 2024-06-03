"use client"
import { supabase } from '@/libs/supabase';
import { createContext, useContext, useEffect, useState } from 'react';

// Define the shape of your user context
interface UserContextType {
    user: any;
    setUser: (user: string) => void;
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
    const [user, setUser] = useState<string>('');
    const [session, setSession] = useState<any>(null);
    async function init() {
        const session: any = await supabase.auth.getSession()
        if (session.data) {
            setSession(session)
            setUser(session.data.session?.user)
        }
    }
    useEffect(() => {
        init()
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};