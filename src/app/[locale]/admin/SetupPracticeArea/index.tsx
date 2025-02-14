'use client'
import LayoutWrapper from '@/app/commonUl/LayoutWrapper';
import PageTitle from '@/commonUI/PageTitle';
import { Button, Col, Form, Row, Select } from 'antd';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

interface SetupPracticeAreaProps {
    testId: string;
}
export default function SetupPracticeArea({
    testId
}: SetupPracticeAreaProps) {
    const [packageWithTest, setPackageWithTest] = useState([])
    const params = useSearchParams();
    const packageId = params.get('packageId')

    const fetchTestWithPackage = async () => {
        const response = await axios.get('/student/package/testWithPackage', {
            params: {
                testId,
                packageId
            }
        })
        const { data } = response.data
        setPackageWithTest(data.data)

    }

    useEffect(() => {
        fetchTestWithPackage()
    }, [testId, packageId])

    return (
        <Row>
            <Col span={24}>
                <PageTitle title='Setup Practice Area' />
            </Col>
            <Col xxl={8} xl={8} lg={8} md={18} sm={24} xs={24}>
                <LayoutWrapper>
                    <Form layout='vertical' size='large'>
                        <Form.Item
                            label={'Topic'}
                            name={'topic'}
                            initialValue={'all'}
                        >
                            <Select
                                options={[
                                    {
                                        label: '---Select Topic---',
                                        value: 'all'
                                    }
                                ]}
                            />
                        </Form.Item>
                        <Form.Item label={'Subtopic'} name={'subtopic'} initialValue={'all'}>
                            <Select
                                options={[
                                    {
                                        label: '---Select Subtopic---',
                                        value: 'all'
                                    }
                                ]}
                            />
                        </Form.Item>
                        <Form.Item label={'Number of Questions'} name={'numberOfQuestion'} initialValue={'all'}>
                            <Select
                                options={[
                                    {
                                        label: '---All Questions---',
                                        value: 'all'
                                    }
                                ]}
                            />
                        </Form.Item>
                        <Button htmlType='submit' type='primary' className='w-100'>
                            Submit & Continue
                        </Button>
                    </Form>
                </LayoutWrapper>
            </Col>
        </Row>
    )
}
