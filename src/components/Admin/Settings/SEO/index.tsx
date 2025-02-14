import ParaText from '@/app/commonUl/ParaText'
import AuthContext from '@/contexts/AuthContext';
import { getSingleBrandDetails, updateSEODetails } from '@/lib/adminApi';
import ErrorHandler from '@/lib/ErrorHandler';
import { Button, Col, Form, Input, message, Row } from 'antd'
import React, { useContext, useEffect, useState } from 'react';

interface Props {
    activeKey: string;
}

export default function SEO({ activeKey }: Props) {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (user?._id) {
            fetchSEODetail(user._id);
        }
    }, [activeKey, user?._id]);


    const fetchSEODetail = async (id: string) => {
        try {
            const data = {
                userId: id
            }
            const res = await getSingleBrandDetails(data);
            if (res.status === true && res.data) {
                form.setFieldsValue({
                    googleAnalytics: res.data.seo.googleAnalytics,
                    searchConsole: res.data.seo.searchConsole,
                    hotJar: res.data.seo.hotJar,
                    mailChimp: res.data.seo.mailChimp,
                })
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }

    const onfinish = async (values: { userId: string; }) => {
        try {
            setLoading(true);
            values.userId = user?._id || '';
            const res = await updateSEODetails(values);
            if (res.status == true) {
                message.success(res.message);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            ErrorHandler.showNotification(error);
        }
    }

    return (
        <>
            <ParaText size="large" fontWeightBold={600} color="PrimaryColor">
                SEO Integration
            </ParaText>
            <div className="gapMarginTopOne"></div>
            <Row >
                <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                    <Form layout='vertical' form={form} size='large' onFinish={onfinish} >
                        <Row >
                            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                <Form.Item
                                    name="googleAnalytics"
                                    label="Google Analytics"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Google Analytics ID is required',
                                        },
                                        {
                                            pattern: /^G-[A-Z0-9]{7,}$/,
                                            message: 'Invalid Google Analytics ID (must follow the format G-XXXXXXX)',
                                        },
                                        {
                                            max: 50,
                                            message: 'Google Analytics ID must not exceed 50 characters',
                                        },
                                    ]}
                                >
                                    <Input
                                        type="text"
                                        maxLength={50}
                                        placeholder="Enter Google Analytics ID (G-XXXXXXX)"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                <Form.Item
                                    name="searchConsole"
                                    label="Search Console"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Search Console code is required',
                                        },
                                        {
                                            pattern: /^google-site-verification=[a-zA-Z0-9_-]+$/,
                                            message: 'Invalid Search Console code format',
                                        },
                                        {
                                            max: 50,
                                            message: 'Search Console code must not exceed 50 characters',
                                        },
                                    ]}
                                >
                                    <Input
                                        type="text"
                                        maxLength={50}
                                        placeholder="Enter Search Console code"
                                    />
                                </Form.Item>


                            </Col>
                            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                <Form.Item
                                    name="hotJar"
                                    label="Hot-jar"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Hot-jar code is required',
                                        },
                                        {
                                            pattern: /^[a-zA-Z0-9]{9}$/,
                                            message: 'Please enter a valid Hot-jar code (9 alphanumeric characters)',
                                        },
                                        {
                                            max: 50,
                                            message: 'Hot-jar code must not exceed 50 characters',
                                        },
                                    ]}
                                >
                                    <Input
                                        type="text"
                                        maxLength={50}
                                        placeholder="Enter Hot-jar code"
                                    />
                                </Form.Item>


                            </Col>
                            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                <Form.Item
                                    name="mailChimp"
                                    label="Mailchimp"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Mailchimp code is required',
                                        },
                                        {
                                            pattern: /^[a-zA-Z0-9]{32}$/,
                                            message: 'Please enter a valid Mailchimp code (32 alphanumeric characters)',
                                        },
                                        {
                                            max: 50,
                                            message: 'Mailchimp code must not exceed 50 characters',
                                        },
                                    ]}
                                >
                                    <Input
                                        type="text"
                                        maxLength={50}
                                        placeholder="Enter Mailchimp code"
                                    />
                                </Form.Item>
                            </Col>
                            <Col md={24} style={{ textAlign: 'end' }}>
                                <div className="smallTopMargin"></div>
                                <Button type='primary' htmlType='submit' loading={loading}>{loading ? 'Submitting' : 'Submit Seo Integration'}</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col xl={16} lg={16} md={16} sm={24} xs={24}></Col>
            </Row>
        </>
    )
}
