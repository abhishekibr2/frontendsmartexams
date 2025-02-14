// jest.setup.ts

import '@testing-library/jest-dom';
import 'fast-text-encoding';

// Mock window.matchMedia to avoid issues in tests with responsive components
global.matchMedia =
    global.matchMedia ||
    function () {
        return {
            matches: false,
            addListener: jest.fn(),
            removeListener: jest.fn()
        };
    };

// Suppress console.warn and console.error globally during tests
beforeAll(() => {
    // Cast to jest.Mock to access mockRestore
    jest.spyOn(console, 'warn').mockImplementation(() => { });
    jest.spyOn(console, 'error').mockImplementation(() => { });
});

afterAll(() => {
    // Restore original console.warn and console.error after tests are done
    (console.warn as jest.Mock).mockRestore();
    (console.error as jest.Mock).mockRestore();
});
