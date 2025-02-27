'use client'
import React, { useEffect, useState } from 'react'
import { Test } from '@/lib/types';
import axios from 'axios';
import { Card, Col, Form, Row, Select, Typography } from 'antd';
import './style.css'
// @ts-ignore
import { useRouter } from 'nextjs-toploader/app';

interface StartTestProps {
    testId: string;
}

export default function StartTest({
    testId,
}: StartTestProps) {
    const [test, setTest] = useState<Test | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const router = useRouter()

    const fetchTest = async () => {
        try {
            const response = await axios.get(`/student/test/${testId}`);
            const testData = response.data.data;
            setTest(testData);
        } catch (error) {
            console.error("Error fetching test data", error);
        } finally {
            setIsLoading(false)
        }
    }

    const onFinish = async (values: any) => {
        values.testId = testId;
        const response = await axios.post('/student/test/attempt', values);
        const { testAttempt } = response.data;
        router.push(`/test-attempt/${testAttempt._id}`)
    }

    useEffect(() => {
        fetchTest();
    }, [testId])

    if (isLoading) {
        return <p>Loading test data...</p>
    }
    return (

        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#f0f2f5',
                width: '100%'
            }}
        >
            <Row justify={'center'} align={'middle'} style={{ width: '100%' }}>
                <Col
                    xxl={15}
                    xl={15}
                    lg={15}
                    md={24}
                    sm={24}
                    xs={24}
                >
                    <Card
                        title={<Typography.Title level={2} className='m-0 p-0'>
                            Test Name: {test?.testDisplayName}
                        </Typography.Title>}>
                        <Form onFinish={onFinish} size='large'>
                            <div className="row">
                                <div className="col-sm-6">
                                    <p className="color-dark-gray p-md fw-medium mb-1 ">Mode</p>
                                    <Form.Item
                                        name={'mode'}
                                        rules={[
                                            { required: true, message: 'Please select a test mode!' },
                                        ]}
                                    >
                                        <Select defaultValue={''}>
                                            <Select.Option value={''}>Select Exam Mode</Select.Option>
                                            <Select.Option value={'exam'}>Exam Mode</Select.Option>
                                            <Select.Option value={'tutor'}>Tutor Mode</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </div>
                                <div className="col-sm-6">
                                    <p className="color-dark-gray p-md fw-medium mb-1 ">Timer</p>
                                    <Form.Item
                                        name={'timer'}
                                        rules={[
                                            { required: true, message: 'Please select a timer!' },
                                        ]}
                                    >
                                        <Select defaultValue={''}>
                                            <Select.Option value={''}>Select Timer</Select.Option>
                                            <Select.Option value={'timed'}>Timed Exam</Select.Option>
                                            <Select.Option value={'untimed'}>Untimed Exam</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </div>
                                <div className="col-sm-12">
                                    <button type='submit' className="btn-primary fix-content-width btn-spac-lg bg-fresh-green opacity   mt-3">
                                        Start Exam
                                    </button>
                                </div>
                            </div>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
