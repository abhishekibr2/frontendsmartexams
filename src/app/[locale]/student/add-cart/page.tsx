'use client';
import React, { useContext, useEffect, useState } from 'react';
import { Form, message } from 'antd'
import AuthContext from '@/contexts/AuthContext';
import { CartData } from '@/lib/types';
import { roundNumber } from '@/helper/roundNumber';
import { applyCouponCode, getSingleCartItem, validateCouponCode } from '@/lib/frontendApi';
import ErrorHandler from '@/lib/ErrorHandler';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

interface FormValues {
    name: string;
    lastName: string;
    Address: string;
}

interface couponCode {
    couponCode: string;
    discount: number;
}

export default function page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const paramId = searchParams.get('packageId');
    const { user } = useContext(AuthContext);
    const [cartItem, setCartItem] = useState<CartData>();
    const [isAgreed, setIsAgreed] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [couponMessage, setCouponMessage] = useState('');
    const [couponData, setCouponData] = useState<couponCode | null>(null);
    const [formValues, setFormValues] = useState<FormValues>({
        name: '',
        lastName: '',
        Address: ''
    });


    useEffect(() => {
        if (user) fetchCart();
    }, [user]);

    const fetchCart = async () => {
        try {
            const res = await getSingleCartItem({ userId: user?._id as string, packageId: paramId as string, coupon: couponCode, forCheckout: 'false' });
            setCartItem(res.data);
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }
    const updateCartInfo = async () => {
        setLoading(true);
        if (!isAgreed) {
            setErrorMessage('*Please agree to the Terms and Privacy Policy before proceeding.');
            setLoading(false);
            return;
        }
        if (
            cartItem &&
            (
                (Array.isArray(cartItem.cart?.package) && cartItem.cart.package.length > 0) ||
                (Array.isArray(cartItem.cart?.eBook) && cartItem.cart.eBook.length > 0)
            )
        ) {
            const res = await applyCouponCode({
                userId: user?._id as string,
                couponCode: couponCode as string,
            });
            if (res?.status === true) {
                setErrorMessage('');
                setCouponCode('');
                setCouponMessage('');
                router.push('/checkout');
            } else {
                setLoading(false);
                setErrorMessage(res.message || "Something went wrong. Please try again.");
            }
        } else {
            setLoading(false);
            message.warning('Your cart is empty. Please add an item to proceed to checkout.');
        }
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };


    const handleCoupon = async () => {
        try {
            const res = await validateCouponCode({
                userId: user?._id as string,
                couponCode: couponCode as string,
            });

            if (res?.status === true) {
                setCouponMessage(res.message);
                setCouponData(res.data);
                await fetchCart();
            } else {
                setCouponCode('');
                setCouponMessage(res.message || "Invalid coupon code.");
                setCouponData(null);
                await fetchCart();
            }
        } catch (error: any) {
            setCouponCode('');
            setCouponData(null);
            setCouponMessage(error.response?.data?.message || "Something went wrong. Please try again.");
            await fetchCart();
        }
    };

    return (
        <>
            <section className="dash-part bg-light-steel ">
                <div className="spac-dash">
                    <div className="row align">
                        <div className="col-sm-5">
                            <h2 className="top-title">
                                Add Cart
                            </h2>
                        </div>
                    </div>
                    <br />
                    <div className="row card-dash spac-mobile-sm" style={{ margin: '0px' }}>
                        <div className="col-lg-7 col-md-12 ">
                            <Form className="form-fields max-100 bottom-max-space" size='large'
                                initialValues={{
                                    name: user?.name || '',
                                    email: user?.email || '',
                                    address: {
                                        city: user?.city || '',
                                        state: user?.state || '',
                                    },
                                }}
                            >
                                <div className="row">
                                    <div className="col-sm-12">
                                        <label className="label-lg bottom-small-space">Full Name</label>
                                        <input
                                            name="name"
                                            type="text"
                                            className="field-panel2"
                                            placeholder="Enter your first name"
                                            value={formValues.name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-sm-12">
                                        <label className="label-lg bottom-small-space">Email</label>
                                        <input
                                            type="email"
                                            className="field-panel2"
                                            placeholder="Enter your email "
                                        />
                                    </div>
                                    <div className="col-sm-12">
                                        <label className="label-lg bottom-small-space">
                                            Test series name
                                        </label>
                                        <input
                                            type="text"
                                            className="field-panel2"
                                            placeholder="SOTT for 2025"
                                        />
                                    </div>
                                    <div className="col-sm-12">
                                        <label className="label-lg bottom-small-space">Address</label>
                                        <textarea className="size-xl  field-panel" defaultValue={""} />
                                    </div>
                                    <div className="col-sm-12">
                                        <label className="label-lg bottom-small-space top-large-space">
                                            Test series cost
                                        </label>

                                        <input
                                            type="text"
                                            className="field-panel2  "
                                            placeholder="90.0"
                                        />
                                    </div>
                                    {Number(cartItem?.packageDetails.totalAfterDiscount) > 0 &&
                                        <div className="col-sm-12">
                                            <label className="label-lg">
                                                Voucher code
                                            </label>
                                            <input type="text" className="field-panel2" placeholder="Coupon code" aria-label="Recipient's username" aria-describedby="basic-addon2" onChange={(e) => setCouponCode(e.target.value)}
                                            />
                                            <button
                                                className={`
                                            btn-primary fix-content-width btn-spac-lg bg-fresh-green
                                         ${couponMessage === 'Valid' ? 'color-light' : 'color-dark-gray'}
                                         ${couponMessage === 'Valid' ? 'bg-fresh-green' : ''}
                                            opacity-7
                                             fw-medium
                                             `}
                                                onClick={handleCoupon}>
                                                {couponMessage === 'Valid' ? 'Applied' : 'Apply coupon'}

                                            </button>
                                            {couponMessage !== 'Valid' &&
                                                <span className='text-danger'>{couponMessage}</span>
                                            }
                                        </div>
                                    }

                                    <div className="col-sm-12">
                                        <label className="label-lg bottom-small-space top-extra-space">
                                            Net cost
                                        </label>
                                        <input
                                            type="text"
                                            className="field-panel2  "
                                            placeholder="90.0"
                                        />
                                    </div>
                                    <div className="col-sm-12 text-end  ">
                                        <button className="btn-primary fix-content-width btn-spac-lg bg-fresh-green opacity right-gap-15  ">
                                            Submit
                                        </button>{" "}
                                        &nbsp;&nbsp;
                                        <button className="btn-primary fix-content-width btn-spac-lg bg-fresh-green opacity ">
                                            Reset
                                        </button>
                                    </div>
                                </div>
                            </Form>
                        </div>
                        <div className="col-lg-5 col-md-12">
                            <div className="card rounded-4">
                                <h3 className="title-tertiary fw-light color-dark-gray bottom-large-space">Payment Details</h3>
                                {/* ALL PACKAGES DETAIL IN CART */}
                                {Number(cartItem?.cart.package?.length) > 0 &&
                                    <div className="row border-bottom">
                                        <div className="col-12 border-bottom mb-2">
                                            <span className="p-md fw-bold color-dark opacity-6">Packages Detail</span>
                                        </div>
                                        <div className="col-6">
                                            <p className="p-md fw-regular color-dark-gray opacity-6">Items Total</p>
                                        </div>
                                        <div className="col-6 text-end">
                                            <p className="p-md fw-light color-dark-gray opacity-6">${cartItem?.packageDetails.itemTotal}</p>
                                        </div>
                                        {cartItem?.packageDetails && Number(cartItem?.packageDetails?.discount) > 0 &&
                                            <>
                                                <div className="col-6">
                                                    <p className="p-md fw-regular color-dark-gray opacity-6">Discount</p>
                                                </div>
                                                <div className="col-6 text-end">
                                                    <p className="p-md fw-light color-dark-gray opacity-6">-${cartItem?.packageDetails.discount}</p>
                                                </div>
                                            </>
                                        }
                                        {couponData?.discount && (
                                            <>
                                                <div className="col-9 mb-2">
                                                    <span className="p-md fw-regular color-dark-gray opacity-6">Coupon Discount({couponData.discount}%) </span> <br />
                                                    <span style={{ fontSize: '12px', color: 'gray' }}>
                                                        Coupon discount applies only to the packages total
                                                    </span>
                                                </div>
                                                <div className="col-3 text-end">
                                                    <p className="p-md fw-light color-dark-gray opacity-6">
                                                        -${cartItem?.packageDetails.couponDiscount}
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                        <div className="col-6 mb-2">
                                            <span className="p-md fw-bold color-dark-gray opacity-6">Sub Total</span>
                                        </div>
                                        <div className="col-6 text-end  mb-2">
                                            <span className="p-md fw-bold color-dark-gray opacity-6">
                                                ${roundNumber(
                                                    Number(cartItem?.packageDetails?.couponDiscount) > 0
                                                        ? (Number(cartItem?.packageDetails?.totalAfterDiscount || 0) - Number(cartItem?.packageDetails?.couponDiscount || 0))
                                                        : Number(cartItem?.packageDetails?.totalAfterDiscount || 0),
                                                    2
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                }
                                {/* ALL EBOOKS DETAILS IN CART */}
                                {Number(cartItem?.eBookDetails?.itemTotal) > 0 &&
                                    <div className="row border-bottom">
                                        <div className="col-12 border-bottom mb-2 mt-1">
                                            <span className="p-md fw-bold color-dark opacity-6">Ebooks Detail</span>
                                        </div>
                                        <div className="col-6">
                                            <p className="p-md fw-regular color-dark-gray opacity-6">Items Total</p>
                                        </div>
                                        <div className="col-6 text-end">
                                            <p className="p-md fw-light color-dark-gray opacity-6">${cartItem?.eBookDetails.itemTotal}</p>
                                        </div>
                                        {cartItem?.eBookDetails && Number(cartItem?.eBookDetails?.discount) > 0 &&
                                            <>
                                                <div className="col-6">
                                                    <p className="p-md fw-regular color-dark-gray opacity-6">Discount</p>
                                                </div>
                                                <div className="col-6 text-end">
                                                    <p className="p-md fw-light color-dark-gray opacity-6">-${cartItem?.eBookDetails.discount}</p>
                                                </div>
                                            </>
                                        }
                                        <div className="col-6">
                                            <p className="p-md fw-bold color-dark-gray opacity-6">Sub Total</p>
                                        </div>
                                        <div className="col-6 text-end">
                                            <p className="p-md fw-bold color-dark-gray opacity-6">${cartItem?.eBookDetails.totalAfterDiscount}</p>
                                        </div>
                                    </div>
                                }

                                <div className="row border-bottom top-large-space">
                                    <div className="col-6">
                                        <p className="p-md fw-bold color-dark-gray opacity-6">Grand Total</p>
                                    </div>
                                    <div className="col-6 text-end">
                                        <p className="p-md fw-bold color-dark-gray opacity-7">${cartItem?.totalAmount}</p>
                                    </div>
                                </div>

                                <div className="top-large-space">
                                    <label className="check-box-leabel p-sm">
                                        <input
                                            type="checkbox"
                                            className="me-2"
                                            required
                                            checked={isAgreed}
                                            onChange={() => setIsAgreed(!isAgreed)}  // Toggle the checkbox state
                                        />

                                        I agree to all the{" "}
                                        <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/terms-of-service`} target={'blank'} className="p-sm fw-bold color-aqua-steel ">Terms</Link>{" "}
                                        and{" "}
                                        <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/privacy-policy`} target={'blank'} className="p-sm fw-bold color-aqua-steel ">Privacy policy</Link>{" "}

                                    </label>
                                </div>
                                {errorMessage && (
                                    <span className="text-danger p-sm">
                                        {errorMessage}
                                    </span>
                                )}
                                <button
                                    disabled={loading}
                                    type='button'
                                    className="btn-accent-form shopping-btn mt-4 mb-3 opacity"
                                    onClick={updateCartInfo}
                                >
                                    {loading &&
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    }
                                    {loading ? 'Please wait' : 'Proceed to Checkout'} </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}
