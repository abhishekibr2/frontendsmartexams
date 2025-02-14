"use client";
import React, { useContext, useState, useEffect } from 'react';
import { Row, Col, Button, Image, message, Select } from 'antd';
import './style.css';
import { EBook } from '@/lib/types';
import Link from 'next/link';
import { addToCartDetails } from '@/lib/frontendApi';
import AuthContext from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import ErrorHandler from '@/lib/ErrorHandler';
import { setExamType } from '@/redux/reducers/examReducer';
import { setServices } from '@/redux/reducers/serviceReducer';
import { useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { useAppSelector } from '@/redux/hooks';
import { getAllExamType, getAllStates } from '@/lib/frontendApi';

const { Option } = Select;
interface Props {
    eBooksData?: EBook[];
}

const EbookSection = ({ eBooksData = [] }: Props) => {
    const { user } = useContext(AuthContext);
    const pathName = usePathname();
    const router = useRouter();
    // const [state, setState] = useState()
    const [filteredBooks, setFilteredBooks] = useState<any[]>(eBooksData);
    const stateList = useAppSelector((state: RootState) => state.serviceReducer.services);
    const examList = useAppSelector((state: RootState) => state.examTypeReducer.examTypes);
    const dispatch = useDispatch();
    const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
    const [selectedExamTypeId, setSelectedExamTypeId] = useState<string | null>(null);

    const handleChange = async (stateId: string | null) => {
        setSelectedStateId(stateId);
        let filteredData = stateId && stateId !== 'all'
            ? eBooksData.filter((book: any) => book?.stateId === stateId)
            : eBooksData;

        if (selectedExamTypeId) {
            filteredData = filteredData.filter((book: any) => book.examTypeId === selectedExamTypeId);
        }
        setFilteredBooks(filteredData);
        const examType = await getAllExamType();
        if (examType?.data) {
            const filteredExamTypes = examType.data.filter((exam: any) =>
                filteredData.some((ebook: any) => ebook.examTypeId === exam._id)
            );
            dispatch(setExamType(filteredExamTypes));
        }
    };

    const handleExamType = (examTypeId: string | null) => {
        setSelectedExamTypeId(examTypeId);
        let filteredData = eBooksData;
        if (selectedStateId) {
            filteredData = filteredData.filter((book: any) => book?.stateId === selectedStateId);
        }
        if (examTypeId) {
            filteredData = filteredData.filter((book: any) => book.examTypeId === examTypeId);
        }
        setFilteredBooks(filteredData);
    };

    const handleFilter = (value: string) => {
        if (!value) { setFilteredBooks(eBooksData); return; }
        if (value === "Low to High") {
            const sortedBooks = [...filteredBooks].sort((a, b) => a.price - b.price);
            setFilteredBooks(sortedBooks);
        } else if (value === "High to Low") {
            const sortedBooks = [...filteredBooks].sort((a, b) => b.price - a.price);
            setFilteredBooks(sortedBooks);
        }
    }

    useEffect(() => {
        fetchState();
    }, [])

    const fetchState = async () => {
        try {
            const state = await getAllStates();
            if (state?.data) {
                const filteredServices = state.data.filter((service: any) =>
                    eBooksData.some((ebook: any) => ebook?.stateId === service?._id)
                );
                dispatch(setServices(filteredServices));
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }

    const handleAddToCart = async (item: any) => {
        if (!user) {
            localStorage.setItem('pathName', pathName);
            router.push(`${process.env['NEXT_PUBLIC_SITE_URL']}/login`);
        } else {
            const data = {
                userId: user?._id,
                eBookId: item._id,
                quantity: 1,
            }
            try {
                const res = await addToCartDetails(data);
                if (res.status === true) {
                    message.success('Ebook added to cart successfully');
                    router.push('/cart');
                }
            } catch (error) {
                ErrorHandler.showNotification(error);
            }
        }
    };

    return (
        <section className="dash-part bg-light-steel">
            <Row>
                <Col xl={24} lg={24} md={24} sm={24} >
                    <div className="card-dash">
                        <div className='bottom-space-30'>
                            <Row gutter={16} justify="end" style={{ marginBottom: 20 }}>
                                <Col xl={12} lg={12} md={12} sm={12} xs={24} ></Col>
                                <Col xl={4} lg={4} md={4} sm={4} xs={24} >
                                    <Select
                                        showSearch
                                        placeholder="Select State"
                                        onChange={handleChange}
                                        className="select-info-btn"
                                        allowClear
                                        disabled={!!selectedExamTypeId}
                                    >
                                        <Option value={'all'}>
                                            All
                                        </Option>
                                        {stateList.map((state) => (
                                            <Option key={state.title} value={state._id}>
                                                {state.title}
                                            </Option>
                                        ))}
                                    </Select>
                                </Col>
                                <Col xl={4} lg={4} md={4} sm={4} xs={24}>
                                    <Select
                                        showSearch
                                        placeholder="Select Exam Type"
                                        onChange={handleExamType}
                                        className="select-info-btn"
                                        allowClear
                                    >
                                        {examList.map((item) => (
                                            <Option key={item?._id} value={item?._id}>
                                                {item?.examType}
                                            </Option>
                                        ))}
                                    </Select>
                                </Col>
                                <Col xl={4} lg={4} md={4} sm={4} xs={24}>
                                    <Select
                                        showSearch
                                        placeholder="Sort by Price"
                                        onChange={handleFilter}
                                        className="select-info-btn"
                                        allowClear
                                    >
                                        <Option value="Low to High">Low to High</Option>
                                        <Option value="High to Low">High to Low</Option>
                                    </Select>
                                </Col>
                            </Row>
                        </div>
                        <Row gutter={24}>
                            {filteredBooks.map((item: any, index) => (
                                <Col key={index} xl={4} lg={3} md={6} sm={12} xs={24}>
                                    <div className="book-card">
                                        <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/ebooks/${item.slug}`} className="book-card__link">
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
                                            <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/ebooks/${item.slug}`} className="book-card__link">
                                                <p className="book-card__title">
                                                    {item.title}
                                                </p>
                                            </Link>
                                            <p className="book-card__price">

                                                Price: <span style={{ color: '#09a6eb' }}>${item.discountedPrice}</span>
                                                <span style={{ textDecoration: 'line-through', color: 'gray', marginLeft: '8px', fontSize: 'smaller' }}>
                                                    ${item.price}
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
                                                <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/ebooks/${item.slug}`} className="book-card__link">
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
                                                {/* <span className="book-card__icon">🛒</span> */}
                                                Add to Cart
                                            </Button>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Col>
            </Row>
        </section >
    );
};

export default EbookSection;
