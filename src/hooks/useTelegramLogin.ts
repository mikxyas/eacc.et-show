import { useEffect } from 'react';

interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
}
interface Window {
    Telegram: {
        Login: any;
    };
}
interface UseTelegramLoginOptions {
    bot_id: string;
    lang?: string;
    corner_radius?: number;
    request_access?: string;
    onAuth: (user: TelegramUser) => void;
}

const useTelegramLogin = (options: UseTelegramLoginOptions) => {
    const { bot_id, onAuth, ...widgetOptions } = options;

    useEffect(() => {
        if (!bot_id || !onAuth) {
            console.error('Bot ID and onAuth callback are required.');
            return;
        }

        // Load the Telegram widget script
        const script = document.createElement('script');
        script.src = "https://telegram.org/js/telegram-widget.js?2";
        script.async = true;
        script.onload = () => {
            // @ts-ignore
            window.Telegram.Login.init({
                bot_id,
                ...widgetOptions,
            }, onAuth);
        };
        document.head.appendChild(script);

        // Cleanup the script when component unmounts
        return () => {
            document.head.removeChild(script);
        };
    }, [bot_id, onAuth, widgetOptions]);

    const openTelegramLogin = () => {
        // @ts-ignore

        if (window.Telegram && window.Telegram.Login) {
            // @ts-ignore

            window.Telegram.Login.open();
        }
    };

    return { openTelegramLogin };
};

export default useTelegramLogin;
