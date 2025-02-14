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
                    NOTE: MAXIMUM OF 5 READING COMPREHENSION CAN BE UPLOADED INTO QUESTION BANK FROM WORD DOCUMENT.
                </div>
            </Col>
            <Col xxl={12} xl={12} lg={12}>
                <Typography.Title level={5}>
                    1: Download .DOC Template
                </Typography.Title>
                <Typography>
                    Instruction
                </Typography>
                <Button type='default' className='mt-2' size='large'>
                    <Typography>How to upload .DOC Reading Comprehension </Typography> show
                </Button>
            </Col>
            <Col xxl={12} xl={12} lg={12}>
                <Typography.Title level={5}>
                    2: Upload Reading Comprehension
                </Typography.Title>
                <Typography>
                    When your .DOC Reading Comprehension template ready.
                </Typography>
                <Button type='primary' className='mt-2' size='large' onClick={next}>
                    Go to Uplaod Reading Comprehension
                </Button>
            </Col>
            <Col xxl={24} xl={24} lg={24} className='mt-5 mb-2'>
                <Typography.Title level={5}>
                    Download &quot;Reading Comprehension&quot; Templates:
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
                            .DOC Template
                        </div>
                    </Col>
                    <Col xxl={8} xl={8} lg={8} md={8} sm={12} xs={12}>
                        <div className="grid-title">
                            Instructions
                        </div>
                    </Col>
                    <Col xxl={8} xl={8} lg={8} md={8} sm={12} xs={12} className="grid-title">
                        <Button
                            color="default" variant="text"
                        >
                            Multiple Choice
                        </Button>
                    </Col>
                    <Col xxl={8} xl={8} lg={8} md={8} sm={12} xs={12}>
                        <Flex gap={'small'} className="grid-title" align={'center'}>
                            <Link href={`${process.env.NEXT_PUBLIC_IMAGE_URL}/images/templates/Multiple_Choice_Blank_Template.xlsx`} target='_blank'>
                                <Button type='text'>
                                    Blank
                                </Button>
                            </Link>
                            |
                            <Link href={`${process.env.NEXT_PUBLIC_IMAGE_URL}/images/templates/Multiple_Choice_Sample_Template.xlsx`} target='_blank'>
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
