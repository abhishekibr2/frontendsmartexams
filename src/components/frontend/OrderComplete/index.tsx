'use client';
import AuthContext from '@/contexts/AuthContext';
import ErrorHandler from '@/lib/ErrorHandler';
import { getUserOrderDetails } from '@/lib/frontendApi';
import { OrderDetail } from '@/lib/types';
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import './style.css';

export default function OrderComplete() {
    const { user } = useContext(AuthContext);
    const [orderDetails, setOrderDetails] = useState<OrderDetail>();

    useEffect(() => {
        if (user) {
            fetchOrderDetails();
        }
    }, [user]);

    const fetchOrderDetails = async () => {
        try {
            const res = await getUserOrderDetails(user?._id as string);
            if (res.status) {
                setOrderDetails(res.data);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }

    return (
        <section className="section-gap bg-light-white">
            <div className="container-fluid w-90">
                <div className="row">
                    <div className="col-sm-5">
                        <h2 className="color-dark-gray title-lg bottom-ultra-space fw-regular">Order Complete</h2>
                    </div>
                    <div className="col-sm-7">
                        <ul className="breadcrumb">
                            <li><Link href={`#`}><span>Shopping cart</span> <i className="fa-solid fa-angle-right"></i></Link></li>
                            <li><Link href="#" ><span>Checkout </span><i className="fa-solid fa-angle-right"></i></Link></li>
                            <li><Link href="#" className="active"><span>Order Complete</span></Link></li>
                        </ul>
                    </div>
                </div>


                <div className="top-extra-max-space md-none"></div>
                <div className="row">
                    <div className="col-sm-3"></div>
                    <div className="col-sm-6">
                        <div className="order-complete text-center">
                            <img src="/images/smart/image 12.png" alt="image 12" />
                            <h2 className="title-secondary text-center fw-regular color-neutral mt-3 bottom-ultra-space ">Thank you for order!</h2>

                            <div className="card mt-3">
                                <h3 className="title-tertiary fw-bold color-fresh-green">Completed</h3>

                                <div className="row bg-Zblack top-extra-space pt-2 pb-2">
                                    <div className="col-6">
                                        <p className="p-xs fw-regular color-light text-start mb-0">Product</p>
                                    </div>
                                    <div className="col-3 text-center">
                                        <p className="p-xs fw-light color-light mb-0">Quantity</p>
                                    </div>
                                    <div className="col-3 text-end">
                                        <p className="p-xs fw-light color-light mb-0">Price</p>
                                    </div>
                                </div>
                                {orderDetails && orderDetails.orderSummary.package.map((pkg, index) => {
                                    return (
                                        <div className="row bg-light-gray border-bottom pt-2 pb-2" key={index}>
                                            <div className="col-6">
                                                <p className="p-xs fw-regular color-dark-gray text-start mb-0">{pkg.packageName}</p>
                                            </div>
                                            <div className="col-3 text-center">
                                                <p className="p-xs fw-light color-dark-gray mb-0">{pkg.packageQuantity}</p>
                                            </div>
                                            <div className="col-3 text-end">
                                                <p className="p-xs fw-light color-dark-gray text-end mb-0">
                                                    {pkg.packageQuantity > 1 && (
                                                        <span className="mx-1" style={{ fontSize: '12px' }}>
                                                            (${(pkg.packageDiscountPrice ?? pkg.packagePrice)}/each)
                                                        </span>
                                                    )}
                                                    ${Number((pkg.packageDiscountPrice ?? pkg.packagePrice) * Number(pkg.packageQuantity))}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                                {orderDetails && orderDetails.orderSummary.coupon.isCouponApplied === true &&
                                    <div className="row bg-light-gray border-bottom pt-2 pb-2">
                                        <div className="col-3">
                                        </div>
                                        <div className="col-7 text-end">
                                            <p className="p-xs fw-regular color-dark-gray  mb-0">Coupon Discount</p>
                                        </div>
                                        <div className="col-2 text-end">
                                            <p className="p-xs fw-light color-dark-gray text-end mb-0">-${orderDetails?.orderSummary.coupon.totalCouponDiscount}</p>
                                        </div>
                                    </div>
                                }
                                {orderDetails && orderDetails.orderSummary.eBook.map((ebook, index) => {
                                    return (
                                        <div className="row bg-light-gray border-bottom pt-2 pb-2" key={index}>
                                            <div className="col-6">
                                                <p className="p-xs fw-regular color-dark-gray text-start mb-0">{ebook.eBookTitle}</p>
                                            </div>
                                            <div className="col-3 text-center">
                                                <p className="p-xs fw-light color-dark-gray mb-0">{ebook.eBookQuantity}</p>
                                            </div>
                                            <div className="col-3 text-end">
                                                <p className="p-xs fw-light color-dark-gray text-end mb-0">
                                                    {ebook.eBookQuantity > 1 &&
                                                        <span className='mx-1' style={{ fontSize: '12px' }}>
                                                            (${ebook.eBookDiscountPrice}/each)
                                                        </span>
                                                    }
                                                    ${Number(ebook.eBookDiscountPrice) * (Number(ebook.eBookQuantity))}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                                <div className="row border-bottom top-extra-space">
                                    <div className="col-6">
                                        <p className="p-md fw-regular color-dark-gray opacity-7 text-start">Subtotal</p>
                                    </div>
                                    <div className="col-6 text-end">
                                        <p className="p-md fw-light color-dark-gray opacity-7">${orderDetails?.orderSummary.subTotal}</p>
                                    </div>
                                </div>

                                <div className="row border-bottom top-extra-space">
                                    <div className="col-6">
                                        <p className="p-md fw-semi-bold color-accent   text-start">Total</p>
                                    </div>
                                    <div className="col-6 text-end">
                                        <p className="p-md fw-semi-bold color-accent  ">${orderDetails?.orderSummary.totalAmount}</p>
                                    </div>
                                </div>
                                <div className='top-extra-space bottom-extra-space'>
                                    <Link href={`${process.env['NEXT_PUBLIC_SITE_URL']}`} className="link-btn bg-secondary m-auto  fw-medium p-sm bg-Zblack">Back to Home</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
