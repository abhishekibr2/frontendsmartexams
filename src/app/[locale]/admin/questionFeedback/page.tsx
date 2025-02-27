'use client';
import React, { useContext, useEffect, useState } from 'react';
import './style.css';
import AuthContext from '@/contexts/AuthContext';
import ResponsiveTable from '@/commonUI/ResponsiveTable';
import { Image, Skeleton, Typography, Select } from 'antd';
import ErrorHandler from '@/lib/ErrorHandler';
import { getAllTestFeedback } from '@/lib/adminApi';
import dayjs from 'dayjs';
import Link from 'next/link';
import { ArrowLeftOutlined } from '@ant-design/icons';

export default function Page() {
	const { user } = useContext(AuthContext);
	const [feedbackData, setFeedbackData] = useState<any[]>([]);
	const [allTest, setAllTest] = useState<any[]>([]);
	const [servicesId, setServicesId] = useState<string[]>([]);
	const [selectedTest, setSelectedTest] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchFeedback = async () => {
		try {
			const res = await getAllTestFeedback({ testId: selectedTest as string });
			if (res.success) {
				const formattedData = res.data.testFeedbacks.map((feedback: any) => ({
					key: feedback._id,
					studentName: `${feedback.userId?.name || ''} ${feedback.userId?.lastName || ''}`,
					email: feedback.userId?.email || 'N/A',
					testName: feedback.testId?.testDisplayName || feedback.testId?.testName || 'N/A',
					difficultyFeedback: feedback.difficultyFeedback?.like ? '👍 (Liked) ' : feedback.difficultyFeedback?.dislike ? '👎 (Disliked)' : 'N/A',
					questionFeedback: feedback.questionFeedback?.like ? '👍 (Liked)' : feedback.questionFeedback?.dislike ? '👎 (Disliked)' : 'N/A',
					technicalFeedback: feedback.technicalFeedback?.like ? '👍 (Liked)' : feedback.technicalFeedback?.dislike ? '👎 (Disliked)' : 'N/A',
					comment: feedback.comment || 'N/A',
					createdAt: dayjs(feedback.createdAt).format('DD/MM/YYYY'),
				}));
				setFeedbackData(formattedData);
				setAllTest(res.data.allTest);
				setLoading(false);
			}
		} catch (error) {
			setLoading(false);
			ErrorHandler.showNotification(error);
		}
	};

	useEffect(() => {
		fetchFeedback();
	}, [selectedTest]);

	const columns = [
		{
			title: 'Student Name',
			dataIndex: 'studentName',
			key: 'studentName',
			sorter: (a: any, b: any) => a.studentName.localeCompare(b.studentName),
		},
		{
			title: 'Test Name',
			dataIndex: 'testName',
			key: 'testName',
		},
		{
			title: 'Difficulty Feedback',
			dataIndex: 'difficultyFeedback',
			key: 'difficultyFeedback',
		},
		{
			title: 'Question Feedback',
			dataIndex: 'questionFeedback',
			key: 'questionFeedback',
		},
		{
			title: 'Technical Feedback',
			dataIndex: 'technicalFeedback',
			key: 'technicalFeedback',
		},
		{
			title: 'Comment',
			dataIndex: 'comment',
			key: 'comment',
		},
		{
			title: 'Submitted At',
			dataIndex: 'createdAt',
			key: 'createdAt',
			sorter: (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
		},
	];

	const GetSelectedId = (data: []) => {
		setServicesId(data);
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
									Test Feedback List
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
					<ResponsiveTable columns={columns} data={feedbackData} GetSelectedId={GetSelectedId} />
				</>
			}
		</>
	);
}
