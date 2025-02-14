import { useEffect, useState } from 'react';

export function useLazyLoad(callback: () => void) {
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries: any) => {
                if (entries[0].isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();  // Stop observing once it's in view
                }
            },
            { threshold: 0.5 } // Trigger when 50% of the component is in view
        );

        const element = document.getElementById(callback.name); // Use a dynamic ID based on the callback

        if (element) {
            observer.observe(element);
        }

        return () => {
            observer.disconnect();
        };
    }, [callback]);

    return isInView;
}
