'use client'
import axios from 'axios'
import { Col, Row, Typography, Flex } from 'antd'
import React, { useEffect, useState } from 'react'
// @ts-ignore
import { useRouter } from 'nextjs-toploader/app';
import './style.css'
import { useSearchParams } from 'next/navigation';

export default function QuestionListByTopic() {
    const [question, setQuestion] = useState<any[]>([])
    const router = useRouter();
    const searchParams = useSearchParams()
    const grade = searchParams.get('grade')
    const complexity = searchParams.get('complexity')
    const limit = searchParams.get('limit')

    const fetchData = async () => {
        const response = await axios.get('/student/question/list/group', {
            params: {
                grade,
                complexity
            }
        })
        const { data, comprehension } = await response.data
        setQuestion([...data, ...comprehension])
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleSubTopicClick = (subTopic: string, topic: string, questionType: string) => {
        router.push(`/student/practice-area/question?topic=${topic}&subtopic=${subTopic}&questionType=${questionType}&limit=${limit}`)
    }

    return (
        <Row gutter={[16, 16]} justify="start" style={{ width: '100%' }}>
            <Col span={24}>
                <Typography.Title level={2}>
                    Smart Exam Online Practice
                </Typography.Title>
                <div className="masonry">
                    {question && question.length > 0 && question.map((item, index) => (
                        <div
                            key={index}
                            className='item'
                        >
                            <Typography.Title level={4} style={{ marginBottom: '8px', display: 'flex', gap: '10px' }}>
                                {String.fromCharCode(65 + index)}:
                                <Typography.Title level={4} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    {item._id}
                                    {item?.questionType && (
                                        <Typography.Text type="secondary" style={{ color: '#1890ff', fontWeight: 'bold' }}>
                                            ({item.questionType})
                                        </Typography.Text>
                                    )}
                                </Typography.Title>
                            </Typography.Title>
                            <Flex vertical>
                                {item.subTopic.map((subTopic: any, subtopicIndex: number) => (
                                    <Typography.Text type='secondary' key={subtopicIndex} style={{
                                        display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 8
                                    }}>
                                        {subtopicIndex + 1}.
                                        <Typography.Text
                                            key={subtopicIndex}
                                            style={{
                                                display: 'inline-block',
                                                cursor: 'pointer',
                                                textDecoration: 'underline',
                                            }}
                                            onClick={() => handleSubTopicClick(subTopic.slug, item.topicSlug, subTopic.comprehensionId ? 'comprehension' : subTopic.questionType)}
                                        >
                                            {subTopic.title}
                                        </Typography.Text>
                                    </Typography.Text>
                                ))}
                            </Flex>
                        </div>
                    ))}
                </div>
            </Col>
        </Row>
    )
}
