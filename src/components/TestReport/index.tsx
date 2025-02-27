'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios';
import { Badge, Button, Col, Flex, Modal, Row, Spin, Typography } from 'antd';
import datetimeDifference from "datetime-difference";
import DifficultyTestReportChart from '../DifficultyTestReportChart';
import ReportByGroupChart from '../ReportByGroupChart';
import { usePDF } from 'react-to-pdf';
import './style.css';
import FeedbackForm from './FeedbackForm';
import { FaCheck } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';

interface TestReportProps {
    testAttemptId: string;
}

export default function TestReport({
    testAttemptId
}: TestReportProps) {
    const [loading, setLoading] = useState(true)
    const [testAttempt, setTestAttempt] = useState<any>()
    const [feedbackModal, setFeedBackModal] = useState(false)
    const [totalQuestion, setTotalQuestion] = useState(0)
    const [correctAnswer, setCorrectAnswer] = useState(0)
    const [incorrectAnswer, setIncorrectAnswer] = useState(0)
    const [skippedAnswer, setSkippedAnswer] = useState(0)
    const [score, setScore] = useState(0)
    const [filterByDiffculty, setFilterByDiffculty] = useState<any>(null)
    const [groupedByTopic, setGroupedByTopic] = useState<any>([])
    const [timeTaken, setTimeTaken] = useState<any>(0);
    const [pdfLoading, setPdfLoading] = useState(false);
    const [isFeedbackSubmit, setIsFeedbackSubmit] = useState(false);
    const { toPDF, targetRef } = usePDF({ filename: `Test Report.pdf` });
    const [questionAttempt, setQuestionAttempt] = useState([])

    const fetchTestAttempt = async () => {
        setLoading(true)
        const response = await axios.get(`/student/testAttempt/${testAttemptId}`);
        const data = response.data.testAttempt;
        const answers = response.data.questionAttempts;
        setQuestionAttempt(answers)
        let correctAnswerCount = 0;
        let incorrectAnswerCount = 0;
        let skippedAnswerCount = 0;
        let initialDiffcultyData = {
            easy: {
                total: 0,
                correctAnswer: 0,
                incorrectAnswer: 0,
                unanswered: 0
            },
            medium: {
                total: 0,
                correctAnswer: 0,
                incorrectAnswer: 0,
                unanswered: 0
            },
            hard: {
                total: 0,
                correctAnswer: 0,
                incorrectAnswer: 0,
                unanswered: 0
            }
        }
        answers.map((item: any) => {
            const difficulty = item.questionId.complexityId.complexityLevel;

            let difficultyCategory: 'easy' | 'medium' | 'hard';

            if (difficulty === 'easy') {
                difficultyCategory = 'easy';
            } else if (difficulty === 'hard') {
                difficultyCategory = 'hard';
            } else {
                difficultyCategory = 'medium';
            }
            initialDiffcultyData[difficultyCategory].total += 1;
            if (item.answerId && item.answerId.length > 0 && item.isCorrect === false) {
                initialDiffcultyData[difficultyCategory].incorrectAnswer += 1;
                incorrectAnswerCount += 1;
            } else if (item.isCorrect) {
                correctAnswerCount += 1;
                initialDiffcultyData[difficultyCategory].correctAnswer += 1;
            } else if (item.status === 'unanswered') {
                skippedAnswerCount += 1;
                initialDiffcultyData[difficultyCategory].unanswered += 1;
            }
        });

        const aggregateData = answers.reduce((acc: any, { questionId, isCorrect }: any) => {
            const topic = questionId.topic;
            const subTopic = questionId.subTopic;
            if (!acc[topic]) {
                acc[topic] = { correct: 0, incorrect: 0 };
                acc[topic]["subTopic"] = subTopic;
            }
            isCorrect ? acc[topic].correct++ : acc[topic].incorrect++;
            return acc;
        }, {});

        const chartData = Object.keys(aggregateData).map((topic) => ({
            topic,
            subTopic: aggregateData[topic].subTopic,
            correct: aggregateData[topic].correct,
            incorrect: aggregateData[topic].incorrect,
        }));
        setGroupedByTopic(chartData)
        const startDate = new Date(data.startTime);
        const endDate = new Date(data.endTime);
        const result = datetimeDifference(startDate, endDate);

        setTimeTaken(result)
        const allQuestions = [...data.test.questions]
        setFilterByDiffculty(initialDiffcultyData)
        setScore(((correctAnswerCount / allQuestions.length) * 100))
        setIncorrectAnswer(incorrectAnswerCount)
        setCorrectAnswer(correctAnswerCount)
        setSkippedAnswer(skippedAnswerCount)
        setTestAttempt(data);
        setTotalQuestion(allQuestions.length);
        setLoading(false);
    }

    useEffect(() => {
        if (testAttemptId) {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    await Promise.all([
                        fetchTestAttempt()
                    ]);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };

            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [testAttemptId])

    const handlePrintTest = () => {
        setPdfLoading(true);
        toPDF()
            // @ts-ignore
            .then(() => {
                setPdfLoading(false);
            })
            // @ts-ignore
            .catch((error) => {
                console.error("Error generating PDF: ", error);
                setPdfLoading(false);
            });
    };

    const getOrdinalSuffix = (num: any) => {
        if (!num) return ""; // Handle undefined/null case
        const suffixes = ["th", "st", "nd", "rd"];
        const v = num % 100;
        return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
    };

    return (
        <>
            {
                loading ?
                    <Flex style={{ height: '100vh' }} align='center' justify='center'>
                        <Spin spinning={loading} />
                    </Flex>
                    :
                    <Badge.Ribbon text={loading ? "Loading..." : getOrdinalSuffix(testAttempt.attempt) + " Attempt"}>
                        <section style={{ fontFamily: 'Public Sans', }} ref={targetRef}>
                            <div
                                style={{
                                    margin: "10px auto",
                                    backgroundColor: "#fff",
                                    borderRadius: 8,
                                    padding: "4%",
                                    boxShadow: "1px 8px 20px 0px #2020200F",
                                    border: "solid 1px #eee"
                                }}
                            >
                                <Flex align='center' justify='space-between'>
                                    <h1
                                        style={{
                                            textAlign: "left",
                                            color: "#202020",
                                            fontWeight: 400,
                                            fontSize: "1.8rem",
                                        }}
                                        className='p-0'
                                    >
                                        <p className="top-title m-0">
                                            {loading ? "Loading..." : testAttempt?.test?.testDisplayName}
                                        </p>
                                    </h1>
                                    <div style={{ textAlign: "right" }}>
                                        <Button
                                            onClick={handlePrintTest}
                                            loading={pdfLoading}
                                            // href="#"
                                            size='large'
                                            style={{
                                                textDecoration: "none",
                                                background: "#5CB85C",
                                                color: "#fff"
                                            }}
                                        >
                                            Download Scores PDF
                                        </Button>
                                    </div>
                                </Flex>
                                <div style={{ marginTop: "3rem" }}>
                                    <Typography.Title
                                        level={4}
                                    >
                                        Question Summary Report
                                    </Typography.Title>
                                    <div
                                        style={{
                                            border: "1px solid #20202033",
                                            borderRadius: 8,
                                            padding: "2%",
                                            display: "flex",
                                            overflowX: "auto",
                                            whiteSpace: "nowrap",
                                            flexWrap: "wrap",
                                            justifyContent: "space-between"
                                        }}
                                    >
                                        <div
                                            style={{ width: "140px", textAlign: "center", padding: "4px 10px" }}
                                        >
                                            <p
                                                style={{
                                                    fontSize: "1.7rem",
                                                    fontWeight: 400,
                                                    textAlign: "center",
                                                    color: "#202020",
                                                    marginBottom: 5
                                                }}
                                            >
                                                {totalQuestion}
                                            </p>
                                            <p
                                                style={{
                                                    fontSize: "1rem",
                                                    fontWeight: 600,
                                                    lineHeight: "20.24px",
                                                    textAlign: "center",
                                                    color: "#20202066",
                                                    margin: 0
                                                }}
                                            >
                                                Questions
                                            </p>
                                        </div>
                                        <div
                                            style={{ width: "140px", textAlign: "center", padding: "4px 10px" }}
                                        >
                                            <p
                                                style={{
                                                    fontSize: "1.7rem",
                                                    fontWeight: 400,
                                                    textAlign: "center",
                                                    color: "#66AB7B",
                                                    marginBottom: 5
                                                }}
                                            >
                                                {correctAnswer}
                                            </p>
                                            <p
                                                style={{
                                                    fontSize: "1rem",
                                                    fontWeight: 600,
                                                    lineHeight: "20.24px",
                                                    textAlign: "center",
                                                    color: "#20202066",
                                                    margin: 0
                                                }}
                                            >
                                                Correct
                                            </p>
                                        </div>
                                        <div
                                            style={{ width: "140px", textAlign: "center", padding: "4px 10px" }}
                                        >
                                            <p
                                                style={{
                                                    fontSize: "1.7rem",
                                                    fontWeight: 400,
                                                    textAlign: "center",
                                                    color: "#F28D9A",
                                                    marginBottom: 5
                                                }}
                                            >
                                                {incorrectAnswer}
                                            </p>
                                            <p
                                                style={{
                                                    fontSize: "1rem",
                                                    fontWeight: 600,
                                                    lineHeight: "20.24px",
                                                    textAlign: "center",
                                                    color: "#20202066",
                                                    margin: 0
                                                }}
                                            >
                                                Incorrect
                                            </p>
                                        </div>
                                        <div
                                            style={{ width: "140px", textAlign: "center", padding: "4px 10px" }}
                                        >
                                            <p
                                                style={{
                                                    fontSize: "1.7rem",
                                                    fontWeight: 400,
                                                    textAlign: "center",
                                                    color: "#202020",
                                                    marginBottom: 5
                                                }}
                                            >
                                                {skippedAnswer}
                                            </p>
                                            <p
                                                style={{
                                                    fontSize: "1rem",
                                                    fontWeight: 600,
                                                    lineHeight: "20.24px",
                                                    textAlign: "center",
                                                    color: "#20202066",
                                                    margin: 0
                                                }}
                                            >
                                                Skipped
                                            </p>
                                        </div>
                                        <div
                                            style={{ width: "140px", textAlign: "center", padding: "4px 10px" }}
                                        >
                                            <p
                                                style={{
                                                    fontSize: "1.7rem",
                                                    fontWeight: 400,
                                                    textAlign: "center",
                                                    color: "#202020",
                                                    marginBottom: 5
                                                }}
                                            >
                                                {score?.toFixed(2)}%
                                            </p>
                                            <p
                                                style={{
                                                    fontSize: "1rem",
                                                    fontWeight: 600,
                                                    lineHeight: "20.24px",
                                                    textAlign: "center",
                                                    color: "#20202066",
                                                    margin: 0
                                                }}
                                            >
                                                Score
                                            </p>
                                        </div>
                                        <div
                                            style={{ width: "140px", textAlign: "center", padding: "4px 10px" }}
                                        >
                                            <p
                                                style={{
                                                    fontSize: "1.7rem",
                                                    fontWeight: 400,
                                                    textAlign: "center",
                                                    color: "#202020",
                                                    marginBottom: 5
                                                }}
                                            >
                                                {timeTaken?.minutes}<small>m</small> {timeTaken?.seconds}<small>s</small>
                                            </p>
                                            <p
                                                style={{
                                                    fontSize: "1rem",
                                                    fontWeight: 600,
                                                    lineHeight: "20.24px",
                                                    textAlign: "center",
                                                    color: "#20202066",
                                                    margin: 0
                                                }}
                                            >
                                                Time Taken
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: "flex", flexWrap: "wrap", margin: "50px 0 50px 0" }}>
                                    <div style={{ width: "50%", textAlign: "left" }}>
                                        <Typography.Title
                                            level={4}
                                        >
                                            How you did, by diffculty:
                                        </Typography.Title>
                                    </div>
                                    <div style={{ width: "50%", textAlign: "right" }}>
                                        <Link href={`/student/test-report/${testAttempt._id}/answer`}>
                                            <Button
                                                size='large'
                                                style={{
                                                    background: "#3098A0",
                                                    color: "#fff"
                                                }}
                                            >
                                                View Your Answers
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                                <Row gutter={[16, 16]} justify="center">
                                    <Col span={8} style={{ textAlign: 'center' }}>
                                        <Typography.Title level={5} style={{ textAlign: 'center' }}>
                                            Easy
                                        </Typography.Title>
                                    </Col>
                                    <Col span={8}>
                                        <Typography.Title level={5} style={{ textAlign: 'center' }}>
                                            Medium
                                        </Typography.Title>
                                    </Col>
                                    <Col span={8}>
                                        <Typography.Title level={5} style={{ textAlign: 'center' }}>
                                            Hard
                                        </Typography.Title>
                                    </Col>
                                </Row>

                                {filterByDiffculty && (
                                    <Row gutter={[16, 16]} justify="center">
                                        <Col span={8}>
                                            <DifficultyTestReportChart
                                                correctAnswer={filterByDiffculty.easy.correctAnswer}
                                                incorrectAnswer={filterByDiffculty.easy.incorrectAnswer}
                                                unanswered={filterByDiffculty.easy.unanswered}
                                            />
                                        </Col>
                                        <Col span={8}>
                                            <DifficultyTestReportChart
                                                correctAnswer={filterByDiffculty.medium.correctAnswer}
                                                incorrectAnswer={filterByDiffculty.medium.incorrectAnswer}
                                                unanswered={filterByDiffculty.medium.unanswered}
                                            />
                                        </Col>
                                        <Col span={8}>
                                            <DifficultyTestReportChart
                                                correctAnswer={filterByDiffculty.hard.correctAnswer}
                                                incorrectAnswer={filterByDiffculty.hard.incorrectAnswer}
                                                unanswered={filterByDiffculty.hard.unanswered}
                                            />
                                        </Col>
                                    </Row>
                                )}
                                <br />
                                <br />
                                <Typography.Title
                                    level={4}
                                >
                                    How your did, your Topic:
                                </Typography.Title>
                                {groupedByTopic
                                    &&
                                    <ReportByGroupChart groupedByTopic={groupedByTopic} />
                                }
                                {/* <GanttChart /> */}
                                {/* <TimeTakenChart data={questionAttempt} /> */}
                                {/* <TimingChart /> */}
                                <br />
                                <br />
                                <Typography.Title
                                    level={4}
                                >
                                    How did you do by Topic and Sub-Topic:
                                </Typography.Title>
                                <table
                                    style={{
                                        width: "100%",
                                        border: "1px solid #20202033",
                                        background: "#FFFFFF",
                                        overflowY: "scroll"
                                    }}
                                >
                                    <tbody>
                                        <tr
                                            style={{
                                                fontWeight: 600,
                                                textAlign: "left",
                                                background: "#057DB1B2",
                                                padding: 10,
                                                color: "#fff"
                                            }}
                                        >
                                            <th
                                                style={{
                                                    fontWeight: 500,
                                                    padding: 5,
                                                    borderBottom: "1px solid #20202033",
                                                    textAlign: "center"
                                                }}
                                            >
                                                #
                                            </th>
                                            <th
                                                style={{
                                                    fontWeight: 500,
                                                    padding: 5,
                                                    borderBottom: "1px solid #20202033",
                                                    textAlign: "center"
                                                }}
                                            >
                                                Correct
                                            </th>
                                            <th
                                                style={{
                                                    fontWeight: 500,
                                                    padding: 5,
                                                    borderBottom: "1px solid #20202033"
                                                }}
                                            >
                                                Difficulty
                                            </th>
                                            <th
                                                style={{
                                                    fontWeight: 500,
                                                    padding: 5,
                                                    borderBottom: "1px solid #20202033"
                                                }}
                                            >
                                                Topic
                                            </th>
                                            <th
                                                style={{
                                                    fontWeight: 500,
                                                    padding: 5,
                                                    borderBottom: "1px solid #20202033"
                                                }}
                                            >
                                                Skill/Knowledge Testing Point
                                            </th>
                                        </tr>
                                        {
                                            groupedByTopic.map((item: any, index: number) => (
                                                <tr
                                                    key={index}
                                                    style={{
                                                        fontWeight: 600,
                                                        textAlign: "left",
                                                        background: "#fff",
                                                        padding: 10,
                                                        color: "#000"
                                                    }}
                                                >
                                                    <td
                                                        style={{
                                                            fontWeight: 500,
                                                            padding: 5,
                                                            borderBottom: "1px solid #20202033",
                                                            textAlign: "center"
                                                        }}
                                                    >
                                                        <b>{index + 1}</b>
                                                    </td>
                                                    <td
                                                        style={{
                                                            fontWeight: 500,
                                                            padding: 5,
                                                            borderBottom: "1px solid #20202033",
                                                            textAlign: "center"
                                                        }}
                                                    >
                                                        <b>{item.incorrect == 0 ? <FaCheck color='#52C479' /> : <FaXmark color='#FB3311' />}</b>
                                                    </td>
                                                    <td
                                                        style={{
                                                            fontWeight: 500,
                                                            padding: 5,
                                                            borderBottom: "1px solid #20202033"
                                                        }}
                                                    >
                                                        Medium
                                                    </td>
                                                    <td
                                                        style={{
                                                            fontWeight: 500,
                                                            padding: 5,
                                                            borderBottom: "1px solid #20202033"
                                                        }}
                                                    >
                                                        {item.topic}
                                                    </td>
                                                    <td
                                                        style={{
                                                            fontWeight: 500,
                                                            padding: 5,
                                                            borderBottom: "1px solid #20202033"
                                                        }}
                                                    >
                                                        Words In Context
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                                <br />
                                <br />
                                <Typography.Title
                                    level={4}
                                >
                                    Areas of Improvement:
                                </Typography.Title>
                                <table
                                    style={{
                                        width: "100%",
                                        border: "1px solid #20202033",
                                        background: "#FFFFFF"
                                    }}
                                >
                                    <tbody>
                                        <tr
                                            style={{
                                                fontWeight: 600,
                                                textAlign: "left",
                                                background: "#50A4C8",
                                                padding: 10,
                                                color: "#fff"
                                            }}
                                        >
                                            <th
                                                style={{
                                                    fontWeight: 500,
                                                    padding: 5,
                                                    borderBottom: "1px solid #20202033",
                                                    textAlign: "center"
                                                }}
                                            >
                                                S.NO
                                            </th>
                                            <th
                                                style={{
                                                    fontWeight: 500,
                                                    padding: 5,
                                                    borderBottom: "1px solid #20202033",
                                                    textAlign: "center"
                                                }}
                                            >
                                                Key Topic
                                            </th>
                                            <th
                                                style={{
                                                    fontWeight: 500,
                                                    padding: 5,
                                                    borderBottom: "1px solid #20202033"
                                                }}
                                            >
                                                Sub-Topic
                                            </th>
                                            <th
                                                style={{
                                                    fontWeight: 500,
                                                    padding: 5,
                                                    borderBottom: "1px solid #20202033"
                                                }}
                                            >
                                                Action
                                            </th>
                                        </tr>
                                        {
                                            Array.from(
                                                new Map(
                                                    questionAttempt
                                                        .filter((item: any) => item.isCorrect === false)
                                                        .map((item: any) => [`${item.questionId.topic}-${item.questionId.subTopic}`, item])
                                                ).values()
                                            ).map((item: any, index: number) => {
                                                return (
                                                    <tr
                                                        key={`${item.questionId.topic}-${item.questionId.subTopic}`}
                                                        style={{
                                                            fontWeight: 600,
                                                            textAlign: "left",
                                                            background: "#D81B608A",
                                                            padding: 10,
                                                            color: "#fff"
                                                        }}
                                                    >
                                                        <td
                                                            style={{
                                                                fontWeight: 500,
                                                                padding: 5,
                                                                borderBottom: "1px solid #20202033",
                                                                textAlign: "center"
                                                            }}
                                                        >
                                                            {index + 1}.
                                                        </td>
                                                        <td
                                                            style={{
                                                                fontWeight: 500,
                                                                padding: 5,
                                                                borderBottom: "1px solid #20202033",
                                                                textAlign: "center"
                                                            }}
                                                        >
                                                            {item.questionId.topic}
                                                        </td>
                                                        <td
                                                            style={{
                                                                fontWeight: 500,
                                                                padding: 5,
                                                                borderBottom: "1px solid #20202033"
                                                            }}
                                                        >
                                                            {item.questionId.subTopic}
                                                        </td>
                                                        <td
                                                            style={{
                                                                fontWeight: 500,
                                                                padding: 5,
                                                                borderBottom: "1px solid #20202033"
                                                            }}
                                                        >
                                                            <Link
                                                                href={`/student/practice-area/filter?questionType=${item.questionId.questionType}&topic=${item.questionId.topicSlug}&subtopic=${item.questionId.subTopicSlug}`}
                                                                style={{ textDecoration: 'underline', color: '#fff' }}
                                                            >
                                                                Go to Practice
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        }

                                    </tbody>
                                </table>
                                <div style={{ textAlign: "left", marginTop: "2rem" }}>
                                    <Button
                                        size='large'
                                        onClick={() => setFeedBackModal(true)}
                                        className="btn"
                                        disabled={isFeedbackSubmit}
                                        style={{
                                            background: "#09A6EB",
                                            color: "#fff"
                                        }}
                                    >
                                        Give Test Feedback
                                    </Button>
                                </div>
                            </div>
                            <Modal
                                title={<>Test Name: {testAttempt?.test?.testDisplayName} Feedback</>}
                                centered
                                open={feedbackModal}
                                onCancel={() => setFeedBackModal(false)}
                                footer={null}
                            >
                                <FeedbackForm testAttempt={testAttempt} testAttemptId={testAttemptId} onSuccess={() => { setFeedBackModal(false); setIsFeedbackSubmit(true) }} />
                            </Modal>
                        </section>
                    </Badge.Ribbon>
            }
        </>
    )
}
