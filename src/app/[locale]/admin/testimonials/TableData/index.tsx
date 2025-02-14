'use client';
import React, { useEffect, useState } from 'react';
import { Form, Popconfirm, Modal, Button, message, Image, Avatar, Row, Col, Space, Select } from 'antd';
import FormModal from '../FormModal';
import { EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { deleteTestimonials } from '@/lib/adminApi';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setEditData, setFetchTestimonials, setModal } from '@/redux/reducers/testimonialReducer';
import { truncateLongString } from '@/helper/stringFunctions';
import { dateFormat } from '@/helper/dateFormat';
import Titles from '@/app/commonUl/Titles';
import PrimaryButton from '@/app/commonUl/primaryButton'; import ResponsiveTable from '@/commonUI/ResponsiveTable';
import { ExamType, State } from '@/lib/types';
import { getStateWithExamTypes } from '@/lib/frontendApi';
import { ignore } from 'antd/es/theme/useToken';

interface Testimonial {
    _id: string;
    createdAt: string;
    createdBy: string | null;
    deletedAt: string;
    deletedBy: string | null;
    description: string;
    designation: string;
    image: string | null;
    name: string;
    status: 'active' | 'inactive';
    updatedAt: string;
    updatedBy: string | null;
    __v: number;
    state: {
        title: 'string'
    };
    examType: {
        examType: 'string'
    };
    pages: string;
}

const TableData = () => {
    const [form] = Form.useForm();
    const [selectedAuthorIds, setSelectedAuthorIds] = useState<string[]>([]);
    const isModalOpen = useSelector((state: RootState) => state.testimonialReducer.modal);
    const testimonial = useSelector((state: RootState) => state.testimonialReducer.testimonial);
    const editData = useSelector((state: RootState) => state.testimonialReducer.editData); // Get the data for editing
    const fetchTestimonials = useSelector((state: RootState) => state.testimonialReducer.fetchTestimonials)
    const dispatch = useDispatch();
    const { Option } = Select;
    const [pageFilter, setPageFilter] = useState<string>('');
    const [stateFilter, setStateFilter] = useState<string>('');
    const [examTypeFilter, setExamTypeFilter] = useState<string>('');
    const [state, setState] = useState<any[]>([]);

    const [filteredExamTypes, setFilteredExamTypes] = useState<any[]>([]);

    const showModal = () => {
        dispatch(setModal(true))
    };

    const handlePageChange = (value: string) => {
        setPageFilter(value);
        setStateFilter('');
        setExamTypeFilter('');
    };


    const handleStateChange = (value: string) => {
        if (value === "") {
            setStateFilter(value);
            setExamTypeFilter('');
        } else {
            setStateFilter(value);
            setExamTypeFilter('');
        }
        const selectedState = state.find((item) => item._id === value);
        if (selectedState) {
            setFilteredExamTypes(selectedState?.examTypes);
        } else {
            setFilteredExamTypes([]);
        }
    };


    const handleExamTypeChange = (value: string) => {
        setExamTypeFilter(value);
    };
    const getStates = async () => {
        try {
            const response = await getStateWithExamTypes();
            setState(response.data);
        } catch (error) {
            console.error('Error while getting states:', error);
        }
    };

    useEffect(() => {
        getStates();
    }, []);
    const confirmDelete = async (ids: string[]) => {
        try {
            const res = await deleteTestimonials(ids);
            if (res) {
                dispatch(setFetchTestimonials(!fetchTestimonials));
                message.success(res.message);
                setSelectedAuthorIds([]);
            }
        } catch (error) {
            message.error('Failed to delete testimonials. Please try again.');
        }
    };



    const columns = [

        {
            title: 'Pages',
            dataIndex: 'pages',
            key: 'pages',
            sorter: (a: Testimonial, b: Testimonial) =>
                // @ts-ignore
                (a.pages?.join(', ') || '').localeCompare(b.pages?.join(', ') || ''),
            defaultSortOrder: 'ascend',
            render: (pages: string[]) => pages?.join(' , ') || 'N/A',
        },
        {
            title: 'State',
            dataIndex: 'state',
            key: 'state',
            render: (text: any, record: any) => record?.state?.title,
            sorter: (a: Testimonial, b: Testimonial) => a.state?.title.localeCompare(b.state?.title),
            defaultSortOrder: 'ascend',
        },
        {
            title: 'Exam Name',
            dataIndex: 'examType',
            key: 'examType',
            render: (text: any, record: any) => record?.examType?.examType,
            sorter: (a: Testimonial, b: Testimonial) => a.examType?.examType.localeCompare(b.examType?.examType),
            defaultSortOrder: 'ascend',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            editable: true,
            key: 'name',
            sorter: (a: Testimonial, b: Testimonial) =>
                (a.name || '').localeCompare(b.name || ''),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            editable: true,
            key: 'description',
            render: (description: string) => truncateLongString(description, 15)
        },
        {
            title: 'CreatedAt',
            dataIndex: 'createdAt',
            render: (createdAt: Date) => dateFormat(createdAt),
            sorter: (a: Testimonial, b: Testimonial) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return dateA - dateB;
            }
        },
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (_: string, testimonials: Testimonial) => (
                testimonials.image ?
                    <Image
                        preview={true}
                        src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/testimonials/original/${testimonials.image}`}
                        alt="image"
                        style={{ width: 50, height: 50, borderRadius: '50px' }}
                    />
                    :
                    <Avatar size={50} icon={<UserOutlined />} />
            )
        },
        {
            title: 'Action',
            dataIndex: 'operation',
            render: (_: string, record: Testimonial) => (
                <>
                    <div style={{ display: 'flex', }}>
                        <Button
                            onClick={() => {
                                showModal();
                                handleEditClick(record);
                            }}
                        >
                            <EditOutlined />
                        </Button>
                        <Popconfirm
                            title="Are you sure you want to delete this testimonial?"
                            onConfirm={() => confirmDelete([record._id])}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button style={{ marginLeft: '10px' }}>
                                <DeleteOutlined />
                            </Button>
                        </Popconfirm>
                    </div>
                </>
            )
        }
    ];

    const handleEditClick = async (record: any) => {
        dispatch(setEditData(record));
    };

    const GetSelectedId = (data: string[]) => {
        setSelectedAuthorIds(data)
    }

    const formattedData = testimonial?.map((item: Testimonial) => ({
        ...item,
        key: item._id,
    })) || [];

    const filteredData = formattedData.filter((item: any) => {
        const isPageMatch = pageFilter ? item.pages === pageFilter : true;
        const isStateMatch = stateFilter ? item.state?._id === stateFilter : true;
        const isExamTypeMatch = examTypeFilter ? item.examType?._id === examTypeFilter : true;
        return isPageMatch && isStateMatch && isExamTypeMatch;
    });

    return (
        <>
            <Row >
                <Col className="" xs={24} sm={24} md={8} lg={8} xxl={12} xl={6}>
                    <Titles level={5} className="top-title">
                        Testimonials ({testimonial.length})
                    </Titles>
                </Col>
                <Col className="" xs={24} sm={24} md={16} lg={16} xxl={12} xl={18}>
                    <div className="floatRight text-end" >
                        <Row gutter={16} >

                            <Col xs={24} sm={24} md={4} lg={4} xxl={4} xl={4}>
                                {selectedAuthorIds.length > 0 && (
                                    <Popconfirm
                                        title="Are you sure to delete selected testimonials?"
                                        onConfirm={() => confirmDelete(selectedAuthorIds)}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button
                                            className="primary"
                                            danger
                                            ghost
                                            style={{ color: '#b90d0d', background: '#af03031f' }}
                                        >
                                            <RiDeleteBin5Line
                                                style={{ fontSize: '15px', margin: '0 5px -1px 0' }}
                                            />
                                            Delete
                                        </Button>
                                    </Popconfirm>
                                )}
                            </Col>
                            <Col xs={24} sm={24} md={5} lg={5} xxl={5} xl={5}>

                                <Select placeholder="Select Page" onChange={handlePageChange}
                                    //  value={pageFilter}
                                    value={pageFilter || undefined}

                                    style={{ width: '100%' }}
                                >
                                    <Option value="">All</Option>
                                    <Option value="Home">Home</Option>
                                    <Option value="Exam Info">Exam Info</Option>
                                    <Option value="Tutoring & Classes">Tutoring & Classes</Option>
                                    <Option value="Why Choose Us">Why Choose Us</Option>

                                </Select>
                            </Col>

                            <Col xs={24} sm={24} md={5} lg={5} xxl={5} xl={5}>

                                <Select
                                    placeholder="Select a state"
                                    onChange={handleStateChange}
                                    style={{ width: '100%' }}
                                    // value={stateFilter}
                                    value={stateFilter || undefined}

                                >
                                    <Option value="">All</Option>
                                    {state.map((item) => (
                                        <Option key={item._id} value={item._id}>
                                            {item.title}
                                        </Option>
                                    ))}
                                </Select>
                            </Col>

                            <Col xs={24} sm={24} md={5} lg={5} xxl={5} xl={5}>

                                <Select
                                    placeholder="Select Exam Type"
                                    style={{ width: '100%' }}
                                    // value={examTypeFilter}
                                    value={examTypeFilter || undefined}
                                    onChange={handleExamTypeChange}
                                >
                                    <Option value="">All</Option>
                                    {filteredExamTypes.map((examType: any) => (
                                        <Option key={examType._id} value={examType._id}>
                                            {examType.examType}
                                        </Option>
                                    ))}
                                </Select>
                            </Col>
                            <Col xs={24} sm={24} md={5} lg={5} xxl={5} xl={5}>
                                <Space >


                                    <PrimaryButton
                                        label="Add Testimonial"
                                        onClick={() => {
                                            dispatch(setModal(true));
                                            dispatch(setEditData(null));
                                        }}
                                    />
                                </Space>
                            </Col>
                        </Row>
                    </div>

                </Col>
            </Row>

            <Form form={form} component={false}>
                <ResponsiveTable
                    columns={columns}
                    data={filteredData}
                    GetSelectedId={GetSelectedId}
                />
            </Form>
            <Modal
                title={editData ? 'Edit Testimonial' : 'Add Testimonial'}
                open={isModalOpen}
                onOk={() => dispatch(setModal(false))}
                onCancel={() => dispatch(setModal(false))}
                footer={null}
                width={600}
            >
                <FormModal />
            </Modal>
        </>
    );
};

export default TableData;
