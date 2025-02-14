'use client';
import React, { useEffect, useState, useContext } from 'react';
import ErrorHandler from '@/lib/ErrorHandler';
import { getAllTestPacks, addToCartDetails } from '@/lib/frontendApi';
import AuthContext from '@/contexts/AuthContext';
import { Col, Image, message, Row } from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PracticePackage } from '@/lib/types';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import tinycolor from "tinycolor2";

const PracticePackages = () => {
    const { user } = useContext(AuthContext);
    const [packages, setPackages] = useState<PracticePackage[]>([]);
    const pathName = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const stateId = searchParams.get('stateId');
    const examTypeId = searchParams.get('examTypeId');

    useEffect(() => {
        if (stateId && examTypeId) {
            GetAllPackagesData(stateId, examTypeId);
        }
    }, [stateId, examTypeId]);

    const GetAllPackagesData = async (stateId: string, examTypeId: string) => {
        try {
            const data = { stateId, examTypeId };
            const res = await getAllTestPacks(data);
            if (res.status) {
                const sortedPackages = res.data.sort((a: any, b: any) => {
                    const priceA = parseFloat(a.packageDiscountPrice || a.packagePrice || '0');
                    const priceB = parseFloat(b.packageDiscountPrice || b.packagePrice || '0');
                    return priceA - priceB;
                });
                setPackages(sortedPackages);
            }
        } catch (error) {
            ErrorHandler.showNotification(error.message || 'Something went wrong');
        }
    };


    const handleAddToCart = async (item: PracticePackage) => {
        if (!user) {
            localStorage.setItem('pathName', pathName);
            router.push(`${process.env['NEXT_PUBLIC_SITE_URL']}/login`);
        } else {
            const data = {
                userId: user?._id,
                packageId: item._id || '',
                quantity: 1,
            }
            try {
                const res = await addToCartDetails(data);
                if (res.status === true) {
                    message.success('Package added to cart successfully');
                    router.push('/cart');
                }
            } catch (error) {
                ErrorHandler.showNotification(error);
            }
        }
    };

    return (
        <>
            <section className="section-gap ">
                <div className="container">
                    <h2 className="text-center title-secondary color-dark-gray fw-regular xs-font-sm">
                        Explore Exams Across Australia
                    </h2>
                    <h2 className="text-center title-secondary color-dark-gray fw-regular xs-font-sm ">
                        <span className="package">Practice Packages</span>
                    </h2>
                    <br />
                    <div className="width-80 m-auto rounded-4">
                        <div className='row mt-5'>

                        </div>
                        <Row gutter={[24, 24]} justify='center'>
                            {
                                packages.length === 0 ? (
                                    <div className="col-12 text-center">
                                        <p>No package in this Exam Type</p>
                                    </div>
                                ) : (
                                    packages.map((record: any, index: number) => (
                                        <Col xxl={8} xl={8} lg={8} md={8} key={index}>
                                            <div className='vic-price-table'>
                                                <div className='main-card-price-name'>{record.tag}</div>
                                                <h3>{record.state?.title} {record.examType?.examType}</h3>
                                                {
                                                    record.packageImage ?
                                                        <Image
                                                            preview={false}
                                                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/packageImage/original/${record.packageImage}`}
                                                            alt="Package Image"
                                                            className='icon-img-price'
                                                        />
                                                        :
                                                        <Image
                                                            preview={false}
                                                            src={"images/icon-img-price.png"}
                                                            alt="Package Image"
                                                            className='icon-img-price'
                                                        />
                                                }
                                                <h2 className='mb-4'>{record.packageName}</h2>
                                                <h4 className='price-value mt-5'>${record.packageDiscountPrice ? parseFloat(record.packageDiscountPrice).toFixed(2) : 0} <del className='price-del'>${parseFloat(record.packagePrice).toFixed(2)}</del></h4>
                                                <p className='valid-value'> Valid for {record.packageDuration.DurationTime} days</p>
                                                <ul className='list-values mt-5'>
                                                    {/* @ts-ignore  */}
                                                    {record.features?.map((feature, featureIndex) => (
                                                        <li key={featureIndex} className='check-icon'> {
                                                            feature.availability === 'unavailable' ? (
                                                                <CloseOutlined
                                                                    style={{
                                                                        color: 'red'
                                                                    }}
                                                                />
                                                            ) : (
                                                                <CheckOutlined
                                                                    style={{
                                                                        color: 'green'
                                                                    }}
                                                                />
                                                            )
                                                        } {feature.featureName}</li>
                                                    ))}
                                                </ul>
                                                <button className='premium-btn' onClick={() => handleAddToCart(record)}>Get {record.packageName} - ${record.packageDiscountPrice ? parseFloat(record.packageDiscountPrice).toFixed(2) : 0} </button>
                                            </div>
                                        </Col>

                                    ))

                                )
                            }
                        </Row>
                    </div>
                </div>
            </section >

        </>
    )
}
export default PracticePackages;
