'use client'
import React, { useContext, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, } from '@stripe/react-stripe-js';
import CheckoutPage from '@/components/CheckoutPage/page';
import AuthContext from '@/contexts/AuthContext';

if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) {
	throw new Error('Undefined Stripe Publishable Key');
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function PaymentStripe({ amount, ebookId }: { amount: number, ebookId: string }) {

	return (
		<>
			<Elements
				stripe={stripePromise}
			>
				<CheckoutPage amount={amount} ebookId={ebookId} />
			</Elements>
		</>
	);
}
