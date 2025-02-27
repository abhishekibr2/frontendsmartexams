'use client';
import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '@/contexts/AuthContext';
import {
	Button,
	Card,
	Col,
	Input,
	Row,
	Select,
	Typography,
	Dropdown,
	Menu,
	Pagination,
	Table,
	message,
	Popconfirm,
	Form,
	Flex,
	Switch,
} from 'antd';
import './style.css';
import {
	CheckCircleOutlined,
	MoreOutlined,
	UndoOutlined,
} from '@ant-design/icons';
import { GetAllTests, GetAllPackages } from '@/lib/adminApi';
import { deleteTests } from '@/lib/adminApi';
import Link from 'next/link';
import ErrorHandler from '@/lib/ErrorHandler';
import { useAppSelector } from '@/redux/hooks';
import { SearchOutlined } from '@ant-design/icons';
import '.././Admin/PackageContainer/style.css'
import { Test } from '@/lib/types';
import axios from 'axios';
import LayoutWrapper from '@/app/commonUl/LayoutWrapper';
import PageTitle from '@/commonUI/PageTitle';
import { useDataContext } from '@/contexts/DataContext';
// @ts-ignore
import { useRouter } from 'nextjs-toploader/app';
import Swal from 'sweetalert2'

interface test {
	subject: string;
	title: string;
	name: string;
	subjectName: string;
	testName: string;
	duration: string;
	subjects: string;
	testType: string;
	active: string;
	qualityChecked: string;
	published: string;
	_id: string;
	packageName: string;
	examType: string;
	testConductedBy: string;
	state: string;
	grade: string;
	numTests: number;
	packagePrice: number;

}
const { Option } = Select;
export default function AllTests() {
	const { subjects, grades, examTypes, states } = useDataContext()
	const { user } = useContext(AuthContext);
	const [form] = Form.useForm()
	const [tests, setTests] = useState<any[]>([]);
	const [clicked, setClicked] = useState(false)
	const testConductBy = useAppSelector((state) => state.testConductedByReducer.testConductBy)
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(5);
	const [totalTest, setTotalTest] = useState(0)
	const [orderBy, setOrderBy] = useState('newest')
	const roleName = user?.roleId?.roleName;
	const router = useRouter()
	const [loading, setLoading] = useState(false);
	const [packages, setPackages] = useState<any[]>([]);

	const getAllTestData = async (values: any = null) => {
		setLoading(true)
		const response = await GetAllTests({ ...values, page: currentPage, limit: pageSize, orderBy });
		if (response) {
			setTests(response.data);
			const pagination = response.pagination;
			setTotalTest(pagination.total)
		}
		setLoading(false)
	};


	useEffect(() => {
		getAllTestData();
		getAllPackageName()
	}, []);
	const getAllPackageName = async () => {
		const response = await GetAllPackages(undefined, orderBy);
		if (response) {
			setPackages(response.data);
		}
	}

	const handleDelete = async (testId: string) => {
		const response = await deleteTests({ testId })
		if (response) {
			getAllTestData();
			message.success(`${response.message}`);
		}

	}

	const menu = (testId: string) => (
		<Menu>
			<Menu.Item key="edit">
				<Link href={`/${roleName}/test/create?EditId=${testId}`} >
					Edit
				</Link>
			</Menu.Item>
			<Menu.Item key="assign">
				<Link href={``} onClick={() => addNewTest(`/${roleName}/assignedTests?TestId=${testId}`)}>
					Assign Test To package
				</Link>
			</Menu.Item>

			<Menu.Item key="duplicate">
				<Link href={`/${roleName}/test/create?Duplicate=${testId}`} >
					Duplicate Test
				</Link>
			</Menu.Item>

			<Menu.Item key="print">
				<Link href={`/${roleName}/printTest?printId=${testId}`}>
					Print
				</Link>
			</Menu.Item>
			<Popconfirm
				title="Are you sure to delete this test?"
				onConfirm={() => handleDelete(testId)}
				okText="Yes"
				cancelText="No"
			>
				<Menu.Item key="delete">
					Delete
				</Menu.Item>
			</Popconfirm>
		</Menu>
	);

	const handleTestPublish = async (id: string, value: boolean) => {
		try {
			await axios.post(`/admin/test/publish/${id}`, { id, value });

			setTests((prevData: any[]) =>
				prevData.map(item =>
					item._id === id ? { ...item, isPublished: value } : item
				)
			);
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	};

	const handleQualityChecked = async (id: string, value: boolean) => {
		try {
			await axios.post(`/admin/test/qualityChecked/${id}`, { id, value });

			setTests((prevData: Test[]) =>
				prevData.map(item =>
					item._id === id ? { ...item, qualityChecked: value, isPublished: !value ? value : item.isPublished } : item
				)
			);
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	}

	const columns = [
		{
			title: 'Test Name',
			dataIndex: 'testName',
			key: 'testName',
			sorter: (a: Test, b: Test) => a.testName.localeCompare(b.testName),
			render: (text: string, record: Test) => {
				const allTestsAdded = record.questionOrder.length === record.maxQuestions;
				const qualityChecked = record.qualityChecked;
				const isPublished = record.isPublished;
				const stateTitle = record?.state?.title || 'No State';

				let statusMessage = '';
				let statusColor = '';

				if (isPublished) {
					statusMessage = 'Already Published';
					statusColor = 'default';
				} else if (allTestsAdded && qualityChecked) {
					statusMessage = 'Ready to Publish';
					statusColor = 'success';
				} else {
					const missingItems = [];
					if (!allTestsAdded) missingItems.push('Tests Not Added');
					if (!qualityChecked) missingItems.push('Quality Not Checked');
					statusMessage = missingItems.join(' & ');
					statusColor = 'warning';
				}

				return (
					<div style={{ wordWrap: 'break-word', whiteSpace: 'normal', display: 'flex', flexDirection: 'column' }}>
						<Typography.Text> {text.toLocaleUpperCase()} ({stateTitle})</Typography.Text>
						{
							record.isPublished ?
								''
								:
								// @ts-ignore
								<Typography.Text type={statusColor}>
									{statusMessage}
								</Typography.Text>
						}
					</div>
				);
			}
		},
		{
			title: 'Package Name',
			dataIndex: 'packageName',
			key: 'packageName',
			sorter: (a: Test, b: Test) => (a.packageName?.packageName || '').localeCompare(b.packageName?.packageName || ''),
			render: (packageName: test) => packageName?.packageName.toLocaleUpperCase() || 'No Package',
		},
		{
			title: 'Quality Checked',
			dataIndex: 'qualityChecked',
			key: 'qualityChecked',
			render: (value: boolean, record: any) => {
				return (
					<Popconfirm
						title={value
							? 'This test is already quality checked. Do you want to uncheck it?'
							: 'This test is not yet quality checked. Are you sure you want to check it?'}
						okText="Ok"
						cancelText="Cancel"
						onConfirm={() => handleQualityChecked(record._id, !value)}
					>
						<Switch
							checked={value}
							checkedChildren={'Yes'}
							unCheckedChildren={'No'}
						/>
					</Popconfirm>
				);
			}
		},
		{
			title: 'Total Questions',
			dataIndex: 'maxQuestions',
			key: 'maxQuestions',
			sorter: (a: any, b: any) => a.maxQuestions - b.maxQuestions,
			render: (_: any, record: Test) => {
				const allTestsAdded = record.questionOrder.length === record.maxQuestions;
				return (
					<div
						className={allTestsAdded ? 'text-success' : 'text-danger'}
					>
						{record.questionOrder.length} / {record.maxQuestions}
					</div>
				);
			},

		},
		{
			title: 'Publish Test',
			dataIndex: 'isPublished',
			key: 'isPublished',
			render: (value: boolean, record: any) => {
				return (
					<Popconfirm
						placement="bottomRight"
						title={value
							? 'This test is already published. Are you sure you want to unpublish it?'
							: 'This test is not yet published. Are you sure you want to publish it?'}
						okText={value ? "Unpublish" : "Publish"}
						cancelText="Cancel"
						onConfirm={() => handleTestPublish(record._id, !value)}
					>
						<button
							// icon={value ? <UndoOutlined /> : <CheckCircleOutlined />}
							className={value ? 'btn btn-outline-success' : 'btn btn-outline-danger'}
						>
							{value ? "Unpublish Test" : "Publish Test"}
						</button>
					</Popconfirm>
				);
			},
		},
		{
			title: 'Actions',
			key: 'actions',
			render: (_: test, record: test) => (
				<Flex gap={'small'} align='center'>
					<Link href={`/${roleName}/test/${record._id}`}>
						<Button size='middle'>
							<Typography style={{ marginBottom: 0 }}>
								Open
							</Typography>
						</Button>
					</Link>
					<Dropdown overlay={menu(record._id)} trigger={['click']}>
						<Button size='middle' type="default">
							<Typography style={{ marginBottom: 0 }}>
								<MoreOutlined style={{ fontSize: '20px' }} />
							</Typography>
						</Button>
					</Dropdown>
					<Link href={`/${roleName}/test/${record._id}/print`} >
						<Button>
							<Typography style={{ marginBottom: 0 }}>
								Q
							</Typography>
						</Button>
					</Link>
				</Flex>
			),
		},
	];

	const expandableRowRender = (record: any) => {
		return (
			<div style={{ padding: '10px', backgroundColor: '#f7f7f7', borderRadius: '5px' }}>
				<Typography.Text strong style={{ color: '#333', fontSize: '16px' }}>Subject:</Typography.Text>
				<Typography.Text className='mb-1'>{record.subject?.subjectName || 'No Subject'}</Typography.Text>
				<Typography.Text strong style={{ color: '#333', fontSize: '16px' }}>Package Name:</Typography.Text>
				<Typography.Text className='mb-1'>{record.packageName?.packageName || 'No Package'}</Typography.Text>
				<Typography.Text strong style={{ color: '#333', fontSize: '16px' }}>Test Conducted By:</Typography.Text>
				<Typography.Text className='mb-1'>{record.testConductedBy?.name || 'No Test Conducted By'}</Typography.Text>
				<Typography.Text strong style={{ color: '#333', fontSize: '16px' }}>Duration:</Typography.Text>
				<Typography.Text className='mb-1'>{record.duration !== null ? record.duration : 'N/A'}</Typography.Text>
			</div>
		);
	};

	const expandedRowRender = expandableRowRender;

	const filterToggle = () => {
		setClicked((pre) => !pre)
	}

	const filterTest = async (values: any) => {
		getAllTestData(values)
	}

	useEffect(() => {
		getAllTestData(form.getFieldsValue())
	}, [pageSize, currentPage, orderBy])


	const addNewTest = async (url: string | undefined) => {
		const response = await axios.get('/admin/packages/available');

		if (response.data.data.length === 0) {
			Swal.fire({
				title: 'No Available Package!',
				text: 'You need to create a package before adding a test.',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Create Package',
				cancelButtonText: 'Cancel',
				customClass: {
					confirmButton: 'swal-confirm-button',
					cancelButton: 'swal-cancel-button'
				}
			}).then((result) => {
				if (result.isConfirmed) {
					router.push(url ? url : '');
				}
			});

			return;
		}
		router.push(`/${roleName}/test/create`);
	}

	return (
		<Row>
			<Col span={12}>
				<PageTitle title='Tests' />
			</Col>
			<Col span={12} className='text-end'>
				<div className='d-flex-up-down-btn gap-2'>
					<Button
						style={{
							backgroundColor: 'black',
							color: 'white'
						}}
						size='large'
						onClick={filterToggle}
					>
						Filter Now
					</Button>
					<Button size='large' type='primary' onClick={() => addNewTest('/admin/add-package')}>
						Add Test
					</Button>
				</div>
			</Col>
			<Col span={24}>
				<LayoutWrapper>
					{clicked ?
						<Card style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }} title='Test Information Management'>
							<Form form={form} layout="vertical" size='large' onValuesChange={filterTest} onReset={() => getAllTestData(null)}>
								<Row gutter={16}>
									{/* // here packageName */}
									<Col span={6}>
										<Form.Item label="Package Name" name="packageName">
											<Select
												placeholder="Select Packages"
											>
												<Option value="">All</Option>
												{packages.map((pkg) => (
													<Option key={pkg._id} value={pkg._id}>{pkg.packageName}</Option>
												))}
											</Select>
										</Form.Item>
									</Col>
									<Col span={6}>
										<Form.Item label="Search" name="testName">
											<Input
												placeholder="Search"
												suffix={<SearchOutlined />}
												style={{ width: '100%', height: '39px', borderRadius: '5px', borderColor: '#d9d9d9' }}
											/>
										</Form.Item>
									</Col>
									<Col span={6}>
										<Form.Item label="Subject" name="subject">
											<Select
												placeholder="Select Subject"
											>
												<Option value="">All</Option>
												{subjects.map((sub) => (
													<Option key={sub._id} value={sub._id}>{sub.subjectName}</Option>
												))}
											</Select>
										</Form.Item>
									</Col>
									<Col span={6}>
										<Form.Item label="Grade" name="grade">
											<Select
												placeholder="Select Grade"
											>
												<Option value="">All</Option>
												{grades.map((grd) => (
													<Option key={grd._id} value={grd._id}>{grd.gradeLevel}</Option>
												))}
											</Select>
										</Form.Item>
									</Col>
									<Col span={6}>
										<Form.Item label="State" name="state">
											<Select
												placeholder="Select State"
											>
												<Option value="">All</Option>
												{states.map((ste) => (
													<Option key={ste._id} value={ste._id}>
														{ste.title.charAt(0).toUpperCase() + ste.title.slice(1)}
													</Option>
												))}
											</Select>
										</Form.Item>
									</Col>
									<Col span={6}>
										<Form.Item label="Exam Type" name="examType">
											<Select
												placeholder="Select Exam Type"
											>
												<Option value="">All</Option>
												{examTypes.map((exm) => (
													<Option key={exm._id} value={exm._id}>{exm.examType}</Option>
												))}
											</Select>
										</Form.Item>
									</Col>
									<Col span={6}>
										<Form.Item label="Test Conducted By" name="testConductedBy">
											<Select
												placeholder="Select Conducted By"
											>
												<Option value="">All</Option>
												{testConductBy.map((tst) => (
													<Option key={tst._id} value={tst._id}>{tst.name}</Option>
												))}
											</Select>
										</Form.Item>
									</Col>
									<Col span={6}>
										<Form.Item
											label="Test Duration"
										//   name="duration"
										>
											<Select
												placeholder="Select Duration"
											>
												<Option value="">All</Option>
												{tests.map((tst) => (
													<Option key={tst._id} value={tst._id}>{tst.duration}</Option>
												))}
											</Select>
										</Form.Item>
									</Col>
									<Col span={6}>
										<Form.Item label="Test Quality Checked" name="qualityChecked">
											<Select
												placeholder="Select Quality Checked"
											>
												<Option value="yes">Yes</Option>
												<Option value="no">No</Option>
											</Select>
										</Form.Item>
									</Col>
									<Col span={6}>
										<Form.Item label="Timer Change Allowed" name="timerChangeAllowed">
											<Select
												placeholder="Select Timer Change"
											>
												<Option value="yes">Yes</Option>
												<Option value="no">No</Option>
											</Select>
										</Form.Item>
									</Col>
									<Col span={6}>
										<Form.Item label="Status" name="status">
											<Select
												placeholder="Select Test Status"
											>
												<Option value="active">Active</Option>
												<Option value="inactive">Inactive</Option>
											</Select>
										</Form.Item>
									</Col>
									<Col span={6}>
										<Form.Item label="Test Calculator Allowed" name="showCalculation">
											<Select
												placeholder="Select Calculator Allowed"
											>
												<Option value="yes">Yes</Option>
												<Option value="no">No</Option>
											</Select>
										</Form.Item>
									</Col>
									<Col span={6}>
										<Form.Item label="Test Difficulty Level" name="difficulty">
											<Select
												placeholder="Select Difficulty Level"
											>
												<Option value="easy">Easy</Option>
												<Option value="medium">Medium</Option>
												<Option value="hard">Hard</Option>
											</Select>
										</Form.Item>
									</Col>
									<Col span={6}>
										<Form.Item label={' '}>
											<Button
												block
												color="default"
												variant="solid"
												htmlType="reset"
												onClick={() => setClicked(false)}
											>
												Clear Filter
											</Button>
										</Form.Item>
									</Col>
								</Row>
							</Form>
						</Card>
						: ''}
					<Row style={{ alignItems: 'center' }}>
						<Col span={5} xs={24} style={{ textAlign: 'left' }}>
							<h6>Total Tests: {totalTest}</h6>
						</Col>
						<Col span={19} xs={24} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10 }}>
							<Pagination
								current={currentPage}
								pageSize={pageSize}
								total={totalTest}
								onChange={(page, pageSize) => {
									setCurrentPage(page);
									setPageSize(pageSize);
								}}
								showSizeChanger
								pageSizeOptions={['5', '10', '20', '50', '100']}
								onShowSizeChange={(current, size) => setPageSize(size)}
								style={{ margin: '20px 0' }}
							/>
							<Select
								style={{ width: 200 }}
								placeholder="Sort by"
								defaultValue="newest"
								options={[
									{ label: 'Newest First', value: 'newest' },
									{ label: 'Oldest First', value: 'oldest' },
								]}
								onChange={(value: string) => setOrderBy(value)}
							/>
						</Col>
					</Row>
					<Row justify={'center'} className="all-tests-wrapper">
						<Col xl={24} lg={24} md={24} sm={24} xs={24}>

							<Card className="all-tests-card">
								<Table
									loading={loading}
									columns={columns as any}
									dataSource={tests}
									rowKey={(record) => record._id}
									pagination={false}
									expandable={{ expandedRowRender }}
								/>


								<div style={{ display: 'flex', justifyContent: 'flex-end', margin: '20px 0' }}>

									<Pagination
										className='package-table'
										current={currentPage}
										pageSize={pageSize}
										total={totalTest}
										onChange={(page, pageSize) => {
											setCurrentPage(page);
											setPageSize(pageSize);
										}}
										showSizeChanger
										pageSizeOptions={['5', '10', '20', '50', '100']}
										onShowSizeChange={(current, size) => setPageSize(size)}
										style={{ textAlign: 'right', margin: '20px 0' }}
									/>
								</div>
							</Card>
						</Col>
					</Row>
				</LayoutWrapper>
			</Col>
		</Row>
	);
}


