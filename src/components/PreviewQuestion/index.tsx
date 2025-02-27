'use client'

import axios from 'axios'
import { Button, Card, Carousel, Col, Row, Typography, Space, Flex, Modal } from 'antd'
// @ts-ignore
import { useRouter } from 'nextjs-toploader/app'
import React, { useEffect, useRef, useState } from 'react'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { QuestionAndComprehension } from '@/lib/types'
import QuestionItem from './QuestionItem'

interface PreviewQuestionProps {
    testId?: string;
}

export default function PreviewQuestion({ testId }: PreviewQuestionProps) {
    const [loading, setLoading] = useState(true)
    const [questions, setQuestions] = useState<QuestionAndComprehension[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isNextButtonVisible, setIsNextButtonVisible] = useState(false)
    const [selectedAnswer, setSelectedAnswer] = useState<any>(null)
    const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null)
    const [questionResults, setQuestionResults] = useState<{ [key: string]: boolean }>({})
    const [paragraph, setParagraph] = useState<string | null>(null)
    const [showSummary, setShowSummary] = useState(false)
    const [initialQuestions, setInitialQuestions] = useState<QuestionAndComprehension[]>([])

    const carouselRef = useRef<any>(null)
    const router = useRouter()
    const searchParams = useSearchParams()
    const topic = searchParams.get('topic')
    const subtopic = searchParams.get('subtopic')
    const questionType = searchParams.get('questionType')
    const limit = searchParams.get('limit')

    useEffect(() => {
        if (topic && subtopic && questionType && limit) {
            fetchTest(topic, subtopic, questionType, parseInt(limit))
        }
    }, [topic, subtopic, questionType])

    const fetchTest = async (topic: string, subtopic: string, questionType: string, limit: number) => {
        setLoading(true)
        const response = await axios.get(`/student/question`, { params: { topic, subtopic, questionType, limit, isRandom: true } })
        setParagraph(questionType === 'comprehension' ? response.data.questions[0].paragraph : null)
        setQuestions(questionType === 'comprehension' ? response.data.questions[0].questionId : response.data.questions)
        setInitialQuestions(questionType === 'comprehension' ? response.data.questions[0].questionId : response.data.questions)
        setLoading(false)
    }

    const handleOptionClick = (question: QuestionAndComprehension, option: any) => {
        setQuestions(prev =>
            prev.map(q => q._id === question._id ? {
                ...q, questionOptions: q.questionOptions.map(opt => ({
                    ...opt, isClicked: opt._id === option._id, isHighlighted: opt.isCorrect
                }))
            } : q)
        )

        setQuestionResults({ ...questionResults, [question._id]: option.isCorrect })
        setSelectedAnswer(option)
        setIsAnswerCorrect(option.isCorrect)
        setIsNextButtonVisible(true)
    }

    const moveToNextQuestion = () => {
        if (currentIndex === questions.length - 1) {
            setShowSummary(true)
            getTestSummary()
        } else {
            setIsNextButtonVisible(false)
            setSelectedAnswer(null)
            carouselRef.current.next()
            setIsAnswerCorrect(null)
        }
    }

    const getTestSummary = () => {
        const correctCount = Object.values(questionResults).filter(isCorrect => isCorrect).length;
        const incorrectCount = questions.length - correctCount;
        const scorePercentage = Math.round((correctCount / questions.length) * 100);
        const accuracy = (correctCount / questions.length) * 100;
        const encouragementMessage =
            scorePercentage >= 80
                ? "🌟 Excellent work! Keep it up!"
                : scorePercentage >= 50
                    ? "👍 Good effort! A little more practice and you'll ace it!"
                    : "💪 Don't give up! Keep practicing and you'll improve!";

        return (
            <Modal open={showSummary} footer={null} closable={false} centered>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="summary-container"
                    style={{
                        textAlign: "center",
                    }}
                >
                    <div className="summary-header" style={{ marginBottom: "20px" }}>
                        <Typography.Title level={3} style={{ color: "#1890ff" }}>
                            🎉 Test Completed!
                        </Typography.Title>
                        <Typography.Text style={{ fontSize: "1rem", color: "#555" }}>
                            Great job! Here a summary of your performance:
                        </Typography.Text>
                    </div>

                    <div className="progress-bar-container" style={{ marginBottom: "20px" }}>
                        <div className="progress-bar" style={{ height: "12px", borderRadius: "8px", backgroundColor: "#f0f0f0" }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${accuracy}%` }}
                                className="progress-fill"
                                style={{
                                    height: "100%",
                                    borderRadius: "8px",
                                    backgroundColor: accuracy >= 80 ? "#4CAF50" : accuracy >= 50 ? "#FFC107" : "#F44336",
                                }}
                            />
                        </div>
                        <Typography.Text style={{ fontSize: "1rem", fontWeight: "bold", marginTop: "8px" }}>
                            Accuracy: {accuracy.toFixed(2)}%
                        </Typography.Text>
                    </div>

                    <div className="score-breakdown" style={{ marginBottom: "30px" }}>
                        <Typography.Text>
                            📌 <b>Total Questions:</b> {questions.length}
                        </Typography.Text>
                        <br />
                        <Typography.Text>
                            ✅ <b>Correct Answers:</b> <span style={{ color: "#4CAF50" }}>{correctCount}</span>
                        </Typography.Text>
                        <br />
                        <Typography.Text>
                            ❌ <b>Incorrect Answers:</b> <span style={{ color: "#F44336" }}>{incorrectCount}</span>
                        </Typography.Text>
                    </div>

                    <div className="encouragement" style={{ marginBottom: "20px" }}>
                        <Typography.Title level={4} style={{ color: "#555" }}>
                            {encouragementMessage}
                        </Typography.Title>
                    </div>

                    <div className="summary-buttons" style={{ marginTop: "20px" }}>
                        <Button
                            type="primary"
                            size="large"
                            style={{
                                backgroundColor: "#1890ff",
                                width: "100%",
                                borderRadius: "8px",
                                boxShadow: "0 4px 8px rgba(24, 144, 255, 0.2)",
                                transition: "all 0.3s ease",
                            }}
                            onClick={() => router.push("/student/practice-area/list")}
                        >
                            🔄 Return to Home
                        </Button>
                        <Button
                            type="default"
                            size="large"
                            style={{
                                marginTop: "10px",
                                width: "100%",
                                borderRadius: "8px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                transition: "all 0.3s ease",
                            }}
                            onClick={() => {
                                setShowSummary(false);
                                setSelectedAnswer(null)
                                setQuestionResults({});
                                setQuestions(initialQuestions)
                                setIsNextButtonVisible(false)
                                carouselRef.current.goTo(0);
                            }}
                        >
                            🔁 Restart Test
                        </Button>
                    </div>
                </motion.div>
            </Modal>
        );
    };

    return (
        <Row justify="start">
            <Col span={24}>
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Flex justify="space-between" align="center">
                        <Typography.Title level={3}>{questions[0]?.topic} || {questions[0]?.subTopic}</Typography.Title>
                    </Flex>

                    <Card
                        loading={loading}
                        title={
                            <Typography.Title level={4} className='m-0'>
                                Question {currentIndex + 1} / {questions.length}
                            </Typography.Title>
                        }
                    >
                        {
                            paragraph && (
                                <Card
                                    style={{
                                        backgroundColor: '#f9f9f9',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                        marginBottom: '20px',
                                        transition: 'transform 0.3s ease',
                                    }}
                                    hoverable
                                >
                                    <div dangerouslySetInnerHTML={{ __html: paragraph }} />
                                </Card>

                            )
                        }
                        <Carousel ref={carouselRef} infinite={false} dots={false} afterChange={setCurrentIndex}>
                            {questions.map((question) => (
                                question.paragraph ?
                                    <>
                                        <div key={question._id} style={{ padding: "10px 0" }}>
                                            <Typography.Text type="secondary" style={{ display: "block", fontSize: "1rem" }}>
                                                <span dangerouslySetInnerHTML={{ __html: question.paragraph }} />
                                            </Typography.Text>
                                        </div>

                                        <Carousel ref={carouselRef} infinite={false} dots={false} afterChange={setCurrentIndex}>
                                            {question.questionId.map((item: any) => (
                                                <QuestionItem
                                                    key={item._id}
                                                    question={item}
                                                    handleOptionClick={handleOptionClick}
                                                    selectedAnswer={selectedAnswer}
                                                    currentIndex={currentIndex}
                                                />
                                            ))}
                                        </Carousel>
                                    </>
                                    :
                                    <QuestionItem
                                        key={question._id}
                                        question={question}
                                        handleOptionClick={handleOptionClick}
                                        selectedAnswer={selectedAnswer}
                                        currentIndex={currentIndex}
                                    />
                            ))}
                        </Carousel>
                        {showSummary && getTestSummary()}
                        {isNextButtonVisible && (
                            <Button
                                type="primary"
                                size="large"
                                block
                                style={{
                                    marginTop: '20px',
                                    backgroundColor: isAnswerCorrect ? '#5cb85c' : '#ff4d4f',
                                }}
                                onClick={moveToNextQuestion}
                            >
                                {currentIndex === questions.length - 1 ? 'Finish Test' : 'Next Question'}
                            </Button>
                        )}
                        {!showSummary && (
                            <Space style={{ marginTop: '20px', textAlign: 'right' }}>
                                <Flex wrap gap={'small'}>
                                    {questions.map((_, index) => {
                                        // @ts-ignore
                                        const isCorrect = questionResults[questions[index]._id]
                                        return (
                                            <Button
                                                key={index}
                                                type={isCorrect === true ? 'primary' : 'default'}
                                                style={{
                                                    backgroundColor: isCorrect ? 'green' : isCorrect === false ? 'red' : '',
                                                    color: isCorrect !== undefined ? 'white' : 'black',
                                                }}
                                                onClick={() => carouselRef.current.goTo(index)}
                                                icon={isCorrect ? <FaCheckCircle /> : isCorrect === false ? <FaTimesCircle /> : null}
                                            >
                                                {index + 1}
                                            </Button>
                                        )
                                    })}
                                </Flex>
                            </Space>
                        )}
                    </Card>
                </Space>
            </Col>
        </Row>
    )
}
