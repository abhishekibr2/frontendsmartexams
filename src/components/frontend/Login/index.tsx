'use client';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Form, Input, message, InputRef } from 'antd';
import Link from 'next/link';
import AuthContext from '@/contexts/AuthContext';
import { signIn, signOut, useSession } from 'next-auth/react';
import Cookies from 'js-cookie';
import { socialLogin } from '@/lib/ApiAdapter';
//@ts-ignore
import { useRouter } from 'nextjs-toploader/app';
import ErrorHandler from '@/lib/ErrorHandler';
import './style.css'
import HeaderLogo from '../HeaderLogo';

interface login {
	email: string;
	password: string;
	remember?: boolean;
}

const Login = () => {
	const [form] = Form.useForm();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const { login, setUser, locale } = useContext(AuthContext);
	const { data: session } = useSession();
	const RememberMeCookieName = 'rememberMe';
	const focusInput = useRef<InputRef>(null)
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [isLogin, setIsLogin] = useState(false);

	const onFinish = async (values: login) => {
		setLoading(true);
		try {
			if (values.remember) {
				Cookies.set(RememberMeCookieName, JSON.stringify({ email: values.email, password: values.password }));
			} else {
				Cookies.remove(RememberMeCookieName);
			}

			await login(values.email, values.password, '');

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			setLoading(false);
		}
		finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (session) {
			SocialData(session.user);
		}
		if (focusInput.current) {
			focusInput.current.focus();
		}
	}, [session]);

	const SocialData = (user: { name?: string | null; email?: string | null; image?: string | null; id?: string | null; } | undefined) => {
		const data = {
			name: user?.name,
			email: user?.email,
			id: user?.id,
		};

		socialLogin(data)
			.then((res) => {
				if (res) {
					Cookies.set('session_token', res.token);
					Cookies.set('roleName', res.user.role);
					setIsLogin(true)
					setUser(res.user);
					signOut({ redirect: false }).then();
					const userRole = res.user.role;
					if (userRole === 'student') {
						const dashboardUrl = `${process.env['NEXT_PUBLIC_SITE_URL']}/${userRole}/dashboard`;
						router.push(dashboardUrl);
					} else {
						console.log("Role is not student");
					}

				} else {
					message.error(res.message);
				}
			})
			.catch((err) => {
				message.error(err);
			});
	};

	useEffect(() => {
		const rememberMeData = Cookies.get(RememberMeCookieName);
		if (rememberMeData) {
			const parsedData = JSON.parse(rememberMeData);
			if (parsedData && parsedData.email) {
				form.setFieldsValue({
					email: parsedData.email,
					password: parsedData.password || '',
					remember: true
				});
			}
		}
	}, []);

	const GoogleLogin = async () => {
		try {
			await signIn('google');
			setIsLogin(true)
		} catch (error) {
			ErrorHandler.showNotification(error);
			message.error('Google sign-in failed. Please try again.');
		}
	};

	return (
		<>

			<HeaderLogo />
			<section className="form-body align-v-center">
				<div className="container">
					<h2 className="text-center title-medium fw-semi-bold top-ultra-space bottom-ultra-space ">
						Login to your account
					</h2>

					<Form
						form={form}
						name="login"
						className="form-fields"
						onFinish={onFinish}
						layout="vertical"
					>
						<div className="form-auto">
							<label>Email Id :</label>
							<div className='icon-field right-icon'>

								<Form.Item
									name="email" rules={[
										{
											type: 'email',
											message: 'The input is not valid E-mail!'
										},
										{
											required: true,
											message: 'Please input your email address!',
										},
										{
											pattern: /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
											message: '',
										},
									]}
									className='icon-field right-icon'
								>
									<Input
										className="field-panel"
										placeholder="Email"
										maxLength={60}
										type='email'
										ref={focusInput}
									/>

								</Form.Item>
								<i className="fa-regular fa-envelope"></i>
							</div>

							<label>Password :</label>
							<div className='icon-field right-icon'>
								<Form.Item
									name="password"
									rules={[
										{ required: true, message: 'Please input your Password!' },
									]}

								>
									<Input
										placeholder="Enter your password"
										className="field-panel"
										maxLength={25}
										type={passwordVisible ? 'text' : 'password'}

									/>

								</Form.Item>
								<i
									className={`fa-solid ${passwordVisible ? 'fa-solid fa-unlock' : 'fa-solid fa-lock'}`}
									onClick={() => setPasswordVisible(!passwordVisible)}
									style={{ cursor: 'pointer' }}
								/>
							</div>

							<p className="text-end top-extra-space">
								<Link href="/forgot-password" className="p-sm fw-bold color-accent">
									Forgot Password?
								</Link>
							</p>

							<Form.Item>
								<button
									type="submit"
									className="w-100  btn-accent-form  hover-effects opacity">
									{loading ? 'Please wait...' : 'Login Now'}
								</button>
							</Form.Item>

							<p className="text-center or top-extra-space">OR</p>


							<div className="row">
								<div className="col-sm-6">
									<Link href="/register" className="w-100 btn-accent-form top-extra-space hover-effects opacity btn-small">Create account</Link>
								</div>
								<div className="col-sm-6">
									<Link
										href="#"
										onClick={GoogleLogin}
										className="w-100 btn-accent-form top-extra-space hover-effects opacity btn-small bg-Zblack"
									>
										<img src="/images/smart/g-icon.png" alt="g-icon" />
										&nbsp;Sign-in with google
									</Link>
								</div>
							</div>

							<p className="text-center fw-regular color-dark-gray top-extra-space ottom-extra-space p-sm">
								Don’t have an account?{" "}
								<Link href="/register" className="p-sm fw-bold color-accent">
									Sign Up
								</Link>
							</p>
						</div>

					</Form>
				</div>
			</section>
		</>
	);
};

export default Login;
