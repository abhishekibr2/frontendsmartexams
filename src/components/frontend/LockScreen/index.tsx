'use client';
import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Button, Space, Avatar, Card, Col, Row, Image } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Link from 'next/link';
import AuthContext from '@/contexts/AuthContext';
import { getUserById } from '@/lib/ApiAdapter';
import { useSearchParams } from 'next/navigation';
import ParaText from '@/app/commonUl/ParaText';
import ErrorHandler from '@/lib/ErrorHandler';
import './style.css'
import Titles from '@/app/commonUl/Titles';
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

				} catch (error) {
					ErrorHandler.showNotification(error);
				}
			}
		}

		fetchData();
	}, [searchParams]);

	return (
		<>
			<Row gutter={[16, 16]} className='heightVh'>
				<Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
					<div className="loginSection"></div >
				</Col>
				<Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
					<div className="loginFormLogin">
						<div className="textCenter">

							<Link href="/">
								{/* <Image src="/images/smart/logo.png" alt="logo" width={300} height={100} preview={false} /> */}
								<HeaderLogo />
							</Link>
						</div>
						<Titles level={5} color="black" className="textUppercase textCenter">
							Lock Screen
						</Titles>
						<div className="gapMarginTop"></div>
						<Form
							name="normal_login"
							className="login-form"
							initialValues={{ remember: true }}
							onFinish={onFinish}
							form={form}
							style={{ paddingTop: '20px' }}
						>
							<div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
								<Space>

									{userData?.image ? (
										<Image
											src={
												userData?.image
													? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/original/${userData?.image}`
													: `/images/avatar.png`
											}
											alt="Avatar"
											width="40px"
											height="40px"
											style={{ borderRadius: '50px' }}
											preview={false}
										/>
									) : (
										<UserOutlined style={{ fontSize: 40 }} />
									)}
								</Space>

								<ParaText size="small" fontWeightBold={400} color="black">
									{userData?.email}
								</ParaText>
							</div>

							<div className="gapMarginTopOne"></div>
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
								/>
							</Form.Item>

							<Form.Item>
								<Button type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%' }}>
									{loading ? 'Please wait...' : 'Unlock'}
								</Button>
							</Form.Item>
						</Form>
						<div style={{ textAlign: 'center', marginTop: '20px' }}>
							<span>
								Not You?{' '}
								<Link href={`${locale !== 'en' ? `/${locale}` : ''}/login`} >
									Login here
								</Link>
							</span>
						</div>

					</div>
				</Col>
			</Row >
		</>
	);
};

export default LockScreen;
