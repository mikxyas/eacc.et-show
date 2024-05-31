"use client"
import { createContext, useContext, useState } from 'react';

// Define the shape of your user context
interface UserContextType {
    user: string;
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

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};