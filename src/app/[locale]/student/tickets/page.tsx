'use client';
import React, { useContext, useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Row, Select, Upload, UploadFile } from 'antd';
import OpenModal from '@/app/commonUl/OpenModal';
import TextArea from 'antd/es/input/TextArea';
import { validationRules } from '@/lib/validations';
import { RcFile } from 'antd/es/upload';
import ErrorHandler from '@/lib/ErrorHandler';
import AuthContext from '@/contexts/AuthContext';
import { addUpdateTicketDetails, getAllTicketsWithParams } from '@/lib/commonApi';
import { handleFileCompression } from '@/lib/commonServices';
const { Option } = Select;

export default function Page() {
	const [modalPopup, setModalPopup] = useState(false); // Modal visibility state
	const [ticketId, setTicketId] = useState('');
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const { user } = useContext(AuthContext);

	// Handling file changes
	const handleChange = ({ fileList: newFileList }: any) => {
		setFileList(newFileList);
	};

	const handleBeforeUpload = async (file: RcFile) => {
		try {
			const compressedFiles = await handleFileCompression(file, '');
			setFileList(compressedFiles);
			return false;
		} catch (error) {
			ErrorHandler.showNotification(error);
			return true;
		}
	};

	const uploadButton = (
		<div>
			<PlusOutlined />
			<div style={{ marginTop: 8 }}>Upload</div>
		</div>
	);
	const handleSubmit = async (values: any) => {
		try {
			setLoading(true);
			const formData = new FormData();
			fileList.forEach((file) => {
				formData.append('image', file.originFileObj as Blob);
			});

			formData.append('ticketId', ticketId || '');
			formData.append('userId', user?._id || '');
			formData.append('creator', user?._id || '');
			formData.append('role', user?.role || '');
			formData.append('title', values.title);
			formData.append('description', values.description);
			formData.append('priority', values.priority);

			const res = await addUpdateTicketDetails(formData);
			if (res.status === true) {
				message.success(res.message);
				form.resetFields();
				setFileList([]);
				setLoading(false);
				setModalPopup(false);
				// accessChat(values.title, values.description)
			}
			setLoading(false);
		} catch (error) {
			setLoading(false);
			ErrorHandler.showNotification(error);
		}
	};

	return (
		<>
			<div>
				{/* Modal for adding/editing ticket */}
				<OpenModal
					title={<span style={{ fontSize: '20px' }}>{ticketId ? 'Edit Ticket' : 'Add Ticket'}</span>}
					width={740}
					open={modalPopup}
					onClose={() => setModalPopup(false)}
				>
					<div>
						<Form
							onFinish={handleSubmit}
							form={form}
							layout="vertical"
							size="large"
							initialValues={{ status: 'active' }}
						>
							<Row gutter={16}>
								<Col lg={12} md={12} sm={24} xs={24}>
									<Form.Item
										label="Title"
										name="title"
										rules={[
											{
												required: true,
												message: 'Please enter title'
											},
											{
												max: validationRules.textLongLength.maxLength,
												message: `Title must be at most ${validationRules.textLongLength.maxLength} characters`
											}
										]}
									>
										<Input type="text" placeholder="Enter Title" />
									</Form.Item>
								</Col>
								<Col lg={12} md={12} sm={24} xs={24}>
									<Form.Item label="Priority" name="priority">
										<Select placeholder="Select Priority">
											<Option value="low">Low</Option>
											<Option value="medium">Medium</Option>
											<Option value="high">High</Option>
										</Select>
									</Form.Item>
								</Col>
							</Row>
							<div className="mediumTopMargin" />
							<Row gutter={16}>
								<Col lg={24} md={24} sm={24} xs={24}>
									<Form.Item
										label="Description"
										name="description"
										rules={[
											{
												required: true,
												message: 'Please enter description'
											},
											{
												max: validationRules.textEditor.maxLength,
												message: `Description must be at most ${validationRules.textEditor.maxLength} characters`
											}
										]}
									>
										<TextArea
											placeholder="Enter description"
											autoSize={{ minRows: 5, maxRows: 8 }}
										/>
									</Form.Item>
								</Col>

								<Col lg={12} md={12} sm={24} xs={24}>
									<Form.Item name="image" label="Image">
										<Upload
											action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-330c5e6a2138"
											listType="picture-card"
											fileList={fileList}
											onChange={handleChange}
											beforeUpload={handleBeforeUpload}
											accept=".jpg,.jpeg,.png"
										>
											{fileList.length >= 1 ? null : uploadButton}
										</Upload>
									</Form.Item>
								</Col>

								<Col lg={12} md={12} sm={24} xs={24} className="textEnd">
									<div style={{ paddingTop: '6rem' }}>
										<Button htmlType="submit" loading={loading} type="primary">
											{loading ? 'Please wait' : 'Submit Ticket Details'}
										</Button>
									</div>
								</Col>
							</Row>
						</Form>
					</div>
				</OpenModal>
			</div>
		</>
	);
}
