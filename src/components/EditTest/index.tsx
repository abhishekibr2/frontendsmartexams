'use client'
import AuthContext from '@/contexts/AuthContext';
import { Test } from '@/lib/types';
import { Button, Card, Col, Flex, Row, Typography } from 'antd';
import axios from 'axios';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react'
import { BiPencil } from 'react-icons/bi';
import { GrDocument } from 'react-icons/gr';

interface EditTestProps {
    testId: string;
}

export default function EditTest({
    testId,
}: EditTestProps) {
    const [test, setTest] = useState<Test>()
    const { user } = useContext(AuthContext);
    const roleName = user?.roleId?.roleName;
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
                    Edit Test
                </Typography.Title>
            </Col>
            <Col xl={16} lg={16} md={24} sm={24} xs={24} className='mt-2'>
                <Card>
                    <Flex
                        style={{
                            height: 150,
                            padding: '0 100px'

                        }}
                        justify='space-between'
                        align='center'
                    >
                        <Flex align='center' gap='small'>
                            <GrDocument style={{
                                fontSize: 20,
                                color: '#ccc'
                            }} />
                            <Typography.Title level={4} className='m-0'>
                                {test?.testDisplayName}
                            </Typography.Title>
                        </Flex>
                        <Link href={`/${roleName}/test/${testId}/editor/edit`}>
                            <Button size='large' icon={<BiPencil />} type='primary'>
                                Edit Test
                            </Button>
                        </Link>
                    </Flex>
                </Card>
            </Col>
        </Row>
    )
}
