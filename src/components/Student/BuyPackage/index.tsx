'use client';
import React, { useState, useContext, useEffect } from 'react';
import Link from 'next/link'
import { Modal, Table, Image, message } from 'antd'
import { Button } from 'antd'
import { addToCartDetails, getAllCartItems } from '@/lib/frontendApi';
import AuthContext from '@/contexts/AuthContext';
import { CartData, PracticePackage } from '@/lib/types';
import ErrorHandler from '@/lib/ErrorHandler';
import { useRouter } from 'next/navigation';

export default function BuyPackageListing({ getPackage }: any) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<any>(null);
    const { user } = useContext(AuthContext);
    const router = useRouter();

    const showModal = (packageId: string) => {
        setIsModalOpen(true);
        const selected = getPackage.find((data: any) => data._id === packageId);
        setSelectedPackage(selected);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };


    const handleAddToCart = async (item: PracticePackage) => {
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

    };

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: 'Package Name',
            dataIndex: 'packageName',
            key: 'packageName',
            render: (text: any) => text || 'N/A'
        },
        {
            title: 'State',
            dataIndex: 'state',
            key: 'state',
            align: 'center',
            render: (text: any) => text?.title || 'N/A',
        },
        {
            title: 'Exam Type',
            dataIndex: 'examType',
            key: 'examType',
            render: (text: any) => text?.examType || 'N/A'
        },
        {
            title: 'Subject',
            dataIndex: 'subjectsInPackage',
            key: 'subjectsInPackage',
            align: 'center',
            render: (subjects: any) => {
                return subjects && subjects.length > 0
                    ? subjects.map((subject: any) => subject.subjectName).join(', ')
                    : 'N/A';
            },
        },
        {
            title: 'Grade',
            dataIndex: 'grade',
            key: 'grade',
            align: 'center',
            render: (text: any) => text?.gradeLevel || 'N/A',
        },
        {
            title: 'Price',
            dataIndex: 'packagePrice',
            key: 'packagePrice',
            align: 'center',
            render: (text: any) => text || '0',
        },
        {
            title: 'Actions',
            dataIndex: 'operation',
            key: 'operation',
            render: (_: any, record: any) => (
                <>
                    <Link href='/cart'>
                        <Button className='right-gap-15' onClick={() => handleAddToCart(record)}>
                            <i className="fa-solid fa-cart-plus"></i>
                        </Button>
                    </Link>

                    <Button onClick={() => showModal(record?._id)}>
                        <i className="fa-solid fa-eye"></i>
                    </Button>
                </>
            ),
        },
    ];


    return (
        <>
            <section className="dash-part bg-light-steel">
                <div className="d-flex">
                    <div className="w-100 spac-dash ">
                        <h2 className="top-title">
                            Buy Tests
                        </h2>
                        <Table
                            className="text-center shadow-sm mt-3"
                            columns={columns.map((col) => ({
                                ...col,
                                align: 'center',
                            }))}
                            dataSource={getPackage.map((item: any, index: any) => ({
                                ...item,
                                index,
                            }))}
                        />

                    </div>
                </div>
            </section>

            <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={380} footer={null} closable={false} className='custom-package-modal'>
                <div className='card  order-complete border-success'>
                    <h6 className="title-tertiary fw-regular text-success top-medium-space text-center">
                        {selectedPackage?.state?.title} {selectedPackage?.examType?.examType}
                    </h6>
                    <div style={{ textAlign: 'center' }}>
                        <Image
                            src={getPackage.packageImage ? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/packageImage/original/${selectedPackage?.packageImage}` : '/images/smart/prise-1.png'}

                            alt="package-1"
                            className="m-auto mb-2 rounded"
                            width={100}
                            height={100}
                            preview={false}
                        />
                    </div>


                    <h3 className="text-center title-small fw-regular color-dark-gray">
                        {selectedPackage?.packageName}
                    </h3>
                    {Number(selectedPackage?.packageDiscountPrice) > 0 ?
                        <h5 className="title-tertiary fw-regular text-center">
                            ${parseFloat(selectedPackage?.packageDiscountPrice).toFixed(2)}
                        </h5>
                        :
                        <h5 className="title-tertiary fw-regular text-center">
                            ${parseFloat(selectedPackage?.packagePrice).toFixed(2)}
                        </h5>
                    }
                    {Number(selectedPackage?.packagePrice) > 0 &&
                        <del style={{ fontSize: '16px' }} className='text-muted text-center mx-1'>
                            ${parseFloat(selectedPackage?.packagePrice).toFixed(2)}
                        </del>
                    }
                    <div className="text-center">
                        <p style={{ fontSize: '12px' }}> Valid for {selectedPackage?.packageDuration?.DurationTime}</p>
                    </div>
                    <div className="description mb-3"
                        style={{
                            height: '200px',
                            overflow: 'auto',
                            overflowWrap: 'break-word',
                            wordBreak: 'break-word',
                            whiteSpace: 'pre-wrap',
                            lineHeight: '1.5',
                            scrollbarWidth: 'thin',
                        }}
                    >
                        <p
                            className="p-xs fw-regular set-content"
                            dangerouslySetInnerHTML={{ __html: selectedPackage?.packageDescription || '' }}
                        ></p>
                    </div>
                    {Number(selectedPackage?.packagePrice) < 0
                        ?
                        <p className="p-xs fw-regular color-purple text-center fw-medium top-max-space">
                            No Credit Card Required!
                        </p>
                        :
                        ''
                    }

                    {Number(selectedPackage?.packagePrice) > 0
                        ?
                        <button className='bg-success btn rounded-pill fix-content-width m-auto p-xxs fw-bold text-center w-100 text-light' onClick={() => handleAddToCart(selectedPackage)}>
                            Buy Scholar
                        </button>
                        :
                        <button className='bg-success btn rounded-pill fix-content-width m-auto p-xxs fw-bold text-center w-100 text-light' onClick={() => handleAddToCart(selectedPackage)}>
                            GET STARTED
                        </button>
                    }
                </div>
            </Modal >
        </>
    )
}
