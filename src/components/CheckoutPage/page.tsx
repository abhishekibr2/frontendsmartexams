'use client';
import { useContext, useEffect, useRef, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import AuthContext from '@/contexts/AuthContext';
import { STRIPE_PUBLISHABLE_KEY } from '@/constants/ENV';

if (STRIPE_PUBLISHABLE_KEY === undefined) {
    throw new Error('Undefined Stripe Publishable Key');
}
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
function CheckoutPage({ amount, ebookId }: { amount: number, ebookId: string }) {
    const { user } = useContext(AuthContext);
    const hasCreatedSession = useRef(false);
    useEffect(() => {
        if (amount && !hasCreatedSession.current) {
            hasCreatedSession.current = true;
            createCheckoutSession();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [amount]);

    const createCheckoutSession = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    price: amount,
                    userId: user?._id,
                    userEmail: user?.email,
                    ebookId: ebookId
                }),
            });
            const session = await response.json();
            if (session?.id) {
                // Ensure stripe is loaded
                const stripe = await stripePromise;
                // Redirect to Stripe Checkout
                const result = await stripe?.redirectToCheckout({
                    sessionId: session.id,
                });
                if (result?.error) {
                    console.error(result.error.message);
                }
            } else {
                console.error('Session creation failed or invalid session ID');
            }
        } catch (error) {
            console.error('Error during checkout session creation:', error);
        }
    };

    // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    //     event.preventDefault();
    //     setLoading(true);
    //     setErrorMessage(null);

    //     if (!stripe || !elements) {
    //         setLoading(false);
    //         setErrorMessage('Stripe has not loaded yet. Please try again.');
    //         return;
    //     }

    //     const { error } = await stripe.confirmPayment({
    //         elements,
    //         confirmParams: {
    //             return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/SuccessPage`,
    //         },
    //     });

    //     if (error) {
    //         setErrorMessage(error.message || 'Payment confirmation failed.');
    //     } else {
    //         // Handle successful payment submission (e.g., redirect to success page)
    //     }

    //     setLoading(false);
    // };

    return (
        // <div style={{
        //     display: 'flex',
        //     justifyContent: 'center',
        //     alignItems: 'center',
        //     height: '100vh',
        //     backgroundColor: '#f5f5f5'
        // }}>
        //     <form onSubmit={handleSubmit} >
        //         {/* {clientSecret && <PaymentElement />} */}

        //         {errorMessage && (
        //             <div style={{ color: 'red', marginTop: '10px' }}>
        //                 {errorMessage}
        //             </div>
        //         )}

        //         <button type="submit" disabled={!stripe || loading} >
        //             {/* // {loading ? 'Processing...' : `Pays `} */}
        //         </button>
        //     </form>
        // </div>
        <></>
    );
}

export default CheckoutPage;
