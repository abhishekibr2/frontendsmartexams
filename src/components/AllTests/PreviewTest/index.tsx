'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Row, Typography } from 'antd'
import { Test } from '@/lib/types';
import LayoutWrapper from '@/app/commonUl/LayoutWrapper';

interface PreviewTestProps {
    testId: string;
}

export default function PreviewTest({
    testId,
}: PreviewTestProps) {
    const [test, setTest] = useState<Test>()

    useEffect(() => {
        const getTestQuestions = async (id: string = testId) => {
            try {
                const response = await axios.get(`/admin/test/${id}/questions`);
                const test = response.data.data
                setTest(test)
            } catch (error) {
                console.error('Error fetching test questions:', error);
            }
        };

        if (testId) {
            getTestQuestions(testId);
        }
    }, [testId]);

    return (
        <Row>
            <Col span={24}>
                <Typography.Title level={2} className="top-title m-0"
                    style={{
                        fontWeight: 400
                    }}>
                    {test?.testDisplayName}
                </Typography.Title>
            </Col>
            <Col span={16} className='mt-2'>
                <LayoutWrapper>
                    <Card
                        style={{
                            border: 'none',
                            padding: '24px',
                            margin: 24,
                            background: '#F9FAFB',
                            borderRadius: '4px',
                            boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.16)',
                        }}
                    >
                        <Typography.Title level={5}>Instructions</Typography.Title>
                        <ul
                            className="important-padding"
                        >
                            <li>
                                <Typography.Text>Number of Text: 1</Typography.Text>
                            </li>
                            <li>
                                <Typography.Text>Number of attempts allowed: Unlimited</Typography.Text>
                            </li>
                            <li>
                                <Typography.Text>Must be finished in one sitting: You can not save and finish later.</Typography.Text>
                            </li>
                            <li>
                                <Typography.Text>Question displayed per page: 1</Typography.Text>
                            </li>
                            <li>
                                <Typography.Text>Will allow you to go back and change the answers.</Typography.Text>
                            </li>
                            <li>
                                <Typography.Text>Will not let you finish with any questions unattempted.</Typography.Text>
                            </li>
                        </ul>
                    </Card>
                    <div
                        style={{
                            textAlign: 'right'
                        }}
                    >
                        <Button type='primary' size='large' style={{ marginRight: 24 }}>
                            Continue
                        </Button>
                    </div>
                </LayoutWrapper>
            </Col>
        </Row>
    )
}
