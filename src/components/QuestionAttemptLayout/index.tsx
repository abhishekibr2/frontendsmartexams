'use client'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { Badge, Button, Card, Col, Divider, Flex, message, Modal, Popconfirm, Progress, Row, Tooltip, Typography } from 'antd';
import { useTestContext } from '@/contexts/TestContext';
import './style.css'
// @ts-ignore
import { useRouter } from 'nextjs-toploader/app';
import MyTimer from '@/commonUI/MyTimer';
import Stopwatch from '@/commonUI/Stopwatch';
import AuthContext from '@/contexts/AuthContext';
import ReportProblemModal from './ReportProblemModal';
import { QuestionAndComprehension } from '@/lib/types';
import { FaCheck } from 'react-icons/fa';
import { RxCross2 } from "react-icons/rx";
import { PiFlagPennantFill } from 'react-icons/pi';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import useRestrictAndForceFullscreen from '@/lib/useDisableContextMenu';

interface QuestionAttemptLayoutProps {
    children: React.ReactNode;
    params: any;
    testAttemptId: string;
    response: any;
}

export default function QuestionAttemptLayout({
    children,
    testAttemptId,
    response
}: QuestionAttemptLayoutProps) {
    const { user } = useContext(AuthContext)
    const [progressPercentage, setProgressPercentage] = useState<number>(0)
    const [loading, setLoading] = useState(true)
    const [timeRemaining, setTimeRemaining] = useState(0)
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [countdown, setCountdown] = useState(10);
    const [showExit, setShowExit] = useState(false)
    const [initialized, setInitialized] = useState(false)
    const searchParams = useSearchParams()
    const questionId = searchParams.get('questionId');
    const review = searchParams.get('review')
    const router = useRouter()
    useRestrictAndForceFullscreen('attempt-test-wrapper');
    const roleName = user?.roleId?.roleName;
    const {
        carouselRef,
        isFlagged,
        setIsFlagged,
        setTestAttempt,
        isComprehension,
        setQuestions,
        questions,
        currentIndex,
        setCurrentIndex,
        testAttempt,
        setTotalQuestion,
        form,
        setQuestionAttempts,
        questionAttempts,
        isReview,
        setIsReview
    } = useTestContext()

    const fetchTestAttempt = async (response: any) => {
        const data = response.testAttempt;
        if (data.isCompleted && !questionId && !review) {
            message.info('The test has already been completed.');
            router.push('/student/test');
        }

        if (questionId && review) {
            setIsReview(true)
        }

        const answers = response.questionAttempts;
        setQuestionAttempts(answers)
        if (questionId) {
            setCurrentIndex(answers.findIndex((qa: any) => qa.questionId._id.toString() === questionId) + 1)
        } else {
            // setCurrentIndex(answers.length - 1)
        }
        setTestAttempt(data);
        setQuestions([
            ...data.test.questions
        ]);
        setTotalQuestion(data.test.questionOrder.length);
        const durationInSeconds = data.duration * 60;
        setTimeRemaining(durationInSeconds * 1000);
        carouselRef.current.goTo(answers.length - 1)
    }

    useEffect(() => {
        if (testAttemptId) {
            setInitialized(false)
            const fetchData = async () => {
                try {
                    setLoading(true);
                    await Promise.all([
                        fetchTestAttempt(response)
                    ]);
                } catch (error) {
                    console.error("Error fetching data:", error);
                } finally {
                    setLoading(false);
                    setInitialized(true)
                }
            };

            fetchData();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setQuestions, setTestAttempt, setTotalQuestion, testAttemptId, response])

    const goToQuestionAttempt = async (targetQuestionId: string | null = null, index: number | null = null) => {
        const questionId = questions[currentIndex]?._id;
        const answerId = form.getFieldValue([questionId, 'answerId'])

        const questionAttempt = questionAttempts.find((item: any) => item.questionId._id === targetQuestionId)

        if (questionAttempt) {
            carouselRef.current.goTo(index)
            setCurrentIndex(index || currentIndex + 1);
            return
        }

        const response = await axios.post(`/student/testAttempt/answer`, {
            questionId: targetQuestionId || questionId,
            testAttemptId,
            isFlagged,
            answerId,
            status: answerId ? 'answered' : 'unanswered'
        });
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
        setIsFlagged(false)
        setQuestionAttempts(newAttemptData);
        if (targetQuestionId) {
            carouselRef.current.goTo(index)
            setCurrentIndex(index || currentIndex + 1);
        } else {
            carouselRef.current.next();
            setCurrentIndex(currentIndex + 1);
        }

    }

    useEffect(() => {
        if (testAttempt) {
            setLoading(true)
            setProgressPercentage((currentIndex / testAttempt.test?.questions.length || 0) * 100)
            setLoading(false)
        }
    }, [currentIndex, testAttempt]);

    useEffect(() => {
        if (timeRemaining === 0 && initialized) {
            setIsTimeUp(true);
            const interval = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);

            // Auto-redirect to results page after 10 seconds
            const timeout = setTimeout(() => {
                router.push(`/student/testAttempt/${testAttemptId}/result`);
            }, 10000);

            return () => {
                clearInterval(interval);
                clearTimeout(timeout);
            };
        }
    }, [timeRemaining, router, testAttemptId])

    const confirmSubmit = async () => {
        try {
            form.submit()
            await axios.get(`/student/testAttempt/complete/${testAttemptId}`, {
                params: {
                    status: 'completed',
                    isCompleted: true
                }
            })
            message.success('Test submitted successfully!');
            if (user?.roleId.roleName === 'student') {
                router.push(`/student/test-report/${testAttemptId}`);
            } else {
                router.push(`/${roleName}/test/report/${testAttemptId}`);
            }
        } catch (error) {
            message.error('Failed to submit the test.');
        }
    };

    const getOrdinalSuffix = (num: any) => {
        if (!num) return "";
        const suffixes = ["th", "st", "nd", "rd"];
        const v = num % 100;
        return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
    };

    const handleExit = async () => {
        await axios.get(`/student/testAttempt/complete/${testAttemptId}`, {
            params: {
                status: 'exited',
                isCompleted: false
            }
        })
        message.success('Test submitted successfully!');
        if (user?.roleId.roleName === 'student') {
            router.push(`/student/test-report/${testAttemptId}`);
        } else {
            router.push(`/${roleName}/test/report/${testAttemptId}`);
        }
    }
    return (
        <Badge.Ribbon text={loading ? 'Loading...' : getOrdinalSuffix(testAttempt?.attempt) + " " + 'Attempt'}>
            <Card
                loading={loading}
                className="dash-part"
            >
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-xxl-8 col-sm-8">
                            <p className="top-title m-0">
                                Test: {testAttempt?.test?.testDisplayName || "Seal Package"}
                            </p>
                            <div className="d-flex gap-2 align-items-end">
                                <div className="d-flex align-items-baseline gap-2">
                                    <p className="p-sm fw-semi-bold color-dark-gray m-0">Test Mode :</p>
                                    <p className="p-sm color-dark-gray m-0">{testAttempt?.mode.charAt(0).toUpperCase() + testAttempt?.mode.slice(1)}</p>
                                </div>
                                <div className="d-flex align-items-baseline gap-2">
                                    <p className="p-sm fw-semi-bold color-dark-gray m-0">
                                        {testAttempt && testAttempt.mode === 'exam' ? 'Time Left' : 'Test in Progress'}
                                    </p>
                                    {testAttempt && (
                                        testAttempt.mode === 'exam' ?
                                            <MyTimer
                                                expiryTimestamp={new Date(testAttempt.startTime).getTime() + timeRemaining}
                                            />
                                            :
                                            <Stopwatch />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="col-xxl-4 col-sm-4">
                            <div className='d-flex'>
                                <Typography.Title level={5}>Test Progress :</Typography.Title>
                                <Progress percent={Math.round(progressPercentage)} size="small" />
                            </div>
                        </div>
                    </div>

                    <div className="card-dash top-extra-space">
                        <Flex justify='space-between' align='center'>
                            <p className="p-lg color-dark-gray m-0 fw-semi-bold">Question No: {currentIndex + 1} of {questions.length || 0}</p>
                            {isReview &&
                                <Link href={`/student/test-report/${testAttemptId}/answer`}>
                                    <Button
                                        type="primary"
                                        danger
                                        size="large"
                                        style={{
                                            background: '#ff4d4f',
                                            color: '#fff',
                                        }}
                                    >
                                        Back
                                    </Button>
                                </Link>
                            }
                        </Flex>
                        <Divider />
                        <div className="row justify-content-between">
                            <div className="col-lg-12 col-md-12">
                                <div className="questionAnswer">
                                    <Row gutter={24}>
                                        <Col xxl={20} xl={20} lg={16} md={14} sm={24} xs={24}>
                                            {children}
                                        </Col>
                                        <Col
                                            xxl={4}
                                            xl={4}
                                            lg={8}
                                            md={8}
                                            sm={24}
                                            xs={24}>
                                            <Flex vertical className="iconListQuestionAnswer" gap={'small'}>
                                                <li>
                                                    <i className="fa-solid fa-check" />
                                                    Answered
                                                </li>
                                                <li className="softPink">
                                                    <i className="fa-solid fa-xmark" />
                                                    Unanswered
                                                </li>
                                                <li className="deepRed">
                                                    <i className="fa-solid fa-maximize" />
                                                    Not Visited
                                                </li>
                                                <li className="purple">
                                                    <i className="fa-solid fa-comments" />
                                                    Answered & Flagged
                                                </li>
                                                <li className="lightGreen">
                                                    <i className="fa-solid fa-message" />
                                                    Flagged Unanswered
                                                </li>
                                            </Flex>
                                            <div className="list-number mt-4">
                                                <Flex wrap gap={'small'}>
                                                    {questions && questionAttempts && testAttempt && testAttempt.test?.questions.map((questionId: QuestionAndComprehension, index: number) => {
                                                        const questionActive = questionAttempts?.find((item: any) => item?.questionId?._id == questionId._id);
                                                        let isFlagged = questionActive?.isFlagged;
                                                        let backgroundColor = '';
                                                        let borderColor = '';
                                                        let color = '#fff';
                                                        let icon = null;
                                                        let status = 'Unanswered'

                                                        if (!questionActive) {
                                                            backgroundColor = '#e87c75';
                                                            status = 'Unanswered'
                                                        }

                                                        if (questionAttempts.length < currentIndex && currentIndex > index && !questionActive) {
                                                            backgroundColor = '#b81736';
                                                            icon = <i className="fa-solid fa-maximize" />;
                                                            status = 'Not Visited'
                                                        }

                                                        if (questionActive) {
                                                            switch (questionActive.status) {
                                                                case 'answered':
                                                                    if (isFlagged) {
                                                                        backgroundColor = '#9171c9';
                                                                        icon = <i className="fa-solid fa-comments" />
                                                                        status = 'Answered & Flagged'
                                                                    } else {
                                                                        icon = <FaCheck />
                                                                        backgroundColor = '#19E8B2';
                                                                        status = 'Answered'
                                                                    }
                                                                    break;
                                                                case 'unanswered':
                                                                    if (isFlagged) {
                                                                        icon = <i className="fa-solid fa-message" />
                                                                        backgroundColor = '#a0d368';
                                                                        status = 'Unanswered & Flagged'
                                                                    } else {
                                                                        icon = <RxCross2 />
                                                                        backgroundColor = '#e87c75';
                                                                        status = 'Unanswered'
                                                                    }
                                                                    break;
                                                                case 'incomplete':
                                                                    backgroundColor = 'rgb(9, 166, 235)';
                                                                    status = 'Incomplete'
                                                                    break;
                                                                case 'notVisited':
                                                                    backgroundColor = '#B81736';
                                                                    icon = <i className="fa-solid fa-maximize" />
                                                                    status = 'Not Visited'
                                                                    break;
                                                                default:
                                                                    backgroundColor = '';
                                                            }
                                                        }

                                                        const isActive = index === currentIndex;
                                                        const activeStyles = isActive ? { border: '2px solid rgb(9, 166, 235)', fontWeight: 'bold' } : {};

                                                        return (
                                                            <div key={index}>
                                                                <Tooltip title={status}>
                                                                    <Button
                                                                        // disabled={isReview}
                                                                        shape="circle"
                                                                        type="link"
                                                                        // onClick={() => goToQuestionAttempt(questionId._id, index)}
                                                                        onClick={() => carouselRef.current.goTo(index)}
                                                                        style={{
                                                                            background: backgroundColor,
                                                                            color: color,
                                                                            border: `1px solid ${borderColor || '#fff'}`,
                                                                            transition: 'all 0.3s ease',
                                                                            ...activeStyles,
                                                                        }}
                                                                    >
                                                                        <Flex vertical>
                                                                            <span>{index + 1}</span>
                                                                            {isFlagged && <PiFlagPennantFill style={{ marginLeft: '5px', color: 'red' }} />}
                                                                        </Flex>
                                                                    </Button>
                                                                </Tooltip>
                                                            </div>
                                                        );
                                                    })}
                                                </Flex>
                                            </div>
                                            {!isReview &&
                                                <div style={{ width: '100%' }} className="text-end float-end mt-4">
                                                    <Popconfirm
                                                        title={`${questionAttempts && testAttempt && questionAttempts.length < testAttempt.test.questionOrder.length
                                                            ? 'You have not completed all the questions.'
                                                            : ''
                                                            } Are you sure you want to submit?`}
                                                        onConfirm={confirmSubmit}
                                                        okText="Yes, submit"
                                                        cancelText="No, go back"
                                                    >
                                                        <Button
                                                            disabled={isReview}
                                                            size='large'
                                                            style={{
                                                                background: '#09a6eb',
                                                                color: '#fff'
                                                            }}>
                                                            Submit Test
                                                        </Button>
                                                    </Popconfirm>
                                                </div>
                                            }
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                            {!isReview &&
                                <div className="col-lg-12 col-md-12">
                                    <Flex justify='space-between' align='center' className='mt-4'>
                                        {!isComprehension &&
                                            <div className="d-flex gap-2 align-items-center">
                                                <div className="text-center bottom-large-space">
                                                    <Button
                                                        disabled={isReview}
                                                        shape='circle'
                                                        size='large'
                                                        color='default'
                                                        onClick={() => {
                                                            setIsFlagged(!isFlagged);
                                                            form.setFieldsValue({
                                                                isFlagged: !isFlagged
                                                            });
                                                        }}
                                                        style={{
                                                            background: isFlagged ? 'green' : 'rgb(204 204 204 / 25%)',
                                                            cursor: "pointer",
                                                            color: isFlagged ? '#fff' : '#ccc'
                                                        }}>
                                                        <i className="fa-solid fa-flag" />
                                                    </Button>
                                                </div>
                                                <div style={{ width: 150 }} className="text-center bottom-large-space">
                                                    <Button
                                                        disabled={currentIndex === 0 || isReview}
                                                        className="btn-primary btn-spac"
                                                        style={{
                                                            background: '#09a6eb',
                                                            color: '#fff'
                                                        }}
                                                        htmlType='button'
                                                        onClick={() => carouselRef.current.prev()}
                                                        size='large'
                                                    >
                                                        Previous
                                                    </Button>
                                                </div>
                                                <div style={{ width: 150 }} className="text-center bottom-large-space">
                                                    <Button disabled={isReview} className="btn-primary btn-spac clear-btn" onClick={() => form.resetFields()} size='large'>
                                                        <i className="fa-solid fa-eraser" /> Clear
                                                    </Button>
                                                </div>
                                                <div style={{ width: 150 }} className="text-center bottom-large-space">
                                                    {currentIndex === questions.length - 1 ?
                                                        <Popconfirm
                                                            title={`Are you sure you want to submit?`}
                                                            onConfirm={confirmSubmit}
                                                            okText="Yes, submit"
                                                            cancelText="No, go back"
                                                        >
                                                            <Button
                                                                disabled={isReview}
                                                                size='large'
                                                                style={{
                                                                    background: '#09a6eb',
                                                                    color: '#fff'
                                                                }}
                                                            >
                                                                Submit Test
                                                            </Button>
                                                        </Popconfirm>
                                                        :
                                                        <Button

                                                            className="btn-primary btn-spac"
                                                            disabled={currentIndex === questions.length || isReview}
                                                            style={{
                                                                background: '#09a6eb',
                                                                color: '#fff'
                                                            }}
                                                            htmlType='button'
                                                            onClick={() => form.submit()}
                                                            size='large'
                                                        >
                                                            Next
                                                        </Button>
                                                    }
                                                </div>
                                            </div>
                                        }
                                        <Flex gap={'small'}>
                                            <Button size='large'>
                                                <Typography.Text type='secondary' onClick={() => setModalVisible(true)}>
                                                    Report a Problem
                                                </Typography.Text>
                                            </Button>
                                            <Popconfirm
                                                title={`Are you sure you want to exit? ${questionAttempts && testAttempt && questionAttempts.length < testAttempt.test.questionOrder.length
                                                    ? 'You have not completed all the questions.'
                                                    : ''
                                                    }`}
                                                onConfirm={handleExit}
                                                okText="Yes, exit"
                                                cancelText="No, stay"
                                            >
                                                <Button
                                                    disabled={isReview}
                                                    type="primary"
                                                    danger
                                                    size="large"
                                                    style={{
                                                        background: '#ff4d4f',
                                                        color: '#fff',
                                                    }}
                                                // onClick={handleExit}
                                                >
                                                    Exit Test
                                                </Button>
                                            </Popconfirm>
                                        </Flex>
                                    </Flex>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <Modal
                    title="Time's Up!"
                    visible={isTimeUp}
                    closable={false}
                    footer={null}
                    centered
                    style={{
                        borderRadius: '10px',
                        textAlign: 'center',
                        padding: '20px',
                    }}
                >
                    <p style={{ fontSize: '1.25rem', color: '#333', marginBottom: '20px' }}>
                        Your test time has expired.
                    </p>
                    <p style={{ fontSize: '1rem', color: '#666', marginBottom: '20px' }}>
                        You will be redirected to the results page in <b>{countdown} seconds</b>.
                    </p>
                    <Button
                        disabled={isReview}
                        type="primary"
                        size="large"
                        onClick={() => router.push(`/student/testAttempt/${testAttemptId}/result`)}
                    >
                        View Results Now
                    </Button>
                </Modal>
                <Modal
                    title="Exit Test"
                    open={showExit}
                    onClose={() => setShowExit(false)}
                    onCancel={() => setShowExit(false)}
                    onOk={handleExit}
                    okText="Yes, exit"
                    cancelText="No, stay"
                >
                    <p>
                        Are you sure you want to exit?
                        {questionAttempts && testAttempt && questionAttempts.length < testAttempt.test.questionOrder.length
                            ? 'You have not completed all the questions.'
                            : ''
                        }
                    </p>
                </Modal>
                {
                    testAttempt &&
                    <ReportProblemModal
                        visible={modalVisible}
                        onClose={() => setModalVisible(false)}
                        testId={testAttempt.test._id}
                        userId={user?._id || ''}
                    />
                }
            </Card>
        </Badge.Ribbon>
    )
}
