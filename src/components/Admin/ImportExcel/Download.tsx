import { Question } from '@/lib/types'
import { DownloadOutlined } from '@ant-design/icons'
import { Button, Col, Flex, Row, Typography } from 'antd'
import Link from 'next/link';
import React from 'react'

interface DownloadProps {
    next: () => void,
    prev: () => void,
    question?: Question[],
    setQuestion?: (question: Question[]) => void;
}

export default function Download({
    next,
    prev,
    question,
    setQuestion
}: DownloadProps) {
    return (
        <Row gutter={10}>
            <Col xxl={24} xl={24} lg={24}>
                <div className="note-text">
                    NOTE: MAXIMUM OF 50 QUESTIONS CAN BE UPLOADED INTO QUESTION BANK FROM EXCEL SHEET.
                </div>
            </Col>
            <Col xxl={12} xl={12} lg={12}>
                <Typography.Title level={5}>
                    1: Download .CSV Question Template
                </Typography.Title>
                <Typography>
                    Instruction
                </Typography>
                <Button type='default' className='mt-2' size='large'>
                    <Typography>How to upload new question:</Typography> show
                </Button>
            </Col>
            <Col xxl={12} xl={12} lg={12}>
                <Typography.Title level={5}>
                    1: Upload Questions
                </Typography.Title>
                <Typography>
                    When your Question template ready.
                </Typography>
                <Button type='primary' className='mt-2' size='large' onClick={next}>
                    Go to Step 2
                </Button>
            </Col>
            <Col xxl={24} xl={24} lg={24} className='mt-5 mb-2'>
                <Typography.Title level={5}>
                    Download &quot;Question Import&quot; Templates:
                </Typography.Title>
            </Col>
            <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
                <Row gutter={[10, 10]} align={'middle'}>
                    <Col xxl={8} xl={8} lg={8} md={8} sm={12} xs={12} className="grid-title">
                        <div>
                            Question Type
                        </div>
                    </Col>
                    <Col xxl={8} xl={8} lg={8} md={8} sm={12} xs={12}>
                        <div className="grid-title">
                            CSV Template
                        </div>
                    </Col>
                    <Col xxl={8} xl={8} lg={8} md={8} sm={12} xs={12}>
                        <div className="grid-title">
                            Instructions
                        </div>
                    </Col>
                    <Col xxl={8} xl={8} lg={8} md={8} sm={12} xs={12} className="grid-title">
                        <Typography.Text type='secondary'>
                            Multiple Choice
                        </Typography.Text>
                    </Col>
                    <Col xxl={8} xl={8} lg={8} md={8} sm={12} xs={12}>
                        <Flex gap={'small'} className="grid-title" align={'center'}>
                            <Link target='_blank' href={`${process.env.NEXT_PUBLIC_IMAGE_URL}/templates/Multiple_Choice_Blank_Template.xlsx`}>
                                <Button type='text'>
                                    Blank
                                </Button>
                            </Link>
                            |
                            <Link target='_blank' href={`${process.env.NEXT_PUBLIC_IMAGE_URL}/templates/Multiple_Choice_Sample_Template.xlsx`}>
                                <Button type='text'>
                                    Sample
                                </Button>
                            </Link>
                        </Flex>
                    </Col>
                    <Col xxl={8} xl={8} lg={8} md={8} sm={12} xs={12}>
                        <Flex gap={'small'} className="grid-title" align={'center'}>
                            <Button type='text'>
                                PDF Instructions
                            </Button>
                            |
                            <Button type='text'>
                                <DownloadOutlined />
                            </Button>
                        </Flex>
                    </Col>
                    <Col xxl={8} xl={8} lg={8} md={8} sm={12} xs={12} className="grid-title">
                        <Typography.Text type='secondary'>
                            Multiple Response
                        </Typography.Text>
                    </Col>
                    <Col xxl={8} xl={8} lg={8} md={8} sm={12} xs={12}>
                        <Flex gap={'small'} className="grid-title" align={'center'}>
                            <Link target='_blank' href={`${process.env.NEXT_PUBLIC_IMAGE_URL}/templates/Multiple_Response_Blank_Template.xlsx`}>
                                <Button type='text'>
                                    Blank
                                </Button>
                            </Link>
                            |
                            <Link target='_blank' href={`${process.env.NEXT_PUBLIC_IMAGE_URL}/templates/Multiple_Response_Sample_Template.xlsx`}>
                                <Button type='text'>
                                    Sample
                                </Button>
                            </Link>
                        </Flex>
                    </Col>
                    <Col xxl={8} xl={8} lg={8} md={8} sm={12} xs={12}>
                        <Flex gap={'small'} className="grid-title" align={'center'}>
                            <Button type='text'>
                                PDF Instructions
                            </Button>
                            |
                            <Button type='text'>
                                <DownloadOutlined />
                            </Button>
                        </Flex>
                    </Col>
                    <Col xxl={8} xl={8} lg={8} md={8} sm={12} xs={12} className="grid-title">
                        <Typography.Text type='secondary'>
                            True / False
                        </Typography.Text>
                    </Col>
                    <Col xxl={8} xl={8} lg={8} md={8} sm={12} xs={12}>
                        <Flex gap={'small'} className="grid-title" align={'center'}>
                            <Link target='_blank' href={`${process.env.NEXT_PUBLIC_IMAGE_URL}/templates/True_False_Blank_Template.xlsx`}>
                                <Button type='text'>
                                    Blank
                                </Button>
                            </Link>
                            |
                            <Link target='_blank' href={`${process.env.NEXT_PUBLIC_IMAGE_URL}/templates/True_False_Sample_Template.xlsx`}>
                                <Button type='text'>
                                    Sample
                                </Button>
                            </Link>
                        </Flex>
                    </Col>
                    <Col xxl={8} xl={8} lg={8} md={8} sm={12} xs={12}>
                        <Flex gap={'small'} className="grid-title" align={'center'}>
                            <Button type='text'>
                                PDF Instructions
                            </Button>
                            |
                            <Button type='text'>
                                <DownloadOutlined />
                            </Button>
                        </Flex>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}
