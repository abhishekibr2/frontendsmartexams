'use client'
import React, { useEffect, useState } from 'react'
import { Button, Col, Flex, Row, Table, Typography } from 'antd'
import axios from 'axios';
import { usePDF } from 'react-to-pdf';
import { QuestionAndComprehension, Test } from '@/lib/types';

interface PrintTestProps {
    testId: string;
}

export default function PrintTest({
    testId
}: PrintTestProps) {
    const [test, setTest] = useState<Test>()
    const [questions, setQuestions] = useState<QuestionAndComprehension[]>([])
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const { toPDF, targetRef } = usePDF({ filename: `${test?.testDisplayName}.pdf` });

    useEffect(() => {
        const getTestQuestions = async (id: string = testId) => {
            try {
                const response = await axios.get(`/admin/test/${id}/questions`);
                const test = response.data.data
                const normalizedData = test.questions.map((item: any) => ({
                    ...item,
                    questionType: item.paragraph ? 'comprehension' : item.questionType,
                }));
                setTest(test)
                setQuestions(normalizedData);
                setIsDataLoaded(true);
            } catch (error) {
                console.error('Error fetching test questions:', error);
            }
        };

        if (testId) {
            getTestQuestions(testId);
        }
    }, [testId]);

    if (!isDataLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <Row>
            <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                <Row>
                    <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                        <div ref={targetRef}>
                            <Flex justify='space-between' align='center'>
                                <Typography.Title
                                    level={2}
                                    className="top-title m-0"
                                    style={{
                                        fontWeight: 400,
                                        marginBottom: 24
                                    }}>
                                    <div>{`Package Name: ${test?.packageName?.packageName} (${test?.state?.title})`}</div>
                                    <div>
                                        {`Test Name: ${test?.testDisplayName}`}
                                        <span style={{ fontWeight: '500', fontSize: 'large' }}>
                                            {`(${questions?.length} Question)`}
                                        </span>
                                    </div>
                                </Typography.Title>
                                <Button
                                    type='primary'
                                    size='large'
                                    onClick={() => toPDF()}
                                    disabled={!isDataLoaded}
                                    className="print-button"
                                >
                                    Print
                                </Button>
                            </Flex>

                            <Table
                                style={{
                                    border: 'none'
                                }}
                                className="mt-2 primary-table q-table"
                                dataSource={questions}
                                columns={[
                                    {
                                        title: 'Q.NO',
                                        dataIndex: 'qno',
                                        key: 'qno',
                                        render: (_, record, index) => index + 1,
                                    },
                                    {
                                        title: 'QUID',
                                        dataIndex: '_id',
                                        key: 'quid',
                                        render: (_id) => _id || 'N/A',
                                    },
                                    {
                                        title: 'TOPIC',
                                        dataIndex: 'topic',
                                        key: 'topic',
                                        render: (topic) => topic || 'General',
                                    },
                                    {
                                        title: 'SUB-TOPIC',
                                        dataIndex: 'subtopic',
                                        key: 'subtopic',
                                        render: (subtopic) => subtopic || 'N/A',
                                    },
                                    {
                                        title: 'QUESTION',
                                        dataIndex: 'questionText',
                                        key: 'questionText',
                                        render: (questionText) => questionText ? (
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: questionText
                                                }}
                                            />
                                        ) : 'N/A',
                                    },
                                    {
                                        title: 'ANSWER',
                                        dataIndex: 'answer',
                                        key: 'answer',
                                        render: (_, record) => {
                                            const correctAnswers = record.questionOptions
                                                ?.filter(option => option.isCorrect)
                                                .map(option => option.title)
                                                .join(', ');

                                            return correctAnswers ? (
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: correctAnswers
                                                    }}
                                                />
                                            ) : 'No correct answer available';
                                        },
                                    }
                                ]}
                                bordered
                                pagination={false}
                            />
                        </div>
                    </Col>
                </Row>
            </Col >
        </Row >
    )
}
