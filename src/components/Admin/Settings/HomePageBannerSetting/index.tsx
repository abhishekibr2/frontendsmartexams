'use client'
import dayjs from 'dayjs'; import ErrorHandler from '@/lib/ErrorHandler';
import { PlusOutlined } from '@ant-design/icons';
import AuthContext from '@/contexts/AuthContext';
import { handleFileCompression } from '@/lib/commonServices';
import { RcFile, UploadFile } from 'antd/es/upload/interface';
import React, { useContext, useEffect, useState } from 'react';
import { addHomePageContent, getHomepageContent } from '@/lib/adminApi';
import { Button, Col, DatePicker, Form, Input, message, Modal, Row, Upload } from 'antd';
import Titles from '@/app/commonUl/Titles';
import { HomeFormValues } from '@/lib/types';
import AllUsers from '../../AllUsers';


export default function HomePageBannerSetting() {
    const [form] = Form.useForm();
    const { user } = useContext(AuthContext);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [homeData, setHomeData] = useState<HomeFormValues[]>([]);
    const [editId, setEditId] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);

    const getData = async () => {
        const response = await getHomepageContent();
        if (response.status === true) {
            setHomeData(response.data);
        }
    };

    useEffect(() => {
        if (homeData && Object.keys(homeData).length > 0) {
            setEditId(homeData[0]?._id);
            form.setFieldsValue({
                heading: homeData[0]?.heading,
                couponCode: homeData[0]?.couponCode,
                discount: homeData[0]?.discount,
                startTime: dayjs(homeData[0]?.startTime),
                endTime: dayjs(homeData[0]?.endTime),
                bannerDescription: homeData[0]?.bannerDescription,
                description: homeData[0]?.description,
                secondHeading: homeData[0]?.secondHeading,
            });

            if (homeData[0]?.image) {
                setFileList([
                    {
                        uid: '-1',
                        name: homeData[0]?.image,
                        status: 'done',
                        url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/bannerImages/original/${homeData[0]?.image}`,
                    },
                ]);
            }
        }
    }, [homeData]);

    useEffect(() => {
        getData();
    }, []);

    const onFinish = async (values: HomeFormValues) => {
        try {
            const formData = new FormData();

            if (fileList && fileList.length > 0 && fileList[0]?.originFileObj) {
                const file = fileList[0].originFileObj as File;
                formData.append('image', file);
            }
            formData.append('heading', values.heading);
            formData.append('secondHeading', values.secondHeading);
            formData.append('couponCode', String(values.couponCode));
            formData.append('discount', values.discount);
            formData.append('startTime', values.startTime);
            formData.append('endTime', values.endTime);
            formData.append('description', values.description);
            formData.append('bannerDescription', values.bannerDescription);
            if (editId) {
                formData.append('editId', editId);
            }

            const res = await addHomePageContent(formData);
            if (res.status === true) {
                getHomepageContent();
                message.success(res.message);
            } else {
                message.error('Failed to add homepage content');
            }
        } catch (error) {
            console.log(error, 'add error');
        }
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const handleBeforeUpload = async (file: RcFile) => {
        try {
            const compressedFiles = await handleFileCompression(file, '');
            setFileList(compressedFiles);
            return false;
        } catch (error) {
            ErrorHandler.showNotification(error);
            return true;
        }
    };

    const handleRemove = () => {
        setFileList([]);
    };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
    };

    const handleSendEmail = () => {
        setIsModalVisible(true);
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    };


    return (
        <>
            <Row gutter={[16, 16]} align="middle">
                <Col className="" xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>
                    <Titles level={5} className="top-title">
                        Banner Page
                    </Titles>
                </Col>
                <Col className="" xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>
                    <div className="floatRight text-end">

                    </div>
                </Col>
            </Row>
            <div className="desktop-view card-dash shadow-none top-medium-space">
                <Form form={form} onFinish={onFinish} layout="vertical" size='large'>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Form.Item label="Heading" name="heading" >
                                <Input placeholder="Enter Heading" maxLength={100} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Form.Item
                                label="Second Heading"
                                name="secondHeading"
                            >
                                <Input placeholder="Enter Second Heading" maxLength={100} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Form.Item
                                label="Coupon Code"
                                name="couponCode"
                                rules={[{ required: true, message: 'Coupon code is required' }]}

                            >
                                <Input placeholder="Enter Coupon Code" maxLength={100} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Discount"
                                name="discount"
                                rules={[{ required: true, message: 'Discount is required' },
                                {
                                    type: 'number',
                                    min: 0,
                                    max: 100,
                                    message: 'Discount must be between 0 and 100',
                                },
                                ]}

                            >
                                <Input placeholder="Enter Discount" type='number' onChange={(e) => {
                                    const value = Number(e.target.value);
                                    form.setFieldsValue({ discount: value });
                                }} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="Banner Description"
                                name="bannerDescription"
                            >
                                <Input.TextArea rows={4} placeholder="Enter Banner Description" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Form.Item
                                label="Start Time"
                                name="startTime"
                            >
                                <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="End Time"
                                name="endTime"
                            >
                                <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Form.Item
                                label="Description"
                                name="description"
                            >
                                <Input.TextArea rows={4} placeholder="Enter Description" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Form.Item label="Banner Image" name="image">
                                <Upload
                                    listType="picture-card"
                                    fileList={fileList}
                                    beforeUpload={handleBeforeUpload}
                                    onRemove={handleRemove}
                                    onPreview={handlePreview}
                                >
                                    {fileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Button type="primary" htmlType="submit" style={{ height: 40 }}>
                                Save
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                type="primary"
                                style={{ height: 40 }}
                                onClick={handleSendEmail}
                            >
                                Send Email
                            </Button>
                        </Col>
                    </Row>
                </Form>

                <Modal
                    title='All User'
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                    width='40%'
                >
                    <AllUsers handleCancel={handleCancel} />
                </Modal>
            </div>
        </>
    );
}

function getBase64(originFileObj: RcFile | undefined): string | PromiseLike<string> {
    throw new Error('Function not implemented.');
}
