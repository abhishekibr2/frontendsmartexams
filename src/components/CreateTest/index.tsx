'use client';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Form, Input, message, notification, Row, Select, Typography } from 'antd';
const { Option } = Select;
import './style.css';
import Link from 'next/link';
import { ArrowLeftOutlined } from '@ant-design/icons';
import AuthContext from '@/contexts/AuthContext';
import { createTest, getAllComplexity, getAllExamType, getAllGrades, GetAllPackages, getAllSubjects, getAllTestConducted } from '@/lib/adminApi';
import { setExamType } from '@/redux/reducers/examReducer';
import { useAppSelector } from '@/redux/hooks';
import ErrorHandler from '@/lib/ErrorHandler';
import { setGrades } from '@/redux/reducers/gradeReducer';
import { Package } from '@/lib/types';
import { setTestConductBy } from '@/redux/reducers/testConductedByReducer';
import { getCommonStates } from '@/lib/commonApi';
import { setServices } from '@/redux/reducers/serviceReducer';
import { setSubjects } from '@/redux/reducers/subjectReducer';
import { setComplexity } from '@/redux/reducers/complexityReducer';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { getTestsById } from '@/lib/adminApi';
import { TestTimeDurations } from './TestTimeDurations';
import axios from 'axios';
import Swal from 'sweetalert2';

interface CreateTestFormValues {
	testName: string;
	packageName: string;
	maxQuestions: number;
	grade: string;
	state: string;
	duration: string;
	difficulty: string;
	showCalculation: string;
	testDescription: string;
	examType: string;
	testConductedBy: string;
	subject: string;
	selectTimer: string;
	subjectInPackage: string[];
	qualityChecked: string;
	testDisplayName: string;
}

interface testData {
	_id: string,
	testName: string,
	testDescription: string,
	maxQuestions: number,
	grade: { _id: string },
	state: string,
	duration: string,
	difficulty: string,
	showCalculation: string,
	examType: string,
	testConductedBy: string,
	subject: string,
	selectTimer: string,
	subjectInPackage: string[],
	qualityChecked: string
	packageName: string
	onlineAvailability: string,
	eligibility: string
	subjectName: string;
	durationId: string;
	testDisplayName: string;
}

export default function CreateTest() {
	const router = useRouter();
	const examTypes = useAppSelector((state) => state.examTypeReducer.examTypes);
	const grades = useAppSelector((state) => state.gradeReducer.grades);
	const testConductedBy = useAppSelector((state) => state.testConductedByReducer.testConductBy);
	const allDifficultyLevel = useAppSelector((state) => state.complexityReducer.complexity);
	const allStates = useAppSelector((state) => state.serviceReducer.services);
	const allSubjects = useAppSelector((state) => state.subjectReducer.subjects);
	const [packages, setPackages] = useState<Package[]>([]);
	const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
	const [form] = Form.useForm();
	const { user } = useContext(AuthContext);
	const [tests, setTests] = useState<testData | null>(null);
	const dispatch = useDispatch()
	const [edit, setEdit] = useState<boolean>(false);
	const [testId, setTestId] = useState('');
	const editParams = useSearchParams();
	const testUrl = editParams.get('EditId')
	const duplicateTestId = editParams.get('Duplicate')
	const subjects = useAppSelector((state) => state.subjectReducer.subjects);
	const createTestId = editParams.get('packageId');
	const [isPackageExits, setPackageExists] = useState(false);
	const [oldPackageId, setOldPackageId] = useState<string | null>(null);
	const roleName = user?.roleId?.roleName;
	useEffect(() => {
		if (testUrl || duplicateTestId) {
			setEdit(true);
		} else {
			setEdit(false);
		}
	}, [testUrl]);

	useEffect(() => {
		if (tests && edit) {
			setTestId(tests?._id)
			form.setFieldsValue({
				testName: duplicateTestId ? 'Copy of ' + tests?.testName : tests?.testName,
				packageName: tests?.packageName,
				maxQuestions: tests?.maxQuestions,
				grade: tests?.grade,
				state: tests?.state,
				duration: tests?.duration,
				difficulty: tests?.difficulty,
				showCalculation: tests?.showCalculation,
				testDescription: tests?.testDescription,
				examType: tests?.examType,
				testConductedBy: tests?.testConductedBy,
				subject: tests?.subject,
				selectTimer: tests?.selectTimer,
				subjectInPackage: tests?.subjectInPackage,
				eligibility: tests?.eligibility,
				onlineAvailability: tests?.onlineAvailability,
				testDisplayName: tests?.testDisplayName
			});
			setOldPackageId(tests?.packageName || null);
		}
	}, [tests, edit]);

	const testDataHandler = async () => {
		if (edit) {
			const data = {
				testUrl,
				duplicateTestId
			}
			const response = await getTestsById(data);
			if (response && response.data) {
				setTests(response.data);
			}
		}
	};

	useEffect(() => {
		if (edit) {
			testDataHandler();
		}
	}, [edit]);

	const onFinish = async (values: CreateTestFormValues) => {
		try {
			const data = {
				...values,
				testId,
				duplicateTestId,
				createTestId, oldPackageId
			}
			const response = await createTest(data);
			if (response.success == true) {
				message.success(`${response.message}`);
				form.resetFields();
				if (createTestId) {
					router.push(`/${roleName}/packages`)
				}
				else {
					router.push(`/${roleName}/test`);
				}
			} else {
				message.error(response.message);
			}
		} catch (error) {
			if (error.response && error.response.data) {
				message.error(error.response.data.message);
			}
			notification.error({
				message: 'Error',
				description: error,
			});
		}
	};

	useEffect(() => {
		if (user) {
			fetchData(getAllExamType, setExamType, "examType");
			fetchData(getAllGrades, setGrades, "grades");
			fetchData(getAllTestConducted, setTestConductBy, "testConductedBy");
			fetchData(getCommonStates, setServices, "services");
			fetchData(getAllSubjects, setSubjects, "subjects");
			fetchData(getAllComplexity, setComplexity, "complexity");
			getAllPackageData();
			getAllSubjectsData();
		}
	}, [user]);

	const getAllPackageData = async () => {
		const response = await axios.get('/admin/packages/available');

		if (response.data.data.length === 0) {
			Swal.fire({
				title: 'No Available Package!',
				text: 'You need to create a package before adding a test.',
				icon: 'warning',
				showCancelButton: false,
				confirmButtonText: 'Create Package',
				customClass: {
					confirmButton: 'swal-confirm-button'
				},
				allowOutsideClick: false,
				allowEscapeKey: false,
				allowEnterKey: false
			}).then((result) => {
				if (result.isConfirmed) {
					router.push('/admin/add-package');
				}
			});
			return;
		}
		setPackages(response.data.data);
	};

	const fetchData = async (apiCall: Function, dispatchAction: Function, action: string) => {
		try {
			const res = await apiCall();
			if (res.status === true) {
				dispatch(dispatchAction(res.data));
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	};

	async function getAllSubjectsData() {
		try {
			const res = await getAllSubjects();
			if (res.status === true) {
				dispatch(setSubjects(res.data));
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	}
	const handlePackageName = (value: string) => {
		const selectedPkg: any = packages.find((pkg) => pkg._id === value);
		setSelectedPackage(value);
		const subjectInPackage = selectedPkg.subjectsInPackage?.map(
			(subject: testData) => subject.subjectName
		);
		form.setFieldsValue({
			examType: selectedPkg?.examType?._id || null,
			testConductedBy: selectedPkg.testConductedBy || null,
			state: selectedPkg.state?._id || null,
			grade: selectedPkg.grade?._id || null,
			subjectInPackage: subjectInPackage || null
		});
	}


	useEffect(() => {
		const selectedPkg = packages.find((pkg) => pkg._id === createTestId);
		const subjectInPackage = selectedPkg?.subjectsInPackage?.map(
			(subject: any) => subject.subjectName
		);

		if (selectedPkg) {
			setPackageExists(true);
			form.setFieldsValue({
				packageName: selectedPkg._id,
				grade: selectedPkg.grade._id,
				examType: selectedPkg?.examType?._id || null,
				testConductedBy: selectedPkg.testConductedBy || null,
				state: selectedPkg.state?._id || null,
				subjectInPackage: subjectInPackage || null
			});
		}
	}, [packages, createTestId, form]);


	return (
		<div style={{ padding: '20px' }}>

			<Row gutter={[16, 16]} align="middle">
				<Col className="" xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>
					<div style={{ display: 'flex', alignItems: 'center' }}>
						{createTestId ? <Link href={`/${roleName}/packages`}>
							<ArrowLeftOutlined style={{ fontSize: '20px', cursor: 'pointer', marginRight: '10px' }} />
						</Link> : <Link href={`/${roleName}/test`}>
							<ArrowLeftOutlined style={{ fontSize: '20px', cursor: 'pointer', marginRight: '10px' }} />
						</Link>}
						<Typography.Title level={3} className='mb-0 top-title' style={{ marginBottom: 0 }}>
							{!duplicateTestId && (edit ? 'Update a Test' : 'Create a Test')}
							{duplicateTestId && 'Duplicate Test'}
						</Typography.Title>

					</div>
					<p style={{ marginLeft: '30px' }}>{!duplicateTestId && (edit ? '(Update a Test for Each State Exam)' : '(Create a Test for Each State Exam)')}
						{duplicateTestId && 'Create a Duplicate Test'}</p>
				</Col>
				<Col className="" xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>
				</Col>
			</Row>

			<Row justify="center">
				<Col xs={24} sm={24} md={24} lg={24} xl={24}>
					<div className='desktop-view card-dash shadow-none'>
						<Form size="large" layout="vertical" form={form} onFinish={onFinish}>
							<Row gutter={[16, 16]}>
								<Col xl={12} sm={24}>
									<Form.Item
										label="Test Name"
										name="testName"
										rules={[{ required: true, message: 'Please input the test name!' }]}
									>
										<Input placeholder="Enter Test Name" maxLength={120} />
									</Form.Item>
									<Form.Item
										label="Test Package Name"
										name="packageName"
										style={{ marginTop: 20 }}
										rules={[{ required: true, message: 'Please select a package!' }]}

									>
										<Select placeholder="Select Package"
											// mode="multiple"
											onChange={handlePackageName} disabled={isPackageExits} value={selectedPackage}>
											{packages
												.filter((pkg) => pkg.status === 'inUse')
												.map((pkg) => (
													<Option key={pkg._id} value={pkg._id}>
														{pkg.packageName}
													</Option>
												))}
										</Select>
									</Form.Item>

									<Form.Item
										label="Maximum Number of Questions?"
										name="maxQuestions"
										style={{ marginTop: 20 }}
										rules={[
											{
												required: true,
												message: 'Please input the maximum number of questions!',
											},
										]}
									>
										<Input
											placeholder="Enter Maximum Number of Questions"
											type="number"
											onInput={(e) => {
												const input = e.target as HTMLInputElement;
												if (Number(input.value) < 1) {
													input.value = ''; // Clear the input if a negative number is entered
												}
											}}
										/>
									</Form.Item>
									<Form.Item
										label="Grade"
										name="grade"
										style={{ marginTop: 20 }}
										rules={[{ required: true, message: 'Please select a grade!' }]}
									>
										<Select placeholder="Select Grade" disabled>
											{grades
												.filter((grade) => grade.status === 'active')
												.map((grade) => (
													<Option key={grade._id} value={grade._id}>
														{grade.gradeLevel}
													</Option>
												))}
										</Select>
									</Form.Item>

									<Form.Item
										label="Test for State"
										name="state"
										style={{ marginTop: 20 }}
										rules={[{ required: true, message: 'Please select a state!' }]}
									>
										<Select placeholder="Select State" disabled>
											{allStates
												.filter((state) => state.status === 'active')
												.map((state) => (
													<Option key={state._id} value={state._id}>
														{state.title.toUpperCase()}
													</Option>
												))}
										</Select>
									</Form.Item>
									<Form.Item
										label="Test Duration"
										name="duration"
										style={{ marginTop: 20 }}
										rules={[{ required: true, message: 'Please select a duration!' }]}
									>
										<Select placeholder="Select Duration">
											{TestTimeDurations
												.map((duration) => (
													<option key={duration.value} value={duration.value}>
														{duration.label}
													</option>
												))}

										</Select>
									</Form.Item>

									<Form.Item
										label="Test Difficulty Level"
										name="difficulty"
										style={{ marginTop: 20 }}
										rules={[{ required: true, message: 'Please select a difficulty level!' }]}
									>
										<Select placeholder="Select Difficulty">
											{allDifficultyLevel
												.filter((level) => level.status === 'active')
												.map((level) => (
													<Option key={level._id} value={level.complexityLevel}>
														{level.complexityLevel.charAt(0).toUpperCase() + level.complexityLevel.slice(1)}
													</Option>
												))}
										</Select>
									</Form.Item>

									<Form.Item
										label="Show Calculator in Test"
										name="showCalculation"
										style={{ marginTop: 20 }}
										rules={[{ required: true, message: 'Please select an option!' }]}
									>
										<Select placeholder="Select Option">
											<Option value="yes">Yes</Option>
											<Option value="no">No</Option>
										</Select>
									</Form.Item>
								</Col>

								<Col xl={12} sm={24}>
									<Form.Item
										label="Test Display Name"
										name="testDisplayName"
										rules={[{ required: true, message: 'Please input the test name!' }]}
									>
										<Input placeholder="Enter Test Display Name" maxLength={120} />
									</Form.Item>
									<Form.Item
										label="Test Description"
										name="testDescription"
									>
										<Input.TextArea placeholder="Enter Test Description" rows={4} style={{ minHeight: '130px' }} />
									</Form.Item>

									<Form.Item
										label="Exam Type"
										name="examType"
										style={{ marginTop: 20 }}
										rules={[{ required: true, message: 'Please select an exam type!' }]}
									>
										<Select placeholder="Select Exam Type" disabled>
											{examTypes &&
												examTypes
													.filter((exam) => exam.status === 'active')
													.map((exam) => (
														<Option key={exam._id} value={exam._id}>
															{exam.examType.charAt(0).toUpperCase() + exam.examType.slice(1)}
														</Option>
													))}
										</Select>
									</Form.Item>

									<Form.Item
										label="Test Conducted By"
										name="testConductedBy"
										// rules={[{ required: true, message: 'Please choose one!' }]}
										style={{ marginTop: 20 }}
									>
										<Select placeholder="Select Test Conducted By" disabled>
											{testConductedBy
												.filter((item) => item.status === 'active')
												.map((item) => (
													<Option key={item._id} value={item._id}>
														{item.name}
													</Option>
												))}
										</Select>
									</Form.Item>

									<Form.Item
										label="Subject"
										name="subject"
										style={{ marginTop: 20 }}
										rules={[{ required: true, message: 'Please select a subject!' }]}
									>
										<Select placeholder="Select Subject">
											{allSubjects
												.filter((subject) => subject.status === 'active')
												.map((subject) => (
													<Option key={subject._id} value={subject._id}>
														{subject.subjectName.toUpperCase()}
													</Option>
												))}
										</Select>
									</Form.Item>
									<Form.Item
										label="Subject In Package"
										name="subjectInPackage"
										style={{ marginTop: 20 }}
										rules={[
											{
												required: true,
												message: "Please select at least one subject!",
											},
										]}
									>
										<Select
											placeholder="Select Subject"
											maxTagCount="responsive"
											mode="multiple" disabled
										>
											{subjects.map((subject) => (
												<Option key={subject.subjectName} value={subject.subjectName}>
													{subject.subjectName.charAt(0).toUpperCase() + subject.subjectName.slice(1)}
												</Option>
											))}
										</Select>
									</Form.Item>
									<Row gutter={[16, 16]}>
										<Col span={12}>
											<Form.Item
												label="Student Allowed to Select Timer?"
												name="selectTimer"
												rules={[{ required: true, message: 'Please select an option!' }]}
											>
												<Select placeholder="Select Option" className='w-100'>
													<Option value="yes">Yes</Option>
													<Option value="no">No</Option>
												</Select>
											</Form.Item>
										</Col>
									</Row>

								</Col>
							</Row>

							<Form.Item style={{ textAlign: 'center', marginTop: 40 }}>
								<Button
									type="primary"
									htmlType="submit"
									style={{
										background: '#722ed1',

										borderColor: '#722ed1',
										padding: '0 40px',
										height: '40px',
										fontSize: '16px',
									}}
								>
									{!duplicateTestId && (edit ? 'Update Test' : 'Create Test')}
									{duplicateTestId ? 'Create Test' : ''}

								</Button>
							</Form.Item>
						</Form>
					</div>

				</Col>
			</Row>
		</div>
	);
}
