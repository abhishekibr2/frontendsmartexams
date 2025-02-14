import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Table, Space, message, Popconfirm, Button, Input, Row, Col } from 'antd';
import './style.css';
import { EBook } from '@/lib/types';
import AddEbookForm from '@/components/Admin/AddEbookForm';
import { deleteEbook, getAllEbook, getAllExamType, getAllGrades, getAllStates, getAllSubjects } from '@/lib/adminApi';
import { useDispatch } from 'react-redux';
import { setBooks } from '@/redux/reducers/eBookReducer';
import { setExamType } from '@/redux/reducers/examReducer';
import { setSubjects } from '@/redux/reducers/subjectReducer';
import { setServices } from '@/redux/reducers/serviceReducer';
import { setGrades } from '@/redux/reducers/gradeReducer';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import Titles from '@/app/commonUl/Titles';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

interface TableDataProps {
    fetchData: () => void;
}

const TableData: React.FC<TableDataProps> = () => {
    const [ebookData, setEbookData] = useState<EBook | null>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const dispatch = useDispatch();
    const Ebooks = useAppSelector((state: RootState) => state.eBookReducer.books);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const fetchData = useCallback(async () => {
        try {
            const [ebooksRes, examRes, stateRes, subjectRes, gradeRes] = await Promise.all([
                getAllEbook(),
                getAllExamType(),
                getAllStates(),
                getAllSubjects(),
                getAllGrades()
            ]);

            if (ebooksRes) dispatch(setBooks(ebooksRes.eBooks));
            dispatch(setExamType(examRes.data));
            dispatch(setServices(stateRes.data));
            dispatch(setSubjects(subjectRes.data));
            dispatch(setGrades(gradeRes.data));

        } catch (error) {
            console.error(error);
        }
    }, [dispatch]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const toggleFormVisibility = () => {
        setEbookData(null);
        setIsFormVisible(true);
    };

    const handleEditClick = (record: EBook) => {
        setEbookData(record);
        setIsFormVisible(true);
    };

    const confirmDelete = async (record: string) => {
        try {
            await deleteEbook({ id: record });
            fetchData();
            message.success('Book deleted successfully');
        } catch (error) {
            message.error('Failed to delete the book. Please try again.');
        }
    };

    const closeForm = () => {
        setEbookData(null);
        setIsFormVisible(false);
    };

    const columns = useMemo(() => [
        {
            title: 'EBook Title',
            dataIndex: 'title',
            key: 'title',
            width: '20%',
            filterMultiple: false,
            onFilter: (value: any, record: EBook) =>
                record.title.toLowerCase().includes(value.toLowerCase()),
            filterDropdown: () => (
                <Input
                    placeholder="Search title"
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ width: 150, padding: 8 }}
                />
            ),
            render: (text: string) => {
                const words = text.split(' ');
                const firstLine = words.slice(0, 4).join(' ');
                const remainingWords = words.slice(4).join(' ');
                return (
                    <>
                        <div>{firstLine}</div>
                        {remainingWords && <div>{remainingWords}</div>}
                    </>
                );
            },
            sorter: (a: any, b: any) => a.title.localeCompare(b.title),  // Added sorter

        }
        ,
        {
            title: 'State',
            dataIndex: 'stateId',
            key: 'state',
            width: '20%',

            render: (stateId: { title: string }) => <span>{stateId?.title || 'N/A'}</span>,
            onFilter: (value: any, record: EBook) => record.stateId?.title.toLowerCase().includes(value.toLowerCase()),
            filterDropdown: () => (
                <Input
                    placeholder="Search state"
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ width: 150, padding: 8 }}
                />
            ),
            sorter: (a: any, b: any) => a.stateId?.title.localeCompare(b.stateId?.title),  // Added sorter

        },
        {
            title: 'Exam Type',
            dataIndex: 'examTypeId',
            key: 'examType',
            width: '20%',

            render: (examTypeId: { examType: string }) => <span>{examTypeId?.examType || 'N/A'}</span>,
            onFilter: (value: any, record: any) => record.examTypeId?.examType.toLowerCase().includes(value.toLowerCase()),
            filterDropdown: () => (
                <Input
                    placeholder="Search state"
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ width: 150, padding: 8 }}
                />
            ),
            sorter: (a: any, b: any) => a.examTypeId?.examType.localeCompare(b.examTypeId?.examType),  // Added sorter

        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            width: '20%',

            onFilter: (value: any, record: EBook) => record.price.toString().includes(value),
            filterDropdown: () => (
                <Input
                    placeholder="Search price"
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ width: 150, padding: 8 }}
                />
            ),
            sorter: (a: any, b: any) => a.price - b.price,

        },
        {
            title: 'Discount',
            dataIndex: 'discount',
            key: 'discount',
            width: '10%',
            onFilter: (value: any, record: EBook) => record.discount?.toString().includes(value),
            filterDropdown: () => (
                <Input
                    placeholder="Search discount"
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ width: 150, padding: 8 }}
                />
            ),
            render: (discount: number | string) => {
                return discount != null && discount !== '' ? discount : 'N/A';
            },
            sorter: (a: any, b: any) => a.discount - b.discount,
        },

        {
            title: 'Actions',
            key: 'actions',
            width: '20%',
            render: (_: any, record: EBook) => (
                <Space size="middle"  >
                    <Popconfirm
                        title="Are you sure you want to delete this eBook?"
                        onConfirm={() => confirmDelete(record._id)}
                        okText="Yes"
                        cancelText="No"

                    >

                        <Button style={{ marginLeft: '10px' }}>
                            <DeleteOutlined />
                        </Button>
                    </Popconfirm>
                    <Button
                        onClick={() => handleEditClick(record)}
                    >
                        <EditOutlined />
                    </Button>
                </Space>

            ),
        },
    ], []);

    const filteredData = Ebooks.filter((ebook) => {
        return (
            ebook.title?.toLowerCase().includes(searchQuery) ||
            (ebook.stateId?.title && ebook.stateId.title?.toLowerCase().includes(searchQuery)) ||
            (ebook.examTypeId?.examType && ebook.examTypeId.examType?.toLowerCase().includes(searchQuery)) ||
            ebook.price?.toString().includes(searchQuery) ||
            ebook.discount?.toString().includes(searchQuery)
        );
    });

    return (
        <div>
            <Row gutter={[24, 24]} >
                <Col xs={24} sm={24} md={12} lg={16} xxl={15} xl={16}>
                    <Titles level={5} className="top-title">
                        Ebook
                    </Titles>
                </Col>
                {!isFormVisible ? (
                    <>
                        <Col xs={24} sm={24} md={4} lg={5} xxl={6} xl={5}>
                            <Input
                                placeholder="Search ebook Title"
                                onChange={handleSearchChange}
                                maxLength={40}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={4} lg={3} xxl={2} xl={3}>
                            <div className="floatRight text-end">
                                <Space size="small">
                                    <Button
                                        type="primary"
                                        onClick={toggleFormVisibility}
                                        style={{ marginBottom: '20px' }}
                                    >
                                        Upload New eBook
                                    </Button>
                                </Space>
                            </div>

                        </Col>
                    </>
                ) : null}
            </Row>
            <Row gutter={[16, 16]} align="middle">
                <Col xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>
                    <h6 >Count: {filteredData.length}</h6>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>

                </Col>
            </Row>
            {!isFormVisible ? (
                <>
                    <div className="desktop-view card-dash shadow-none">
                        <Table
                            rowKey="_id"
                            columns={columns}
                            dataSource={filteredData}
                            bordered={false}
                            className="custom-table"

                            pagination={{
                                pageSizeOptions: ['5', '10', '20', '50', '100'],
                                defaultPageSize: 10,
                                showSizeChanger: true,
                            }}
                        />
                    </div>
                </>
            ) : (
                <AddEbookForm
                    {...(ebookData && { ebook: ebookData })}
                    fetchData={fetchData}
                    closeForm={closeForm}
                />
            )}
        </div>
    );
};

export default TableData;
