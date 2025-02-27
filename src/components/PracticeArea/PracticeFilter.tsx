'use client'
import React, { useEffect } from 'react'
import LayoutWrapper from '@/app/commonUl/LayoutWrapper'
import PageTitle from '@/commonUI/PageTitle'
import { useDataContext } from '@/contexts/DataContext'
import { Complexity } from '@/lib/types'
import { Button, Col, Form, Row, Select } from 'antd'
import { useSearchParams } from 'next/navigation'
// @ts-ignore
import { useRouter } from 'nextjs-toploader/app';

export default function PracticeFilter() {
    const { complexity } = useDataContext()
    const searchParams = useSearchParams()
    const grade = searchParams.get('grade')
    const topic = searchParams.get('topic')
    const subtopic = searchParams.get('subtopic')
    const questionType = searchParams.get('questionType')
    const router = useRouter();

    const onFinish = (values: any) => {
        const params = new URLSearchParams();
        if (grade) params.set('grade', grade);
        params.set('complexity', values.complexity);
        params.set('limit', values.limit);

        if (topic) params.set('topic', topic);
        if (subtopic) params.set('subtopic', subtopic);
        if (questionType) params.set('questionType', questionType);

        if (topic && subtopic) {
            router.push(`/student/practice-area/question?${params.toString()}`);
        } else {
            router.push(`/student/practice-area/list?${params.toString()}`);
        }

    }
    return (
        <Row>
            <Col xxl={12} xl={12} md={12} sm={24} xs={24}>
                <PageTitle title='Question Filter'></PageTitle>
                <LayoutWrapper>
                    <Form layout='vertical' size='large' onFinish={onFinish}>
                        <Row gutter={24} align={'middle'}>
                            <Col xxl={12} xl={12} sm={24} xs={24}>
                                <Form.Item label='Question Complexity' name={'complexity'}>
                                    <Select
                                        options={complexity.map((item: Complexity) => {
                                            return { label: item.complexityLevel, value: item._id }
                                        })}
                                        placeholder='Select Question Complexity'
                                    />
                                </Form.Item>
                            </Col>
                            <Col xxl={24} xl={24} sm={24} xs={24}>
                            </Col>
                            <Col xxl={12} xl={12} sm={24} xs={24}>
                                <Form.Item label='Number of questions' name={'limit'}>
                                    <Select
                                        placeholder='Select Number of Questions'
                                        options={[
                                            {
                                                label: '10',
                                                value: 10
                                            },
                                            {
                                                label: '20',
                                                value: 20
                                            },
                                            {
                                                label: '30',
                                                value: 30
                                            },
                                            {
                                                label: '40',
                                                value: 40
                                            },
                                            {
                                                label: '50',
                                                value: 50
                                            }
                                        ]}
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Button type='primary' htmlType='submit'>Go!</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </LayoutWrapper>
            </Col>
        </Row>
    )
}
