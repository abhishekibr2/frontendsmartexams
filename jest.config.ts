import nextJest from 'next/jest';
import type { Config } from 'jest';

// Initialize the next/jest function
const createJestConfig = nextJest({ dir: './' });

// Define the Jest configuration
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // Handle CSS modules (e.g., styles.module.css)
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',

    // Handle general CSS/SASS files
    '^.+\\.(css|sass|scss)$': 'identity-obj-proxy',

    // Handle image imports (e.g., .png, .jpg, .svg)
    '^.+\\.(png|jpg|jpeg|gif|webp|avif|svg)$': '<rootDir>/__mocks__/fileMock.js'
  },
  testEnvironment: 'jest-environment-jsdom',
  clearMocks: true,
  // collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  transform: {
    // Handle TypeScript files with ts-jest
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        importHelpers: true
      }
    ]
  },
  transformIgnorePatterns: ['/node_modules/', '\\.pnp\\.[^\\/]+$'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx']
} satisfies Config;

// Export the configuration using nextJest wrapper with correct typing
export default createJestConfig(customJestConfig) as Config;
