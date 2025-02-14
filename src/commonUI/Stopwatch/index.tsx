import React from 'react';
import { useStopwatch } from 'react-timer-hook';

export default function Stopwatch() {
    const {
        seconds,
        minutes,
        hours,
        days
    } = useStopwatch({ autoStart: true });

    // Helper function to format numbers to 2 digits
    const formatNumber = (num: number) => String(num).padStart(2, '0');

    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '16px' }}>
                <span>{formatNumber(days)}</span>:<span>{formatNumber(hours)}</span>:
                <span>{formatNumber(minutes)}</span>:<span>{formatNumber(seconds)}</span>
            </div>
        </div>
    );
}
