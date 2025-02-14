import { QuestionAndComprehension } from '@/lib/types';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Button, Carousel, Checkbox, Flex, Form, Input, Radio, Space, Typography } from 'antd';
import React, { useRef, useState } from 'react'

interface ComprehensionQuestionsProps {
    question: QuestionAndComprehension;
}

export default function ComprehensionQuestions({
    question
}: ComprehensionQuestionsProps) {
    const carouselInnerRef = useRef<any>(null)
    const [innerIndex, setInnerIndex] = useState(0);

    const getOptionLabel = (index: number) => {
        return String.fromCharCode(65 + index);
    }

    return (
        <div className='comprehension-questions-wrapper'>
            <Carousel
                arrows={false}
                infinite={false}
                ref={carouselInnerRef}
                fade={true}
                afterChange={(current: number) => {
                    setInnerIndex(current);
                }}
            >
                {
                    question.questionId.map((item, innerIndex) => (
                        <div key={item._id}>
                            <Typography.Title level={5} type='secondary' className='mb-2'>
                                {`${innerIndex + 1}: `} <span dangerouslySetInnerHTML={{ __html: item?.questionText }} />
                            </Typography.Title>
                            <Form.Item
                                name={[item._id, 'questionId']}
                                style={{
                                    display: 'none'
                                }}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item name={[item._id, 'answerId']}>
                                {item?.questionType === 'multipleResponse' ?
                                    <Checkbox.Group>
                                        <Space direction="vertical">
                                            {
                                                item?.questionOptions.map((option, optionIndex) => (
                                                    <Flex gap={'small'} key={optionIndex}>
                                                        <Checkbox value={option._id}>
                                                            <Typography.Text type='secondary'>
                                                                <b> {getOptionLabel(optionIndex)}.</b> <span dangerouslySetInnerHTML={{ __html: option.title }} />
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
                                                    item?.questionOptions.map((option, optionIndex) => (
                                                        <Flex gap={'small'} key={optionIndex}>
                                                            <Radio value={option._id}>
                                                                <Typography.Text type='secondary'>
                                                                    <b> {getOptionLabel(optionIndex)}.</b> <span dangerouslySetInnerHTML={{ __html: option.title }} />
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
                        </div>
                    ))
                }
            </Carousel>
            <Flex gap={'small'} className='mt-2' justify='end'>
                <Button
                    disabled={innerIndex === 0}
                    htmlType='button'
                    onClick={() => carouselInnerRef.current.prev()}
                    size='large'
                >
                    <ArrowLeftOutlined />
                </Button>
                <Button
                    disabled={innerIndex === question.questionId.length - 1}
                    htmlType='button'
                    onClick={() => carouselInnerRef.current.next()}
                    size='large'
                >
                    <ArrowRightOutlined />
                </Button>
            </Flex>
        </div>
    )
}
