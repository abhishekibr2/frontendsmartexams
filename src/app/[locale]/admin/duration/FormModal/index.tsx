'use client';
import './style.css';
import 'react-quill/dist/quill.snow.css';
import ErrorHandler from '@/lib/ErrorHandler';
import AuthContext from '@/contexts/AuthContext';
import { addUpdateSubjectDetails } from '@/lib/adminApi';
import React, { useContext, useEffect, useState } from 'react';
import { Col, Form, Row, Button, notification, Input, message, Select } from 'antd';
import { Duration } from '@/lib/types';

import { AddDuration } from '@/lib/adminApi';

interface ServiceModalProps {
	authorName: string;
	service: Duration | null;
	onEdit: () => Promise<void>;
	onClose: () => void;
}
interface DurationForm {
	duration: string;
	durationOption: string;
	stateId: string;
}

export default function FormModal(props: ServiceModalProps) {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState<boolean>(false);
	const [durationId, SetDurationId] = useState<string>('');
	const { user } = useContext(AuthContext);
	const [isNew, setIsNew] = useState<boolean>(true);
	const userId = user?._id;


	useEffect(() => {
		if (props.service) {
			setIsNew(false);
			SetDurationId(props.service._id);
			form.setFieldsValue({
				duration: parseInt(props.service.DurationTime?.split(' ')[0] || '0', 10).toString(),
				durationOption: props.service.durationOption,
				userID: user?._id
			});
		} else {
			setIsNew(true);
			SetDurationId('');
			form.resetFields();
		}
	}, [props.service]);

	const onFinish = async (values: DurationForm) => {
		try {
			const data = {
				duration: values.duration,
				durationOption: values.durationOption,
				createdBy: userId || null,
				updateId: durationId
			};

			const res = await AddDuration(data);
			if (res.status === true) {
				{ durationId ? props.onClose() : '' }
				props.onEdit();
				form.resetFields();
				const action = isNew ? 'added' : 'updated';
				message.success(`Subject ${action} successfully`, 4);
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	};

	const durationOptions = [
		{ label: 'Days', value: 'days' },
		{ label: 'Weeks', value: 'weeks' },
		{ label: 'Months', value: 'months' },
		{ label: 'Years', value: 'years' }
	];

	return (
		<>
			<Form form={form} onFinish={onFinish} layout="vertical" initialValues={{ status: 'active' }}>
				<Row align="middle" gutter={[16, 16]}>
					<Col lg={12} md={12} sm={24} xs={24}>
						<Form.Item
							label="Duration Time"
							name="duration"
							rules={[
								{ required: true, message: 'Please enter duration time' },
								{
									validator: (_, value) => {
										if (!value) return Promise.resolve();

										if (!/^\d{1,3}$/.test(value)) {
											return Promise.reject(new Error('Duration must be a number with up to 3 digits and no decimals'));
										}

										return Promise.resolve();
									},
								},
							]}
						>
							<Input
								placeholder="Duration"
								type="number"
								onInput={(e) => {
									const input = e.target as HTMLInputElement;
									input.value = input.value.replace(/[^0-9]/g, '').slice(0, 3);
								}}
							/>
						</Form.Item>
					</Col>
					<Col lg={12} md={12} sm={24} xs={24}>
						<Form.Item
							name="durationOption"
							label="Duration Option"
							initialValue="days"
							rules={[{ required: true, message: 'Please select duration option' }]}
						>
							<Select
								placeholder="Select Duration"
								showSearch
								style={{ width: '100%' }}
								optionFilterProp="children"
								options={durationOptions}
							/>
						</Form.Item>
					</Col>
				</Row>

				<Button className='mt-3' type="primary" htmlType="submit" loading={loading} style={{ width: '100%', height: 40 }}>
					{durationId ? 'Update Duration' : 'Save Duration'}
				</Button>
			</Form>
		</>
	);
}
