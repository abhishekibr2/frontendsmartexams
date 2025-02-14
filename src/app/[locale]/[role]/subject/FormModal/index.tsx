'use client';
import './style.css';
import 'react-quill/dist/quill.snow.css';
import ErrorHandler from '@/lib/ErrorHandler';
import AuthContext from '@/contexts/AuthContext';
import { addUpdateSubjectDetails } from '@/lib/adminApi';
import React, { useContext, useEffect, useState } from 'react';
import { Col, Form, Row, Button, notification, Input, message } from 'antd';
import { Subject } from '@/lib/types';

interface ServiceModalProps {
	authorName: string;
	service: Subject | null;
	onEdit: () => Promise<void>;
	onClose: () => void;
}
interface ServiceFormValues {
	subjectName: string;
	description: string;
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
		if (props.service) {
			setIsNew(false);
			setStateId(props.service._id);
			form.setFieldsValue({
				subjectName: props.service.subjectName,
				userID: user?._id
			});
		} else {
			setIsNew(true);
			setStateId('');
			form.resetFields();
		}
	}, [props.service]);

	const generateSlug = (text: string) => {
		return text
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^a-z0-9-]/g, '');
	};

	const onFinish = async (values: ServiceFormValues) => {
		try {
			const data = {
				subjectName: values.subjectName,
				createdBy: userId || null,
				updateId: stateId
			};

			const res = await addUpdateSubjectDetails(data);
			if (res.status === true) {
				{ stateId ? props.onClose() : '' }
				props.onEdit();
				form.resetFields();
				const action = isNew ? 'added' : 'updated';
				message.success(`Subject ${action} successfully`, 4);
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	};

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const nameValue = e.target.value;
		form.setFieldsValue({
			slug: generateSlug(nameValue)
		});
	};

	return (
		<>
			<Form form={form} onFinish={onFinish} layout="vertical" initialValues={{ status: 'active' }}>
				<Row align="middle" gutter={[16, 16]}>
					<Col lg={24} md={24} sm={24} xs={24}>
						<Form.Item
							label="Subject Name"
							name="subjectName"
							rules={[{ required: true, message: 'Please enter title' }]}
						>
							<Input
								placeholder="Subject title"
								type="text"
								onChange={handleNameChange}
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
					{stateId ? 'Update Subject' : 'Save Subject & Add More'}
				</Button>
			</Form>
		</>
	);
}
