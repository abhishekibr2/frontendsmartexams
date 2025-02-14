'use client';
import './style.css';
import 'react-quill/dist/quill.snow.css';
import ErrorHandler from '@/lib/ErrorHandler';
import AuthContext from '@/contexts/AuthContext';
import { addUpdateTestConductedDetails } from '@/lib/adminApi';
import React, { useContext, useEffect, useState } from 'react';
import { Col, Form, Row, Button, Input, message } from 'antd';
import { TestConductBy } from '@/lib/types';

interface ServiceModalProps {
	testConductedBy: TestConductBy | null;
	onEdit: () => Promise<void>;
	onClose: () => void;
}
interface ServiceFormValues {
	name: string;
	slug: string;
	stateId: string;
}

export default function FormModal(props: ServiceModalProps) {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState<boolean>(false);
	const [stateId, setStateId] = useState<string>('');
	const { user } = useContext(AuthContext);
	const [isNew, setIsNew] = useState<boolean>(true);
	const userId = user?._id;

	useEffect(() => {
		if (props.testConductedBy) {
			setIsNew(false);
			setStateId(props.testConductedBy._id);
			form.setFieldsValue({
				name: props.testConductedBy.name,
				userID: user?._id,
			});
		} else {
			setIsNew(true);
			setStateId('');
			form.resetFields();
		}
	}, [props.testConductedBy]);

	// Generate slug from name
	const generateSlug = (text: string) => {
		return text
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^a-z0-9-]/g, '');
	};

	// Capitalize words in the name input
	const capitalizeWords = (str: string) => {
		return str
			.split(' ')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))  // Capitalize first letter of each word
			.join(' ');
	};

	// Handle name input change to capitalize words and update the slug
	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const nameValue = e.target.value;
		const capitalizedName = capitalizeWords(nameValue);  // Capitalize first letter of each word
		form.setFieldsValue({
			name: capitalizedName,  // Update name with capitalized words
			slug: generateSlug(capitalizedName),  // Generate slug in lowercase
		});
	};

	const onFinish = async (values: ServiceFormValues) => {
		try {
			setLoading(true);
			const data = {
				name: values.name,
				createdBy: userId || null,
				updateId: stateId,
			};

			const res = await addUpdateTestConductedDetails(data);
			if (res.status === true) {
				props.onEdit();
				form.resetFields();
				const action = isNew ? 'added' : 'updated';
				message.success(`Test Conducted By ${action} successfully`, 4);
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Form form={form} onFinish={onFinish} layout="vertical" initialValues={{ status: 'active' }}>
				<Row align="middle" gutter={[16, 16]}>
					<Col lg={24} md={24} sm={24} xs={24}>
						<Form.Item label="Title" name="name" rules={[{ required: true, message: 'Please enter name' }]}>
							<Input
								placeholder="Test Conducted title"
								type="text"
								onChange={handleNameChange}  // Handle the input change
								style={{ textTransform: 'capitalize' }}
								maxLength={30}
								onKeyPress={(e) => {
									const charCode = typeof e.which === 'number' ? e.which : e.keyCode;
									const charStr = String.fromCharCode(charCode);
									if (!/[A-Za-z\s]/.test(charStr)) {
										e.preventDefault();
									}
								}}
							/>
						</Form.Item>
					</Col>
				</Row>
				<Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%', height: 40 }}>
					{!isNew ? 'Update Test Conducted By' : 'Save Test Conducted By & Add More'}
				</Button>
			</Form>
		</>
	);
}
