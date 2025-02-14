'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Button, Table } from 'antd'
import axios from 'axios'
import { GrDocumentPdf } from 'react-icons/gr'

export default function page() {
    const [testResults, setTestResults] = useState<any[]>([]);

    useEffect(() => {
        const fetchTestResult = async () => {
            try {
                const response = await axios.get(`/student/testAttempt/test/result`);
                const data = await response.data.result;
                setTestResults(data); // Ensure this is the correct structure for the table
            } catch (error) {
                console.error(error);
            }
        };

        fetchTestResult();
    }, []);

    const columns = [
        {
            title: 'Test name',
            dataIndex: 'test',
            key: 'test',
            render: (test: any) => test ? test.testDisplayName : 'N/A'
        },
        {
            title: 'Package',
            dataIndex: 'mode',
            key: 'mode'
        },
        {
            title: 'Date & Time',
            dataIndex: 'startTime',
            key: 'startTime',
            render: (startTime: any) => startTime ? new Date(startTime).toLocaleString() : 'N/A'
        },
        {
            title: 'Exam Type',
            dataIndex: 'timer',
            key: 'timer'
        },
        {
            title: 'Total Questions',
            dataIndex: 'attemptQuestions',
            key: 'totalQuestions',
            render: (attemptQuestions: any) => attemptQuestions ? attemptQuestions.length : 0
        },
        {
            title: 'Correct',
            dataIndex: 'attemptQuestions',
            key: 'correct',
            render: (attemptQuestions: any) => attemptQuestions ? attemptQuestions.filter((qa: any) => qa.isCorrect).length : 0
        },
        {
            title: 'Wrong',
            dataIndex: 'attemptQuestions',
            key: 'wrong',
            render: (attemptQuestions: any) => attemptQuestions ? attemptQuestions.filter((qa: any) => !qa.isCorrect).length : 0
        },
        {
            title: 'Left',
            dataIndex: 'attemptQuestions',
            key: 'left',
            render: (attemptQuestions: any) => attemptQuestions ? attemptQuestions.filter((qa: any) => !qa.isActive).length : 0
        },
        {
            title: 'Your %',
            dataIndex: 'attemptQuestions',
            key: 'percentageCorrect',
            render: (attemptQuestions: any) => {
                if (attemptQuestions && attemptQuestions.length) {
                    const correctAnswers = attemptQuestions.filter((qa: any) => qa.isCorrect).length;
                    const totalQuestions = attemptQuestions.length;
                    return totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
                }
                return 0;
            }
        },
        {
            title: 'Topper %',
            dataIndex: 'percentageTopper',
            key: 'percentageTopper',
            render: () => '90%'
        },
        {
            title: 'Your Rank',
            dataIndex: 'rank',
            key: 'rank',
            render: () => '1'
        },
        {
            title: 'Report',
            dataIndex: 'testReportId',
            key: 'report',
            render: (testReportId: string) => <Link href={`/student/test-report/${testReportId}`}><Button><GrDocumentPdf /></Button></Link>
        }
    ];

    const dataSource = testResults && testResults.length > 0 && testResults.map((result: any) => ({
        key: result._id,
        test: result.test || { name: 'N/A' }, // Assuming test name could be null
        mode: result.mode,
        startTime: result.startTime,
        timer: result.timer,
        attemptQuestions: result.attemptQuestions,
        percentageTopper: '90%',
        rank: '1',
        testReportId: result._id
    }));

    return (
        <>
            <section className="dash-part bg-light-steel ">

                <div className="spac-dash">
                    <h2 className="top-title mb-3">
                        My Test Result
                    </h2>
                    {/* @ts-ignore */}
                    <Table columns={columns} dataSource={dataSource} />
                </div>
            </section>

        </>
    )
}
