'use client'
import React, { useEffect, useState } from 'react'
import { Button, Col, Row, Table } from 'antd'
import PageTitle from '@/commonUI/PageTitle'
import LayoutWrapper from '@/app/commonUl/LayoutWrapper'
import axios from 'axios'
import { FaCheck } from 'react-icons/fa'
import datetimeDifference from "datetime-difference";
import { FaXmark } from 'react-icons/fa6'
import Link from 'next/link'

interface ViewAnswerProps {
    testAttemptId: string;
}

export default function ViewAnswer({
    testAttemptId
}: ViewAnswerProps) {
    const [testAttempt, setTestAttempt] = useState<any>()
    const [questionAttempts, setQuestionAttempts] = useState<any>()


    const fetchTestAttempt = async () => {
        const response = await axios.get(`/student/testAttempt/${testAttemptId}`);
        const data = response.data.testAttempt;
        setTestAttempt(data)
        const answers = response.data.questionAttempts;
        setQuestionAttempts(answers)
    }

    useEffect(() => {
        if (testAttemptId) {
            const fetchData = async () => {
                try {
                    await Promise.all([
                        fetchTestAttempt()
                    ]);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };

            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [testAttemptId])

    return (
        <Row>
            <Col xxl={24} xl={24} md={24} sm={24}>
                <PageTitle title='Questions and Answers' />
            </Col>
            <Col xxl={24} xl={24} md={24} sm={24}>
                <LayoutWrapper>
                    <Table
                        bordered
                        pagination={false}
                        columns={[
                            { title: 'NUMBER', dataIndex: 'number', key: 'number' },
                            { title: 'QID', dataIndex: 'qid', key: 'qid' },
                            { title: 'ANSWER STATS', dataIndex: 'answerstat', key: 'answerstat', align: 'center' },
                            { title: 'DIFFICULTY', dataIndex: 'difficulty', key: 'difficulty' },
                            { title: 'MARKS', dataIndex: 'marks', key: 'marks' },
                            { title: 'TOPIC', dataIndex: 'topic', key: 'topic' },
                            { title: 'SUB-TOPIC', dataIndex: 'subTopic', key: 'subTopic' },
                            { title: 'TIME', dataIndex: 'time', key: 'time' },
                            { title: 'REVIEW', dataIndex: 'review', key: 'review' },
                        ]}
                        dataSource={questionAttempts ? questionAttempts.map((item: any, index: number) => {
                            const startTime = new Date(item.startTime);
                            const endTime = new Date(item.endTime);
                            const timeTaken = datetimeDifference(startTime, endTime)

                            return {
                                number: index + 1,
                                qid: item.questionId._id,
                                answerstat: item.isCorrect ? <FaCheck color='#52C479' /> : <FaXmark color='#FB3311' />,
                                difficulty: <Button
                                    style={{
                                        textTransform: 'capitalize',
                                        color: '#fff',
                                        width: '100%',
                                        background: `${item.questionId.complexityId.complexityLevel === 'easy' ? '#52C479'
                                            : item.questionId.complexityId.complexityLevel === 'hard' ? '#FB3311' : '#B81736'}`
                                    }}
                                >
                                    {item.questionId.complexityId.complexityLevel}
                                </Button>,
                                marks: item.isCorrect ? '1/1' : '0/1',
                                topic: item.questionId.topic,
                                subTopic: item.questionId.subTopic,
                                time: `${timeTaken.minutes} min ${timeTaken.seconds} sec`,
                                review: <Link href={`/test-attempt/${testAttempt._id}?questionId=${item._id}&review=1`} style={{
                                    color: '',
                                    textDecoration: 'underline'
                                }}>Review</Link>,
                            }
                        })
                            :
                            []
                        }
                    />
                </LayoutWrapper>
            </Col>
        </Row>
    )
}
