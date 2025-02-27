"use client";
import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Select, Button, Image, message } from 'antd';
import './style.css';
import { EBook } from '@/lib/types';
import { getAllStatesForFilter, getEbooksForStudent, getAllExamTypeForFilter, getStudentCheckoutDetails } from '@/lib/studentApi';
import AuthContext from '@/contexts/AuthContext';
import ErrorHandler from '@/lib/ErrorHandler';
import { addToCartDetails } from '@/lib/frontendApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setTotalCount } from '@/redux/reducers/userCartReducer';
import Link from 'next/link';
const { Option } = Select;

interface StateFilter {
    _id: string;
    title: string;
}

interface ExamTypeFilter {
    _id: string;
    examType: string;
    stateId: string;
}

interface CheckoutData {
    orderSummary: {
        eBook: {
            eBookId: string
        }[]
    }
}


export default function BookListStudent() {
    const [filterStateId, setFilterStateId] = useState('');
    const [filterExamTypeId, setFilterExamTypeId] = useState('');
    const [filterPrice, setFilterPrice] = useState('');
    const [purchaseType, setPurchaseType] = useState('');
    const [perPage, setPerPage] = useState(10);
    const [studentCheckouts, setStudentCheckouts] = useState<CheckoutData[]>();
    const [allEbooks, setAllEbooks] = useState<EBook[]>([]);
    const [allStateForFilter, setAllStateForFilter] = useState<StateFilter[]>();
    const [allExamTypesForFilter, setAllExamTypesForFilter] = useState<ExamTypeFilter[]>();
    const dispatch = useAppDispatch();
    const { user } = useContext(AuthContext);
    const cartItems = useAppSelector((state) => state.userCartReducer.cartItems);

    useEffect(() => {
        fetchData(filterStateId, filterExamTypeId, filterPrice, perPage, purchaseType);
    }, [filterStateId, filterExamTypeId, filterPrice, perPage, purchaseType]);

    const fetchAllStates = async () => {
        try {
            const res = await getAllStatesForFilter();
            if (res.status) setAllStateForFilter(res.data);
        } catch (err) {
            ErrorHandler.showNotification(err);
        }
    };

    const fetchAllExamTypes = async () => {
        try {
            const res = await getAllExamTypeForFilter();
            if (res.status) setAllExamTypesForFilter(res.data);
        } catch (err) {
            ErrorHandler.showNotification(err);
        }
    };

    useEffect(() => {
        fetchAllStates();
        fetchAllExamTypes();
        if (user?._id) fetchUserCheckouts();
    }, [user])

    const fetchUserCheckouts = async () => {
        try {
            const res = await getStudentCheckoutDetails(user?._id as string);
            if (res.status) {
                setStudentCheckouts(res.data);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    const fetchData = async (filterStateId: string, filterExamTypeId: string, filterPrice: string, perPage: number, purchaseType: string) => {
        try {
            const res = await getEbooksForStudent(
                filterStateId,
                filterExamTypeId,
                filterPrice,
                perPage,
                purchaseType,
                user?._id as string,
            );
            console.log(res.data, 'here ebooks data')
            if (res.status) {
                setAllEbooks(res.data);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    const handleDownload = async (item: any) => {
        const fileUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL}/E-bookss/pdfs/${item.pdfFile}`;

        try {
            const response = await fetch(fileUrl);
            if (!response.ok) {
                throw new Error('Failed to download file');
            }
            const blob = await response.blob();
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.setAttribute('download', item.pdfFile);
            link.style.display = 'none';

            document.body.appendChild(link);
            link.click();
            URL.revokeObjectURL(url);
            document.body.removeChild(link);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    const filterForPrice = [
        { label: 'High To Low', value: 'highToLow' },
        { label: 'Low To High', value: 'lowToHigh' },
    ];

    const purchaseTypeFilter = [
        { label: 'Free', value: 'free' },
        { label: 'Paid', value: 'paid' },
        { label: 'My Purchased', value: 'purchased' },
    ];

    const handleAddToCart = async (eBookId: any) => {
        try {
            const data = {
                userId: user?._id,
                eBookId: eBookId,
                quantity: 1,
            }
            const res = await addToCartDetails(data);
            if (res.status === true) {
                message.success(res.message);
                dispatch(setTotalCount(res.totalCount));
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }

    return (
        <section className="dash-part bg-light-steel">
            <h2 className='top-title'>E-Books</h2>
            <div className="card-dash mt-3">
                <Row gutter={16} className='mb-3 colum-spce-mobile'>
                    <Col xxl={5} xl={5} lg={6} md={12} sm={12} xs={24} >
                        <p className="p-sm color-dark-gray p-xs fw-medium mb-1">Select State</p>
                        <Select
                            className='select-list-2 p-relative w-100'
                            placeholder="Select State"
                            value={filterStateId || undefined}
                            onChange={(value) => {
                                setFilterStateId(value);
                                setFilterExamTypeId('');
                            }}
                            allowClear
                        >
                            <Option value={'all'} key="all">All</Option>
                            {allStateForFilter?.map((item) => (
                                <Option value={item._id} key={item._id}>
                                    {item.title}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xxl={5} xl={5} lg={6} md={12} sm={12} xs={24}>
                        <p className="p-sm color-dark-gray p-xs fw-medium mb-1">Select Exam Type</p>
                        <Select
                            placeholder="Select Exam Type"
                            className='select-list-2 p-relative w-100'
                            value={filterExamTypeId || undefined}
                            allowClear
                            disabled={!filterStateId}
                            onChange={(value) => setFilterExamTypeId(value)}
                        >
                            {filterStateId &&
                                allExamTypesForFilter
                                    ?.filter(item => item.stateId === filterStateId)
                                    .map(filteredItem => {
                                        return (
                                            <Option key={filteredItem._id} value={filteredItem._id}>
                                                {filteredItem.examType}
                                            </Option>
                                        )
                                    })
                            }
                        </Select>
                    </Col>
                    <Col xxl={5} xl={5} lg={6} md={12} sm={12} xs={24}>
                        <p className="p-sm color-dark-gray p-xs fw-medium mb-1">Select Price</p>
                        <Select
                            className='select-list-2 p-relative w-100'
                            placeholder="Select Price"
                            value={filterPrice || undefined}
                            allowClear
                            options={filterForPrice}
                            onChange={(value) => setFilterPrice(value)}
                        />
                    </Col>
                    <Col xxl={5} xl={5} lg={0} md={0} sm={0} xs={24}>
                        <p className="p-sm color-dark-gray p-xs fw-medium mb-1">Purchase Type</p>
                        <Select
                            className='select-list-2 p-relative w-100'
                            placeholder="Purchase Type"
                            value={filterPrice || undefined}
                            allowClear
                            options={purchaseTypeFilter}
                            onChange={(value) => setPurchaseType(value)}
                        />
                    </Col>
                    <Col xxl={3} xl={4} lg={6} md={12} sm={12} xs={24}>
                        <p className="p-sm color-dark-gray p-xs fw-medium mb-1">Select Items Per Page
                        </p>
                        <Select
                            className='select-list-2 p-relative w-100'
                            placeholder="Items per page"
                            value={perPage || undefined}
                            onChange={(value) => setPerPage(value)}
                        >
                            <Option value={10}>10</Option>
                            <Option value={20}>20</Option>
                            <Option value={30}>30</Option>
                            <Option value={50}>50</Option>
                            <Option value={100}>100</Option>
                            <Option value={'all'}>All</Option>
                        </Select>
                    </Col>
                </Row>
                <Row gutter={[16, 12]}>
                    {allEbooks.map((item, index) => {
                        console.log(item, '******')
                        return (
                            <Col key={index} xl={4} lg={3} md={6} sm={12}>
                                <div className="book-card">
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
                                                ${item.price}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="book-card__button-container">
                                        {studentCheckouts &&
                                            studentCheckouts[0]?.orderSummary?.eBook &&
                                            studentCheckouts[0].orderSummary.eBook.some(
                                                (checkout) => checkout.eBookId === item._id || item.isFree === 'yes'
                                            ) ? (
                                            <Button
                                                className="book-card__button"
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    fontSize: '14px',
                                                    backgroundColor: '#8C52FF',
                                                    borderRadius: '8px',
                                                    color: '#fff',
                                                    height: '100%',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                                onClick={() => handleDownload(item)}
                                            >
                                                Download full ebook
                                            </Button>
                                        ) : (
                                            <Button
                                                className="book-card__button"
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    fontSize: '14px',
                                                    backgroundColor: '#8C52FF',
                                                    borderRadius: '8px',
                                                    color: '#fff',
                                                    height: '100%',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                                onClick={() => handleAddToCart(item._id)}
                                                disabled={item?.isFree === 'yes'}
                                            >
                                                {cartItems && cartItems.eBook.some((ebk) => ebk.eBookId === item._id)
                                                    ? 'Already in Cart'
                                                    : 'Add to Cart'}
                                            </Button>
                                        )}
                                    </div>

                                </div>
                            </Col>
                        );
                    })}
                </Row>
            </div>
        </section >
    );
}
