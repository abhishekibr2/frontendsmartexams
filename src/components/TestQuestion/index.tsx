'use client'
import React, { useEffect } from 'react'
import { QuestionAndComprehension } from '@/lib/types';
import { Carousel, Col, Row } from 'antd';
import { useTestContext } from '@/contexts/TestContext';
import axios from 'axios';
import TestQuestionItem from '../TestQuestionItem';
import ErrorHandler from '@/lib/ErrorHandler';

interface TestQuestionProps {
    testAttemptId: string;
}

const contentStyle: React.CSSProperties = {
    height: '60vh',
    overflowY: 'scroll',
    overflowX: 'hidden'
};

const paragraphStyle: React.CSSProperties = {
    height: '60vh',
    overflowY: 'scroll',
    overflowX: 'hidden'
};

export default function TestQuestion({
    testAttemptId,
}: TestQuestionProps) {
    const {
        questions,
        carouselRef,
        setCurrentIndex,
        form,
        questionAttempts,
        testAttempt,
        currentIndex,
        setQuestionAttempts,
        isFlagged,
        setIsFlagged,
    } = useTestContext()

    const getOptionLabel = (index: number) => {
        return String.fromCharCode(65 + index);
    }

    useEffect(() => {
        if (questionAttempts[currentIndex]) {
            setIsFlagged(questionAttempts[currentIndex].isFlagged)
            form.setFieldsValue({
                [questionAttempts[currentIndex]?.questionId._id]: {
                    answerId: questionAttempts[currentIndex].answerId.length > 1 ? questionAttempts[currentIndex]?.answerId : questionAttempts[currentIndex]?.answerId[0],
                    isFlagged: questionAttempts[currentIndex]?.isFlagged,
                }
            });
        }
    }, [questionAttempts, currentIndex, form, setIsFlagged]);

    const onFinish = async (values: any) => {
        if (!testAttempt.test.questionIds || !testAttempt.test.questionIds[currentIndex]) {
            return;
        }
        const currentQuestion = testAttempt.test.questionIds[currentIndex];

        let requestData: any = {};
        const selectedAnswer = values?.[currentQuestion];
        if (selectedAnswer && selectedAnswer.answerId) {
            requestData.answerId = selectedAnswer.answerId;
            requestData.status = 'answered';
        } else {
            requestData.status = 'unanswered'
        }

        const prevQuestion: any = questionAttempts[currentIndex - 1]
        if (prevQuestion) {
            requestData.startTime = prevQuestion.endTime;
        }
        requestData.testAttemptId = testAttemptId;
        requestData.isFlagged = isFlagged;
        requestData.questionId = currentQuestion || '';

        try {
            const response = await axios.post(`/student/testAttempt/answer`, requestData);
            const data = response.data;

            const exitingAnswer = questionAttempts.find((item: any) => item._id === data._id);
            let newAttemptData;
            if (exitingAnswer) {
                newAttemptData = questionAttempts.map((item: any) => (
                    item._id === data._id ? data : item
                ));
            } else {
                newAttemptData = [...questionAttempts, data];
            }
            if (currentIndex < questions.length - 1) {
                carouselRef.current.next();
                setCurrentIndex(currentIndex + 1);
            }
            setIsFlagged(false)
            setQuestionAttempts(newAttemptData);
        } catch (error) {
            ErrorHandler.showNotification(error)
        }
    };

    return (
        <div className="question-test-wrapper" style={{ position: 'relative' }}>
            {questions &&
                <Carousel
                    arrows={false}
                    infinite={false}
                    ref={carouselRef}
                    fade={true}
                    afterChange={(current: number) => {
                        setCurrentIndex(current)
                    }}
                    autoplaySpeed={100}
                >
                    {testAttempt && questions && testAttempt?.test?.questions.map((question: QuestionAndComprehension, index: number) => {
                        if (!question) {
                            return null;
                        }

                        return (
                            <div key={question?._id}>
                                <div style={contentStyle} id='option-scroll'>
                                    {!question.comprehensionId ?
                                        (
                                            <TestQuestionItem
                                                question={question}
                                                index={index}
                                                form={form}
                                                onFinish={onFinish}
                                                getOptionLabel={getOptionLabel}
                                                testAttempt={testAttempt}
                                            />
                                        ) :
                                        (
                                            <Row gutter={[24, 24]}>
                                                <Col xxl={11} xl={11} lg={11} md={11} sm={24} xs={24}>
                                                    {/* @ts-ignore  */}
                                                    <div style={paragraphStyle} dangerouslySetInnerHTML={{ __html: question?.comprehensionId?.paragraph || '' }} />
                                                </Col>
                                                <Col xxl={13} xl={13} lg={13} md={13} sm={24} xs={24}>
                                                    <TestQuestionItem
                                                        question={question}
                                                        index={index}
                                                        form={form}
                                                        onFinish={onFinish}
                                                        getOptionLabel={getOptionLabel}
                                                        testAttempt={testAttempt}
                                                    />
                                                </Col>
                                            </Row>
                                        )}
                                </div>
                            </div>

                        );
                    })}
                </Carousel>
            }
        </div>
    )
}
