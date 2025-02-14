'use client';
import { Popconfirm, Table, message, Row, Col, Select, Input, Tooltip, Form, Typography, Switch, Flex } from 'antd';
import AuthContext from '@/contexts/AuthContext';
import { GetAllPackages, getAllExamType, getAllGrades, getAllSubjects, getAllTestConducted, getDuration } from '@/lib/adminApi';
import { useContext, useEffect, useState } from 'react';
import { Button } from 'antd';
import { DeletePackage } from '@/lib/adminApi';
import Link from 'next/link';
import { useAppSelector } from '@/redux/hooks';
import { setExamType } from '@/redux/reducers/examReducer';
import { useDispatch } from 'react-redux';
import ErrorHandler from '@/lib/ErrorHandler';
import { setGrades } from '@/redux/reducers/gradeReducer';
import { getCommonStates } from '@/lib/commonApi';
import { setServices } from '@/redux/reducers/serviceReducer';
import { setTestConductBy } from '@/redux/reducers/testConductedByReducer';
const { Option } = Select;
import { CheckCircleOutlined, SearchOutlined, UndoOutlined } from '@ant-design/icons';
import { setSubjects } from '@/redux/reducers/subjectReducer';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { ExamType, Package } from '@/lib/types';
import '../style.css'
import axios from 'axios';
import PackageActions from './PackageActions';
import LayoutWrapper from '@/app/commonUl/LayoutWrapper';



export default function PackageListing() {
	const { user } = useContext(AuthContext);
	const [newPackages, setPackages] = useState<Package[]>([]);
	const examTypes = useAppSelector((state) => state.examTypeReducer.examTypes);
	const grades = useAppSelector((state) => state.gradeReducer.grades);
	const services = useAppSelector((state) => state.serviceReducer.services);
	const testConductedBy = useAppSelector((state) => state.testConductedByReducer.testConductBy);
	const dispatch = useDispatch();
	const [clicked, setClicked] = useState(false)
	const subject = useAppSelector((state) => state.subjectReducer.subjects);
	const [selectedIds, setSelectedIds] = useState<any[]>([]);
	const [duration, setDuration] = useState([])
	const [form] = Form.useForm();
	const [sorter, setSorter] = useState<any>({});
	const roleName = user?.roleId?.roleName;
	const [orderBy, setOrderBy] = useState('newest')
	const [totalPakages, setTotalPakages] = useState(0)
	const [pageSize, setPageSize] = useState(10);
	const [filteredExamTypes, setFilteredExamTypes] = useState<ExamType[]>([]);


	const clearFilters = () => {
		form.resetFields();
		packages()
	};

	const getAllGradesData = async () => {
		try {
			const res = await getAllGrades();
			if (res.status === true) {
				dispatch(setGrades(res.data));
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	};

	const getExam = async () => {
		try {
			const res = await getAllExamType();
			if (res.status === true) {
				dispatch(setExamType(res.data));
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	};

	// const packages = async (values: any = null) => {
	// 	const response = await GetAllPackages(undefined, orderBy, values, pageSize);
	// 	if (response) {
	// 		setPackages(response.data);
	// 		setTotalPakages(response.totalPackage)
	// 	}
	// };
	const packages = async (values: any = null) => {
		const response = await GetAllPackages(undefined, orderBy, values, pageSize);
		if (response) {
			const allPackages = response.data;
			const filteredData = allPackages.filter((pkg: any) => {
				return (
					(!values?.packageDuration || pkg.packageDuration?._id === values.packageDuration) &&
					(!values?.state || pkg.state?._id === values.state) &&
					(!values?.examType || pkg.examType?._id === values.examType) &&
					(!values?.grade || pkg.grade?._id === values.grade) &&
					(!values?.subject || pkg.subjectsInPackage.some((subject: any) => subject._id === values.subject)) &&
					(!values?.isActive || (values.isActive === "yes" ? pkg.isActive : !pkg.isActive)) &&
					(!values?.qualityChecked || (values.qualityChecked === "yes" ? pkg.qualityChecked : !pkg.qualityChecked)) &&
					(!values?.packageName || pkg?.packageName.toLowerCase().includes(values.packageName.toLowerCase())) &&
					(!values?.testConductedBy || pkg?.testConductedBy._id === values.testConductedBy) &&
					(!values?.hasEssay || pkg?.hasEssay === values.hasEssay)
				);
			});
			setPackages(filteredData);
			setTotalPakages(filteredData.length);
		}
	};


	function filterData(values: string) {
		packages(values);

	}
	async function fetchData() {
		try {
			const res = await getCommonStates();
			if (res.status === true) {
				dispatch(setServices(res.data));
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	}
	async function getTests() {
		try {
			const res = await getAllTestConducted();
			if (res.status === true) {
				dispatch(setTestConductBy(res.data));
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	}
	async function subjects() {
		try {
			const res = await getAllSubjects();
			if (res.status === true) {
				dispatch(setSubjects(res.data));
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	}
	async function DurationHandler() {
		try {
			const res = await getDuration();
			if (res.status === true) {
				setDuration(res.data);
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	}

	useEffect(() => {

		const fetchFunctions = async () => {
			await getExam();
			await packages();
			await getAllGradesData();
			await fetchData();
			await getTests();
			await subjects();
			await DurationHandler();
		}
		if (user) {
			fetchFunctions();
		}
	}, [user])


	useEffect(() => {
		if (user) {
			packages();
		}
	}, [user]);

	const handleDelete = async (record: string[]) => {
		try {
			const response = await DeletePackage(record);
			if (response.status === true) {
				message.success('Package deleted successfully');
				packages();
				setSelectedIds([])
			}
		} catch (error) {
			message.error(error.message);
		}
	};

	const handlePublish = async (id: string, value: boolean) => {
		try {
			await axios.post(`/admin/packages/publish/${id}`, { id, value });

			setPackages((prevData: any[]) =>
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
			await axios.post(`/admin/packages/qualityChecked/${id}`, { id, value });

			setPackages((prevData: any[]) =>
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
			title: 'Package Name',
			dataIndex: 'packageName',
			key: 'packageName',
			sorter: (a: Package, b: Package) => a.packageName.localeCompare(b.packageName),
			render: (text: string, record: Package) => {
				const allTestsAdded = record.tests.length === record.numTests;
				const qualityChecked = record.qualityChecked;
				const isPublished = record.isPublished;

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
					<div style={{ wordWrap: 'break-word', whiteSpace: 'normal', maxWidth: 'calc(20ch)', display: 'flex', flexDirection: 'column' }}>
						<Typography.Text strong>{text.length > 20 ? `${text.slice(0, 17)}...` : text}</Typography.Text>
						{
							record.isPublished ?
								''
								:
								// @ts-ignore
								<Typography.Text type={statusColor} style={{ fontWeight: 'bold' }}>
									{statusMessage}
								</Typography.Text>
						}
					</div>
				);
			},
		},
		{
			title: 'Grade',
			dataIndex: 'grade',
			key: 'grade',
			sorter: (a: Package, b: Package) => a.grade?.gradeLevel.localeCompare(b.grade?.gradeLevel),
			render: (_: string, record: Package) => record?.grade?.gradeLevel,
		},
		{
			title: 'Exam Type',
			dataIndex: 'examType',
			key: 'examType',
			sorter: (a: Package, b: Package) => a.examType?.examType.localeCompare(b.examType?.examType),
			render: (_: string, record: Package) => record?.examType?.examType,
		},
		{
			title: 'State',
			dataIndex: 'state',
			key: 'state',
			sorter: (a: Package, b: Package) => a.state?.title.localeCompare(b.state?.title),
			render: (_: any, record: Package) => record?.state?.title || 'N / A',
		},

		{
			title: 'Conducted By',
			dataIndex: 'testConductedBy',
			key: 'testConductedBy',
			sorter: (a: Package, b: Package) => a.testConductedBy?.name.localeCompare(b.testConductedBy?.name),
			render: (_: any, record: Package) => record?.testConductedBy?.name || 'N / A',
		},
		{
			title: 'Tests',
			dataIndex: 'numTests',
			key: 'numTests',
			render: (_: any, record: Package) => {
				const allTestsAdded = record.tests.length === record.numTests;
				return (
					<Tooltip
						title={allTestsAdded ? 'All tests are added' : 'Click to add tests'}
					>
						<Button
							type='link'
							style={{
								color: allTestsAdded ? '#52c41a' : '#1890ff',
								fontWeight: 'bold',
								padding: 0,
								textDecoration: 'underline',
							}}
						>
							{record.tests.length} / {record.numTests} {allTestsAdded ? 'Tests Added' : 'Test(s) Remaining'}
						</Button>
					</Tooltip>
				);
			},
		},
		{
			title: 'Quality Checked',
			dataIndex: 'qualityChecked',
			key: 'qualityChecked',
			render: (value: boolean, record: any) => {
				return (
					<Popconfirm
						title={value
							? 'This package is already quality checked. Do you want to uncheck it?'
							: 'This package is not yet quality checked. Are you sure you want to check it?'}
						okText="Ok"
						cancelText="Cancel"
						onConfirm={() => handleQualityChecked(record._id, !value)}
					>
						<Switch
							checkedChildren={'Yes'}
							unCheckedChildren={'No'}
							checked={value}
							style={{
								backgroundColor: value ? '#52c41a' : '#ff4d4f',
								borderColor: value ? '#52c41a' : '#ff4d4f',
								borderRadius: '5px',
							}}
						/>
					</Popconfirm>
				);
			}
		},
		{
			title: 'Price',
			dataIndex: 'packagePrice',
			key: 'packagePrice',
			sorter: (a: Package, b: Package) => parseFloat(a.packagePrice) - parseFloat(b.packagePrice),
			render: (value: string) => {
				return `$${value}`;
			},
		},
		{
			title: 'Discount Price',
			dataIndex: 'packageDiscountPrice',
			key: 'packageDiscountPrice',
			render: (value: string) => {
				const numericValue = parseFloat(value);
				if (isNaN(numericValue)) {
					return 'N/A';
				}
				return `$${numericValue.toFixed(2)}`;
			},
		},
		{
			title: 'Publish',
			dataIndex: 'isPublished',
			key: 'isPublished',
			render: (value: boolean, record: any) => {
				return (
					<Popconfirm
						placement="bottomRight"
						title={value
							? 'This package is already published. Are you sure you want to unpublish it?'
							: 'This package is not yet published. Are you sure you want to publish it?'}
						okText={value ? "Unpublish" : "Publish"}
						cancelText="Cancel"
						onConfirm={() => handlePublish(record._id, !value)}
					>
						<Button
							icon={value ? <UndoOutlined /> : <CheckCircleOutlined />}
							style={{
								backgroundColor: value ? '#52c41a' : '#ff4d4f',
								borderColor: value ? '#52c41a' : '#ff4d4f',
								color: '#fff'
							}}
						>
							{value ? "Unpublish Package" : "Publish Package"}
						</Button>
					</Popconfirm>
				);
			},
		},
		{
			title: 'Actions',
			key: 'actions',
			render: (_: any, record: Package) => (
				<PackageActions
					// @ts-ignore
					record={record}
					// @ts-ignore
					handleDelete={handleDelete}
				/>
			)
		}
	];

	const iconHandler = () => {
		setClicked(prev => !prev);
	};

	useEffect(() => {
		packages()
	}, [orderBy, pageSize])

	const handleStateChange = (stateId: string) => {
		const filtered = examTypes.filter(
			(examType) => examType.stateId?._id === stateId
		);
		setFilteredExamTypes(filtered);
		// handleFilterChange('state', stateId);
	};

	return (
		<>
			<div style={{ width: '100%' }}>
				<div >

					<Row gutter={10} style={{ marginBottom: '1rem' }}>
						<Col sm={18} md={18} xl={18} xs={24}  >
							<h2 className="top-title mb-3" > Package</h2>
						</Col>
						<Col sm={3} md={3} xl={3} xs={12} span={3} className='text-end'>
							<div className='d-flex-up-down-btn'>
								<Button
									className='mobile-w-100'
									style={{
										background: 'black',
										color: 'white',
										fontWeight: '600',
										padding: '10px 20px',
									}}
									size='large'
									onClick={iconHandler}
								>
									Filter Now
								</Button>

								{selectedIds.length > 0 && (
									<Popconfirm
										style={{ height: '40px' }}
										title="Are you sure to delete selected Package?"
										onConfirm={() => handleDelete(selectedIds as any)}
										okText="Yes"
										cancelText="No"
									>
										<Button
											className="primary"
											danger
											ghost
											style={{
												marginLeft: '10px',
												color: '#b90d0d',
												background: '#af03031f',
											}}
										>
											<RiDeleteBin5Line style={{ fontSize: '15px', margin: '0 5px -1px 0' }} />
											Delete
										</Button>
									</Popconfirm>
								)}

							</div>
						</Col>
						<Col span={3} sm={3} md={3} xl={3} xs={12}>
							<Link href={`/${roleName}/add-package`}>
								<Button type="primary" className='w-100' style={{ width: '100%', height: '40px' }}>+ New Package</Button>
							</Link>
						</Col>
					</Row>



					{clicked ? <Form form={form} layout="vertical" onValuesChange={filterData}>
						<Row gutter={16} >
							<Col span={4}>
								<Form.Item label="Package Duration" name="packageDuration">
									<Select
										placeholder="Please Select Duration"
									>
										<Option value="">All</Option>
										{duration.map((dur: any) => (
											<Option key={dur._id} value={dur._id}>
												{dur.DurationTime}
											</Option>
										))}
									</Select>
								</Form.Item>


							</Col>
							<Col span={4}>
								<div>
									<Form.Item label="State" name="state">
										<Select placeholder="Please Select State" style={{ width: '100%' }}
											onChange={(value) => handleStateChange(value)} >
											<Option value="">All</Option>
											{services.map((data) => (
												<Option key={data._id} value={data._id}>
													{data.title}
												</Option>
											))}
										</Select>
									</Form.Item>
								</div>
							</Col>
							<Col span={4}>
								<Form.Item label="Exam Type" name="examType">

									<Select placeholder="Please Select Exam Type" style={{ width: '100%' }}
									>
										<Option value="">All</Option>
										{filteredExamTypes.map((data: any) => (
											<Option key={data._id} value={data._id}>
												{data.examType}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col span={4}>
								<Form.Item label="Grade" name="grade">
									<Select placeholder="Grade" style={{ width: '100%' }}
									>
										<Option value="">All</Option>
										{grades.map((data) => (
											<Option key={data._id} value={data._id}>
												{data.gradeLevel}
											</Option>
										))}
									</Select>


								</Form.Item>
							</Col>
							<Col span={4}>
								<Form.Item label="Subject in Package" name="subjectsInPackage">
									<Select placeholder='Subjects in Package' style={{ width: '100%' }}
									>
										<Option value="">All</Option>
										{subject.map((data) => (
											<Option key={data._id} value={data._id}>
												{data.subjectName}
											</Option>
										))}

									</Select>
								</Form.Item>
							</Col>
							<Col span={4}>
								<Form.Item label="Package Active" name="isActive">
									<Select placeholder="Package Type" style={{ width: '100%' }}
									>

										<Option value="">All</Option>
										<Option value="yes">Yes</Option>
										<Option value="no">No</Option>
									</Select>
								</Form.Item>
							</Col>


						</Row>

						<Row gutter={16} style={{ marginBottom: '1rem' }}>


							<Col span={4}>
								<Form.Item label="Package Quality Checked" name="qualityChecked">

									<Select placeholder="Package Quality" style={{ width: '100%' }}
									>
										<Option value="">All</Option>
										<Option value="yes">Yes</Option>
										<Option value="no">No</Option>
									</Select>
								</Form.Item>
							</Col>
							<Col span={4} >
								<Form.Item label="Search Package Name" name="packageName">
									<Input
										placeholder='search'
										type="search"
										style={{ width: '100%', height: '32px' }}
										suffix={<SearchOutlined />}
									/>
								</Form.Item>
							</Col>
							<Col span={4}>
								<Form.Item label="Test Conducted By" name="testConductedBy">
									<Select placeholder="Test Conducted By" style={{ width: '100%' }}
									>
										<Option value="">All</Option>
										{testConductedBy.map((data) => (
											<Option key={data._id} value={data._id}>
												{data.name}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col span={4}>

								<Form.Item label="Has Essay" name="hasEssay">
									<Select placeholder="Has Essay" style={{ width: '100%' }}>
										<Option value="">All</Option>
										<Option value="yes">Yes</Option>
										<Option value="no">No</Option>
									</Select>
								</Form.Item>



							</Col>
							<Col span={4}>

								<Button
									type="primary"
									onClick={clearFilters}
									style={{
										fontWeight: '600',
										padding: '10px 20px',
										width: '100%',
										marginTop: '30px',
									}}
								>
									Clear Filters
								</Button>
							</Col>
						</Row>
					</Form> : ''}
				</div>
				<LayoutWrapper>
					<Flex justify='space-between' className='mb-2' align='baseline'>
						<span>Total Packages: ({totalPakages})</span>
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
					</Flex>
					<Table
						className='package-table'
						dataSource={newPackages}
						columns={columns}
						rowKey="_id"
						pagination={{
							pageSizeOptions: ['5', '10', '20', '50', '100'],
							defaultPageSize: 10,
							showSizeChanger: true,
							onShowSizeChange: (current, size) => setPageSize(size),
							total: totalPakages
						}}

						onChange={(sorter) => {
							setSorter(sorter);
						}}
					/>
				</LayoutWrapper>

			</div >
		</>
	);
}
