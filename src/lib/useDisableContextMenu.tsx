'use client';

import { useEffect } from 'react';

const useRestrictAndForceFullscreen = (elementId: string) => {
    useEffect(() => {
        // Function to request fullscreen mode on the specified element
        // const requestFullscreen = async () => {
        //     const rootElement = document.getElementById(elementId);
        //     if (rootElement) {
        //         try {
        //             // Check for fullscreen API compatibility across different browsers
        //             if (rootElement.requestFullscreen) {
        //                 await rootElement.requestFullscreen(); // Standard fullscreen API
        //             } else if ((rootElement as any).webkitRequestFullscreen) {
        //                 await (rootElement as any).webkitRequestFullscreen(); // Safari
        //             } else if ((rootElement as any).msRequestFullscreen) {
        //                 await (rootElement as any).msRequestFullscreen(); // Internet Explorer/Edge
        //             }
        //         } catch (error) {
        //             console.error('Fullscreen request failed:', error);
        //         }
        //     }
        // };

        // Automatically trigger fullscreen mode when component mounts
        // requestFullscreen();

        // Prevent right-click context menu
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        // Disable F11, F12, F5, and Developer Tools shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'F12' || e.key === 'F11' || e.key === 'F5' || (e.ctrlKey && (e.key === 'r' || e.key === 'R'))) {
                e.preventDefault();
                return false;
            }

            // Disable Ctrl+Shift+I, Ctrl+Shift+J, and Ctrl+U (Inspect Element and View Source)
            if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J') || (e.ctrlKey && e.key === 'U')) {
                e.preventDefault();
                return false;
            }
        };

        // Prevent page refresh or accidental navigation
        const preventRefresh = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = ''; // Show a confirmation dialog before leaving
        };

        // Attach event listeners
        const rootElement = document.getElementById(elementId);
        rootElement?.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('beforeunload', preventRefresh);

        // Cleanup function to remove event listeners when component unmounts
        return () => {
            rootElement?.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('beforeunload', preventRefresh);
        };
    }, [elementId]);
};

export default useRestrictAndForceFullscreen;
