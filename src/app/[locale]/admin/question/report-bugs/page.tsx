'use client'
import { getAllQuestionReportsBugs } from '@/lib/adminApi'
import ErrorHandler from '@/lib/ErrorHandler'
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Flex, Skeleton, Typography, Select } from 'antd';
import SkeletonLoader from '@/app/commonUl/SkeletonLoader';
import Link from 'next/link';
import { ArrowLeftOutlined } from '@ant-design/icons';
import ResponsiveTable from '@/commonUI/ResponsiveTable';


export default function Page() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [allTest, setAllTest] = useState<any[]>([]);
    const [selectedTest, setSelectedTest] = useState<string | null>(null);

    const fetchReports = async () => {
        try {
            const res = await getAllQuestionReportsBugs({ testId: selectedTest as string });
            if (res.success) {
                const formattedData = res.data.reportBugs.map((report: any) => ({
                    key: report._id,
                    studentName: `${report.userId?.name || ''}`,
                    testName: report.testId?.testDisplayName || report.testId?.testName || 'N/A',
                    issueType: report.issueType,
                    description: report.description,
                    createdAt: dayjs(report.createdAt).format('DD/MM/YYYY'),
                }));
                setAllTest(res.data.allTest);
                setReports(formattedData);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            ErrorHandler.showNotification(error);
        }
    }

    useEffect(() => {
        fetchReports()
    }, [selectedTest]);


    const columns = [
        {
            title: 'Question ID',
            dataIndex: 'key',
            key: 'key',
            render: (text: string, record: any) => (

                <Typography.Paragraph
                    type="secondary"
                    copyable={{ text }}
                    className='m-0'
                >
                    {text.slice(18, 24)}
                </Typography.Paragraph>

            ),
        },
        {
            title: 'Test Name',
            dataIndex: 'testName',
            key: 'testName',
        },
        {
            title: 'Student Name',
            dataIndex: 'studentName',
            key: 'studentName',
        },
        {
            title: 'Issue Type',
            dataIndex: 'issueType',
            key: 'issueType',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',

        }
    ];

    const GetSelectedId = (data: []) => {

    };

    return (
        <>
            {loading ?
                <Skeleton active={loading} loading={loading} />
                :
                <>
                    <div className="row align-items-center">
                        <div className="col-md-10">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Link href={`/admin/dashboard`}>
                                    <ArrowLeftOutlined style={{ fontSize: '20px', cursor: 'pointer', marginRight: '10px' }} />
                                </Link>
                                <Typography.Title level={3} className='mb-0 top-title' style={{ marginBottom: 0 }}>
                                    Report Bugs
                                </Typography.Title>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <Select
                                allowClear
                                className='w-100'
                                showSearch
                                placeholder="Filter by Test Name"
                                optionFilterProp="children"
                                onChange={(value) => {
                                    setSelectedTest(value)
                                }}
                                options={allTest.map((test) => {
                                    return {
                                        label: test.testName,
                                        value: test._id,
                                    };
                                })}
                                value={selectedTest}
                            />
                        </div>
                    </div>
                    <ResponsiveTable columns={columns} data={reports} GetSelectedId={GetSelectedId} />
                </>
            }
        </>
    )
}
