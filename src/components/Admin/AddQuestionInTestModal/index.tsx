import React, { useContext, useEffect } from 'react';
import { Button, Divider, Form, Modal, Select, Typography } from 'antd';
import { useDataContext } from '@/contexts/DataContext';
import { QuestionAndComprehension, Test } from '@/lib/types';
import axios from 'axios';
import AuthContext from '@/contexts/AuthContext';

interface AddQuestionInTestModalProps {
    open: boolean;
    setOpen: (visible: boolean) => void;
    handleAddQuestion?: (questionId: string) => void;
    testId?: string[];
    question?: QuestionAndComprehension;
}

export default function AddQuestionInTestModal({
    open,
    setOpen,
    question,
    testId = [],
}: AddQuestionInTestModalProps) {
    const { tests } = useDataContext();
    const { user } = useContext(AuthContext)
    const [form] = Form.useForm();
    const roleName = user?.roleId?.roleName;

    const onFinish = async (values: any) => {
        try {
            await axios.post(`/${roleName}/test/assignQuestions`, { ...values, questionId: question?._id, questionType: question?.questionType ? question?.questionType : 'comprehension' });
            await form.resetFields();
            setOpen(false);
        } catch (error) {
            console.error('Error assigning question:', error);
        }
    };

    useEffect(() => {
        form.setFieldValue('testIds', testId);
    }, [testId, form]);

    return (
        <Modal
            centered
            title={
                <Typography.Title level={4} style={{ marginBottom: 0 }}>
                    Assign Question to Tests
                </Typography.Title>
            }
            open={open}
            onCancel={() => setOpen(false)}
            footer={null}
        >
            <Typography.Paragraph style={{ marginBottom: 16, color: 'rgba(0, 0, 0, 0.6)' }}>
                Select one or more tests to assign this question.
            </Typography.Paragraph>
            <Divider />
            <Form layout="vertical" form={form} onFinish={onFinish} size='large'>
                <Form.Item>
                    <Typography.Title level={5} style={{ marginBottom: 8 }}>
                        Question Preview
                    </Typography.Title>
                    <Typography.Paragraph style={{ padding: '8px 12px', backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                        {
                            question?.paragraph ?
                                question?.paragraph
                                :
                                <div dangerouslySetInnerHTML={{ __html: question?.questionText?.trim() || '' }} />
                        }
                    </Typography.Paragraph>
                </Form.Item>
                <Form.Item
                    name="testIds"
                    label={
                        <Typography.Text strong style={{ fontSize: 16 }}>
                            Select Tests
                        </Typography.Text>
                    }
                    rules={[{ required: true, message: 'Please select at least one test.' }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Select tests"
                        style={{ width: '100%' }}
                        options={tests.map((test: Test) => ({
                            label: test.testDisplayName,
                            value: test._id,
                        }))}
                        maxTagCount="responsive"
                    />
                </Form.Item>
                <Divider />
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Assign to Selected Tests
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}
