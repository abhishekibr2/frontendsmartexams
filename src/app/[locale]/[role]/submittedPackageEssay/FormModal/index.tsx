'use client';
import './style.css';
import 'react-quill/dist/quill.snow.css';
import ErrorHandler from '@/lib/ErrorHandler';
import AuthContext from '@/contexts/AuthContext';
import TextEditor from '@/app/commonUl/TextEditor';
import { addUpdateStateDetails } from '@/lib/adminApi';
import React, { useContext, useEffect, useState } from 'react';
import { Col, Form, Row, Button, notification, Input, message } from 'antd';

interface Service {
	_id: string;
	id: string;
	title: string;
	content: string;
	createdAt: Date;
	updatedAt?: Date;
	slug?: string;
	description?: string;
	status?: 'active' | 'inactive';
	image?: string;
}

interface ServiceModalProps {
	authorName: string;
	service: Service | null;
	onEdit: () => Promise<void>;
	onClose: () => void;
}
interface ServiceFormValues {
	title: string;
	slug: string;
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
				title: props.service.title,
				description: props.service.description,
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
				title: values.title,
				description: values.description,
				stateId: userId || null,
				updateId: stateId,
				createdBy: user?._id
			};

			const res = await addUpdateStateDetails(data);
			if (res.status === true) {


				{ stateId ? props.onClose() : '' }

				props.onEdit();
				form.resetFields();
				const action = isNew ? 'added' : 'updated';
				message.success(`State ${action} successfully`, 4);
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

	const handleQuillChange = (content: string) => {
		form.setFieldsValue({
			description: content
		});
	};

	return (
		<>
			<Form form={form} onFinish={onFinish} layout="vertical" initialValues={{ status: 'active' }}>
				<Row align="middle" gutter={[16, 16]}>
					<Col lg={24} md={24} sm={24} xs={24}>
						<Form.Item
							label="Title"
							name="title"
							rules={[{ required: true, message: 'Please enter title' }]}
						>
							<Input
								placeholder="Service title"
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
						<Form.Item label="Description" name="description">
							<TextEditor handleQuillChange={handleQuillChange} content={props.service?.content || ''} />
						</Form.Item>
					</Col>
				</Row>
				<Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%', height: 40 }}>
					{stateId ? 'Update State' : 'Save State & Add More'}
				</Button>
			</Form>
		</>
	);
}
