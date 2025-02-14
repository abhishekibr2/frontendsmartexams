import ParaText from '@/app/commonUl/ParaText';
import AuthContext from '@/contexts/AuthContext';
import { updatePassword } from '@/lib/adminApi';
import ErrorHandler from '@/lib/ErrorHandler';
import { LockOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Row } from 'antd';
import React, { useContext } from 'react';

import { setLoading } from '@/redux/reducers/resetPassword';

interface formValues {
	password: string;
	confirmPassword: string;
}

import validatorPassword from '../../../../commonUI/PasswordValidator';
// import { useSocket } from '@/contexts/SocketMessage';
import { useDispatch } from 'react-redux';

export default function ResetPassword() {
	const { user } = useContext(AuthContext);
	const [form] = Form.useForm();
	// const { sendNotification } = useSocket();
	const dispatch = useDispatch();

	const onFinish = async (values: formValues) => {
		try {
			dispatch(setLoading(true));

			const res = await updatePassword(user?._id, values);
			if (res.status == true) {
				message.success(res.message);
				form.resetFields();
				// sendNotification('Password Updated');
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
			setLoading(false);
		}
	};

	return (
		<>
			<ParaText size="large" fontWeightBold={600} color="PrimaryColor">
				Reset Password
			</ParaText>
			<div className="smallTopMargin"></div>
			<Form layout="vertical" form={form} size="large" onFinish={onFinish}>
				<Row>
					<Col xl={8} lg={8} md={8} sm={24} xs={24}>
						<Row gutter={10}>
							<Col xl={24} md={24} sm={24} xs={24} className="MarginBottomXMobile">
								<Form.Item
									name="currentPassword"
									rules={[
										{
											required: true,
											message: 'Please enter current Password!'
										}
									]}
								>
									<Input.Password
										prefix={<LockOutlined className="site-form-item-icon" />}
										type="password"
										placeholder="Enter current password"
										maxLength={20}
									/>
								</Form.Item>
							</Col>
							<Col xl={24} lg={24} md={24} sm={24} xs={24}>
								<Form.Item
									name="newPassword"
									rules={[
										{ required: true, message: 'Please input your new Password!' },
										{ validator: validatorPassword }
									]}
								>
									<Input.Password
										prefix={<LockOutlined className="site-form-item-icon" />}
										type="password"
										placeholder="Enter new password"
										maxLength={15}
									/>
								</Form.Item>
							</Col>

							<Col xl={24} lg={24} md={24} sm={24} xs={24}>
								<Form.Item
									name="confirmPassword"
									dependencies={['newPassword']}
									rules={[
										{ required: true, message: 'Please confirm your Password!' },
										({ getFieldValue }) => ({
											validator(_, value) {
												if (!value || getFieldValue('newPassword') === value) {
													return Promise.resolve();
												}
												return Promise.reject(new Error('The two passwords do not match!'));
											}
										})
									]}
								>
									<Input.Password
										prefix={<LockOutlined className="site-form-item-icon" />}
										type="password"
										placeholder="Enter confirm Password"
										maxLength={20}
									/>
								</Form.Item>
							</Col>
							<Col md={24} style={{ textAlign: 'end' }}>
								<Button type="primary" htmlType="submit">
									Submit
								</Button>
							</Col>
						</Row>
					</Col>
				</Row>
			</Form>
		</>
	);
}
