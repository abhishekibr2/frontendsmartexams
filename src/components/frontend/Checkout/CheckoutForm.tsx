import React, { useContext, useEffect } from "react";
import {
    PaymentElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import ErrorHandler from "@/lib/ErrorHandler";
import { confirmProductCheckout } from "@/lib/frontendApi";
import AuthContext from "@/contexts/AuthContext";
import { CartData } from "@/lib/types";
import { useRouter } from "next/navigation";

interface FormValues {
    firstName: string;
    lastName: string;
    country: string;
    streetAddress1: string;
    streetAddress2: string;
    townCity: string;
    state: string;
    zipCode: string;
    phone: string;
    email: string;
}

interface Props {
    errors: {}
    formData: FormValues | undefined;
    cartItem: CartData | undefined;
    handlePlaceOrder: (data: boolean) => void;
}

export default function CheckoutForm({ errors, formData, cartItem, handlePlaceOrder }: Props) {
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useContext(AuthContext);
    const [message, setMessage] = React.useState<any>(null);
    const router = useRouter();

    const isEmptyObject = (obj: Record<string, any>) => Object.keys(obj).length === 0;

    useEffect(() => {
        if (isEmptyObject(errors)) {
            submitPayment();
        }
    }, [errors]);

    const submitPayment = async () => {
        if (!stripe || !elements) {
            return;
        }

        handlePlaceOrder(true);

        try {
            // Confirm the payment
            const { paymentIntent, error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    receipt_email: formData?.email, // Optional: Add receipt email
                },
                redirect: 'if_required',
            });

            if (error) {
                // Handle Stripe errors
                const errorMessage =
                    error.type === "card_error" || error.type === "validation_error"
                        ? error.message
                        : "An unexpected error occurred.";
                setMessage(errorMessage);
                handlePlaceOrder(false);
                return;
            }

            // Payment succeeded; call the API
            if (paymentIntent && paymentIntent.status === 'succeeded') {
                const response = await confirmProductCheckout({
                    userId: user?._id,
                    formData,
                    cartItem,
                    stripeDetails: {
                        paymentIntentId: paymentIntent.id,
                        clientSecret: paymentIntent.client_secret,
                        paymentMethodId: paymentIntent.payment_method,
                        currency: paymentIntent.currency,
                        transactionStatus: paymentIntent.status,
                    },
                });

                if (response.status) {
                    router.push(`${process.env.NEXT_PUBLIC_SITE_URL}/order-complete`);
                } else {
                    handlePlaceOrder(false);
                    setMessage("Payment successful, but there was an issue confirming the order.");
                }
            } else {
                handlePlaceOrder(false);
                setMessage("Payment not successful. Please try again.");
            }
        } catch (error) {
            handlePlaceOrder(false);
            ErrorHandler.showNotification(error);
        }
    };



    const paymentElementOptions = {
        layout: "accordion",
    };

    return (
        <form id="payment-form">

            <PaymentElement id="payment-element" options={paymentElementOptions as any} />
            {/* Show any error or success messages */}
            {message && <div id="payment-message">{message}</div>}
        </form>
    );
}
