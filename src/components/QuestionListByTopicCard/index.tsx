'use client'
import { Col, Row, Typography, Card } from 'antd'
import { FileOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './style.css'

export default function QuestionListByTopicCard() {
    const [question, setQuestion] = useState<any[]>([])

    const fetchData = async () => {
        const response = await axios.get('/student/question/list/group')
        const { data } = await response.data
        setQuestion(data)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleSubTopicClick = (subTopic: string) => {
        // Handle subtopic click (e.g., navigate or show details)
        console.log('Clicked subTopic:', subTopic)
    }

    return (
        <Row gutter={[16, 16]} justify="center" style={{ width: '100%' }}>
            <Col span={24}>
                <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }} className='mt-2'>
                    Smart Exam Online Practice
                </Typography.Title>
            </Col>
            {question && question.length > 0 && question.map((item, index) => (
                <Col
                    span={24}
                    key={index}
                >
                    <Card
                        className='item'
                        bordered
                        style={{
                            padding: '16px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                            }}
                        >
                            <FileOutlined
                                style={{
                                    fontSize: '32px',
                                    marginRight: '16px',
                                    color: '#1890ff',
                                }}
                            />
                            <div style={{ flex: 1 }}>
                                <Typography.Title level={4} style={{ marginBottom: '8px', color: '#1890ff', }}>
                                    {item._id}
                                </Typography.Title>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                    {item.subTopic.map((subTopic: any, subtopicIndex: number) => (
                                        <Typography.Text
                                            key={subtopicIndex}
                                            type='secondary'
                                            style={{
                                                display: 'inline-block',
                                                cursor: 'pointer',
                                                textDecoration: 'underline',
                                            }}
                                            onClick={() => handleSubTopicClick(subTopic)}
                                        >
                                            {subTopic}
                                        </Typography.Text>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
            ))}
        </Row>
    )
}
