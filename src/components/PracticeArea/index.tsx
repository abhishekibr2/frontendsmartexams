'use client'
import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import { Button, Card, Col, Flex, Row, Typography } from 'antd'
import { Package } from '@/lib/types'
import axios from 'axios'
import AuthContext from '@/contexts/AuthContext'
import { FaExclamationCircle } from 'react-icons/fa'
export default function PracticeArea() {
    const { user } = useContext(AuthContext)
    const [buyPackages, setBuyPackages] = useState<Package[]>([]);

    useEffect(() => {
        if (user?._id) {
            getBuyPackages()
        }
    }, [user?._id])

    const getBuyPackages = async () => {
        try {
            const res = await axios.get('/student/package/allPackages', {
                params: { userId: user?._id },
            });
            setBuyPackages(res.data.data)
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error)
        }
    }

    return (
        <section className="dash-part bg-light-steel ">
            <div className="spac-dash">
                <h2 className="top-title pb-3">
                    Practice Area
                </h2>
                <Card
                    title={<p className="color-dark-gray p-xl fw-medium mt-2">
                        Your Purchased Tests
                    </p>}
                >
                    {
                        buyPackages.length > 0 ?
                            buyPackages.map((item: Package) => (
                                item.orderSummary.package.map((packageItem: any) => (
                                    <div className="accordion-item" key={`free-package-${item._id}`}>
                                        <Card
                                            title={
                                                <p className="color-dark-gray p-lg fw-medium text-left mt-2">
                                                    {packageItem?.packageId?.packageName}
                                                </p>
                                            }
                                            style={{
                                                background: '#f9f9f9',
                                                borderRadius: '12px',
                                                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
                                                marginBottom: '20px',
                                            }}
                                        >
                                            <Row gutter={[16, 16]}>
                                                {packageItem?.packageId?.tests.map((test: any) => (
                                                    <Col
                                                        xxl={6}
                                                        xl={8}
                                                        lg={8}
                                                        md={12}
                                                        sm={24}
                                                        xs={24}
                                                        key={`${test._id}`}
                                                    >
                                                        <Card
                                                            title={
                                                                <p className="color-primary p-md fw-bold mt-2">
                                                                    {test.testDisplayName}
                                                                </p>
                                                            }
                                                            style={{
                                                                background: '#ffffff',
                                                                borderRadius: '10px',
                                                                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                justifyContent: 'space-between',
                                                                height: '100%',
                                                            }}
                                                        >
                                                            <div>
                                                                <p><strong>Subject:</strong> {test.subject?.subjectName || 'N/A'}</p>
                                                                <p><strong>Exam Type:</strong> {test.examType.examType || ''}</p>
                                                                <p><strong>Duration:</strong> {test.duration || 'N/A'}</p>
                                                                <p><strong>Status:</strong> {test.status || 'N/A'}</p>
                                                            </div>
                                                            <div style={{ marginTop: 'auto', textAlign: 'center' }}>
                                                                <Link href={`/student/practice-area/filter?grade=${test.grade._id}`}>
                                                                    <Button
                                                                        type="primary"
                                                                        block
                                                                        style={{
                                                                            background: 'linear-gradient(90deg, #4caf50, #81c784)',
                                                                            border: 'none',
                                                                            color: '#fff',
                                                                        }}
                                                                    >
                                                                        Continue Practice
                                                                    </Button>
                                                                </Link>
                                                            </div>
                                                        </Card>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Card>
                                    </div>
                                ))
                            ))
                            :
                            <Flex style={{
                                height: '25vh',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <div style={{
                                    textAlign: 'center'
                                }}>
                                    <FaExclamationCircle style={{ fontSize: '40px', color: '#f0ad4e', marginBottom: '10px' }} />
                                    <Typography.Title type='secondary' level={4}>No purchased tests found.</Typography.Title>
                                </div>
                            </Flex>
                    }
                </Card>
            </div>
        </section>
    )
}

