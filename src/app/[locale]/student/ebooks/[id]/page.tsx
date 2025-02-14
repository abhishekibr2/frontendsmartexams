"use client"
import React, { useContext, useEffect, useState } from 'react';
import { getSingleEbook } from '@/lib/studentApi';
import { Col, Row, Image, message, Button } from 'antd';
import { addToCartDetails } from '@/lib/frontendApi';
import { setTotalCount } from '@/redux/reducers/userCartReducer';
import ErrorHandler from '@/lib/ErrorHandler';
import { useAppDispatch } from '@/redux/hooks';
import AuthContext from '@/contexts/AuthContext';
import { useParams } from "next/navigation";
import Link from 'next/link';
import './style.css'

export default function Page() {
    const [ebookData, setData] = useState<any>([])
    const dispatch = useAppDispatch();
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [randomBooks, setRandomBooks] = useState([])
    const { id }: any = useParams();

    useEffect(() => {
        const getData = async () => {
            const res = await getSingleEbook(id);
            setData(res.data)
            setRandomBooks(res.randomBooks)
        }
        getData()
    }, [id])

    const handleAddToCart = async (eBookId: any) => {
        try {
            setLoading(true);
            const data = {
                userId: user?._id,
                eBookId: eBookId,
                quantity: 1,
            }
            const res = await addToCartDetails(data);
            if (res.status === true) {
                message.success(res.message);
                dispatch(setTotalCount(res.totalCount));
                setLoading(false);
            }
        } catch (error) {

            ErrorHandler.showNotification(error);
        }
    }

    return (
        <>
            <div style={{ marginBottom: '50px' }}>
                <Row gutter={[24, 24]} justify="center">
                    <Col xl={5} lg={5} md={5} sm={24} className="text-center">
                        <Image
                            alt="Ebook Image"
                            src={
                                ebookData && ebookData.image
                                    ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/E-bookss/original/${ebookData?.image}`
                                    : '/images/profile-user.jpg'
                            }
                            preview={false}
                            className="book-card__image"
                            style={{
                                width: '264px',
                                objectFit: 'cover',
                                height: '320px',
                                borderRadius: '12px',
                            }}
                        />
                    </Col>
                    <Col xl={13} lg={13} md={13} sm={24}>
                        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <h2 style={{
                                marginBottom: '12px',
                                fontWeight: 'bold',
                                fontSize: '26px',
                                color: '#333',
                            }}>
                                {ebookData?.title}
                            </h2>
                            <p style={{
                                fontSize: '18px',
                                color: '#666',
                                lineHeight: '1.6',
                                textAlign: 'justify',
                            }}>
                                {ebookData?.description?.replace(/<[^>]*>/g, '')}
                            </p>
                            <div style={{
                                width: 'fit-content',
                                padding: '15px',
                                marginTop: 'auto',
                                backgroundColor: '#f0fdf4',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                border: '1px solid #24a148',
                            }}>
                                <span style={{
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    color: '#333',
                                }}>
                                    Price:
                                </span>
                                <span style={{
                                    color: '#24a148',
                                    fontSize: '18px',
                                    fontWeight: '600',
                                }}>
                                    ${ebookData?.discountedPrice}
                                </span>
                                <span style={{ textDecoration: 'line-through', color: 'gray', marginLeft: '8px', marginTop: '10px', fontSize: 'smaller' }}>
                                    ${ebookData?.price}
                                </span>
                            </div>
                        </div>

                    </Col>
                    <Col xl={6} lg={6} md={6} sm={24} className="text-center">
                        <div style={{ padding: '20px', textAlign: 'center', border: '1px solid #ddd', borderRadius: '8px' }}>
                            {/* Price */}
                            <h3 style={{
                                color: '#24a148',
                                fontSize: '30px',
                                fontWeight: 'bold',
                                marginBottom: '16px',
                            }}>
                                ${ebookData?.price || '0.00'}
                            </h3>
                            <p style={{
                                fontSize: '18px',
                                fontWeight: 'bold',
                                color: '#333',
                                marginBottom: '8px'
                            }}>
                                State: <span style={{ color: '#0073e6' }}>{ebookData?.stateId?.title}</span>
                            </p>
                            <p style={{
                                fontSize: '18px',
                                fontWeight: 'bold',
                                color: '#333',
                                marginBottom: '16px'
                            }}>
                                Exam Type: <span style={{ color: '#ff9900' }}>{ebookData?.examTypeId?.examType}</span>
                            </p>
                            <button
                                style={{
                                    backgroundColor: '#ff4d4f',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '12px 20px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    transition: 'all 0.3s ease',
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d9363e'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ff4d4f'}
                                onClick={() => handleAddToCart(ebookData)}
                            >
                                {loading ? 'Adding...' : 'Add to Cart'}
                            </button>
                        </div>
                    </Col>
                </Row>
                <div className='gapMarginTop'></div>
                <div>
                    <h2 style={{ margin: '40px 0' }}>Recommended Books</h2>
                    <Row gutter={24}>
                        {randomBooks.map((item: any, index: number) => (
                            <Col key={index} xl={4} lg={3} md={12} sm={12}>
                                <div className="book-card  ">
                                    <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/student/ebooks/${item._id}`} className="book-card__link">
                                        <div className="book-card__image-container">
                                            <Image
                                                className="book-card__image"
                                                alt="Ebook-image"
                                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/E-bookss/small/${item.image}`}
                                                preview={false}
                                            />
                                        </div>
                                    </Link>
                                    <div className="book-card__content">
                                        <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/student/ebooks/${item._id}`} className="book-card__link">
                                            <p className="book-card__title">
                                                {item.title}
                                            </p>
                                        </Link>
                                        <p className="book-card__price">
                                            Price: <span style={{ color: '#09a6eb' }}>${item.discountedPrice}</span>
                                            <span style={{ textDecoration: 'line-through', color: 'gray', marginLeft: '8px', fontSize: 'smaller' }}>
                                                ${item?.price}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="book-card__button-container">
                                        <Button className="book-card__button"
                                            style={{
                                                width: '48%',
                                                padding: '10px',
                                                fontSize: '14px',
                                                backgroundColor: '#e46059',
                                                borderRadius: '8px',
                                                color: '#fff',
                                                height: '100%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/student/ebooks/${item._id}`} className="book-card__link">
                                                {/* <span className="book-card__icon">📖</span> */}
                                                View Book
                                            </Link>
                                        </Button>

                                        <Button className="book-card__button" disabled={item?.isFree === 'yes'} style={{
                                            width: '48%',
                                            padding: '10px',
                                            fontSize: '14px',
                                            backgroundColor: '#e46059',
                                            borderRadius: '8px',
                                            color: '#fff',
                                            height: '100%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }} onClick={() => handleAddToCart(item)}>
                                            Add to Cart
                                        </Button>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div >
        </>
    );
}
