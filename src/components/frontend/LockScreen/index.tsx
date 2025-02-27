'use client';
import React, { useContext, useEffect, useState } from 'react';
import { Form, Input } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import Link from 'next/link';
import AuthContext from '@/contexts/AuthContext';
import { getUserById } from '@/lib/ApiAdapter';
import { useSearchParams } from 'next/navigation';
import ErrorHandler from '@/lib/ErrorHandler';
import './style.css'
import HeaderLogo from '../HeaderLogo';


interface userData {
	id: string;
	name: string;
	email: string;
	image: string;
}
const LockScreen = () => {
	const [form] = Form.useForm();
	const searchParams = useSearchParams();
	const [loading, setLoading] = useState(false);
	const [userData, setUserData] = useState<userData | undefined>();
	const { login, locale } = useContext(AuthContext);

	const onFinish = async (values: { password: string; }) => {
		setLoading(true);
		try {
			if (userData?.email) {
				await login(userData?.email, values.password, '');
			}
		} catch (error) {
			setLoading(false);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		async function fetchData() {
			const userId = searchParams.get('userId');
			if (userId) {
				try {
					const response = await getUserById(userId);
					setUserData(response.data);
					form.setFieldsValue({ email: response.data.email });
				} catch (error) {
					ErrorHandler.showNotification(error);
				}
			}
		}
		fetchData();
	}, [searchParams]);

	return (
		<>
			<HeaderLogo />
			<section className="form-body align-v-center">
				<div className="container">
					<h2 className="text-center title-medium fw-semi-bold top-ultra-space bottom-ultra-space ">
						Lock Screen
					</h2>
					<div className="gapMarginTop"></div>
					<Form
						name="normal_login"
						className="form-fields"
						initialValues={{ remember: true }}
						onFinish={onFinish}
						form={form}
						layout="vertical"
					>
						<div className="form-auto">
							<label>Email Id :</label>
							<div className='icon-field right-icon'>

								<Form.Item
									name="email"
									className='icon-field right-icon'
								>
									<Input
										className="field-panel"
										placeholder="Email"
										maxLength={60}
										type='email'
										disabled
										value={userData?.email}
									/>

								</Form.Item>
								<i className="fa-regular fa-envelope"></i>
							</div>

							<Form.Item
								name="password"
								label="Password"
								rules={[{ required: true, message: 'Please input your Password!' }]}
								labelCol={{ span: 24 }}
								wrapperCol={{ span: 24 }}
							>
								<Input.Password
									prefix={<LockOutlined className="site-form-item-icon" />}
									type="password"
									placeholder="Password"
									maxLength={20}
									className="field-panel"

								/>
							</Form.Item>

							<Form.Item>
								<button
									type="submit"
									className="w-100  btn-accent-form  hover-effects opacity">
									{loading ? 'Please wait...' : 'Unlock'}
								</button>
							</Form.Item>
						</div>
					</Form>
					<div style={{ textAlign: 'center', marginTop: '20px' }}>
						<span>
							Not You?{' '}
							<Link href={`${locale !== 'en' ? `/${locale}` : ''}/login`} className="p-sm fw-bold color-accent">
								Login here
							</Link>
						</span>
					</div>

				</div>

			</section >
		</>
	);
};

export default LockScreen;
