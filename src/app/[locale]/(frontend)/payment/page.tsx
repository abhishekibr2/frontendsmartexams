// 'use client'
import React from 'react';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements } from '@stripe/react-stripe-js';
// import convertToSubCurrency from '@/lib/convertToSubCurrency';
// import CheckoutPage from '@/components/CheckoutPage/page';

// if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) {
//     throw new Error('Undefined Stripe Publishable Key');
// }

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Page() {
    // const amount = 452;

    return (
        <>
            {/* <Elements
                stripe={stripePromise}
                options={{
                    mode: 'payment',
                    amount: convertToSubCurrency(amount),
                    currency: 'usd',
                }}
            >
                <CheckoutPage amount={amount} />
            </Elements> */}
        </>
    );
}
