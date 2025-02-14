'use client';
import React, { useEffect, useState, useContext } from 'react';
import CheckoutForm from './CheckoutForm';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { confirmProductCheckout, getAllCartItems, getClientSecret } from '@/lib/frontendApi';
import AuthContext from '@/contexts/AuthContext';
import { CartData } from '@/lib/types';
import { CloseOutlined } from '@ant-design/icons';
import ErrorHandler from '@/lib/ErrorHandler';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Loading from '@/app/commonUl/Loading';
import { message } from 'antd';
import './style.css';

interface FormErrors {
    firstName?: string;
    lastName?: string;
    country?: string;
    streetAddress1?: string;
    streetAddress2?: string;
    townCity?: string;
    state?: string;
    zipCode?: string;
    phone?: string;
    email?: string;
    terms?: string;
}

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
    terms: boolean;
}

// Load your Stripe publishable key
const stripePromise = loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`);

const Checkout = () => {
    const { user } = useContext(AuthContext);
    const [cartItem, setCartItem] = useState<CartData>();
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const router = useRouter();
    const [clientSecret, setClientSecret] = useState("");
    const [formValues, setFormValues] = useState<FormValues>({
        firstName: '',
        lastName: '',
        country: '',
        streetAddress1: '',
        streetAddress2: '',
        townCity: '',
        state: '',
        zipCode: '',
        phone: '',
        email: '',
        terms: false,
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormValues({
            ...formValues,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const validateForm = (values: any) => {
        const errors: FormErrors = {};

        if (!values.firstName) errors.firstName = 'First name is required.';
        if (!values.lastName) errors.lastName = 'Last name is required.';
        if (!values.country) errors.country = 'Country/Region is required.';
        if (!values.streetAddress1) errors.streetAddress1 = 'Street address is required.';
        if (!values.townCity) errors.townCity = 'Town/City is required.';
        if (!values.state) errors.state = 'State is required.';
        if (!values.zipCode) errors.zipCode = 'ZIP Code is required.';
        if (!values.terms) {
            errors.terms = 'Please agree to the terms and conditions.';
        }
        if (!values.email) {
            errors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = 'Please enter a valid email address.';
        }

        return errors;
    };

    useEffect(() => {
        if (user) {
            fetchCart();
        }
    }, [user]);

    const fetchClientSecret = async (totalAmount: number) => {
        try {
            const res = await getClientSecret({ totalAmount: totalAmount });
            if (res.status) {
                setClientSecret(res.data);
                setFormValues({
                    firstName: user?.name as string,
                    lastName: user?.lastName as string,
                    country: '',
                    streetAddress1: '',
                    streetAddress2: '',
                    townCity: '',
                    state: '',
                    zipCode: '',
                    phone: user?.phoneNumber as string,
                    email: user?.email as string,
                    terms: true,
                })
            }
        } catch (err) {
            ErrorHandler.showNotification(err);
        }
    }

    const fetchCart = async () => {
        try {
            const res = await getAllCartItems({ userId: user?._id as string, coupon: '', forCheckout: 'true' });
            if (res.status) {
                if (res.data.cart.length === 0) {
                    router.push(`${process.env.NEXT_PUBLIC_SITE_URL}/cart`);
                } else {
                    setCartItem(res.data);
                    if (res.data.totalAmount > 0) fetchClientSecret(res.data.totalAmount);
                    setLoading(false);
                }
            }
        } catch (error) {
            setLoading(false);
            ErrorHandler.showNotification(error);
        }
    }

    const appearance: any = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validateForm(formValues);

        const updatedErrors = { ...validationErrors };

        // Use a type assertion to ensure the key is a valid key of FormValues
        Object.keys(updatedErrors).forEach((key) => {
            if (formValues[key as keyof FormValues]) {
                delete updatedErrors[key as keyof FormValues];
            }
        });

        if (Object.keys(updatedErrors).length === 0) {
            if (cartItem && cartItem?.cart?.package?.length > 0 && Number(cartItem.totalAmount) === 0) {
                handleFreePackage();
                return;
            }
            setErrors({});
        } else {
            setErrors(updatedErrors);
        }
    };

    const handleFreePackage = async () => {
        const response = await confirmProductCheckout({
            userId: user?._id,
            formData: formValues,
            cartItem,
            stripeDetails: {
                paymentIntentId: null,
                clientSecret: null,
                paymentMethodId: null,
                currency: null,
                transactionStatus: null,
            },
        });

        if (response.status) {
            router.push(`${process.env.NEXT_PUBLIC_SITE_URL}/order-complete`);
        } else {
            message.error("Payment successful, but there was an issue confirming the order.");
        }
    }

    return (
        <>
            {loading ?
                <Loading />
                :
                <section className="section-gap bg-light-white">
                    <div className="container-fluid w-90">
                        <div className="row">
                            <div className="col-sm-5">
                                <h2 className="color-dark-gray title-lg bottom-ultra-space fw-regular">Checkout</h2>
                            </div>
                            <div className="col-sm-7">
                                <ul className="breadcrumb">
                                    <li><Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/cart`}><span>Shopping cart</span> <i className="fa-solid fa-angle-right"></i></Link></li>
                                    <li><Link href="#" className="active"><span>Checkout </span><i className="fa-solid fa-angle-right"></i></Link></li>
                                    <li><Link href={`#`}><span>Order Complete</span></Link></li>
                                </ul>
                            </div>
                        </div>
                        {/* <form className="form-fields max-100"> */}
                        <form >
                            <div className="row gy-3">
                                <div className="col-xl-5 col-md-12">
                                    <div className="row">
                                        <div className="col-md-6 col-sm-12">
                                            <label className="label-lg">First name</label>
                                            <input
                                                type="text"
                                                className="field-panel"
                                                name="firstName"
                                                value={formValues.firstName}
                                                onChange={handleChange}
                                                placeholder="Enter your first name"
                                            />
                                            {errors.firstName && <div className="text-danger">{errors.firstName}</div>}
                                        </div>
                                        <div className="col-md-6 col-sm-12">
                                            <label className="label-lg">Last name</label>
                                            <input
                                                type="text"
                                                className="field-panel"
                                                name="lastName"
                                                value={formValues.lastName}
                                                onChange={handleChange}
                                                placeholder="Enter your last name"
                                            />
                                            {errors.lastName && <div className="text-danger">{errors.lastName}</div>}
                                        </div>
                                        <div className="col-md-6 col-sm-12">
                                            <label className="label-lg mt-3">Email address</label>
                                            <input
                                                type="text"
                                                className="field-panel"
                                                name="email"
                                                value={formValues.email}
                                                onChange={handleChange}
                                                placeholder="Enter your email address."
                                            />
                                            {errors.email && <div className="text-danger">{errors.email}</div>}
                                        </div>
                                        <div className="col-md-6 col-sm-12">
                                            <label className="label-lg  mt-3">Phone (optional)</label>
                                            <input
                                                type="number"
                                                className="field-panel"
                                                name="phone"
                                                value={formValues.phone}
                                                onChange={handleChange}
                                                max={12}
                                                placeholder="Enter your phone number"
                                            />
                                        </div>
                                        <div className="col-md-6 col-sm-12">
                                            <label className="label-lg  mt-3">Country / Region</label>
                                            <input
                                                type="text"
                                                className="field-panel"
                                                name="country"
                                                value={formValues.country}
                                                onChange={handleChange}
                                                placeholder="Enter your country / region..."
                                            />
                                            {errors.country && <div className="text-danger">{errors.country}</div>}
                                        </div>
                                        <div className="col-md-6 col-sm-12">
                                            <label className="label-lg mt-3">State</label>
                                            <input
                                                type="text"
                                                className="field-panel"
                                                name="state"
                                                value={formValues.state}
                                                onChange={handleChange}
                                                placeholder="Enter your state"
                                            />
                                            {errors.state && <div className="text-danger">{errors.state}</div>}
                                        </div>
                                        <div className="col-md-6 col-sm-12">
                                            <label className="label-lg mt-3">Town / City</label>
                                            <input
                                                type="text"
                                                className="field-panel"
                                                name="townCity"
                                                value={formValues.townCity}
                                                onChange={handleChange}
                                                placeholder="Enter your town / city"
                                            />
                                            {errors.townCity && <div className="text-danger">{errors.townCity}</div>}
                                        </div>
                                        <div className="col-md-6 col-sm-12">
                                            <label className="label-lg mt-3">ZIP Code</label>
                                            <input
                                                type="text"
                                                className="field-panel"
                                                name="zipCode"
                                                value={formValues.zipCode}
                                                onChange={handleChange}
                                                placeholder="Enter your ZIP code"
                                            />
                                            {errors.zipCode && <div className="text-danger">{errors.zipCode}</div>}
                                        </div>
                                        <div className="col-md-6 col-sm-12">
                                            <label className="label-lg mt-3">Street address</label>
                                            <input
                                                type="text"
                                                className="field-panel"
                                                name="streetAddress1"
                                                value={formValues.streetAddress1}
                                                onChange={handleChange}
                                                placeholder="House number and street name"
                                            />
                                            {errors.streetAddress1 && <div className="text-danger">{errors.streetAddress1}</div>}
                                        </div>
                                        <div className="col-md-6 col-sm-12">
                                            <label className="label-lg mt-3">Apartment (optional)</label>
                                            <input
                                                type="text"
                                                className="field-panel"
                                                name="streetAddress2"
                                                value={formValues.country}
                                                onChange={handleChange}
                                                placeholder="Apartment, suite, unit, etc. (optional)"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-7 col-md-12">
                                    <div className="card">
                                        <h3 className="title-tertiary fw-light color-dark-gray mb-4">Order Summary</h3>
                                        <div className="row">
                                            <div className="col-xl-6 col-lg-7 col-md-6 col-sm-12 products-list">
                                                {cartItem?.cart?.package && cartItem?.cart?.package?.length > 0 &&
                                                    <div className="col-sm-12">
                                                        <span className="p-md fw-bold color-dark opacity-6">Packages</span>
                                                    </div>
                                                }
                                                {cartItem?.cart?.package &&
                                                    cartItem?.cart.package.map((item: any, index) => (
                                                        <div className="row border-bottom mt-2 mb-1" key={index}>
                                                            <div className="col-9">
                                                                <span className="p-md fw-regular color-dark-gray opacity-6">{item.packageId.packageName} <CloseOutlined style={{ fontSize: '12px' }} /> {item.quantity} </span>
                                                            </div>
                                                            <div className="col-3 text-end">
                                                                <span className="p-md fw-light color-dark-gray opacity-6">${Number(item.packageId.packageDiscountPrice) > 0 ? item.packageId.packageDiscountPrice : item.packageId.packagePrice}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                {cartItem?.cart.coupon.isCouponApplied &&
                                                    <>
                                                        <div className="row border-bottom mt-2 mb-1">
                                                            <div className="col-9">
                                                                <span className="p-md fw-medium color-dark-gray opacity-6">Coupon Discount({cartItem.cart.coupon.discountPercentage}%) </span>
                                                            </div>
                                                            <div className="col-3 text-end">
                                                                <span className="p-md fw-light color-dark-gray opacity-6">-${cartItem?.packageDetails.couponDiscount}</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                }
                                                {cartItem?.cart?.eBook && cartItem?.cart?.eBook?.length > 0 &&
                                                    <div className="row mt-2">
                                                        <div className="col-12">
                                                            <span className="p-md fw-bold color-dark opacity-6">Ebooks</span>
                                                        </div>
                                                    </div>
                                                }
                                                {cartItem?.cart.eBook.map((item: any, index) => (
                                                    <div className="row border-bottom mt-2 mb-1" key={index}>
                                                        <div className="col-9">
                                                            <span className="p-md fw-regular color-dark-gray opacity-6">{item.eBookId.title} <CloseOutlined style={{ fontSize: '12px' }} /> {item.quantity} </span>
                                                        </div>
                                                        <div className="col-3 text-end">
                                                            <span className="p-md fw-light color-dark-gray opacity-6">${item.eBookId.discountedPrice}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="row border-bottom mt-2 mb-2">
                                                    <div className="col-6">
                                                        <span className="p-md fw-bold color-dark opacity-6">Subtotal</span>

                                                    </div>
                                                    <div className="col-6 text-end">
                                                        <span className="p-md fw-bold color-dark opacity-6">${cartItem?.subTotal}</span>
                                                    </div>
                                                </div>
                                                <div className="row border-bottom top-large-space">
                                                    <div className="col-6">
                                                        <p className="p-md fw-bold color-dark-gray opacity-6">Grand Total</p>
                                                    </div>
                                                    <div className="col-6 text-end">
                                                        <p className="p-md fw-bold color-dark-gray opacity-7">${cartItem?.totalAmount}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xl-6 col-lg-5 col-md-6 col-sm-12">
                                                {clientSecret && (
                                                    <>
                                                        <p className="p-md fw-regular color-dark-gray opacity-7 top-large-space">Payment method</p>
                                                        {/* <label className="radio-leabel color-dark-gray p-sm opacity-6"><input type="radio" checked /> Credit Card </label>
                                                        <br /> */}
                                                        <div className="mt-3 border-bottom">
                                                            <Elements options={options} stripe={stripePromise}>
                                                                <CheckoutForm errors={errors} formData={formValues} cartItem={cartItem} handlePlaceOrder={(data) => { setSubmitLoading(data) }} />
                                                            </Elements>
                                                        </div>
                                                    </>
                                                )}
                                                <div className="form-fields mt-2 max-100 margin-auto-none">
                                                    <label className="check-box-leabel ">
                                                        <input
                                                            type="checkbox"
                                                            name="terms"
                                                            checked={formValues.terms}
                                                            onChange={handleChange}
                                                        />
                                                        <span className="opacity-6 p-xxs">I have read and agree to the website</span>
                                                        <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/terms-of-service`} className="p-xxs fw-bold color-accent">terms and conditions</Link> </label>
                                                    {errors.terms && <div className="text-danger">{errors.terms}</div>}
                                                </div>
                                                <a
                                                    href="#"
                                                    className={`btn-accent-form shopping-btn mt-1 opacity ${submitLoading ? 'disabled' : ''}`}
                                                    onClick={!submitLoading ? handleSubmit : (e) => e.preventDefault()}
                                                >
                                                    {submitLoading &&
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    }
                                                    {submitLoading ? 'Please wait' : 'Place Order'}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </section>
            }
        </>
    )
}
export default Checkout;
