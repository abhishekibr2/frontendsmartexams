import '@testing-library/jest-dom';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
//@ts-ignore
import { useRouter } from 'nextjs-toploader/app';
import { SessionProvider } from 'next-auth/react';
import React from 'react';
import Register from '@/components/frontend/Register';

// jest.mock('next/navigation', () => ({
//     useRouter: jest.fn(),
// }));

// jest.mock('@/lib/ApiAdapter', () => ({
//     sendEmailVerification: jest.fn().mockResolvedValue({}), // Mocking the API call
//     register: jest.fn().mockResolvedValue({ status: true, message: 'Registration successful' }), // Mock register
// }));

// describe('Register Component', () => {
//     let mockPush: jest.Mock;

//     beforeEach(() => {
//         mockPush = jest.fn();
//         (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

//         global.fetch = jest.fn();
//     });

//     afterEach(() => {
//         jest.restoreAllMocks();
//     });

//     const renderWithSessionProvider = (component: React.ReactNode, session: any = null) => {
//         return render(
//             <SessionProvider session={session}>
//                 {component}
//             </SessionProvider>
//         );
//     };

//     it('shows validation error for empty name, lastname, email, password, and confirmPassword fields', async () => {
//         renderWithSessionProvider(<Register />);

//         // Click the register button to trigger the form submission
//         const registerButton = screen.getByRole('button', { name: /Create account/i });
//         fireEvent.click(registerButton);

//         // Wait for validation errors to appear
//         await waitFor(() => {
//             // Check that the validation error messages appear for the required fields
//             expect(screen.getByText(/Please input your Full Name!/i)).toBeInTheDocument();
//             expect(screen.getByText(/Please input your Last Name!/i)).toBeInTheDocument();
//             expect(screen.getByText(/Please input your Email!/i)).toBeInTheDocument();
//             expect(screen.getByText(/Please enter password!/i)).toBeInTheDocument();
//             expect(screen.getByText(/Please confirm your Password!/i)).toBeInTheDocument();
//         });
//     }, 12000);
// });
