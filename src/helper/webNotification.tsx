import axios from 'axios';
import Cookies from 'js-cookie';

const token = Cookies.get('session_token')

const config = {
    headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
    },
};

async function regSw() {
    if ('serviceWorker' in navigator) {
        let url = '/web-notification-sw.js';
        const reg = await navigator.serviceWorker.register(url, { scope: '/' });
        return reg;
    }
    throw Error('serviceworker not supported');
}

async function subscribe(serviceWorkerReg: any) {
    let subscription = await serviceWorkerReg.pushManager.getSubscription();
    if (subscription === null) {
        subscription = await serviceWorkerReg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        });
    }
    axios.post('http://localhost:3001/subscribe', subscription, config);
}

export { regSw, subscribe };
