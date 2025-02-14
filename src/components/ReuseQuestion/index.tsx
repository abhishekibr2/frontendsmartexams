'use client';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Col, Drawer, Flex, Row, Typography } from 'antd';
import { Test } from '@/lib/types';
import Link from 'next/link';
import Questions from '../Admin/Questions';
import AuthContext from '@/contexts/AuthContext';

interface ReuseQuestionProps {
    testId: string;
}

export default function ReuseQuestion({ testId }: ReuseQuestionProps) {
    const [test, setTest] = useState<Test>()
    const [existingQuestionIds, setExistingQuestionIds] = useState<string[]>([])

    const { user } = useContext(AuthContext)
    const roleName = user?.roleId?.roleName;
    useEffect(() => {
        const getTestQuestions = async (id: string = testId) => {
            try {
                const response = await axios.get(`/admin/test/${id}/questions`);
                const test = response.data.data
                setExistingQuestionIds(test.questionOrder)
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
        <Row className="flex-container">
            <Col span={24}>
                <Questions testId={testId} existingQuestionIds={existingQuestionIds} title='Reuse Question' />
            </Col>
            <Drawer
                placement="top"
                width={80}
                height={90}
                open={true}
                headerStyle={{ display: 'none' }}
                style={{
                    backgroundColor: '#202020'
                }}
                mask={false}
            >
                <Flex
                    justify='space-between'
                    align='center'
                >
                    <div></div>
                    <Typography.Title level={4} style={{ color: '#fff', margin: 0 }}>Test Name: {test?.testDisplayName} / Add From Your Question Bank</Typography.Title>
                    <Flex gap={'small'} align='center'>
                        <Link href={`/${roleName}/test/${testId}/editor/edit`}>
                            <Button size='large' type='primary'>
                                Done
                            </Button>
                        </Link>
                    </Flex>
                </Flex>
            </Drawer>
        </Row>
    );
}
