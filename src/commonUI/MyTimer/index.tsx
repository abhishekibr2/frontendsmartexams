import React from 'react';
import { useTimer } from 'react-timer-hook';

function MyTimer({ expiryTimestamp }: any) {
    const {
        seconds,
        minutes,
        hours,
        days
    } = useTimer({
        expiryTimestamp,
        onExpire: () => console.warn('Timer expired!'),
    });

    const formatNumber = (num: number) => String(num).padStart(2, '0');

    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px' }}>
                <span>{formatNumber(days)}</span>:<span>{formatNumber(hours)}</span>:
                <span>{formatNumber(minutes)}</span>:<span>{formatNumber(seconds)}</span>
            </div>
        </div>
    );
}

export default MyTimer;
