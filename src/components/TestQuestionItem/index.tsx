import { Question } from '@/lib/types';
import { Card, Checkbox, Col, Flex, Form, FormInstance, Radio, Row, Space, Typography } from 'antd';
import React, { useState } from 'react';

interface TestQuestionItemProps {
    question: Question;
    index: number;
    form: FormInstance;
    onFinish: any;
    getOptionLabel: any;
    testAttempt: any;
}

export default function TestQuestionItem({
    question,
    index,
    form,
    onFinish,
    getOptionLabel,
    testAttempt
}: TestQuestionItemProps) {
    const [selectedAnswer, setSelectedAnswer] = useState<string | string[]>([]);
    const [isAnswered, setIsAnswered] = useState(false);

    const isExamMode = testAttempt.mode === 'exam'; // Check if exam mode

    const handleSelectionChange = (value: string | string[]) => {
        if (!isAnswered) {
            setSelectedAnswer(value);
            setIsAnswered(true);
        }
    };

    return (
        <Form layout='horizontal' form={form} onFinish={onFinish} size='large'>
            <p className="title-small color-dark-gray">
                <b>{index + 1}.</b> <span dangerouslySetInnerHTML={{ __html: question?.questionText }} />
            </p>
            <div className="spac-left-sm">
                <Form.Item name={[question._id, 'isFlagged']} className='d-none'>
                    <Checkbox type="hidden" name="isCorrect" />
                </Form.Item>
                <Form.Item className='m-0' name={[question._id, 'answerId']}>
                    {question?.questionType === 'multipleResponse' ? (
                        <Radio.Group onChange={(e) => handleSelectionChange(e.target.value)} disabled={isAnswered}>
                            <Space direction="vertical">
                                {question?.questionOptions.map((option, index) => {
                                    const isCorrect = option.isCorrect;
                                    const isSelected = selectedAnswer.includes(option._id);
                                    return (
                                        <Radio
                                            key={index}
                                            value={option._id}
                                            style={{
                                                backgroundColor: isAnswered && !isExamMode
                                                    ? (isCorrect ? '#d4edda' : isSelected ? '#f8d7da' : 'transparent')
                                                    : 'transparent',
                                                padding: '5px',
                                                borderRadius: '5px',
                                            }}
                                        >
                                            <Flex gap={'small'} justify='center'>
                                                <b> {getOptionLabel(index)}.</b> <span dangerouslySetInnerHTML={{ __html: option.title }} />
                                            </Flex>
                                        </Radio>
                                    );
                                })}
                            </Space>
                        </Radio.Group>
                    ) : (
                        <Checkbox.Group onChange={handleSelectionChange} disabled={isAnswered}>
                            <Space direction="vertical">
                                {question?.questionOptions.map((option, index) => {
                                    const isCorrect = option.isCorrect;
                                    const isSelected = selectedAnswer.includes(option._id);
                                    return (
                                        <Flex gap={'small'} key={index}>
                                            <Checkbox
                                                value={option._id}
                                                style={{
                                                    backgroundColor: isAnswered && !isExamMode
                                                        ? (isCorrect ? '#d4edda' : isSelected ? '#f8d7da' : 'transparent')
                                                        : 'transparent',
                                                    padding: '5px',
                                                    borderRadius: '5px',
                                                }}
                                            >
                                                <b> {getOptionLabel(index)}.</b> <span dangerouslySetInnerHTML={{ __html: option.title }} />
                                            </Checkbox>
                                        </Flex>
                                    );
                                })}
                            </Space>
                        </Checkbox.Group>
                    )}
                </Form.Item>

                {/* Show explanation only if NOT in exam mode */}
                {!isExamMode && question.explanation && selectedAnswer.length > 0 && (
                    <Row gutter={24}>
                        <Col xl={16} lg={16} md={16} sm={24} xs={24}>
                            <Card className="mt-4 explanation-card fade-in">
                                <Typography.Title level={5} style={{ color: '#333' }}>
                                    Explanation
                                </Typography.Title>
                                <Typography.Text type='secondary'>
                                    {question.explanation}
                                </Typography.Text>
                            </Card>
                        </Col>
                    </Row>
                )}
                {/* @ts-ignore  */}
                <style>{`
                    .explanation-card {
                        box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
                        opacity: 0;
                        transform: translateY(20px);
                        animation: fadeInSlide 0.5s ease-in-out forwards;
                    }

                    @keyframes fadeInSlide {
                        0% {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        100% {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}</style>
            </div>
        </Form>
    );
}
