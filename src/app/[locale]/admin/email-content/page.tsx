'use client';
import AuthContext from '@/contexts/AuthContext';
import React, { useContext, useEffect, useState } from 'react';
import { addEmailPageContent, getEmailPageContent } from '@/lib/adminApi';
import { Button, Col, Form, Row, message } from 'antd';
import RichText from '@/commonUI/RichText';

interface HomeFormValues {
    description: string;
}

export default function HomePageContentForm() {
    const [form] = Form.useForm();
    const { user } = useContext(AuthContext);
    const [homeData, setHomeData] = useState<any>([]);
    const [editId, setEditId] = useState('');

    const getData = async () => {
        const response = await getEmailPageContent();
        if (response.status === true) {
            setHomeData(response.data);
        }
    };

    useEffect(() => {

        if (homeData && homeData.length > 0) {
            setEditId(homeData[0]?._id);
            form.setFieldsValue({
                description: homeData[0]?.description,
            });
        }
    }, [homeData]);

    useEffect(() => {
        getData();
    }, [user]);

    const onFinish = async (values: HomeFormValues) => {

        const data = {
            description: values.description,
            editId: editId || null,
        };

        const response = await addEmailPageContent(data);
        if (response.status === true) {
            getData();
            message.success(response.message);
        } else {
            message.error('Failed to update content');
        }
    };


    return (
        <>
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Form.Item
                            label="Email Format"
                            name="description"
                            rules={[{ required: true, message: 'Description is required' }]}
                        >
                            <RichText
                                placeholder="Enter Description"
                                onChange={(value) => {
                                    console.log('RichText value:', value);
                                    form.setFieldsValue({
                                        description: value,
                                    });

                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Button type="primary" htmlType="submit" style={{ height: 40 }}>
                    Save
                </Button>
            </Form>
        </>
    );
}
