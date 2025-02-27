'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, Col, Row, Typography } from 'antd'
import PageTitle from '@/commonUI/PageTitle'
import { Test } from '@/lib/types'
import axios from 'axios'
import './style.css'

interface TestInstructionProps {
    testId: string;
}

export default function TestInstruction({
    testId,
}: TestInstructionProps) {
    const [test, setTest] = useState<Test | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isAgreed, setIsAgreed] = useState<boolean>(false)

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
                backgroundColor: '#f9f9f9',
                padding: '20px',
            }}
        >
            <Row justify={'center'} align={'middle'} style={{ width: '100%' }}>
                <Col xxl={15} xl={15} lg={15} md={24} sm={24} xs={24}>
                    <Card title={
                        <Typography.Title level={2} className='m-0 p-0'>
                            Test Name: {test?.testDisplayName || 'Instruction'}
                        </Typography.Title>
                    }>
                        <section className="dash-part bg-light-steel">
                            <div className="">
                                <div className="card-dash mt-3">
                                    <p className="p-xxl color-dark-gray fw-semi-bold mb-2">
                                        Please read the instructions carefully
                                    </p>
                                    <div dangerouslySetInnerHTML={{ __html: test?.introduction || '' }}></div>
                                    <label className="p-sm color-dark-gray w-100 bottom-small-space">
                                        <div className="check-label">
                                            <input
                                                type="checkbox"
                                                name="agree"
                                                checked={isAgreed}
                                                onChange={() => setIsAgreed(!isAgreed)}
                                            /> I have read all the instructions carefully and have understood them. I agree not to cheat or use unfair means in this examination. I understand that using unfair means of any sort for my own or someone elses advantage will lead to my immediate disqualification. The decision of Trinity Tuition College will be final in these matters and cannot be appealed.

                                        </div>
                                    </label>
                                    <Link href={`/student/test/${testId}/start`}>
                                        <button
                                            className="btn-primary fix-content-width btn-spac-lg bg-fresh-green opacity p-md mt-3"
                                            disabled={!isAgreed}
                                        >
                                            Next
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </section>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
