"use client"
import React from 'react';
import useTelegramLogin from '../hooks/useTelegramLogin';

interface TelegramLoginButtonProps {
    botId: string;
    onAuth: (user: any) => void;
    options?: {
        lang?: string;
        corner_radius?: number;
        request_access?: string;
    };
}

const TelegramLoginButton: React.FC<TelegramLoginButtonProps> = () => {
    const handleAuth = (user: any) => {
        // (user)
    }
    const { openTelegramLogin } = useTelegramLogin({ bot_id: "7499969599:AAEg3y0kbuQW9y0tpGFMj09c6rL442aTWbY", onAuth: handleAuth });

    return (
        <div className="font-mono underline self-center">
            <button onClick={openTelegramLogin} className="px-2 py-1 bg-green-700 border-dashed border-gray-700 border">Login with telegram</button>
        </div>
    );
};

export default TelegramLoginButton;
