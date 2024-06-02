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

const TelegramLoginButton: React.FC<TelegramLoginButtonProps> = ({ botId, onAuth, options }) => {
    const { openTelegramLogin } = useTelegramLogin({ bot_id: botId, onAuth, ...options });

    return (
        <button onClick={openTelegramLogin}>
            Login with Telegram
        </button>
    );
};

export default TelegramLoginButton;
