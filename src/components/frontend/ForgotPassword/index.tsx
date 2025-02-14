'use client';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Form, message, Image, Input, Button } from 'antd';
import './style.css'
import Link from 'next/link';
import AuthContext from '@/contexts/AuthContext';
import {
	forgetEmailPassword,
	generateCaptcha
} from '@/lib/ApiAdapter';
import { useRouter } from 'next/navigation';
import ErrorHandler from '@/lib/ErrorHandler';
import HeaderLogo from '../HeaderLogo';
import { InputRef } from 'antd';
import { TbRefresh } from "react-icons/tb";

const ForgotPassword = () => {
	const { locale } = useContext(AuthContext)
	const [form] = Form.useForm();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [captcha, setCaptcha] = useState('');
	const [captchaKey, setCaptchaKey] = useState('');
	const inputFocus = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (inputFocus.current) {
			inputFocus.current.focus();
		}
		fetchCaptcha();
	}, []);

	const fetchCaptcha = async () => {
		try {
			const res = await generateCaptcha();

			if (res?.captchaSvg && res?.captchaKey) {
				setCaptcha(res.captchaSvg);
				setCaptchaKey(res.captchaKey);

			} else {
				console.error('Captcha response is invalid:', res);
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
			console.error('Captcha fetch error:', error);
		}
	};

	const resetPassword = async (values: { email: string; captcha: string }) => {
		try {
			setLoading(true);
			if (!values.captcha || !captchaKey) {
				message.error('Please enter the correct captcha.');
				setLoading(false);
				return;
			}
			const res = await forgetEmailPassword({
				email: values.email,
				captcha: values.captcha,
				captchaKey,
			});
			if (res) {
				message.success('Email sent successfully! Please check your email.');
				form.resetFields();
				router.push(`${process.env['NEXT_PUBLIC_SITE_URL']}/login`);
			} else {
				message.error('Failed to reset password. Please try again.');
			}
		} catch (error) {
			fetchCaptcha();
			setLoading(false);
			ErrorHandler.showNotification(error);
			console.error('Password reset error:', error);
		}
	};


	return (
		<>
			<HeaderLogo />

			{/* Main Login Body */}
			<section className="form-body align-v-center">
				<div className="container">
					<h2 className="text-center title-medium fw-semi-bold top-ultra-space bottom-ultra-space ">
						Forgot Password
					</h2>

					<Form
						name="normal_login"
						initialValues={{ remember: true }}
						onFinish={resetPassword}
						className="form-fields"
					>
						<div className="form-auto">
							<label>Email Id :</label>
							<Form.Item
								name="email"
								rules={[
									{
										type: 'email',
										message: 'The input is not valid E-mail!',
									},
									{
										required: true,
										message: 'Please input your E-mail!',
									},
								]}
							>
								<div className="icon-field right-icon">
									<input
										className="field-panel"
										placeholder="Enter email"
										type="email"
										maxLength={50}
										ref={inputFocus}
									/>
									<i className="fa-regular fa-envelope"></i>
								</div>
							</Form.Item>


							<label>Captcha:</label>
							<div
								className="captcha-container"
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '10px',
								}}
							>
								<span
									className="captcha"
									style={{
										fontSize: '18px',
										fontWeight: 'bold',
										color: '#333',
										paddingRight: '10px',
									}}
									dangerouslySetInnerHTML={{ __html: captcha }}
								></span>
								<Button
									icon={<TbRefresh />}
									onClick={fetchCaptcha}
									className="refresh-captcha"
									style={{
										padding: '5px',
										fontSize: '18px',
										cursor: 'pointer',
									}}
								/>
								<Form.Item
									name="captcha"
									rules={[
										{
											required: true,
											message: 'Please input the captcha!',
										},
									]}
								>
									<input
										className="field-panel"
										placeholder="Enter captcha"
										style={{
											padding: '5px',
											fontSize: '16px',
											width: '150px',
										}}
										ref={inputFocus}
									/>
								</Form.Item>
							</div>




							<Form.Item>
								<button
									type="submit"
									className="w-100  btn-accent-form top-extra-space hover-effects opacity">

									{loading ? 'Please wait...' : 'Send Me The Link'}

								</button>
							</Form.Item>

							<p className="text-center top-extra-space p-sm">
								Back To{" "}
								<Link href="/login" className="p-sm fw-bold color-accent">
									Login
								</Link>
							</p>
						</div>

					</Form>
				</div >
			</section >


		</>
	);
};

export default ForgotPassword;
