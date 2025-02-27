'use client';
import React, { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import ErrorHandler from '@/lib/ErrorHandler';
import { applyCouponCode, getAllCartItems, removeCartItem, updateCartItemQuantity, validateCouponCode } from '@/lib/frontendApi';
import AuthContext from '@/contexts/AuthContext';
import { message, Popconfirm } from 'antd';
import { CartData } from '@/lib/types';
import { useRouter } from 'next/navigation';
import './style.css';
import { roundNumber } from '@/helper/roundNumber';

interface IncDecItem {
    packageId?: {
        _id: string;
        packageName: string;
        packageDescription: string;
        packagePrice: string;
    };
    quantity: number;
    _id: string;
    eBookId?: {
        _id: string;
        title: string;
        description: string;
        price: string;
    }
}

interface couponCode {
    couponCode: string;
    discount: number;
}


const Cart = () => {
    const { user } = useContext(AuthContext);
    const [cartItem, setCartItem] = useState<CartData>();
    const router = useRouter();
    const [showPopconfirm, setShowPopconfirm] = useState(false);
    const [itemToRemove, setItemToRemove] = useState<IncDecItem | null>(null);
    const [isAgreed, setIsAgreed] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [couponMessage, setCouponMessage] = useState('');
    const [couponData, setCouponData] = useState<couponCode | null>(null);
    console.log(couponMessage, '123456')
    useEffect(() => {
        if (user) fetchCart();
    }, [user]);

    const fetchCart = async () => {
        try {
            const res = await getAllCartItems({ userId: user?._id as string, coupon: couponCode, forCheckout: 'false' });
            setCartItem(res.data);
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }
    const updateCount = async (item: IncDecItem, type: string, actionType: 'increase' | 'decrease') => {
        try {
            if (item.quantity === 1 && actionType === 'decrease') {
                setItemToRemove(item);
                setShowPopconfirm(true);
                return;
            }

            const data = type === 'package' ? { packageId: item.packageId?._id as string } : { eBookId: item.eBookId?._id as string };
            const res = await updateCartItemQuantity(
                { userId: user?._id as string, type: actionType, ...data }
            );

            if (res?.status === true) {
                message.success(res.message);
                fetchCart();
            }
        } catch (err) {
            ErrorHandler.showNotification(err);
        }
    };


    const increaseCount = (item: IncDecItem, type: string) => {
        setItemToRemove(null);
        setShowPopconfirm(false);
        updateCount(item, type, 'increase');
    }
    const decreaseCount = (item: IncDecItem, type: string) => {
        setItemToRemove(null);
        setShowPopconfirm(false);
        updateCount(item, type, 'decrease');
    }


    // Remove item from cart
    const removeItem = async (id: string, type: string) => {
        try {
            let res;
            if (type === 'package') {
                res = await removeCartItem({ packageId: id, userId: user?._id as string });
            } else if (type === 'eBook') {
                res = await removeCartItem({ eBookId: id, userId: user?._id as string });
            }
            if (res?.status === true) {
                message.success(res.message);
            }
            fetchCart();
            setShowPopconfirm(false);
            setItemToRemove(null);
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

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
            <section className="section-gap bg-light-white">
                <div className="container-fluid w-90">
                    <div className="row">
                        <div className="col-sm-5">
                            <h2 className="color-dark-gray title-lg bottom-ultra-space fw-regular">Shopping Cart</h2>
                        </div>
                        <div className="col-sm-7">
                            <ul className="breadcrumb">
                                <li><Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/cart`} className="active"><span>Shopping cart</span> <i className="fa-solid fa-angle-right"></i></Link></li>
                                <li><Link href={'#'}><span>Checkout </span><i className="fa-solid fa-angle-right"></i></Link></li>
                                <li><Link href="#"><span>Order Complete</span></Link></li>
                            </ul>
                        </div>
                        <div className="col-md-6 col-sm-12">
                            <div className="shopping-list">
                                <ul>
                                    <li><i className="fa-solid fa-check"></i></li>
                                    <li><Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/test-packs`} className="btn-accent-form shopping-btn opacity">Continue shopping</Link></li>
                                    <li><p className="fw-regular color-dark-gray title-tertiary opacity-7 mt-3" >Your selection has been added to the cart.</p></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-12">
                            {Number(cartItem?.packageDetails.totalAfterDiscount) > 0 &&
                                <div className="row ">
                                    <div className="col-sm-6 bottom-extra-space">
                                        <div className="coupon-box">
                                            <div className="input-group">
                                                <input type="text" className="form-control" placeholder="Coupon code" aria-label="Recipient's username" aria-describedby="basic-addon2"
                                                    onChange={(e) => {
                                                        setCouponCode(e.target.value);
                                                        setCouponMessage('');
                                                    }}
                                                />
                                                <span
                                                    className={`
                                                input-group-text
                                                p-md
                                             ${couponMessage === 'Valid' ? 'color-light' : 'color-dark-gray'}
                                             ${couponMessage === 'Valid' ? 'bg-fresh-green' : ''}
                                                opacity-7
                                                 fw-medium
                                                 `}
                                                    id="basic-addon2"
                                                    onClick={handleCoupon}
                                                >
                                                    {couponMessage === 'Valid' ? 'Applied' : 'Apply coupon'}
                                                </span>
                                            </div>
                                        </div>
                                        {couponMessage !== 'Valid' &&
                                            <span className='text-danger'>{couponMessage}</span>
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="row mt-4 gy-3">
                        <div className="col-xl-8 col-lg-12 col-md-12 cart-table-container">
                            <table className="table-part table table-responsive cart-table-design" id="cart-table">
                                <thead >
                                    <tr>
                                        <th style={{ background: 'transparent' }} scope="col" className="p-lg color-dark-gray fw-medium card-table-width"></th>
                                        <th style={{ backgroundColor: 'transparent' }} scope="col" className="p-lg color-dark-gray fw-medium digital-width">PRODUCT</th>
                                        <th scope="col" className="p-lg color-dark-gray fw-medium">TYPE</th>
                                        <th scope="col" className="p-lg color-dark-gray fw-medium">PRICE</th>
                                        {/* <th scope="col" className="p-lg color-dark-gray fw-medium d-none d-sm-block d-xl-block">DISCOUNT(%)</th> */}
                                        <th scope="col" className="p-lg color-dark-gray fw-medium">QUANTITY</th>
                                        <th scope="col" className="p-lg color-dark-gray fw-medium">SUBTOTAL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItem?.cart && cartItem.cart.package?.length > 0 &&
                                        cartItem.cart.package?.map((item) => (
                                            <tr key={item._id}>
                                                <td data-label="">
                                                    <div className="bg-soft-lavender card-table mt-2 text-center">
                                                        <div className="close-icon bg-purple">
                                                            <i className="fa-solid fa-xmark"
                                                                onClick={() => removeItem(item.packageId?._id, 'package')}
                                                            ></i>
                                                        </div>
                                                        <h4 className="p-md color-dark-gray mb-2 mt-2">
                                                            {item.packageId ? item.packageId.packageName : ''}
                                                        </h4>
                                                        <h2 className="title-tertiary color-purple fw-bold mb-3">
                                                            ${item.packageId?.packagePrice}
                                                        </h2>
                                                    </div>
                                                </td>
                                                <td data-label="PRODUCT" >
                                                    <p className="color-dark-gray p-md opacity-7 mb-0 ">{item.packageId ? item.packageId.packageName : ''}</p>
                                                </td>
                                                <td data-label="TYPE"><p className="color-dark-gray p-md opacity-7 mb-0">Package</p></td>
                                                <td data-label="PRICE"><p className="color-dark-gray p-md opacity-7 mb-0">${item.packageId?.packagePrice}</p></td>
                                                {/* <td className='d-none d-sm-block d-xl-block' data-label="DISCOUNT"><p className="color-dark-gray p-md opacity-7 mb-0">{item.packageId.packageDiscount}%</p></td> */}
                                                <td data-label="QUANTITY" className="xs-height-sm">
                                                    {showPopconfirm && itemToRemove?.packageId?._id === item.packageId?._id && (
                                                        <Popconfirm
                                                            title={
                                                                <span>
                                                                    Decreasing the quantity to 0 will remove the <br /> item from the cart. Do you want to continue?
                                                                </span>
                                                            }
                                                            onConfirm={() => removeItem(itemToRemove?.packageId?._id as string, 'package')}
                                                            onCancel={() => { setShowPopconfirm(false); setItemToRemove(null) }}
                                                            okText="Continue"
                                                            cancelText="Cancel"
                                                            visible={showPopconfirm}
                                                        />
                                                    )}
                                                    <div className="counter">
                                                        <span className="down" onClick={() => decreaseCount(item as any, 'package')}>-</span>
                                                        <input type="text" value={item.quantity} readOnly />
                                                        <span className="up" onClick={() => increaseCount(item as any, 'package')}>+</span>
                                                    </div>
                                                </td>
                                                <td data-label="SUBTOTAL"><p className="color-dark-gray p-md mb-0 ">${(Number(item.packageId?.packagePrice) * Number(item.quantity))}</p></td>
                                            </tr>
                                        ))
                                    }
                                    {cartItem?.cart && cartItem.cart.eBook?.length > 0 &&
                                        cartItem.cart.eBook?.map((item: any) => (
                                            <tr key={item.id}>
                                                <td data-label="">
                                                    <div className="bg-soft-lavender card-table mt-2 text-center">
                                                        <div className="close-icon bg-purple">
                                                            <i className="fa-solid fa-xmark"
                                                                onClick={() => removeItem(item.eBookId._id, 'eBook')}
                                                            ></i>
                                                        </div>
                                                        <h4 className="p-md color-dark-gray mb-2 mt-2">{item.eBookId ? item.eBookId.title : ''}</h4>
                                                        <h2 className="title-tertiary color-purple fw-bold mb-3">$ {item.eBookId?.price}</h2>
                                                    </div>
                                                </td>
                                                <td data-label="PRODUCT" >
                                                    <p className="color-dark-gray p-md opacity-7 mb-0 ">{item.eBookId ? item.eBookId.title : ''}</p>
                                                </td>
                                                <td data-label="PRICE"><p className="color-dark-gray p-md opacity-7 mb-0">Ebook</p></td>
                                                <td data-label="PRICE"><p className="color-dark-gray p-md opacity-7 mb-0">${item.eBookId.price}</p></td>
                                                {/* <td data-label="DISCOUNT"><p className="color-dark-gray p-md opacity-7 mb-0">{item.eBookId.discount}%</p></td> */}
                                                <td data-label="QUANTITY" className="xs-height-sm">
                                                    {showPopconfirm && itemToRemove?.eBookId?._id === item.eBookId._id && (
                                                        <Popconfirm
                                                            title={
                                                                <span>
                                                                    Decreasing the quantity to 0 will remove the <br /> item from the cart. Do you want to continue?
                                                                </span>
                                                            }
                                                            onConfirm={() => removeItem(itemToRemove?.eBookId?._id as string, 'eBook')}
                                                            onCancel={() => { setShowPopconfirm(false); setItemToRemove(null) }}
                                                            okText="Continue"
                                                            cancelText="Cancel"
                                                            visible={showPopconfirm}
                                                        />
                                                    )}
                                                    <div className="counter">
                                                        <span className="down" onClick={() => decreaseCount(item, 'eBook')}>-</span>
                                                        <input type="text" value={item.quantity} readOnly />
                                                        <span className="up" onClick={() => increaseCount(item, 'eBook')}>+</span>
                                                    </div>
                                                </td>
                                                <td data-label="SUBTOTAL"><p className="color-dark-gray p-md mb-0 ">${(item.eBookId.price * item.quantity)}</p></td>
                                            </tr>
                                        ))
                                    }
                                    {cartItem?.cart && (cartItem.cart.eBook?.length === 0 && cartItem.cart.package?.length === 0) && (
                                        <tr>
                                            <td colSpan={5} className="text-center">
                                                <h2 className="title-tertiary fw-light color-dark-gray bottom-ultra-space">
                                                    No items in your cart
                                                </h2>
                                            </td>
                                        </tr>
                                    )}

                                </tbody>
                            </table>
                        </div>
                        <div className="col-xl-4 col-lg-12 col-md-12">
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
                                {/* SUB TOTAL OF EBOOKS AND PACKAGES */}
                                {/* <div className="row border-bottom">
                                    <div className="col-6">
                                        <p className="p-md fw-bold color-dark-gray opacity-6">Subtotal</p>
                                    </div>
                                    <div className="col-6 text-end">
                                        <p className="p-md fw-bold color-dark-gray opacity-6">${cartItem?.subTotal}</p>
                                    </div>
                                </div> */}

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
export default Cart;
