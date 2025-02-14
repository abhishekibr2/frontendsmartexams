'use client';

import { useEffect } from 'react';

const useRestrictAndForceFullscreen = (elementId: string) => {
    useEffect(() => {
        const requestFullscreen = async () => {
            const rootElement = document.getElementById(elementId);
            if (rootElement) {
                try {
                    if (rootElement.requestFullscreen) {
                        await rootElement.requestFullscreen();
                    } else if ((rootElement as any).webkitRequestFullscreen) {
                        await (rootElement as any).webkitRequestFullscreen();
                    } else if ((rootElement as any).msRequestFullscreen) {
                        await (rootElement as any).msRequestFullscreen();
                    }
                } catch (error) {
                    console.error('Fullscreen request failed:', error);
                }
            }
        };

        requestFullscreen();

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'F12' || e.key === 'F11' || e.key === 'F5' || (e.ctrlKey && (e.key === 'r' || e.key === 'R'))) {
                e.preventDefault();
                return false;
            }

            if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J') || (e.ctrlKey && e.key === 'U')) {
                e.preventDefault();
                return false;
            }
        };

        const preventRefresh = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = '';
        };

        const rootElement = document.getElementById(elementId);
        rootElement?.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('beforeunload', preventRefresh);

        return () => {
            rootElement?.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('beforeunload', preventRefresh);
        };
    }, [elementId]);
};

export default useRestrictAndForceFullscreen;
