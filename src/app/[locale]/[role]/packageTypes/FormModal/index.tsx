'use client';
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message as antdMessage } from 'antd';
import { AddPackageType } from '@/lib/adminApi';

const FormModal = ({ edit, handleCancel, handleFetch, setIsModalVisible }: any) => {
	const [form] = Form.useForm();
	const [updateId, setUpdateId] = useState('');

	useEffect(() => {
		if (edit) {
			setUpdateId(edit._id);
			form.setFieldsValue({
				selectedPackage: edit.selectedPackage,
			});
		}
	}, [edit, form]);

	const handleSubmission = async (values: any) => {
		const { selectedPackage } = values;

		if (!selectedPackage) {
			antdMessage.error("Please enter a package type.");
			return;
		}

		try {
			await AddPackageType({ selectedPackage, updateId });
			antdMessage.success('Package Type added successfully!');
			handleFetch();
			setIsModalVisible(false);
			form.resetFields()
		} catch (error) {
			antdMessage.error(error.response.data.error)

		}
	};

	return (
		<Form
			form={form}
			onFinish={handleSubmission}
			layout="vertical"
			style={{
				maxWidth: '500px',
				margin: 'auto',
			}}
		>
			<Form.Item
				label="Package Type"
				name="selectedPackage"
				rules={[{ required: true, message: 'Please enter a package type' }]}
			>
				<Input
					placeholder="Enter package type"
					style={{
						padding: '5px',
						fontSize: '16px',
					}}
					maxLength={20}
				/>
			</Form.Item>

			<Button
				type="primary"
				htmlType="submit"
				style={{ width: '100%', height: 40 }}>
				{edit ? 'Update Package Type' : 'Add Package Type & Add More'}
			</Button>

		</Form>
	);
};

export default FormModal;
