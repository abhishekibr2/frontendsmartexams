'use client';
import { useState } from 'react';
import { matchEmailOtp } from '@/lib/ApiAdapter';
import ErrorHandler from '@/lib/ErrorHandler';
import { Button, notification, Typography, Spin } from 'antd';
import './style.css'

interface OTPInputProps {
	id: any;
	previousId: any;
	nextId: any;
	value: any;
	onValueChange: any;
	handleSubmit: any;
}

interface Props {
	onClose?: any;
	onResend?: any;
	userEmail?: string;
	onCancel?: any;
	userPhone?: any;
	onSkip?: any;
}

const VerificationModal = ({ onClose, userEmail, onResend, onSkip, onCancel, userPhone }: Props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingTwo, setIsLoadingTwo] = useState(false);
	const [countdown, setCountdown] = useState(60);
	const [inputValues, setInputValues] = useState({
		input1: '',
		input2: '',
		input3: '',
		input4: ''
	});

	const handleInputChange = (inputId: any, value: any) => {
		if (value === null || value === '') {
			setInputValues((prevInputValues) => ({
				...prevInputValues,
				[inputId]: ''
			}));
		} else {
			setInputValues((prevInputValues) => ({
				...prevInputValues,
				[inputId]: value
			}));
		}
	};

	const handleSubmit = async () => {
		setIsLoading(true);
		const otp = Object.values(inputValues).join('');

		if (otp.length < 4) {
			notification.error({ message: 'Please fill in all OTP fields' });
			setIsLoading(false);
			return;
		}

		const data = {
			otp: otp,
			email: userEmail,
			phoneNumber: userPhone
		};

		try {
			const res: any = await matchEmailOtp(data);
			if (res) {
				onClose(res.user);
				setIsLoading(false);
				setInputValues({
					input1: '',
					input2: '',
					input3: '',
					input4: ''
				});
			}
		} catch (error) {
			setIsLoading(false);
			setInputValues({
				input1: '',
				input2: '',
				input3: '',
				input4: ''
			});
			document.getElementById('input1')?.focus();
			ErrorHandler.showNotification(error);
		}
	};

	const handleResend = () => {
		setInputValues({
			input1: '',
			input2: '',
			input3: '',
			input4: ''
		});
		setIsLoading(false);
		onResend();
		setIsLoadingTwo(true);
		startCountdown();
	};

	const startCountdown = () => {
		setCountdown(60);
		const timer = setInterval(() => {
			setCountdown((prevCount) => prevCount - 1);
		}, 1000);

		setTimeout(() => {
			clearInterval(timer);
			setIsLoadingTwo(false);
		}, 60000);
	};

	const handleCancel = () => {
		onCancel();
		setInputValues({
			input1: '',
			input2: '',
			input3: '',
			input4: ''
		});
		setIsLoading(false);
		setIsLoadingTwo(false);
	};

	const formatCountdown = (seconds: any) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		const formattedMinutes = String(minutes).padStart(2, '0');
		const formattedSeconds = String(remainingSeconds).padStart(2, '0');
		return `${formattedMinutes}:${formattedSeconds}`;
	};

	const handleSkip = () => {
		onSkip();
	}

	return (
		<div className="verificationModal textCenter">
			<Typography.Title level={3}>Verify Your {userEmail ? 'Email Address' : 'Mobile Number'}</Typography.Title>
			<Typography.Title level={5} type="secondary">
				We&apos;ve sent a four-digit verification code to your <b>{userEmail ? userEmail : userPhone}</b>
				{userEmail ? 'address' : 'number'}. Please enter the code below to confirm your {userEmail ? 'email' : 'phone'}
			</Typography.Title>

			<div className="otpInputContainer">
				<ul className="inputflex">
					<li>
						<OTPInput
							id="input1"
							value={inputValues.input1}
							onValueChange={handleInputChange}
							previousId={null}
							handleSubmit={handleSubmit}
							nextId="input2"
						/>
					</li>
					<li>
						<OTPInput
							id="input2"
							value={inputValues.input2}
							onValueChange={handleInputChange}
							previousId="input1"
							handleSubmit={handleSubmit}
							nextId="input3"
						/>
					</li>
					<li>
						<OTPInput
							id="input3"
							value={inputValues.input3}
							onValueChange={handleInputChange}
							previousId="input2"
							handleSubmit={handleSubmit}
							nextId="input4"
						/>
					</li>
					<li>
						<OTPInput
							id="input4"
							value={inputValues.input4}
							onValueChange={handleInputChange}
							previousId="input3"
							handleSubmit={handleSubmit}
							nextId="input5"
						/>
					</li>
				</ul>
			</div>

			<div className="actionsContainer">
				<Button
					type="primary"
					onClick={handleSubmit}
					disabled={isLoading}
					size="large"
					loading={isLoading}
					className="verifyButton"
				>
					{isLoading ? 'Verifying.....' : 'Verification Code'}
				</Button>

				<p className="resendLink" onClick={isLoadingTwo ? undefined : handleResend}>
					Didn&apos;t receive an OTP?{' '}
					<span style={{ cursor: 'pointer', color: '#0091f7' }}>
						{isLoadingTwo ? `Resend code in: ${formatCountdown(countdown)}` : 'Resend OTP'}
					</span>
				</p>

				<span style={{ cursor: 'pointer', color: '#0091f7' }} onClick={handleSkip}>
					Continue without OTP
				</span>
			</div>
		</div>
	);
};

const OTPInput = ({ id, previousId, nextId, value, onValueChange, handleSubmit }: OTPInputProps) => {
	const handleKeyUp = (e: any) => {
		if (e.keyCode === 8 || e.keyCode === 37) {
			const prev = document.getElementById(previousId);
			if (prev) {
				prev.focus();
			}
		} else if (
			(e.keyCode >= 48 && e.keyCode <= 57) || // Numeric keys
			(e.keyCode >= 96 && e.keyCode <= 105) || // Numpad keys
			e.keyCode === 39 // Right arrow key
		) {
			const next = document.getElementById(nextId);
			if (next) {
				next.focus();
			} else {
				handleSubmit();
			}
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = e.target.value;
		const numericValue = inputValue.replace(/\D/g, ''); // Remove non-numeric characters
		onValueChange(id, numericValue);
	};

	return (
		<input
			id={id}
			name={id}
			type="text"
			value={value}
			maxLength={1}
			onChange={handleInputChange}
			onKeyUp={handleKeyUp}
			className="otpInputField"
		/>
	);
};

export default VerificationModal;
