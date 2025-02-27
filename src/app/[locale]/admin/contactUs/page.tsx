'use client'
import React, { useState, useEffect, useContext } from 'react';
import { getAllContactUs, deleteContactUs } from '@/lib/adminApi';
import { Button, Col, Input, Popconfirm, Row, Select, Table, Typography, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { SearchOutlined } from '@ant-design/icons';
import PrimaryButton from '@/app/commonUl/primaryButton';
import Titles from '@/app/commonUl/Titles';
import { FaRegEye } from 'react-icons/fa';
import Link from 'next/link';
import AuthContext from '@/contexts/AuthContext';

interface CreatedBy {
    name: string;
    email: string;
}

interface contactUsData {
    _id: string;
    id: string;
    name: string;
    email: string;
    message: string;
    created_at: string;
    createdBy: {
        _id: string,
        name: string,
        email: string
    };
}

const ContactUs = () => {
    const [contactUsData, setContactUsData] = useState<contactUsData[]>([]);
    const [selectedId, setSelected] = useState<string[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const { user } = useContext(AuthContext);
    const roleName = user?.roleId?.roleName;
    const getContactsHandler = async () => {
        try {
            const response = await getAllContactUs();
            setContactUsData(response.data);
        } catch (error) {
            console.error('Error fetching contact us data:', error);
        }
    };

    useEffect(() => {
        getContactsHandler();
    }, []);

    useEffect(() => {
        filterSearchHandler();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contactUsData, searchValue]);

    const deleteHandler = async (ids: string[]) => {
        try {
            const response = await deleteContactUs({ id: ids });
            if (response?.success) {
                message.success(response.message);
                getContactsHandler();
                setSelected([]);
            } else {
                message.error(response?.message || 'Failed to delete contact.');
            }
        } catch (error) {
            console.error('Error deleting contact:', error);
            message.error('Failed to delete contact. Please try again.');
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'createdBy',
            key: 'name',
            sorter: (a: { createdBy: CreatedBy }, b: { createdBy: CreatedBy }) =>
                a.createdBy.name.localeCompare(b.createdBy.name),
            render: (createdBy: CreatedBy) => {
                return createdBy?.name || 'N/A';
            },
            width: '250px',
        },
        {
            title: 'Email',
            dataIndex: 'createdBy',
            key: 'Email',
            sorter: (a: { createdBy: CreatedBy }, b: { createdBy: CreatedBy }) =>
                a.createdBy.email.localeCompare(b.createdBy.email),
            render: (createdBy: CreatedBy, record: any) => {
                return (
                    <span>
                        {createdBy?.email || 'N/A'}
                    </span>
                );
            },
            width: '250px',
        },
        {
            title: 'Action',
            key: 'action',
            render: (record: contactUsData) => {
                return (
                    <>
                        <div>
                            <Popconfirm
                                title="Are you sure you want to delete this Contact?"
                                onConfirm={() => deleteHandler([record?._id])}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button ><DeleteOutlined /></Button>
                            </Popconfirm>
                            &nbsp;&nbsp;
                            <Link href={`/${roleName}/contactUs/${record?.createdBy?._id}`}>
                                <Button ><FaRegEye /></Button>
                            </Link>
                        </div>
                    </>
                )
            },
            width: '150px',
        },
    ];

    const rowSelection = {
        selectedRowKeys: selectedId,
        onChange: (selectedRowKeys: React.Key[], selectedRows: contactUsData[], info: { type: string }) => {
            setSelected(selectedRowKeys as string[]);
        },
    };

    const filterSearchHandler = () => {
        const filtered = contactUsData.filter((item: contactUsData) => {
            return (
                item.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
                item.email?.toLowerCase().includes(searchValue.toLowerCase())
            );
        });
    };

    return (
        <div>

            <div>
                <Row gutter={[12, 12]} align="middle">
                    <Col xs={24} sm={12} md={10} lg={8} xl={6} xxl={6}>
                        <Titles level={5} className="top-title">
                            Contact US
                        </Titles>
                    </Col>
                    <Col xs={24} sm={12} md={14} lg={16} xl={18} xxl={18} >
                        <Row gutter={[8, 12]} justify="end" align="middle" >
                            {selectedId.length > 0 && (
                                <Col xs={24} sm={7} md={5} lg={5} xl={4} xxl={4}>
                                    <Popconfirm
                                        title="Are you sure you want to delete selected users?"
                                        onConfirm={() => deleteHandler(selectedId)}
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

                            <Col xs={24} sm={17} md={13} lg={12} xl={10} xxl={8} >
                                <Input
                                    type="search"
                                    placeholder="Search"
                                    style={{ fontSize: '15px' }}
                                    value={searchValue}
                                    onChange={(e) => {
                                        setSearchValue(e.target.value);
                                    }}
                                    suffix={<SearchOutlined />}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
            <Row gutter={[16, 16]} align="middle">
                <Col xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>
                    <h6 >Count: {contactUsData.length}</h6>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>

                </Col>
            </Row>
            {/* <h6 style={{ textAlign: 'end' }}>Count:{contactUsData.length}</h6> */}

            <Table
                dataSource={contactUsData}
                columns={columns}
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection
                }}
                rowKey='_id'
            />
        </div>
    );
};

export default ContactUs;

