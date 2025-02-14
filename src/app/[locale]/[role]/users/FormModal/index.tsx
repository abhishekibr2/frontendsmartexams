'use client';
import React, { useContext, useEffect, useState } from 'react';
import { Col, Form, Row, Select, Button, Input, message } from 'antd';
import { getAllRoles, addUpdateUser } from '@/lib/adminApi';
import ErrorHandler from '@/lib/ErrorHandler';
import AuthContext from '@/contexts/AuthContext';
import './style.css';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { setShowUserForm, setLoading } from '@/redux/reducers/userReducer';
import { User } from '@/lib/types';
import { setUsers } from '@/redux/reducers/todoReducer';

export default function FormModal({ fetchData }: any) {
	const dispatch = useAppDispatch();
	const { currentUser, users, loading } = useAppSelector((state: RootState) => state.userReducer);
	const [form] = Form.useForm();
	const { user } = useContext(AuthContext);
	const [allRole, setAllRole] = useState<[]>([]);

	useEffect(() => {
		if (currentUser && currentUser !== null) {
			const formData = {
				...currentUser,
				roleId: currentUser.roleId?._id || null
			};

			form.setFieldsValue(formData);
		} else {
			form.resetFields();
		}
	}, [currentUser]);

	const validateEmail = (_rule: any, value: any, callback: any) => {
		const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
		const yahooPattern = /^[a-zA-Z0-9._%+-]+@yahoo\.com$/;

		if (gmailPattern.test(value) || yahooPattern.test(value)) {
			callback();
		} else {
			callback('');
		}
	};

	const onFinish = async (values: any) => {
		try {
			dispatch(setLoading(true));
			const data = {
				name: values.name,
				email: values.email,
				status: values.status,
				roleId: values.roleId,
				userId: currentUser?._id,
				createdBy: user?._id,
				updateBy: currentUser ? user?._id : undefined,

			};
			const res = await addUpdateUser(data);
			if (res.status === true) {
				fetchData();
				dispatch(setShowUserForm(false));
				const updatedUsers =
					currentUser !== null
						? users.map((user: User) => (user._id === currentUser._id ? res.data : user))
						: [res.data, ...users];
				dispatch(setUsers(updatedUsers));
				form.resetFields();

				message.success(res.message);
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		} finally {
			dispatch(setLoading(false));
		}
	};

	useEffect(() => {
		const fetchRoles = async () => {
			try {
				const res = await getAllRoles();
				if (res.status === true) {
					setAllRole(res.data);
				}
			} catch (error) {
				ErrorHandler.showNotification(error);
			}
		};
		fetchRoles();
	}, []);

	return (
		<>
			<Form form={form} onFinish={onFinish} layout="vertical">
				<Row align="middle" gutter={[16, 16]}>
					<Col lg={12} md={12} sm={24} xs={24}>
						<Form.Item
							label="Name"
							name="name"
							rules={[
								{
									required: true,
									message: 'Please enter user name'
								},
								{
									pattern: /^[A-Za-z\s]+$/,
									message: 'Name can only contain letters and spaces'
								}
							]}
						>
							<Input
								placeholder="Name"
								maxLength={50}
								onChange={(e) => {
									const value = e.target.value;
									// Capitalize the first letter of each word
									e.target.value = value.replace(/\b\w/g, (char) => char.toUpperCase());
								}}
							/>
						</Form.Item>
					</Col>
					<Col lg={12} md={12} sm={24} xs={24}>
						<Form.Item
							label="Email"
							name="email"
							rules={[
								{
									required: true,
									message: 'Please input your Email!'
								},
								{
									type: 'email',
									message: 'The input is not a valid email!'
								}
							]}
						>
							{currentUser ? <Input disabled /> : <Input placeholder="Email" type="email" maxLength={40} />}
							{/* <Input placeholder="Email" type="email" maxLength={40} disabled /> */}
						</Form.Item>
					</Col>
					<Col lg={12} md={12} sm={24} xs={24}>
						<Form.Item
							label="Role"
							name="roleId"
							rules={[
								{
									required: true,
									message: 'Please select Role'
								}
							]}
						>
							<Select placeholder="Select a Role" style={{ height: '40px' }}>
								{allRole
									?.filter((role: any) => role.roleName !== 'admin' && role.roleName !== 'superAdmin')
									.map((role: any) => (
										<Select.Option key={role._id} value={role._id}>
											{role.roleName.charAt(0).toUpperCase() + role.roleName.slice(1)}
										</Select.Option>
									))}
							</Select>
						</Form.Item>
					</Col>
					<Col lg={12} md={12} sm={24} xs={24}>
						<Form.Item name="status" label="Status" >
							<Select style={{ height: '40px' }} disabled={["blocked"].includes(currentUser?.status || '')}>
								<Select.Option value="active">Active</Select.Option>
								<Select.Option value="inactive">Inactive</Select.Option>
							</Select>
						</Form.Item>
					</Col>
				</Row>
				<Row align="stretch" gutter={[16, 16]}>
					<Col lg={4} md={4} sm={12} xs={12}>
						<Button type="primary" htmlType="submit" className="w100" loading={loading}>
							Save
						</Button>
					</Col>
				</Row>
			</Form>
		</>
	);
}
