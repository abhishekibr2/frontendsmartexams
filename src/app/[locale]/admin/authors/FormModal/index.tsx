'use client';
import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Select, Upload, message, notification } from 'antd';
import { RcFile, UploadFile } from 'antd/es/upload/interface';
import { updateAuthor } from '@/lib/adminApi';
import { PlusOutlined } from '@ant-design/icons';
import FormInput from '@/app/commonUl/FormInput';
import { handleFileCompression } from '@/lib/commonServices';
import ErrorHandler from '@/lib/ErrorHandler';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setAuthors, setShowAuthorForm } from '@/redux/reducers/authorReducer';
import { RootState } from '@/redux/store';
import { validationRules } from '@/lib/validations';

interface AuthorFormValues {
	name: string;
	designation: string;
	gender: 'male' | 'female' | 'others';
	status: 'active' | 'inactive';
	description?: string;
	linkedin?: string;
	facebook?: string;
	twitter?: string;
	instagram?: string;
}

export default function FormModal() {
	const dispatch = useAppDispatch();
	const { authors, currentAuthor } = useAppSelector((state: RootState) => ({
		authors: state.authorReducer.authors,
		currentAuthor: state.authorReducer.currentAuthor,
	}));

	const [form] = Form.useForm<AuthorFormValues>();
	const [authorId, setAuthorId] = useState<string | undefined>(currentAuthor?._id || '');
	const [fileList, setFileList] = useState<UploadFile[]>([]);

	useEffect(() => {
		if (currentAuthor) {
			setAuthorId(currentAuthor._id);
			form.setFieldsValue(currentAuthor as {});
			if (currentAuthor.profileImage) {
				setFileList([
					{
						uid: '1',
						name: currentAuthor.profileImage,
						status: 'done',
						url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/authors/medium/${currentAuthor.profileImage}`,
					},
				]);
			}
		} else {
			setAuthorId('');
			form.resetFields();
			setFileList([]);
		}
	}, [currentAuthor, form]);

	const onFinish = async (values: AuthorFormValues) => {
		try {
			const formData = new FormData();

			if (fileList[0]?.originFileObj) {
				formData.append('profileImage', fileList[0].originFileObj as Blob);
			} else if (fileList[0]?.name) {
				formData.append('profileImage', fileList[0].name);
			}

			Object.entries(values).forEach(([key, value]) => {
				if (key === 'name' && value) {
					formData.append(key, value.replace(/\b\w/g, (char: string) => char.toUpperCase()));
				} else if (value) {
					formData.append(key, value.toString());
				}
			});

			formData.append('authorId', authorId || '');

			const res = await updateAuthor(formData);
			if (res.status === true) {
				const updatedData = authorId
					? authors.map((author) => (author._id === authorId ? res.data : author))
					: [res.data, ...authors];

				dispatch(setAuthors(updatedData));
				dispatch(setShowAuthorForm(false));
				form.resetFields();
				notification.success({ message: res.message });
				setFileList([]);
			}
		} catch (error) {
			message.error('Failed to update author');
		}
	};

	const handleBeforeUpload = async (file: RcFile) => {
		try {
			const compressedFiles = await handleFileCompression(file, '');
			setFileList(compressedFiles);
			return false;
		} catch (error) {
			ErrorHandler.showNotification(error);
			return false;
		}
	};

	const handleRemove = () => {
		setFileList([]);
	};

	const uploadButton = (
		<div>
			<PlusOutlined />
			<div style={{ marginTop: 8 }}>Upload</div>
		</div>
	);


	return (
		<>
			<Form
				layout="vertical"
				form={form}
				onFinish={onFinish}
				initialValues={{
					name: '',
					designation: '',
					gender: 'male',
					status: 'active',
					description: '',
					linkedin: '',
					facebook: '',
					twitter: '',
					instagram: ''
				}}
			>
				<Row gutter={[16, 16]} align={'middle'}>
					<Col xl={12} md={12} sm={24} xs={24}>
						<Form.Item
							name="name"
							label="Name"
							rules={[
								{
									required: true,
									pattern: /^[A-Za-z\s]*$/,
									message:
										'Please ensure that your input does not contain numbers or special characters!'
								}
							]}
						>
							<FormInput
								className="textCapitalize"
								placeHolder="Please enter name"
								type="text"
								maxLength={50}
							/>
						</Form.Item>
					</Col>
					<Col xl={12} md={12} sm={24} xs={24}>
						<Form.Item
							name="designation"
							label="Designation"
							rules={[
								{
									required: true,
									message: 'Please enter designation!'
								}
							]}
						>
							<FormInput placeHolder="Please enter designation" type="text" maxLength={100} />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={[16, 16]} align={'middle'}>
					<Col xl={12} md={12} sm={24} xs={24}>
						{' '}
						<Form.Item
							name="linkedin"
							label="Linkedin Url"
							rules={[
								{
									pattern: validationRules.linkedinURL.pattern,
									message: 'Please enter a valid URL!'
								}
							]}
						>
							<FormInput placeHolder="https://www.linkedin.com" type="url" maxLength={150} />
						</Form.Item>{' '}
					</Col>

					<Col xl={12} md={12} sm={24} xs={24}>
						{' '}
						<Form.Item name="facebook" label="Facebook Url"
							rules={[
								{
									pattern: validationRules.facebookURL.pattern,
									message: 'Please enter a valid URL!'
								}
							]}
						>
							<FormInput placeHolder="https://www.facebook.com" type="url" maxLength={150} />
						</Form.Item>{' '}
					</Col>
				</Row>

				<Row gutter={[16, 16]} align={'middle'}>
					<Col xl={12} md={12} sm={24} xs={24}>
						{' '}
						<Form.Item name="twitter" label="Twitter Url"
							rules={[
								{
									pattern: validationRules.twitterURL.pattern,
									message: 'Please enter a valid URL!'
								}
							]}
						>
							<FormInput placeHolder="https://www.twitter.com" type="url" maxLength={150} />
						</Form.Item>{' '}
					</Col>

					<Col xl={12} md={12} sm={24} xs={24}>
						{' '}
						<Form.Item name="instagram" label="Instagram Url"
							rules={[
								{
									pattern: validationRules.instagramURL.pattern,
									message: 'Please enter a valid URL!'
								}
							]}
						>
							<FormInput placeHolder="https://www.instagram.com" type="url" maxLength={150} />
						</Form.Item>{' '}
					</Col>
				</Row>

				<Row gutter={[16, 16]}>
					<Col xl={4} md={4} sm={24} xs={24}>
						<Upload
							action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
							listType="picture-card"
							fileList={fileList}
							onRemove={handleRemove}
							beforeUpload={handleBeforeUpload}
							accept=".jpg,.jpeg,.png"
						>
							{fileList.length >= 1 ? null : uploadButton}
						</Upload>
					</Col>
					<Col xl={8} md={8} sm={24} xs={24}>
						<Form.Item
							name="gender"
							label="Gender"
							rules={[
								{
									required: true,
									message: 'Please enter gender!'
								}
							]}
						>
							<Select defaultValue="male" style={{ height: '40px' }}>
								<Select.Option value="male">Male</Select.Option>
								<Select.Option value="female">Female</Select.Option>
								<Select.Option value="others">Others</Select.Option>
							</Select>
						</Form.Item>{' '}
						<Form.Item
							name="status"
							label="Author Status"
							rules={[
								{
									required: true,
									message: 'Please enter author status!'
								}
							]}
						>
							<Select defaultValue="active" style={{ height: '40px' }}>
								<Select.Option value="active">Active</Select.Option>
								<Select.Option value="inactive">Inactive</Select.Option>
							</Select>
						</Form.Item>{' '}
					</Col>

					<Col lg={12} md={12} sm={24} xs={24}>
						<Row justify="end" align="middle" style={{ height: '100%', padding: '0px' }}>
							<Col lg={12} md={12} sm={24} xs={24}>
								<Button
									type="primary"
									className="w100"
									htmlType="submit"
									style={{ padding: '0', width: '100%', display: 'block' }}
								>
									Save Author Information
								</Button>
							</Col>
						</Row>
					</Col>
				</Row>
			</Form>
		</>
	);
}

