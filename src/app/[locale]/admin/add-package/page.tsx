'use client';
import React from 'react';
import { Form, Input, Select, Button, Row, Col, message, Typography, Upload, Flex, Tooltip, InputNumber } from 'antd';
import { getAllExamType, getAllGrades, getAllSubjects, getAllTestConducted, getDuration, addPackagesDetails, getSinglePackageInfo } from '@/lib/adminApi';
const { Option } = Select;
import { useContext, useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { getCommonStates } from '@/lib/commonApi';
import { setServices } from '@/redux/reducers/serviceReducer';
import AuthContext from '@/contexts/AuthContext';
import { useDispatch } from 'react-redux';
import ErrorHandler from '@/lib/ErrorHandler';
import { setSubjects } from '@/redux/reducers/subjectReducer';
import { setGrades } from '@/redux/reducers/gradeReducer';
import { setExamType } from '@/redux/reducers/examReducer';
import { setTestConductBy } from '@/redux/reducers/testConductedByReducer';
import { RcFile } from 'antd/es/upload';
import Link from 'next/link';
import { GetPackageType } from '@/lib/adminApi';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { ExamType, Package, Subject } from '@/lib/types';
import { validationRules } from '@/lib/validations';
import { handleFileCompression } from '@/lib/commonServices';
import RichText from '@/commonUI/RichText';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDataContext } from '@/contexts/DataContext';

export default function Page() {
	const [form] = Form.useForm();
	const { examTypes } = useDataContext()
	const [duration, setDuration] = useState([])
	const [fileList, setFileList] = useState<any[]>([]);
	const services = useAppSelector((state) => state.serviceReducer.services);
	const { user } = useContext(AuthContext);
	const grades = useAppSelector((state) => state.gradeReducer.grades);
	const dispatch = useDispatch();
	const subject = useAppSelector((state) => state.subjectReducer.subjects);
	const testConductedBy = useAppSelector((state) => state.testConductedByReducer.testConductBy);
	const [packageType, setPackageType] = useState([])
	const [filteredExamTypes, setFilteredExamTypes] = useState<ExamType[]>([]);
	const searchParams = useSearchParams();
	const paramId = searchParams.get('id');
	const [packageData, setPackageData] = useState<Package>();
	const router = useRouter();
	const [description, setDescription] = useState('')
	const [examTypeId, setExamTypeId] = useState('');
	const [isFree, setIsFree] = useState<boolean>(false);
	const [hasEssay, setHasEssay] = useState('no');
	const roleName = user?.roleId?.roleName;
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

	const GetPackageTypeHandler = async () => {
		try {
			const res = await GetPackageType();
			setPackageType(res.packageTypes);

		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	}

	const getEditableData = async () => {
		try {

			const res = await getSinglePackageInfo(paramId as string);
			if (res.status === true) {
				setPackageData(res.data);
				handlePackageFree(res.data.isFree);
				handleStateChange(res.data.state?._id);
				setDescription(res.data.packageDescription);
				setExamTypeId(res.data.examType?._id);
				form.setFieldsValue({
					packageName: res.data.packageName,
					packageDescription: res.data.packageDescription,
					packagePrice: res.data.packagePrice,
					packageDiscount: res.data.packageDiscount,
					adminComment: res.data.adminComment,
					discountApplied: res.data.discountApplied,
					packageDuration: res.data.packageDuration?._id,
					state: res.data.state?._id,
					grade: res.data.grade,
					// examType: res.data.examType?._id,
					numSubjects: res.data.numSubjects,
					subjectsInPackage: res.data.subjectsInPackage?.map((subject: Subject) => subject._id),
					testType: res.data.testType,
					qualityChecked: res.data.qualityChecked,
					numTests: res.data.numTests,
					isFree: res.data.isFree,
					isActive: res.data.isActive,
					numUniqueSubjects: res.data.numUniqueSubjects,
					assignedTo: res.data.assignedTo,
					testConductedBy: res.data.testConductedBy?._id,
					hasEssay: res.data.hasEssay,
					hasPackage: res.data.hasPackage,
					packageType: res.data.packageType?._id,
					packageStatus: res.data.status,
					essayTypes: res.data.essayTypes
				});
				if (res.data.packageImage) {
					setFileList([
						{
							uid: '1',
							name: res.data.packageName,
							status: 'done',
							url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/packageImage/original/${res.data.packageImage}`
						}
					]);
				}
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	};

	useEffect(() => {
		const fetchAllData = async () => {
			try {
				await fetchData();
				await subjects();
				await getAllGradesData();
				await getTests();
				await DurationHandler();
				await GetPackageTypeHandler();
			} catch (error) {
				ErrorHandler.showNotification(error);
			}
		};
		fetchAllData();

	}, [user]);

	useEffect(() => {
		if (paramId) getEditableData();
	}, [paramId]);

	useEffect(() => {
		const getExam = async () => {
			try {
				const res = await getAllExamType();
				if (res.status === true) {
					const selectedStateId = services.find(service => service._id === form.getFieldValue('state'))?._id;
					// console.log(selectedStateId, 'selectedStateId')
					if (selectedStateId) {
						handleStateChange(selectedStateId);

						// Filter the exam types based on the selected state ID
						const filtered = res.data.filter((examType: ExamType) => {
							return examType.stateId?._id === selectedStateId;
						});
						// console.log(filtered, 'filtered')


						if (filtered.length > 0) {
							const matchingExamType = filtered.filter((item: ExamType) => {
								return item._id === examTypeId
							});
							// console.log(matchingExamType, 'matchingExamType')

							if (matchingExamType) {
								form.setFieldsValue({ examType: matchingExamType[0]._id });
							}
						}

						setFilteredExamTypes(filtered);
						dispatch(setExamType(res.data));
					}
				}
			} catch (error) {
				// ErrorHandler.showNotification(error);
			}
		};

		getExam();

	}, [examTypeId]);


	const onFinish = async (values: any) => {

		try {
			const formData = new FormData();

			if (fileList && fileList.length > 0 && fileList[0]?.originFileObj) {
				fileList.forEach((file) => {
					formData.append('packageImage', file.originFileObj as Blob);
				});
			}

			if (packageData?._id) formData.append('packageId', packageData._id);

			Object.keys(values).forEach((key) => {
				if (values[key] !== undefined && values[key] !== null) {
					formData.append(key, values[key]);
				}
			});

			const res = await addPackagesDetails(formData);
			if (res.status === true) {
				form.resetFields();
				message.success(res.message);
				router.push(`${process.env["NEXT_PUBLIC_SITE_URL"]}/${roleName}/packages`);
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	};

	const handleStateChange = (stateId: String) => {
		const filtered = examTypes.filter(
			(examType) => examType.stateId?._id === stateId
		);
		form.setFieldsValue({
			examType: undefined,
		});
		setFilteredExamTypes(filtered);
	};


	const uploadButton = (
		<div>
			<PlusOutlined />
			<div style={{ marginTop: 8 }}>Upload</div>
		</div>
	);


	const handleBeforeUpload = async (file: RcFile) => {
		try {
			const compressedFiles = await handleFileCompression(file, '');
			setFileList(compressedFiles);
			return false;
		} catch (error) {
			ErrorHandler.showNotification(error);
			return false;
		}
	};

	const handleRemove = () => {
		setFileList([]);
	};

	const handlePackageFree = (value: string) => {
		if (value === 'yes') {
			form.setFieldsValue({ packagePrice: '0' });
			form.setFieldsValue({ packageDiscount: '0' });
			setIsFree(true); // Set isFree to true
		} else {
			setIsFree(false); // Set isFree to false
		}
	};

	const handleHasEssayChange = (value: any) => {
		setHasEssay(value);
		if (value === 'no') {
			form.setFieldsValue({ essayTypes: '' });
		}
	};


	return (
		<>
			<div style={{ padding: '20px' }}>
				<Row gutter={[16, 16]} align="middle">
					<Col className="" xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<Link href={`/${roleName}/packages`}>
								<ArrowLeftOutlined style={{ fontSize: '20px', cursor: 'pointer', marginRight: '10px' }} />
							</Link>
							<Typography.Title level={3} className='mb-0 top-title' style={{ marginBottom: 0 }}>
								{packageData ? 'Edit Package' : 'Create a Package'}
							</Typography.Title>
						</div>
					</Col>

					<Col className="" xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>

					</Col>
				</Row>

				<div className='desktop-view card-dash shadow-none'>
					<Form size="large" layout="vertical" form={form} onFinish={onFinish}
						initialValues={{
							isActive: 'no',
							qualityChecked: 'no',
							hasEssay: 'no',
							packageStatus: `${!packageData && 'notInUse'}`,
							isFree: packageData?.isFree || 'no',
							packagePrice: packageData?.packagePrice || 0,
							packageDiscount: packageData?.packageDiscount || 0,
						}}>
						<Row gutter={16}>
							<Col md={6} sm={12}>
								<Form.Item
									label="Name"
									name="packageName"
									rules={[
										{
											required: true,
											message: 'Package name is required',
										},
										{
											validator: (_, value) => {
												if (value && value.trim() === '') {
													return Promise.reject(new Error('Please enter a valid package name'));
												}
												return Promise.resolve();
											},
										},
										{
											max: validationRules.textLongLength.maxLength,
											message: `Package name cannot exceed ${validationRules.textLongLength.maxLength} characters`,
										},
									]}
								>
									<Input
										placeholder="Enter the name of the package"
										onChange={(e) => {
											const { value } = e.target;
											const trimmedValue = value.trimStart();
											form.setFieldsValue({ packageName: trimmedValue }); // Automatically removes leading spaces
										}}
									/>
								</Form.Item>

							</Col>
							<Col md={6} sm={24}>
								<Form.Item label="Is Package Free" name="isFree" rules={[{ required: true, message: 'Please Select Package Free' }]}>
									<Select
										placeholder="Select Package Free"
										onChange={(value) => {
											handlePackageFree(value)
										}}
									>
										<Option value="yes">Yes</Option>
										<Option value="no">No</Option>
									</Select>
								</Form.Item>
							</Col>
							<Col md={6} sm={24}>
								<Form.Item
									label="Price"
									name="packagePrice"
									rules={[
										{
											required: true,
											message: 'Please enter the price for the package',
										},
										{
											validator: (_, value) => {
												if (isFree === true) {
													if (value !== '0') {
														return Promise.reject(new Error('Price must be 0 when the package is free'));
													}
												}
												// If the package is not free, validate the price range
												else if (isFree === false) {
													const price = Number(value);
													if (!value || isNaN(price) || price < 1 || price > 1000000000) {
														return Promise.reject(new Error('Price must be between 1 and 1,000,000,000'));
													}
												}

												return Promise.resolve();
											},
										},
									]}
								>
									<Input
										placeholder="Enter the price of the package (1 to 1,000,000,000)"
										onInput={(e) => {
											const input = e.target as HTMLInputElement;
											input.value = input.value.replace(/[^0-9]/g, '').slice(0, 10);
										}}
										disabled={form.getFieldValue('isFree') === 'yes'} // Disable input if the package is free
									/>
								</Form.Item>
							</Col>
							<Col md={6} sm={24}>
								<Form.Item
									label="Discount (%)"
									name="packageDiscount"
									rules={[
										{
											validator: (_, value) => {
												if (value === undefined || value === "") {
													// Allow empty value (no required validation)
													return Promise.resolve();
												}

												const discount = Number(value);

												if (isNaN(discount)) {
													return Promise.reject(new Error('Discount must be a valid number'));
												}

												if (discount < 0 || discount > 100) {
													return Promise.reject(
														new Error('Discount must be between 0 and 100')
													);
												}

												return Promise.resolve();
											},
											message: 'Discount must be between 0 and 100%',
										}
									]}
								>
									<Input
										placeholder="Enter the discount percentage (0 to 100)"
										onInput={(e) => {
											const input = e.target as HTMLInputElement;
											input.value = input.value.replace(/[^0-9]/g, '').slice(0, 3);
										}}
										disabled={form.getFieldValue('isFree') === 'yes'} // Disable input if the package is free
									/>
								</Form.Item>
							</Col>

							<Col md={6} sm={24}>
								<Form.Item
									label="Comments by Admin (Subjects Included)"
									name="adminComment"
									rules={[
										{ required: true, message: 'Please provide comments for the package' },
										{
											max: validationRules.textLongLength.maxLength,
											message: `Comments cannot exceed ${validationRules.textLongLength.maxLength} characters`,
										}
									]}
								>
									<Input
										placeholder="Enter admin comments (letters and spaces only)"
										type="text"
									/>
								</Form.Item>
							</Col>
							<Col md={6} sm={24}>
								<Form.Item
									label="Duration"
									name="packageDuration"
									rules={[
										{ required: true, message: 'Please select the package duration' },
									]}
								>
									<Select
										placeholder="Select a package duration"
										showSearch
										filterOption={(input, option) => {
											const children = option?.children as any;
											return children.toLowerCase().includes(input.toLowerCase());
										}}
									>
										{duration
											// .filter((dur: any) => !isFree && dur.DurationTime !== "Lifetime")
											.map((dur: any) => (
												<Option key={dur._id} value={dur._id}>
													{dur.DurationTime}
												</Option>
											))}
									</Select>
								</Form.Item>
							</Col>
							<Col md={6} sm={12}>
								<Form.Item label="State" name="state"
									rules={[{ required: true, message: 'Please Select State' }]}>
									<Select
										placeholder="Select State"
										showSearch
										filterOption={(input, option) => {
											const children = option?.children as any;
											return children.toLowerCase().includes(input.toLowerCase());
										}}
										onChange={handleStateChange}
									>
										{services.map((data) => (
											<Option key={data._id} value={data._id}>
												{data.title}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col md={6} sm={12}>
								<Form.Item label="Exam Type" name="examType" rules={[{ required: true, message: 'Please Select Exam Type' }]}>
									<Select
										placeholder="Select Exam Type"
										showSearch
										filterOption={(input, option) => {
											const children = option?.children as any;
											return children.toLowerCase().includes(input.toLowerCase());
										}}
									>
										{filteredExamTypes.map((data: ExamType) => (
											<Option key={data._id} value={data._id}>
												{data.examType}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col md={6} sm={12}>
								<Form.Item label="Grade" name="grade" rules={[{ required: true, message: 'Please Select Grade' }]}>
									<Select
										placeholder="Select Grade"
										showSearch
										filterOption={(input, option) => {
											const children = option?.children as any;
											return children.toLowerCase().includes(input.toLowerCase());
										}}
									>
										{grades.map((data) => (
											<Option key={data._id} value={data._id}>
												{data.gradeLevel}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col md={12} sm={24}>
								<Form.Item
									label="Subjects in Package"
									name="subjectsInPackage"
									rules={[{ required: true, message: 'Please Select Subjects' }]}
								>
									<Select
										placeholder="Select Subjects"
										mode="multiple"
										showSearch
										maxTagCount="responsive"
										maxTagPlaceholder={(omittedValues) => (
											<Tooltip title={omittedValues.map(({ label }) => label).join(', ')}>
												<span>...</span>
											</Tooltip>
										)}
										filterOption={(input, option) => {
											const children = option?.children as any;
											return children.toLowerCase().includes(input.toLowerCase());
										}}
									>
										{subject && subject.length > 0 && subject.map((data) => (
											<Option key={data._id} value={data._id}>
												{data.subjectName}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>



							<Col md={6} sm={12}>
								<Form.Item
									label="Number of Essays Per Month"
									name="essayTypes"
									rules={[
										{
											required: hasEssay === 'yes',
											message: 'Please enter the number of essays',
										},
										{
											pattern: /^[0-9]*$/,
											message: 'Please enter only numeric values',
										},
									]}
								>
									<Input
										type="text"
										placeholder="Enter number of essays"
										maxLength={2}
										disabled={hasEssay === 'no'}
										onKeyPress={(e) => {
											const charCode = e.charCode || e.keyCode;
											if (charCode < 48 || charCode > 57) {
												e.preventDefault(); // Allow only numeric values
											}
										}}
										onChange={(e) => {
											const value = e.target.value.replace(/[^0-9]/g, '');
											e.target.value = value;
										}}
									/>
								</Form.Item>
							</Col>
							<Col md={6} sm={24}>
								<Form.Item
									label="Package Type"
									name="packageType"
									rules={[{ required: true, message: 'Select Package Type ' }]}
								>
									<Select placeholder="Please Select Package Type">
										{packageType.map((data: any) => (
											<Option key={data._id} value={data._id}>
												{data.selectedPackage}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col md={6} sm={24}>
								<Form.Item
									label="Number of Tests in Package"
									name="numTests"
									rules={[
										{
											validator: (_, value) => {
												if (!value) {
													return Promise.reject(new Error('Please enter the number of tests'));
												}

												const numTests = Number(value);

												if (isNaN(numTests)) {
													return Promise.reject(new Error('Number of tests must be a valid number'));
												}

												if (numTests < 1) {
													return Promise.reject(new Error('The number of tests must be at least 1'));
												}

												if (numTests > 9999) {
													return Promise.reject(new Error('The number of tests must not exceed 9999'));
												}

												return Promise.resolve();
											},
										},
									]}
								>
									<Input
										type="text"
										placeholder="Enter number of tests"
										maxLength={4}
										onInput={(e: any) => {
											const value = e.target.value.replace(/[^0-9]/g, '');
											e.target.value = value;
										}}
									/>
								</Form.Item>

							</Col>
							<Col md={6} sm={24}>
								<Form.Item label="Quality Checked" name="qualityChecked" rules={[{ required: true, message: 'Please Select Quality Checked ' }]}>
									<Select placeholder="Please Select Quality Checked">
										<Option value="yes">Yes</Option>
										<Option value="no">No</Option>
									</Select>
								</Form.Item>
							</Col>
							<Col md={6} sm={24}>
								<Form.Item label="Has Essay in Package?" name="hasEssay" rules={[{ required: true, message: 'Please Select Has Essay in Package' }]}>
									<Select placeholder="Select Has Essay in Package" onChange={handleHasEssayChange}>
										<Option value="yes">YES</Option>
										<Option value="no">NO</Option>
									</Select>
								</Form.Item>
							</Col>
							<Col md={6} sm={24}>
								<Form.Item
									label="Package in Use or Not"
									name="packageStatus"
									rules={[{ required: true, message: 'Please Select Package Use or Not' }]}
								>
									<Select
										placeholder="Select Package Use or Not"
									>
										<Option value="inUse">In Use</Option>
										<Option value="notInUse">Not in Use</Option>
									</Select>
								</Form.Item>

							</Col>
							<Col md={6} sm={24}>
								<Form.Item label="Test Conducted By" name="testConductedBy" rules={[{ required: true, message: 'Please Select Test Conducted By' }]}>
									<Select
										placeholder=" Select Test Conducted By"
										showSearch
										filterOption={(input, option) => {
											const children = option?.children as any;
											return children.toLowerCase().includes(input.toLowerCase());
										}}
									>
										{testConductedBy.map((data) => (
											<Option key={data._id} value={data._id}>
												{data.name}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col md={6} sm={24}>
								<Form.Item label="Package Active" name="isActive" rules={[{ required: true, message: 'Please Select Published Status' }]}>
									<Select placeholder="Select Published Status">
										<Option value="yes">Yes</Option>
										<Option value="no">No</Option>
									</Select>
								</Form.Item>
							</Col>
							<Col md={6} sm={0}>

							</Col>
							<Col md={18} sm={24}>
								<Form.Item
									label="Package Description"
									name="packageDescription"
									rules={[
										{ required: true, message: 'Please input the package description!' },
									]}
									validateTrigger="onFinish"
								>
									<RichText
										editorValue={form.getFieldValue('packageDescription') || description || ""}
										onChange={(value) => form.setFieldsValue({ packageDescription: value })}
										dependency={true}
									/>
								</Form.Item>
							</Col>
							<Col md={6} sm={24}>
								<div className="text-end">
									<Form.Item label="Package Logo">
										<Upload
											listType="picture-card"
											fileList={fileList}
											beforeUpload={handleBeforeUpload}
											onRemove={handleRemove}
											accept={'image/*'}
										>
											{fileList.length >= 1 ? null : uploadButton}
										</Upload>
									</Form.Item>
									<Flex gap={3} justify={'end'}>
										<Form.Item>
											<Button type="primary" htmlType="submit">
												Submit
											</Button>
										</Form.Item>
										<Form.Item>
											<Link href={`/${roleName}/packages`}>
												<Button type="default">Cancel</Button>
											</Link>
										</Form.Item>
									</Flex>
								</div>
							</Col>
						</Row>
					</Form>
				</div>
			</div>
		</>

	);
}
