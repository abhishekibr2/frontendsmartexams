'use client';
import './style.css';
import 'react-quill/dist/quill.snow.css';
import ErrorHandler from '@/lib/ErrorHandler';
import AuthContext from '@/contexts/AuthContext';
import { addUpdateComplexityDetails } from '@/lib/adminApi';
import React, { useContext, useEffect, useState } from 'react';
import { Col, Form, Row, Button, notification, Input, message } from 'antd';
import { Complexity } from '@/lib/types';

interface GradeModalProps {
	authorName: string;
	complexity: Complexity | null;
	onEdit: () => Promise<void>;
	onClose: () => void;
}
interface GradeFormValues {
	complexityLevel: string;
	slug: string;
	description: string;
	stateId: string;
}

export default function FormModal(props: GradeModalProps) {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState<boolean>(false);
	const [stateId, setStateId] = useState<string>('');
	const { user } = useContext(AuthContext);
	const [isNew, setIsNew] = useState<boolean>(true);
	const userId = user?._id;
	const [grade, setGrade] = useState('');

	useEffect(() => {
		if (props.complexity) {
			setIsNew(false);
			setStateId(props.complexity._id);
			form.setFieldsValue({
				complexityLevel: props.complexity.complexityLevel,
				userID: user?._id
			});
		} else {
			setIsNew(true);
			setStateId('');
			form.resetFields();
		}
	}, [props.complexity]);

	const onFinish = async (values: GradeFormValues) => {
		try {
			const data = {
				complexityLevel: values.complexityLevel,
				createdBy: userId || null,
				updateId: stateId
			};
			const res = await addUpdateComplexityDetails(data);
			if (res.status === true) {
				props.onClose();
				props.onEdit();
				form.resetFields();
				const action = isNew ? 'added' : 'updated';
				message.success(`Complexity ${action} successfully`, 4);
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	};

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const nameValue = e.target.value;
		setGrade(nameValue);
		const value = e.target.value.replace(/[^A-Za-z\s]/g, '');
		form.setFieldsValue({ complexityLevel: value });
	};

	return (
		<>
			<Form form={form} onFinish={onFinish} layout="vertical" initialValues={{ status: 'active' }}>
				<Row align="middle" gutter={[16, 16]}>
					<Col lg={24} md={24} sm={24} xs={24}>
						<Form.Item
							label="Complexity Level"
							name="complexityLevel"
							rules={[
								{ required: true, message: 'Please enter Complexity Level' },
								{
									validator: (_, value) => {
										// Check if the value contains any numbers
										if (!value || /[0-9]/.test(value)) {
											return Promise.reject('Complexity Level must contain only letters');
										}

										if (value.length > 40) {
											return Promise.reject('');
										}
										return Promise.resolve();
									},
								},
							]}
						>
							<Input
								placeholder="Complexity Level"
								type="text"
								onChange={handleNameChange}
								maxLength={40}

							/>
						</Form.Item>
					</Col>
				</Row>

				<Button
					type="primary"
					htmlType="submit"
					loading={loading}
					style={{ width: '100%', height: 40 }}
					value={grade}
				>
					{stateId ? 'Update Complexity Level' : 'Save Complexity Level & Add More'}
				</Button>
			</Form>
		</>
	);
}
