'use client';
import './style.css';
import 'react-quill/dist/quill.snow.css';
import ErrorHandler from '@/lib/ErrorHandler';
import AuthContext from '@/contexts/AuthContext';
import { addUpdateGradeDetails } from '@/lib/adminApi';
import React, { useContext, useEffect, useState } from 'react';
import { Col, Form, Row, Button, notification, Input, message } from 'antd';
import { Grade } from '@/lib/types';

interface GradeModalProps {
	authorName: string;
	grade: Grade | null;
	onEdit: () => Promise<void>;
	onClose: () => void;
}
interface GradeFormValues {
	gradeLevel: string;
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
		if (props.grade) {
			setIsNew(false);
			setStateId(props.grade._id);
			form.setFieldsValue({
				gradeLevel: props.grade.gradeLevel,
				userID: user?._id
			});
		} else {
			setIsNew(true);
			setStateId('');
			form.resetFields();
		}
	}, [props.grade]);

	const onFinish = async (values: GradeFormValues) => {
		try {
			const data = {
				gradeLevel: values.gradeLevel,
				createdBy: userId || null,
				updateId: stateId
			};
			const res = await addUpdateGradeDetails(data);
			if (res.status === true) {
				{ stateId ? props.onClose() : '' }
				props.onEdit();
				form.resetFields();
				const action = isNew ? 'added' : 'updated';
				message.success(`Grade ${action} successfully`, 4);
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	};

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const nameValue = e.target.value;
		setGrade(nameValue);
	};

	return (
		<>
			<Form form={form} onFinish={onFinish} layout="vertical" initialValues={{ status: 'active' }}>
				<Row align="middle" gutter={[16, 16]}>
					<Col lg={24} md={24} sm={24} xs={24}>
						<Form.Item
							label="Grade"
							name="gradeLevel"
							rules={[
								{ required: true, message: 'Please enter grade' },
								{
									validator: (_, value) => {

										if (!value || value.trim().length === 0) {
											return Promise.reject('Whitespace values are not allowed');
										}
										return Promise.resolve();
									},
								},
							]}
						>
							<Input placeholder="Grade" type="number" onChange={handleNameChange} maxLength={30} />
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
					{stateId ? 'Update Grade' : 'Save Grade & Add More'}
				</Button>
			</Form>
		</>
	);
}
