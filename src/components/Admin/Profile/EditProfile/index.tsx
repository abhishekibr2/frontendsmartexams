'use client';
import ParaText from '@/app/commonUl/ParaText';
import { Button, Col, Form, Input, message, Row, Upload, UploadFile } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import ErrorHandler from '@/lib/ErrorHandler';
import { validationRules } from '@/lib/validations';
import AuthContext from '@/contexts/AuthContext';
import { RcFile } from 'antd/es/upload';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { handleFileCompression } from '@/lib/commonServices';
import { updateProfileDetails } from '@/lib/adminApi';
import './style.css';
// import { useSocket } from '@/contexts/SocketMessage';
import { setPhone, setCountry, setLoading, resetProfile, setProfile } from '@/redux/reducers/profileReducer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
interface Props {
	activeKey?: string;
}

interface formData {
	name: string;
	email: string;
	phoneNumber: string;
	country: string;
	state: string;
	image: UploadFile[];
}
interface CountryData {
	name: string;
}
export default function Brands({ activeKey }: Props) {
	const { user, setUser } = useContext(AuthContext);
	const [form] = Form.useForm();
	// const { sendNotification } = useSocket();
	const phone = useSelector((state: RootState) => state.profileReducer.phone);
	const country = useSelector((state: RootState) => state.profileReducer.country);
	const loading = useSelector((state: RootState) => state.profileReducer.loading);
	const profile = useSelector((state: RootState) => state.profileReducer.profile);

	const dispatch = useDispatch();
	const handlePhoneChange = (value: string, countryData: CountryData) => {
		form.setFieldsValue({ country: countryData.name });
		dispatch(setPhone(value));
		dispatch(setCountry(countryData.name));
	};

	useEffect(() => {
		if (user) {
			form.setFieldsValue({
				name: user.name,
				email: user.email,
				phoneNumber: user.phoneNumber,
				country: user?.address?.country,
				state: user?.address?.state
			});
			// Set profile state based on user image
			if (user.image) {
				dispatch(
					setProfile([
						{
							uid: '-1',
							name: user.image,
							status: 'done',
							url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/userImage/medium/${user.image}`
						}
					])
				);
			} else {
				dispatch(resetProfile());
			}
		}
	}, [user, activeKey]);

	const onfinish = async (values: formData) => {
		try {
			dispatch(setLoading(true));
			const formData = new FormData();
			if (profile && profile.length > 0 && profile[0]?.originFileObj) {
				const file = profile[0].originFileObj as File;
				formData.append('image', file);
			}

			formData.append('name', values.name);
			// formData.append('email', 'admin@gmail.com');
			formData.append('email', user?.roleId?.roleName === 'admin' ? 'admin@gmail.com' : values.email);
			formData.append('phoneNumber', values.phoneNumber);
			formData.append('country', values.country);
			formData.append('state', values.state);
			formData.append('userId', user?._id || '');

			const res = await updateProfileDetails(formData);
			if (res.status == true) {
				// sendNotification(`Profile updated `);
				setUser(res.brand);
				message.success(res.message);
				dispatch(setLoading(false));

				setUser(res.brand);
			}
		} catch (error) {
			dispatch(setLoading(false));
			ErrorHandler.showNotification(error);
		}
	};

	const handleBeforeUpload = async (file: RcFile) => {
		try {
			const compressedFiles = await handleFileCompression(file, '');

			const updatedProfile = compressedFiles.map((file) => ({
				...file,
				thumbUrl: file.url || ''
			}));

			dispatch(setProfile(updatedProfile));

			return false;
		} catch (error) {
			ErrorHandler.showNotification(error);
			return true;
		}
	};

	const handleRemove = () => {
		dispatch(resetProfile());
	};
	const uploadButton = (
		<div>
			<PlusOutlined />
			<div style={{ marginTop: 8 }}>Upload</div>
		</div>
	);
	return (
		<>
			<ParaText size="large" fontWeightBold={600} color="PrimaryColor">
				Profile Details
			</ParaText>
			<div className="smallTopMargin"></div>
			<Form layout="vertical" form={form} size="large" onFinish={onfinish}>
				<Row>
					<Col xl={8} lg={8} md={8} sm={24} xs={24}>
						<Row gutter={10}>
							<Col xl={24} lg={24} md={24} sm={24} xs={24}>
								<Form.Item
									name={'name'}
									label={'Name'}
									rules={[
										{
											required: true,
											message: 'Please enter name'
										},
										{
											max: validationRules.textLength.maxLength,
											message: `Please Enter Name`,
											validator: (_, value) => {
												if (!value || !value.trim()) {
													return Promise.reject(new Error('Name cannot be empty '));
												}
												return Promise.resolve();
											}
										},
										{ pattern: /^[A-Za-z\s]+$/, message: 'Please enter only alphabets!' }
									]}
								>
									<Input
										placeholder="Enter name"
										type="text"
										maxLength={30}
										style={{ textTransform: 'capitalize' }}
									/>
								</Form.Item>
							</Col>
							<Col xl={24} lg={24} md={24} sm={24} xs={24}>
								<Form.Item
									name={'email'}
									label="Email"
									rules={[
										{
											required: true,
											message: 'Please enter email',
											type: 'email'
										}
									]}
								>
									<Input
										placeholder="Enter email"
										type="email"
										maxLength={50}
										disabled
										defaultValue={user?.roleId?.roleName == 'admin' ? 'admin@gmail.com' : ''}
									/>
								</Form.Item>
							</Col>
							<Col xl={24} lg={24} md={24} sm={24} xs={24}>
								<Form.Item
									name={'phoneNumber'}
									label="Phone Number"
									rules={[
										{
											required: true,
											message: 'Please enter phone number'
										}
									]}
								>
									<PhoneInput country={'us'} value={phone} onChange={handlePhoneChange} />
								</Form.Item>
							</Col>
							<Col xl={24} lg={24} md={24} sm={24} xs={24}>
								<Form.Item
									name={'country'}
									label="Country"
									rules={[
										{
											required: true,
											message: 'Please enter country'
										},
										{
											pattern: /^[a-zA-Z\s]+$/, // Pattern for alphabetic characters and spaces
											message: 'Country must only contain letters and spaces.'
										}
									]}
								>
									<Input
										placeholder="Enter country"
										type="text"
										maxLength={30}
										value={country}
									// readOnly
									/>
								</Form.Item>
							</Col>
							<Col xl={24} lg={24} md={24} sm={24} xs={24}>
								<Form.Item
									name={'state'}
									label="State"
									rules={[
										{
											required: true,
											message: 'State is required.'
										},
										{
											pattern: /^[a-zA-Z\s]+$/, // Pattern for alphabetic characters and spaces
											message: 'State must only contain letters and spaces.'
										}
									]}
								>
									<Input placeholder="Enter state" type="text" maxLength={50} />
								</Form.Item>
							</Col>
							<Col lg={12} xl={12} md={12} sm={24} xs={24}>
								<Form.Item name={'image'} label="Profile Image" className="upload-container">
									<Upload
										listType="picture-card"
										fileList={profile}
										onRemove={handleRemove}
										beforeUpload={handleBeforeUpload}
										accept=".jpg,.jpeg,.png"
									>
										{profile.length >= 1 ? null : uploadButton}
									</Upload>
								</Form.Item>
							</Col>
							<Col lg={12} xl={12} md={12} sm={24} xs={24} style={{ width: '50px', top: '86px' }}>

								<div >
									<Button type="primary" onClick={() => form.submit()}>
										Submit
									</Button>
								</div>
							</Col>

						</Row>
						<Row>

						</Row>
					</Col>
				</Row>
			</Form>
		</>
	);
}
