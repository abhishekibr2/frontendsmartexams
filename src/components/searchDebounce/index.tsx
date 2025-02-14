import { useState, useCallback } from 'react';

const useDebounce = (func: Function, delay: number) => {
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    const debouncedFn = useCallback((...args: any[]) => {
        if (timer) {
            clearTimeout(timer);
        }
        const newTimer = setTimeout(() => {
            func(...args);
        }, delay);
        setTimer(newTimer);
    }, [timer, delay, func]);

    return debouncedFn;
};

export default useDebounce;
