'use client'
import RichText from '@/commonUI/RichText';
import { addAndUpdateTermsCondition } from '@/lib/adminApi';
import { Button, Form, Input, notification } from 'antd';
import React, { useEffect } from 'react'

interface termsProps {
    editData?: any;
    fetchData: () => void;
    handleCancel: () => void;
}

function FormModal({ editData, fetchData, handleCancel }: termsProps) {
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
            const res = await addAndUpdateTermsCondition(values);

            if (res.success) {
                fetchData();
                handleCancel();
                notification.success({
                    message: 'Success',
                    description: res.message || 'Terms and Conditions updated successfully!',
                });
            } else {
                notification.error({
                    message: 'Error',
                    description: res.message || 'Failed to update Terms and Conditions.',
                });
            }
        } catch (error) {
            console.error('Error updating Terms and Conditions:', error);
            notification.error({
                message: 'Error',
                description: 'An unexpected error occurred while updating Terms and Conditions.',
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
