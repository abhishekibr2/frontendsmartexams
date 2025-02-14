'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios';
import { Badge, Button, Col, Flex, Row, Spin, Typography } from 'antd';
import datetimeDifference from "datetime-difference";
import DifficultyTestReportChart from '../DifficultyTestReportChart';
import ReportByGroupChart from '../ReportByGroupChart';
import GanttChart from '../GanttChart';
import { usePDF } from 'react-to-pdf';

interface TestReportProps {
    testAttemptId: string;
}

export default function TestReport({
    testAttemptId
}: TestReportProps) {
    const [loading, setLoading] = useState(true)
    const [testAttempt, setTestAttempt] = useState<any>()
    const [questions, setQuestions] = useState<any[]>([])
    const [questionAttempts, setQuestionAttempts] = useState<any[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [totalQuestion, setTotalQuestion] = useState(0)
    const [correctAnswer, setCorrectAnswer] = useState(0)
    const [incorrectAnswer, setIncorrectAnswer] = useState(0)
    const [skippedAnswer, setSkippedAnswer] = useState(0)
    const [score, setScore] = useState(0)
    const [filterByDiffculty, setFilterByDiffculty] = useState<any>(null)
    const [groupedByTopic, setGroupedByTopic] = useState<any>([])
    const [timeTaken, setTimeTaken] = useState<any>(0);

    const [pdfLoading, setPdfLoading] = useState(false);
    const { toPDF, targetRef } = usePDF({ filename: `Test Report.pdf` });

    const fetchTestAttempt = async () => {
        setLoading(true)
        const response = await axios.get(`/student/testAttempt/${testAttemptId}`);
        const data = response.data.testAttempt;
        const answers = response.data.questionAttempts;
        setQuestionAttempts(answers)
        let correctAnswerCount = 0;
        let incorrectAnswerCount = 0;
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
            if (item.status === 'unanswered') {
                initialDiffcultyData[difficultyCategory].unanswered += 1;
            } else if (item.isCorrect) {
                initialDiffcultyData[difficultyCategory].correctAnswer += 1;
                correctAnswerCount += 1;
            } else {
                initialDiffcultyData[difficultyCategory].incorrectAnswer += 1;
                incorrectAnswerCount += 1;
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
        const allQuestions = [...data.test.questions, ...data.test.comprehensions]
        setFilterByDiffculty(initialDiffcultyData)
        setQuestions(allQuestions);
        setScore(Math.round((correctAnswerCount / allQuestions.length) * 100))
        setIncorrectAnswer(incorrectAnswerCount)
        setCorrectAnswer(correctAnswerCount)
        setSkippedAnswer(allQuestions.length - answers.length)
        setCurrentIndex(answers.length)
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
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [testAttemptId])

    const config = {
        data: [
            { type: 'Correct', value: 3 },
            { type: 'Incorrect', value: 2 },
            { type: 'Unanswered', value: 1 },
        ],
        angleField: 'value',
        colorField: 'type',
        innerRadius: 0.6,
        label: {
            text: 'value',
            style: {
                fontWeight: 'bold',
            },
        },
        legend: {
            color: {
                title: false,
                position: 'right',
                rowPadding: 5,
            },
        },
        annotations: [
            {
                type: 'text',
                style: {
                    text: 'AntV\nCharts',
                    x: '50%',
                    y: '50%',
                    textAlign: 'center',
                    fontSize: 40,
                    fontStyle: 'bold'
                },
            },
        ],
    };

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

    return (
        <>
            {
                loading ?
                    <Flex style={{ height: '100vh' }} align='center' justify='center'>
                        <Spin spinning={loading} />
                    </Flex>
                    :
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
                            <h1
                                style={{
                                    textAlign: "left",
                                    color: "#202020",
                                    fontWeight: 400,
                                    lineHeight: "1.6rem",
                                    fontSize: "1.8rem",
                                    marginBottom: 25
                                }}
                            >
                                <Badge.Ribbon text={testAttempt?.attempt + 'th Attempt'}>
                                    <p className="top-title m-0">
                                        {testAttempt?.test?.testDisplayName}
                                    </p>
                                </Badge.Ribbon>
                                <span
                                    style={{
                                        fontSize: "1rem",
                                        fontWeight: 600,
                                        lineHeight: "24.51px",
                                        color: "#2020209C",
                                        marginLeft: '5px'
                                    }}
                                >
                                    {/* 2<sup style={{ color: "#2020209C", fontSize: "0.7rem" }}>th</sup>
                            <span style={{ color: "#202020CC", fontWeight: 600, marginLeft: '5px' }}>Attempt</span> */}
                                </span>
                            </h1>
                            <div style={{ textAlign: "right" }}>
                                <Button
                                    onClick={handlePrintTest}
                                    loading={pdfLoading}
                                    // href="#"
                                    style={{
                                        textDecoration: "none",
                                        background: "#5CB85C",
                                        width: 278,
                                        height: 59,
                                        padding: 15,
                                        borderRadius: 7,
                                        fontSize: "0.7rem",
                                        fontWeight: 700,
                                        lineHeight: "29.3px",
                                        color: "#fff",
                                        textAlign: "center"
                                    }}
                                >
                                    Download Scores PDF
                                </Button>
                            </div>
                            <div style={{ marginTop: "3rem" }}>
                                <h2
                                    style={{
                                        fontSize: "0.9rem",
                                        fontWeight: 600,
                                        lineHeight: "1.4",
                                        textAlign: "left",
                                        marginBottom: 10
                                    }}
                                >
                                    Question Summary Report
                                </h2>
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
                                            {score}
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
                                            TimeTaken
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", margin: "50px 0 50px 0" }}>
                                <div style={{ width: "50%", textAlign: "left" }}>
                                    <h2
                                        style={{
                                            fontSize: "0.9rem",
                                            fontWeight: 600,
                                            lineHeight: "1.4",
                                            textAlign: "left",
                                            marginBottom: 10
                                        }}
                                    >
                                        How you did, by diffculty:
                                    </h2>
                                </div>
                                <div style={{ width: "50%", textAlign: "right" }}>
                                    <a
                                        href="#"
                                        style={{
                                            textDecoration: "none",
                                            background: "#3098A0",
                                            width: 247,
                                            height: 45,
                                            padding: 15,
                                            borderRadius: 7,
                                            fontSize: "0.7rem",
                                            fontWeight: 700,
                                            lineHeight: "29.3px",
                                            color: "#fff",
                                            textAlign: "center"
                                        }}
                                    >
                                        View Your Answers
                                    </a>
                                </div>
                            </div>
                            <Row>
                                <Col span={9}>
                                    <Typography.Title level={5}>
                                        Easy
                                    </Typography.Title>
                                </Col>
                                <Col span={9}>
                                    <Typography.Title level={5}>
                                        Medium
                                    </Typography.Title>
                                </Col>
                                <Col span={5}>
                                    <Typography.Title level={5}>
                                        Hard
                                    </Typography.Title>
                                </Col>
                            </Row>
                            {filterByDiffculty &&
                                <Flex style={{ margin: "20px 0 10px 0" }} justify='space-between' gap={'small'}>
                                    <DifficultyTestReportChart
                                        correctAnswer={filterByDiffculty.easy.correctAnswer}
                                        incorrectAnswer={filterByDiffculty.easy.incorrectAnswer}
                                        unanswered={filterByDiffculty.easy.unanswered}
                                    />
                                    <DifficultyTestReportChart
                                        correctAnswer={filterByDiffculty.medium.correctAnswer}
                                        incorrectAnswer={filterByDiffculty.medium.incorrectAnswer}
                                        unanswered={filterByDiffculty.medium.unanswered}
                                    />
                                    <DifficultyTestReportChart
                                        correctAnswer={filterByDiffculty.hard.correctAnswer}
                                        incorrectAnswer={filterByDiffculty.hard.incorrectAnswer}
                                        unanswered={filterByDiffculty.hard.unanswered}
                                    />
                                </Flex>
                            }
                            <br />
                            <br />
                            <h2
                                style={{
                                    fontSize: "0.9rem",
                                    fontWeight: 600,
                                    lineHeight: "1.4",
                                    textAlign: "left",
                                    marginBottom: 10
                                }}
                            >
                                How your did, your Topic:
                            </h2>
                            {groupedByTopic
                                &&
                                <ReportByGroupChart groupedByTopic={groupedByTopic} />
                            }
                            <br />
                            <br />
                            <h2
                                style={{
                                    fontSize: "0.9rem",
                                    fontWeight: 600,
                                    lineHeight: "1.4",
                                    textAlign: "left",
                                    marginBottom: 10
                                }}
                            >
                                How youal located your time:
                            </h2>
                            <p
                                style={{
                                    fontSize: 15,
                                    fontWeight: 600,
                                    lineHeight: "20.43px",
                                    textAlign: "left",
                                    color: "#202020"
                                }}
                            >
                                Show detailed timing graph
                            </p>
                            <GanttChart />
                            <br />
                            <br />
                            <h2
                                style={{
                                    fontSize: "0.7rem",
                                    fontWeight: 600,
                                    lineHeight: "1.4",
                                    textAlign: "left",
                                    marginBottom: 10
                                }}
                            >
                                How did you do by Topic and Sub-Topic:
                            </h2>
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
                                            fontSize: "0.7rem",
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
                                                    fontSize: "0.7rem",
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
                                                    <b>x</b>
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
                                            fontSize: "0.7rem",
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
                                    </tr>
                                    {
                                        groupedByTopic.map((item: any) => {
                                            return (
                                                <tr
                                                    key={''}
                                                    style={{
                                                        fontSize: "0.7rem",
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
                                                        1.
                                                    </td>
                                                    <td
                                                        style={{
                                                            fontWeight: 500,
                                                            padding: 5,
                                                            borderBottom: "1px solid #20202033",
                                                            textAlign: "center"
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
                                                        {item.subTopic}
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                            <div style={{ textAlign: "left", marginTop: "2rem" }}>
                                <Link
                                    href="/student/review"
                                    style={{
                                        textDecoration: "none",
                                        background: "#09A6EB",
                                        width: 278,
                                        height: 59,
                                        padding: 15,
                                        borderRadius: 7,
                                        fontSize: "0.7rem",
                                        fontWeight: 700,
                                        lineHeight: "29.3px",
                                        color: "#fff",
                                        textAlign: "center"
                                    }}
                                >
                                    Give Test Feedback
                                </Link>
                            </div>
                        </div>
                    </section>
            }
        </>
    )
}
