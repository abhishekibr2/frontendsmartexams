"use client"
import React, { useContext, useState, useRef, useEffect } from 'react';
import { Form, message, Modal, Image, InputRef, Input, Button } from 'antd';
import Link from 'next/link';
import AuthContext from '@/contexts/AuthContext';
//@ts-ignore
import { useRouter } from 'nextjs-toploader/app';
// import { register, sendEmailVerification } from '@/lib/ApiAdapter';
import { generateCaptcha, register, sendEmailVerification, socialLogin } from '@/lib/ApiAdapter';
import { signIn, signOut, useSession } from 'next-auth/react';
import Cookies from 'js-cookie';
import ErrorHandler from '@/lib/ErrorHandler';
import VerificationModal from '@/app/commonUl/VerificationModal';
import './style.css';
import HeaderLogo from '../HeaderLogo';
import { TbRefresh } from 'react-icons/tb';


interface FormData {
	fullName?: string;
	email?: string;
	password?: string;
	confirmPassword?: string;
}

const Register = () => {
	const [form] = Form.useForm();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [verificationModal, setVerificationModal] = useState(false);
	const [userEmail, setEmail] = useState('');
	const [formData, setFormData] = useState<FormData | undefined>(undefined);
	const [fullName, setFullName] = useState('');
	const [lastName, setLastName] = useState('');
	const focusInput = useRef<InputRef>(null)
	const { login, setUser, locale } = useContext(AuthContext);
	const { data: session } = useSession();
	const [isLogin, setIsLogin] = useState(false);
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [confimrpasswordVisible, setConfirmPasswordVisible] = useState(false);
	const [captcha, setCaptcha] = useState('');
	const [captchaKey, setCaptchaKey] = useState('');
	const inputFocus = useRef<HTMLInputElement>(null);


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

	const onFinish = async (values: { email: string; captcha?: string }) => {
		try {
			setLoading(true);
			setEmail(values.email);
			const payload = {
				...values,
				captchaKey,
			};
			setFormData(payload);
			await sendEmailVerification(payload).then(() => {
				setLoading(false);
				setVerificationModal(true);
			});
		} catch (error) {
			fetchCaptcha();
			setLoading(false);
			setVerificationModal(false);
			ErrorHandler.showNotification(error);
		}
	};

	useEffect(() => {
		if (session) {
			SocialData(session.user);
		}
		if (focusInput.current) {
			focusInput.current.focus();
		}
		fetchCaptcha()
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
					message.success('You are logged in!');
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
				ErrorHandler.showNotification(err);
			});
	};



	const handleGoogleLogin = async () => {
		try {
			await signIn('google');
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	};

	const handleResendOtp = () => {
		if (formData && formData.email) {
			onFinish({ email: formData.email });
		} else {
			console.log('Email is missing');
		}
	};


	const handleOtp = async () => {
		try {
			message.success('OTP matched successfully');
			setVerificationModal(false);
			await handleRegister();
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	};

	const handleSkip = async () => {
		setVerificationModal(false);
		await handleRegister();
	};


	const handleRegister = async () => {
		try {
			if (!formData?.email || !formData?.password) {
				message.error('Please provide both email and password.');
				return;
			}
			setLoading(true);
			const res = await register(formData);
			if (res.status === true) {
				message.success(res.message);
				form.resetFields();
				const token = await login(formData?.email, formData?.password, '');
				if (token) {
					Cookies.set('session_token', token); // Save login token
				}
			} else {
				message.error(res.message);
			}
		} catch (error) {
			message.error('Failed to register. Please try again later.');
		} finally {
			setLoading(false);
		}
	};

	const handleFullNameChange = (e: { target: { value: string; }; }) => {
		let { value } = e.target;
		value = value.replace(/\b\w/g, (char: string) => char.toUpperCase());
		setFullName(value);
	};
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === ' ') {
			e.preventDefault();
		}
	};
	const handleLastNameChange = (e: { target: { value: string; }; }) => {
		let { value } = e.target;
		value = value.replace(/\b\w/g, (char: string) => char.toUpperCase());
		setLastName(value);
	};

	useEffect(() => {

		if (focusInput.current) {
			focusInput.current.focus();
		}
	}, []);

	return (
		<>
			<HeaderLogo />
			<section className="form-body">
				<div className="container">
					<h2 className="text-center title-medium fw-semi-bold top-ultra-space bottom-ultra-space ">
						Create an account
					</h2>
					<Form className="form-fields signup-width"
						name="normal_register"
						initialValues={{ remember: true }}
						onFinish={onFinish}
						form={form}
					>
						<div className="row p-0">
							<div className="col-sm-6">
								<label>First name</label>
								<Form.Item
									name="name"
									rules={[
										{ required: true, message: 'Please input your Full Name!' },
										{ pattern: /^[A-Za-z\s]+$/, message: 'Please enter only alphabets!' },
									]}
								>
									<Input
										ref={focusInput}
										type="text"
										className="field-panel"
										placeholder="Enter First Name"
										maxLength={30}
										value={fullName}
										onChange={handleFullNameChange}
										onKeyDown={handleKeyDown}

									/>
								</Form.Item>
							</div>
							<div className="col-sm-6">
								<label>Last name</label>
								<Form.Item
									name="lastName"
									rules={[
										{ required: true, message: 'Please input your Last Name!' },
										{ pattern: /^[A-Za-z\s]+$/, message: 'Please enter only alphabets!' },
									]}
								>
									<Input
										type="text"
										className="field-panel"
										placeholder="Enter Last Name"
										maxLength={30}
										value={lastName}
										onChange={handleLastNameChange}
										onKeyDown={handleKeyDown}
									/>
								</Form.Item>
							</div>
							<div className="col-sm-12">
								<label>Email</label>
								<div className='icon-field right-icon'>
									<Form.Item
										name="email"
										rules={[
											{ required: true, message: 'Please input your Email!' },
											{ type: 'email', message: 'The input is not a valid email!' },
										]}
									>
										<Input
											className="field-panel"
											placeholder="Enter email"
											type="email"
											maxLength={50}
										/>
									</Form.Item>
									<i className="fa-regular fa-envelope"></i>
								</div>
							</div>
							<div className="col-sm-6 ">
								<label>Password</label>
								<div className='icon-field right-icon'>
									<Form.Item
										name="password"
										rules={[
											{ required: true, message: "Please enter password!" },
											{
												pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^~`#])[A-Za-z\d@$!%*?&^~`#]{8,}$/,
												message:
													'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.',
											},
										]}
									>
										<Input
											className="field-panel"
											placeholder="Enter your password"
											type={passwordVisible ? 'text' : 'password'}
											maxLength={20}
										/>
									</Form.Item>
									<i
										className={`fa-solid ${passwordVisible ? 'fa-solid fa-unlock' : 'fa-solid fa-lock'}`}
										onClick={() => setPasswordVisible(!passwordVisible)}
										style={{ cursor: 'pointer' }}
									/>
								</div>
							</div>
							<div className="col-sm-6">
								<label>Confirm password</label>
								<div className='icon-field right-icon'>
									<Form.Item
										name="confirmPassword"
										dependencies={['password']}
										rules={[
											{ required: true, message: 'Please confirm your Password!' },
											({ getFieldValue }) => ({
												validator(_, value) {
													if (!value || getFieldValue('password') === value) {
														return Promise.resolve();
													}
													return Promise.reject(new Error('The two passwords do not match!'));
												},
											}),
										]}
									>
										<Input
											className="field-panel"
											placeholder="Re-write password"
											type={confimrpasswordVisible ? 'text' : 'password'}
											maxLength={20}
										/>
									</Form.Item>
									<i
										className={`fa-solid ${confimrpasswordVisible ? 'fa-solid fa-unlock' : 'fa-solid fa-lock'}`}
										onClick={() => setConfirmPasswordVisible(!confimrpasswordVisible)}
										style={{ cursor: 'pointer' }}
									/>
								</div>
							</div>
							<div className="col-sm-6">
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
							</div>
						</div>
						<label className="check-box-leabel">
							<input type="checkbox" /> Remember me
						</label>
						<Form.Item
							name="terms"
							valuePropName="checked"
							rules={[
								{
									validator: (_, value) =>
										value
											? Promise.resolve()
											: Promise.reject(new Error('You must agree to the Terms and Privacy Policy.')),
								},
							]}
						>
							<label className="check-box-leabel">
								<input type="checkbox" /> I agree to all the{" "}
								<Link href="/terms-of-service" className="p-sm fw-bold color-aqua-steel ">
									Terms{" "}
								</Link>
								and{" "}
								<Link href="/privacy-policy" className="p-sm fw-bold color-aqua-steel ">Privacy policy{" "}
								</Link>
							</label>
						</Form.Item>

						<p className="or fw-regular color-dark-gray top-extra-space ottom-extra-space ">
							OR
						</p>
						<div className="row">
							<div className="col-sm-6">
								<button type="submit" className="w-100  btn-accent-form top-extra-space hover-effects opacity btn-small">
									{loading ? 'Please wait...' : 'Create account'}
								</button>
							</div>
							<div className="col-sm-6">
								<Link href="#" className="w-100  btn-accent-form top-extra-space hover-effects opacity btn-small bg-Zblack"
									onClick={handleGoogleLogin}
								>
									<Image src="/images/smart/g-icon.png" alt="g-icon" preview={false} /> &nbsp;Sign-in with
									google
								</Link>
							</div>
						</div>
						<p className="text-center fw-regular color-dark-gray top-extra-space ottom-extra-space p-sm">
							Already have an account?{" "}
							<Link href="/login" className="p-sm fw-bold color-accent">
								Log In
							</Link>
						</p>
						<br />
					</Form>
				</div>
			</section>
			<Modal
				width={550}
				open={verificationModal}
				footer={false}
				onCancel={() => {
					setVerificationModal(false);
					setLoading(false);
				}}
			>
				<VerificationModal
					userEmail={userEmail}
					onClose={() => handleOtp()}
					onResend={handleResendOtp}
					onCancel={() => {
						setVerificationModal(false);
						setLoading(false);
					}}
					onSkip={handleSkip}
				/>
			</Modal>
		</>

	);
};

export default Register;
