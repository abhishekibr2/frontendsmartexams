'use client';
import React, { useState } from 'react';
import { Form, Popconfirm, Modal, Button, message, Image, Avatar, Row, Col, Space } from 'antd';
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
    examType: string;
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


    const showModal = () => {
        dispatch(setModal(true))
    };

    const confirmDelete = async (ids: string[]) => {
        try {
            const res = await deleteTestimonials(ids);
            if (res) {
                dispatch(setFetchTestimonials(!fetchTestimonials));
                message.success(res.message);
                setSelectedAuthorIds([]); // Clear selection after delete
            }
        } catch (error) {
            message.error('Failed to delete testimonials. Please try again.');
        }
    };

    const columns = [
        {
            title: 'Numbering Order',
            key: 'index',
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: 'Pages',
            dataIndex: 'pages',
            key: 'pages',
        },
        {
            title: 'State',
            dataIndex: 'state',
            key: 'state',
            render: (text: any, record: any) => record?.state?.title

        },
        {
            title: 'Exam Name',
            dataIndex: 'examType',
            key: 'examType',
            render: (text: any, record: any) => record?.examType?.examType
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

    return (
        <>
            <Row >
                <Col className="" xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>
                    <Titles level={5} className="top-title">
                        Testimonials
                    </Titles>
                </Col>
                <Col className="" xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>
                    <div className="floatRight text-end">
                        <Space >
                            {selectedAuthorIds.length > 0 && (
                                <Col xs={24} sm={7} md={5} lg={5} xl={4} xxl={4} >
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
                                </Col>
                            )}
                            <PrimaryButton
                                label="Add Testimonial"
                                onClick={() => {
                                    dispatch(setModal(true));
                                    dispatch(setEditData(null));
                                }}
                            />
                        </Space>
                    </div>
                </Col>
            </Row>
            <Row gutter={[16, 16]} align="middle">
                <Col xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>
                    <h6 >Count: {testimonial.length}</h6>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>
                </Col>
            </Row>
            <Form form={form} component={false}>
                <ResponsiveTable
                    columns={columns}
                    data={formattedData}
                    GetSelectedId={GetSelectedId}
                />
            </Form>
            <Modal
                title={editData ? 'Edit Testimonial' : 'Add Testimonial'} // Change title based on whether editing or adding
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
