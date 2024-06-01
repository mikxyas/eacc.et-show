// components/TelegramLoginButton.js
import { useEffect } from 'react';

const TelegramLoginButton = () => {
    useEffect(() => {
        // const script = document.createElement('script');
        // script.src = "https://telegram.org/js/telegram-widget.js?22";
        // script.async = true;
        // script.setAttribute('data-telegram-login', 'e_accbot');
        // script.setAttribute('data-size', 'large');
        // // script.setAttribute('data-auth-url', `${window.location.origin}/auth/telegram/callback`);
        // script.setAttribute('data-request-access', 'write');
        // document.getElementById('telegram-login-button').appendChild(script);
    }, []);

    return <div id="telegram-login-button"></div>;
};

export default TelegramLoginButton;
