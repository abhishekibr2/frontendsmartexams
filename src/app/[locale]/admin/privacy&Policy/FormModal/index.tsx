'use client'
import RichText from '@/commonUI/RichText';
import { AddPrivacyPolicy } from '@/lib/adminApi';
import { Button, Form, Input, notification } from 'antd';
import React, { useEffect } from 'react'

interface PrivacyProps {
    editData?: any;
    fetchData: () => void;
    handleCancel: () => void;
}

function FormModal({ editData, fetchData, handleCancel }: PrivacyProps) {
    const [form] = Form.useForm();


    useEffect(() => {
        if (editData) {
            form.setFieldsValue({
                _id: editData._id,
                title: editData.title,
                description: editData.description,
            });
        } else {
            form.resetFields();
        }
    }, [editData, form])

    const onFinish = async (values: string) => {
        try {
            const res = await AddPrivacyPolicy(values);
            if (res.success) {
                fetchData();
                handleCancel();
                notification.success({
                    message: 'Success',
                    description: res.message || 'Privacy and Policy updated successfully!',
                });
            } else {
                notification.error({
                    message: 'Error',
                    description: res.message || 'Failed to update Privacy and Policy.',
                });
            }
        } catch (error) {
            console.error('Error updating Privacy and Policy:');
            notification.error({
                message: 'Error',
                description: 'An unexpected error occurred while updating Privacy and Policy.',
            });
        }
    };
    return (
        <div>
            <Form
                form={form}
                onFinish={onFinish}
                style={{ maxWidth: 600 }}
                initialValues={{
                    status: 'active',

                }}
                layout="vertical"
            >
                <Form.Item name="_id" hidden>
                    <Input type="hidden" />
                </Form.Item>
                <Form.Item
                    name="title"
                    label="Title"
                    rules={[{ required: true, message: 'Please enter the title!' }]}
                >
                    <Input placeholder="Enter title" />
                </Form.Item>
                <Form.Item name="description"
                    label="Description">
                    <RichText
                        editorValue={form.getFieldValue('description') || editData.description}
                        onChange={(value) => {
                            form.setFieldsValue({ description: value || editData.description });
                        }}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>

            </Form>
        </div>
    )
}

export default FormModal
