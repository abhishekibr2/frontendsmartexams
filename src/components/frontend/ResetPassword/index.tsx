'use client';
import { Form, Input, message, InputRef, Image } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, LockOutlined, UserOutlined } from '@ant-design/icons';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { createNewPassword } from '@/lib/ApiAdapter';
import { useRouter, useSearchParams } from 'next/navigation';
import ErrorHandler from '@/lib/ErrorHandler';
import AuthContext from '@/contexts/AuthContext';
import './style.css'
import HeaderLogo from '../HeaderLogo';
import validatePassword from '@/commonUI/PasswordValidator';

interface ResetPassword {
	userId: string;
	token: string;
	password: string;
	confirmPassword: string;
}

export default function ResetPassword() {
	const [form] = Form.useForm();
	const searchParams = useSearchParams();
	const userID = searchParams.get('userId');
	const token = searchParams.get('token');
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const { locale } = useContext(AuthContext)


	const inputFocus = useRef<InputRef>(null)

	useEffect(() => {
		if (inputFocus.current) inputFocus.current.focus()
	}, [])

	const newPassword = async (values: ResetPassword) => {
		try {
			setLoading(true);
			const updatedValues = { ...values, userId: userID, token: token };
			const res = await createNewPassword(updatedValues);
			if (res) {
				setLoading(false);
				message.success('New password has been set successfully');
				router.push(`${process.env['NEXT_PUBLIC_SITE_URL']}/login`);
			}
		} catch (error) {
			setLoading(false);
			ErrorHandler.showNotification(error);
		}
	};

	return (
		<>
			<HeaderLogo />
			{/* Main Login Body */}
			<section className="form-body align-v-center">
				<div className="container">
					<h2 className="text-center title-medium fw-semi-bold top-ultra-space bottom-ultra-space ">
						Set New Password
					</h2>

					<Form
						form={form}
						name="login"
						className="form-fields"
						onFinish={newPassword}
						layout="vertical"
					>
						<div className="form-auto">
							<label>Enter Password :</label>
							<Form.Item
								name="password"
								rules={[
									{
										required: true,
										message: 'Please enter your new Password!',
									},
									{
										validator: validatePassword,
									},
								]}
							>
								<Input.Password
									prefix={<LockOutlined className="site-form-item-icon" />}
									type="password"
									iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
									placeholder="Enter Password"
									style={{ height: '40px' }}
									ref={inputFocus}

								/>
							</Form.Item>

							<label>Enter Confirm Password :</label>
							<Form.Item
								name="confirmPassword"
								dependencies={['password']}
								rules={[
									{ required: true, message: 'Please enter your confirm Password!' },
									({ getFieldValue }) => ({
										validator(_, value) {
											if (!value || getFieldValue('password') === value) {
												return Promise.resolve();
											}
											return Promise.reject(
												new Error("Password doesn't match with new password!")
											);
										}
									})
								]}
							>
								<Input.Password
									prefix={<LockOutlined className="site-form-item-icon" />}
									type="password"
									iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
									placeholder="Enter Confirm Password"
									style={{ height: '40px' }}
								/>
							</Form.Item>

							<Form.Item>
								<button
									type="submit"
									className="w-100  btn-accent-form top-extra-space hover-effects opacity">

									{loading ? 'Please wait...' : 'Set New Password'}
								</button>
							</Form.Item>

							<Form.Item>
								<button
									type="submit"
									className="w-100  btn-accent-form top-extra-space hover-effects opacity">
									Back To Login
								</button>
							</Form.Item>

						</div>

					</Form>
				</div>
			</section>
		</>
	);
}
