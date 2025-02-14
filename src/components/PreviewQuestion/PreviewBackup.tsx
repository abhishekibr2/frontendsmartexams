'use client'
import axios from 'axios'
import { Button, Card, Carousel, Checkbox, Col, Divider, Flex, Form, Input, Modal, Radio, Row, Space, Tabs, TabsProps, Typography } from 'antd'
// @ts-ignore
import { useRouter } from 'nextjs-toploader/app';
import React, { useEffect, useRef, useState } from 'react'
import LayoutWrapper from '@/app/commonUl/LayoutWrapper'
import PageTitle from '@/commonUI/PageTitle'
import { QuestionAndComprehension } from '@/lib/types'
import { FaBookmark } from 'react-icons/fa'
import Stopwatch from '@/app/commonUl/StopWatch'
import ComprehensionQuestions from './ComprehensionQuestions'

interface PreviewQuestionProps {
    testId: string;
}

export default function PreviewQuestion({
    testId,
}: PreviewQuestionProps) {
    const [form] = Form.useForm()
    const [listForm] = Form.useForm()
    const [test, setTest] = useState<any>()
    const [loading, setLoading] = useState(true)
    const [questions, setQuestions] = useState<QuestionAndComprehension[]>([])
    const [showAnswer, setshowAnswer] = useState(false)
    const [answer, setAnswer] = useState<any>([])
    const [openModal, setOpenModal] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const carouselRef = useRef<any>(null);
    const router = useRouter()

    const fetchTest = async (id: string) => {
        setLoading(true)
        const response = await axios.get(`/admin/test//${id}/questions`)
        const data = response.data.data;
        setTest(data)
        setQuestions([...data.questions, ...data.comprehensions])
        setLoading(false)
    }

    const getOptionLabel = (index: number) => {
        return String.fromCharCode(65 + index);
    }

    useEffect(() => {
        testId && fetchTest(testId)
    }, [testId])

    const onFinish = async (values: any) => {
        values.testId = testId;
        values.mode = 'preview';
        const response = await axios.post('/student/test/attempt', values);
        const { testAttempt } = response.data;
        router.push(`/test-attempt/${testAttempt._id}`)
    }

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'All Question',
            children: <div>
                {
                    questions.map((question: QuestionAndComprehension, index: number) => {
                        return (
                            <Card title={`Question ${index + 1} of ${test && test.questions.length}`} key={question._id} className='mb-2'>
                                <Typography.Title
                                    level={5}
                                    type='secondary'
                                    className='mb-2'
                                    style={{
                                        padding: '0px 10px',
                                    }}
                                >
                                    {`${currentIndex + 1}: `}   <span dangerouslySetInnerHTML={{ __html: question?.questionText }} />
                                </Typography.Title>
                                <Form form={listForm}>
                                    <Form.Item name={[question._id, 'answerId']}>
                                        {question?.questionType === 'multipleChoice' ?
                                            <Radio.Group disabled className='w-100'>
                                                <Flex gap={'small'} vertical key={index} className='w-100'>
                                                    {
                                                        question?.questionOptions.map((option, index) => (
                                                            <Flex
                                                                key={index}
                                                                align='center'
                                                                justify='space-between'
                                                                style={{
                                                                    background: `${option.isCorrect ? '#FBFBFB' : ''}`,
                                                                    padding: '5px 10px',
                                                                    border: '5px'
                                                                }}
                                                            >
                                                                <Radio
                                                                    value={option._id}
                                                                >
                                                                    <Typography.Text type='secondary'>
                                                                        <b> {getOptionLabel(index)}.</b> <span dangerouslySetInnerHTML={{ __html: option.title }} />
                                                                    </Typography.Text>
                                                                </Radio>
                                                                {
                                                                    option.isCorrect &&
                                                                    <div style={{
                                                                        width: '20px',
                                                                        height: '20px',
                                                                        borderRadius: '50px',
                                                                        background: '#52C479'
                                                                    }}></div>
                                                                }
                                                            </Flex>
                                                        )
                                                        )
                                                    }
                                                </Flex>
                                            </Radio.Group>
                                            : (
                                                question.questionType &&
                                                <Checkbox.Group disabled className='w-100'>
                                                    <Flex gap={'small'} vertical key={index} className='w-100'>
                                                        {
                                                            question?.questionOptions.map((option, index) => (
                                                                <Flex
                                                                    key={index}
                                                                    align='center'
                                                                    justify='space-between'
                                                                    style={{
                                                                        background: `${option.isCorrect ? '#FBFBFB' : ''}`,
                                                                        padding: '5px 10px',
                                                                        border: '5px'
                                                                    }}
                                                                >
                                                                    <Checkbox
                                                                        key={index}
                                                                        value={option._id}
                                                                    >
                                                                        <Typography.Text type='secondary'>
                                                                            <b> {getOptionLabel(index)}.</b> <span dangerouslySetInnerHTML={{ __html: option.title }} />
                                                                        </Typography.Text>
                                                                    </Checkbox>
                                                                    {
                                                                        option.isCorrect &&
                                                                        <div style={{
                                                                            width: '20px',
                                                                            height: '20px',
                                                                            borderRadius: '50px',
                                                                            background: '#52C479'
                                                                        }}></div>
                                                                    }
                                                                </Flex>
                                                            ))
                                                        }
                                                    </Flex>
                                                </Checkbox.Group>
                                            )
                                        }
                                    </Form.Item>
                                </Form>
                            </Card>
                        )
                    })
                }
            </div>,
        },
        {
            key: '2',
            label: 'Incorrect',
            children: <div>
                {
                    // answer.map((item: any, index: number) => {
                    // !item.isCorrect &&
                    // const question: QuestionAndComprehension | any = questions.find((questionItem) => questionItem._id == item.questionId)
                    // console.log('item: ', item)
                    // console.log('question: ', question)
                    questions.map((question: QuestionAndComprehension, index: number) => {
                        return (
                            <Card title={`Question ${index + 1} of ${test && test.questions.length}`} key={question._id} className='mb-2'>
                                <Typography.Title
                                    level={5}
                                    type='secondary'
                                    className='mb-2'
                                    style={{
                                        padding: '0px 10px',
                                    }}
                                >
                                    {`${currentIndex + 1}: `}   <span dangerouslySetInnerHTML={{ __html: question?.questionText }} />
                                </Typography.Title>
                                <Form form={listForm}>
                                    <Form.Item name={[question._id, 'answerId']}>
                                        {question?.questionType === 'multipleChoice' ?
                                            <Radio.Group disabled className='w-100'>
                                                <Flex gap={'small'} vertical key={index} className='w-100'>
                                                    {
                                                        question?.questionOptions.map((option, index) => (
                                                            <Flex
                                                                key={index}
                                                                align='center'
                                                                justify='space-between'
                                                                style={{
                                                                    background: `${option.isCorrect ? '#FBFBFB' : ''}`,
                                                                    padding: '5px 10px',
                                                                    border: '5px'
                                                                }}
                                                            >
                                                                <Radio
                                                                    value={option._id}
                                                                >
                                                                    <Typography.Text type='secondary'>
                                                                        <b> {getOptionLabel(index)}.</b> <span dangerouslySetInnerHTML={{ __html: option.title }} />
                                                                    </Typography.Text>
                                                                </Radio>
                                                                {
                                                                    option.isCorrect &&
                                                                    <div style={{
                                                                        width: '20px',
                                                                        height: '20px',
                                                                        borderRadius: '50px',
                                                                        background: '#52C479'
                                                                    }}></div>
                                                                }
                                                            </Flex>
                                                        )
                                                        )
                                                    }
                                                </Flex>
                                            </Radio.Group>
                                            : (
                                                question.questionType &&
                                                <Checkbox.Group disabled className='w-100'>
                                                    <Flex gap={'small'} vertical key={index} className='w-100'>
                                                        {
                                                            question?.questionOptions.map((option, index) => (
                                                                <Flex
                                                                    key={index}
                                                                    align='center'
                                                                    justify='space-between'
                                                                    style={{
                                                                        background: `${option.isCorrect ? '#FBFBFB' : ''}`,
                                                                        padding: '5px 10px',
                                                                        border: '5px'
                                                                    }}
                                                                >
                                                                    <Checkbox
                                                                        key={index}
                                                                        value={option._id}
                                                                    >
                                                                        <Typography.Text type='secondary'>
                                                                            <b> {getOptionLabel(index)}.</b> <span dangerouslySetInnerHTML={{ __html: option.title }} />
                                                                        </Typography.Text>
                                                                    </Checkbox>
                                                                    {
                                                                        option.isCorrect &&
                                                                        <div style={{
                                                                            width: '20px',
                                                                            height: '20px',
                                                                            borderRadius: '50px',
                                                                            background: '#52C479'
                                                                        }}></div>
                                                                    }
                                                                </Flex>
                                                            ))
                                                        }
                                                    </Flex>
                                                </Checkbox.Group>
                                            )
                                        }
                                    </Form.Item>
                                </Form>
                            </Card>
                        )
                        // })
                    })
                }
            </div>
        },
        {
            key: '3',
            label: 'Correct',
            children: 'Content of Tab Pane 3',
        },
        {
            key: '4',
            label: 'Bookmaerked',
            children: 'Content of Tab Pane 4',
        }
    ];

    const finishTest = () => {
        setOpenModal(false)
        setshowAnswer(true)
    }

    return (
        <Row>
            <Col xxl={14} xl={14} lg={14} md={14} sm={24} xs={24}>
                <Flex justify='space-between' align='center'>
                    <PageTitle title='Math' />
                    <Stopwatch />
                </Flex>
                {
                    !showAnswer ?
                        <LayoutWrapper>
                            <Card title={
                                <Flex justify='space-between' align='center'>
                                    {`Question ${currentIndex + 1} of ${test && test.questions.length}`}
                                    <Button
                                        onClick={() => {
                                            // Go to test page
                                        }}
                                    >
                                        <FaBookmark />
                                    </Button>
                                </Flex>
                            } loading={loading}>
                                {
                                    questions &&
                                    <Form form={form} onFinish={onFinish}>
                                        <Carousel
                                            arrows={false}
                                            infinite={false}
                                            ref={carouselRef}
                                            fade={true}
                                            afterChange={(current: number) => {
                                                setCurrentIndex(current);
                                            }}
                                        >
                                            {
                                                questions.map((question: QuestionAndComprehension) => (
                                                    question.questionType ?
                                                        <div key={question._id}>
                                                            {/* Outer carousel content */}
                                                            <Typography.Title level={5} type='secondary' className='mb-2'>
                                                                {`${currentIndex + 1}: `} <span dangerouslySetInnerHTML={{ __html: question?.questionText }} />
                                                            </Typography.Title>
                                                            <Form.Item
                                                                name={[question._id, 'questionId']}
                                                                style={{
                                                                    display: 'none'
                                                                }}
                                                            >
                                                                <Input />
                                                            </Form.Item>
                                                            <Form.Item name={[question._id, 'answerId']}>
                                                                {question?.questionType === 'multipleResponse' ?
                                                                    <Checkbox.Group>
                                                                        <Space direction="vertical">
                                                                            {
                                                                                question?.questionOptions.map((option, index) => (
                                                                                    <Flex gap={'small'} key={index}>
                                                                                        <Checkbox value={option._id}>
                                                                                            <Typography.Text type='secondary'>
                                                                                                <b> {getOptionLabel(index)}.</b> <span dangerouslySetInnerHTML={{ __html: option.title }} />
                                                                                            </Typography.Text>
                                                                                        </Checkbox>
                                                                                    </Flex>
                                                                                ))
                                                                            }
                                                                        </Space>
                                                                    </Checkbox.Group>
                                                                    : (
                                                                        <Radio.Group>
                                                                            <Space direction="vertical">
                                                                                {
                                                                                    question?.questionOptions.map((option, index) => (
                                                                                        <Flex gap={'small'} justify='center' key={index}>
                                                                                            <Radio value={option._id}>
                                                                                                <Typography.Text type='secondary'>
                                                                                                    <b> {getOptionLabel(index)}.</b> <span dangerouslySetInnerHTML={{ __html: option.title }} />
                                                                                                </Typography.Text>
                                                                                            </Radio>
                                                                                        </Flex>
                                                                                    ))
                                                                                }
                                                                            </Space>
                                                                        </Radio.Group>
                                                                    )
                                                                }
                                                            </Form.Item>
                                                            <Form.Item
                                                                name={[question._id, 'isCorrect']}
                                                                style={{
                                                                    display: 'none'
                                                                }}
                                                            >
                                                                <Input />
                                                            </Form.Item>
                                                        </div>
                                                        :
                                                        <div key={question._id}>
                                                            <div dangerouslySetInnerHTML={{ __html: question?.paragraph }}></div>
                                                            <ComprehensionQuestions question={question} />
                                                        </div>
                                                ))
                                            }
                                        </Carousel>
                                    </Form>
                                }
                                <Flex gap={'small'} className='mt-2'>
                                    <Button
                                        disabled={currentIndex === 0}
                                        className="w-100"
                                        htmlType='button'
                                        onClick={() => carouselRef.current.prev()}
                                        size='large'
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        className="w-100"
                                        disabled={currentIndex === questions.length - 1}
                                        htmlType='button'
                                        onClick={() => form.submit()}
                                        size='large'
                                    >
                                        Next
                                    </Button>
                                    <Button
                                        type='primary'
                                        className="w-100"
                                        htmlType='button'
                                        size='large'
                                        onClick={() => setOpenModal(true)}
                                    >
                                        Finish Now
                                    </Button>
                                </Flex>
                            </Card>
                        </LayoutWrapper>
                        :
                        <React.Fragment>
                            <div className='mt-2'></div>
                            <LayoutWrapper>
                                <Card title='Result'>
                                    <Row>
                                        <Col xxl={12} xl={12} md={12} sm={24} xs={24}>
                                            <Typography.Title level={5}>
                                                Point:
                                            </Typography.Title>
                                        </Col>
                                        <Col xxl={12} xl={12} md={12} sm={24} xs={24}>
                                            <Typography.Title level={5} type='secondary'>
                                                {length} / {questions.length}
                                            </Typography.Title>
                                        </Col>
                                        <Col xxl={12} xl={12} md={12} sm={24} xs={24}>
                                            <Typography.Title level={5}>
                                                Percentage:
                                            </Typography.Title>
                                        </Col>
                                        <Col xxl={12} xl={12} md={12} sm={24} xs={24}>
                                            <Typography.Title level={5} type='secondary'>
                                                0%
                                            </Typography.Title>
                                        </Col>
                                        <Col xxl={12} xl={12} md={12} sm={24} xs={24}>
                                            <Typography.Title level={5}>
                                                Duration:
                                            </Typography.Title>
                                        </Col>
                                        <Col xxl={12} xl={12} md={12} sm={24} xs={24}>
                                            <Typography.Title level={5} type='secondary'>
                                                00:25:55
                                            </Typography.Title>
                                        </Col>
                                        <Col xxl={12} xl={12} md={12} sm={24} xs={24}>
                                            <Typography.Title level={5}>
                                                Date Started:
                                            </Typography.Title>
                                        </Col>
                                        <Col xxl={12} xl={12} md={12} sm={24} xs={24}>
                                            <Typography.Title level={5} type='secondary'>
                                                SAT 21 Sep 24 00:18
                                            </Typography.Title>
                                        </Col>
                                        <Col xxl={12} xl={12} md={12} sm={24} xs={24}>
                                            <Typography.Title level={5}>
                                                Date Finished:
                                            </Typography.Title>
                                        </Col>
                                        <Col xxl={12} xl={12} md={12} sm={24} xs={24}>
                                            <Typography.Title level={5} type='secondary'>
                                                SAT 21 Sep 24 00:18
                                            </Typography.Title>
                                        </Col>
                                    </Row>
                                </Card>
                            </LayoutWrapper>
                            <div className='mt-2'></div>
                            <LayoutWrapper>
                                <Card title='Ranking'>
                                    <Tabs
                                        defaultActiveKey="1"
                                        items={items}
                                    />
                                </Card>
                            </LayoutWrapper>
                        </React.Fragment>
                }
            </Col>
            <Modal
                footer=""
                open={openModal}
                centered
                title='Are you sure to finish test?'
                onCancel={() => setOpenModal(false)}
            >
                <Divider />
                <Flex
                    gap={'small'}
                    align='center'
                >
                    <Button size='large' className='w-100' onClick={() => setOpenModal(false)}>Cancel</Button>
                    <Button size='large' className='w-100' type='primary' onClick={finishTest}>Finish Now</Button>
                </Flex>
            </Modal>
        </Row>
    )
}
