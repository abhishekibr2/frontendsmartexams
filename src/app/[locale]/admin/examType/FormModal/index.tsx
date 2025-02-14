'use client';
import './style.css';
import 'react-quill/dist/quill.snow.css';
import ErrorHandler from '@/lib/ErrorHandler';
import AuthContext from '@/contexts/AuthContext';
import { addUpdateExamTypeDetails, getAllStates, getAllComplexity } from '@/lib/adminApi';
import React, { useContext, useEffect, useState } from 'react';
import { Col, Form, Row, Button, Input, message, Select } from 'antd';
import { ExamType } from '@/lib/types';
import { useAppSelector } from '@/redux/hooks';
import { useDispatch } from 'react-redux';
import { setServices } from '@/redux/reducers/serviceReducer';
import { setComplexity } from '@/redux/reducers/complexityReducer';
import TextArea from 'antd/es/input/TextArea';
const { Option } = Select;


interface ServiceModalProps {
	authorName: string;
	examType: ExamType | null;
	onEdit: () => Promise<void>;
	onClose: () => void;

}

export default function FormModal(props: ServiceModalProps) {
	const dispatch = useDispatch()
	const [form] = Form.useForm();
	const [loading, setLoading] = useState<boolean>(false);
	const [stateId, setStateId] = useState<string>('');
	const [examName, setExamName] = useState<string>('');
	const [isNew, setIsNew] = useState<boolean>(true);
	const { user } = useContext(AuthContext);
	const states = useAppSelector((state) => state.serviceReducer.services);
	const complexity = useAppSelector((state) => state.complexityReducer.complexity);
	const userId = user?._id;

	useEffect(() => {

		if (props.examType) {
			setIsNew(false);
			setStateId(props.examType._id);
			setExamName(props.examType.examType || '');

			// Setting form values for all the relevant fields
			form.setFieldsValue({
				examType: props.examType?.examType,
				state: props.examType?.stateId?._id || '',
				complexityLevel: props.examType?.complexityId?._id || '',
				eligibility: props.examType?.eligibility || '',
				duration: props.examType?.duration || '',
				onlineAvailability: props.examType?.onlineAvailability || '',
				testSubjects: props.examType?.testSubjects || '',
			});
		} else {
			setIsNew(true);
			setStateId('');
			setExamName('');
			form.resetFields();
		}
	}, [props.examType, form]);


	const generateSlug = (text: string) =>
		text
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^a-z0-9-]/g, '');

	const capitalizeWords = (str: string) => {
		return str
			.split(' ')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	};

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const nameValue = e.target.value;
		const capitalizedName = capitalizeWords(nameValue);
		setExamName(capitalizedName);
		form.setFieldsValue({
			examType: capitalizedName,
			slug: generateSlug(capitalizedName),
		});
		updateFormField('examType', e.target.value);

	};


	const updateFormField = (fieldName: string, value: any) => {
		form.setFieldsValue({
			[fieldName]: value,
		});
	};
	const onFinish = async () => {
		try {
			setLoading(true);
			const data = {
				examType: examName,
				createdBy: userId || null,
				updateId: stateId,
				stateId: form.getFieldValue('state'),
				complexityId: form.getFieldValue('complexityLevel'),
				eligibility: form.getFieldValue('eligibility'),
				duration: form.getFieldValue('duration'),
				onlineAvailability: form.getFieldValue('onlineAvailability'),
				testSubjects: form.getFieldValue('testSubjects'),
			};

			const res = await addUpdateExamTypeDetails(data);

			if (res.status === true) {
				const action = isNew ? 'added' : 'updated';
				message.success(`Exam Type ${action} successfully`, 4);
				props.onEdit();
				props.onClose();
				form.resetFields();
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		} finally {
			setLoading(false);
		}
	};

	async function fetchStates() {
		try {
			const res = await getAllStates();
			if (res.status === true) {
				dispatch(setServices(res.data));
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	}
	async function fetchComplexities() {
		try {
			const res = await getAllComplexity();
			if (res.status === true) {
				dispatch(setComplexity(res.data));
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	}

	useEffect(() => {
		fetchStates();
		fetchComplexities();
	}, [])


	return (
		<>
			<Form form={form} onFinish={onFinish} layout="vertical" initialValues={{ status: 'active' }} >
				<Row align="middle" gutter={16} >
					<Col lg={12} md={12} sm={24} xs={24}>
						<Form.Item
							label="Title"
							name="examType"
							rules={[{ required: true, message: 'Please enter title' }]}

						>
							<Input
								placeholder="ExamType title"
								onChange={handleNameChange}
								maxLength={50}
							/>
						</Form.Item>
					</Col>
					<Col lg={12} md={12} sm={24} xs={24}>
						<Form.Item label="State" name="state">
							<Select placeholder="Select State" >

								{states.map((ste) => (
									<Option key={ste._id} value={ste._id}>
										{ste.title}
									</Option>
								))}
							</Select>

						</Form.Item>
					</Col>

					<Col lg={12} md={12} sm={24} xs={24}>
						<Form.Item label="Complexity Level" name="complexityLevel">
							<Select placeholder="Select Complexity" >

								{complexity.map((data) => (
									<Option key={data._id} value={data._id}>
										{data.complexityLevel}
									</Option>
								))}
							</Select>

						</Form.Item>
					</Col>

					<Col lg={12} md={12} sm={24} xs={24}>
						<Form.Item
							label="Duration"
							name="duration"
							rules={[{ required: true, message: 'Please enter Duration' }]}

						>
							<Input
								placeholder="Duration"

								type='number'
							/>
						</Form.Item>
					</Col>

					<Col lg={12} md={12} sm={24} xs={24}>
						<Form.Item
							label="Eligibility"
							name="eligibility"
							rules={[{ required: true, message: 'Please enter Eligibility' }]}
							id="w100"
						>

							<TextArea
								placeholder="Eligibility"
								autoSize={{ minRows: 3, maxRows: 5 }}
							/>
						</Form.Item>
					</Col>



					<Col lg={12} md={12} sm={24} xs={24}>
						<Form.Item
							label="Description"
							name="onlineAvailability"
							rules={[{ required: true, message: 'Please enter Description' }]}

						>

							<TextArea
								placeholder="Description"
								autoSize={{ minRows: 3, maxRows: 5 }}
							/>
						</Form.Item>
					</Col>

					<Col lg={24} md={24} sm={24} xs={24}>
						<Form.Item
							label="Test Subjects"
							name="testSubjects"
							rules={[{ required: true, message: 'Please enter Test Subjects' }]}

						>

							<TextArea
								placeholder="Test Subjects"
								autoSize={{ minRows: 3, maxRows: 5 }}
							/>
						</Form.Item>
					</Col>

				</Row>
				<Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%', height: 40 }}>
					Save ExamType & Add More
				</Button>
			</Form>
		</>
	);
}
