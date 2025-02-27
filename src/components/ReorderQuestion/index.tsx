'use client';
import React, { useEffect, useState } from 'react';
import { Card, Col, Flex, Row, Typography } from 'antd';
import axios from 'axios';
import ComprehensionList from '../Admin/Questions/ComprehensionList';
import QuestionListItem from '../Admin/QuestionListItem';
import { QuestionAndComprehension, Test } from '@/lib/types';
import ReorderTable from '@/commonUI/ReorderTable';
import dateFormat from "dateformat";

interface ReorderProps {
    testId: string;
}

export default function ReorderQuestion({ testId }: ReorderProps) {
    const [questions, setQuestions] = useState<QuestionAndComprehension[]>([]);
    const [test, setTest] = useState<Test>()
    const [reload, setReload] = useState(false);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const getTestQuestions = async (id: string = testId) => {
            try {
                setLoading(true)
                const response = await axios.get(`/admin/test/${id}/questions`);
                const test = response.data.data
                const normalizedData = test.questions.map((item: any) => ({
                    ...item,
                    questionType: item.paragraph ? 'comprehension' : item.questionType,
                }));
                setTest(test)
                setQuestions(normalizedData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching test questions:', error);
                setLoading(false);
            }
        };

        if (testId) {
            getTestQuestions(testId);
        }
    }, [testId, reload]);

    let preIndex = 0;

    const tableData = questions.map((item, idx: number) => {
        let index = idx;
        if (item.questionType === 'comprehension') {
            preIndex += item.questionId.length - 1;
        }
        return ({
            key: item._id,
            question: (
                <Card
                    style={{ width: '100%' }}
                    title={
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>
                                {item.questionType === 'comprehension' ? `Comprehension (Question ${index + 1} to ${index + item.questionId.length})` : `Question ${index + 1 + preIndex} of ${test?.totalAddedQuestion}`}
                            </span>
                            <Flex justify='space-between' gap={'large'}>
                                <Typography.Text type='secondary'>
                                    Date added: {dateFormat(item.createdAt, "ddd, dS mmm, yyyy")}
                                </Typography.Text>
                                <Typography.Text type='secondary' className='m-0'>
                                    Topic: {item.topic}
                                </Typography.Text>
                                <Typography.Text type='secondary'>
                                    Sub topic: {item.subTopic}
                                </Typography.Text>
                                <Flex
                                    justify='flex-end'
                                    vertical
                                    style={{
                                        textAlign: 'right'
                                    }}>
                                    <Typography.Paragraph
                                        type="secondary"
                                        copyable={{ text: item._id }}
                                        className='m-0'
                                    >
                                        {
                                            item.questionType === 'comprehension'
                                                ? 'Comprehension'
                                                : 'Question'}{' '}
                                        ID: {item._id.slice(18, 24)
                                        }
                                    </Typography.Paragraph>
                                </Flex>
                            </Flex>
                        </div>
                    }
                >
                    {item.questionType === 'comprehension' ? (
                        <ComprehensionList
                            item={item}
                            setReload={setReload}
                            reload={reload}
                            testId={testId}
                            index={index}
                        />
                    ) : (
                        <QuestionListItem
                            item={item}
                            setReload={setReload}
                            reload={reload}
                            testId={testId}
                        />
                    )}
                </Card>
            ),
        })
    });


    const tableColumns = [
        {
            title: 'Question',
            dataIndex: 'question',
            key: 'question',
        },
    ];

    const onChange = (value: any) => {
        const orderIds = value.map((id: any) => {
            return id.key
        })
        onFinish(orderIds)
    }

    const onFinish = async (orderIds: string[]) => {
        await axios.post(`/admin/test/${testId}/reorder`, { order: orderIds })
            .then(() => {
                setReload(!reload);
            })
            .catch((error) => {
                console.error('Error reordering questions:', error);
            });
    }

    return (
        <Row className="flex-container">
            <Col span={24}>
                <Typography.Title level={2} className="top-title m-0"
                    style={{
                        fontWeight: 400
                    }}>
                    Edit Test
                </Typography.Title>
            </Col>
            <Col span={24} className='mt-4'>
                <Flex align='center' justify='space-between'>
                    <Typography.Title level={5}>{test?.totalAddedQuestion} Questions</Typography.Title>
                    <Typography.Text type='secondary'>Question Bank: {test?.questionCount} questions</Typography.Text>
                </Flex>
                {
                    tableData.length > 0 &&
                    <ReorderTable
                        loading={loading}
                        data={tableData}
                        columns={tableColumns}
                        onChange={(value: any) => onChange(value)}
                        reload={reload}
                    />
                }
            </Col>
        </Row>
    );
}
