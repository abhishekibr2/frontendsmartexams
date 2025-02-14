import ParaText from '@/app/commonUl/ParaText';
import AuthContext from '@/contexts/AuthContext';
import ErrorHandler from '@/lib/ErrorHandler';
import { updatePassword } from '@/lib/userApi';
import { LockOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Row } from 'antd'
import React, { useContext, useState } from 'react'


interface Props {
    activeKey: string;
}

import validatePassword from '@/commonUI/PasswordValidator';

export default function ResetPassword({ activeKey }: Props) {

    const { user } = useContext(AuthContext);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);


    const userLogin = user?.loginType;

    const onFinish = async (values: string) => {

        try {
            setLoading(true);
            const res = await updatePassword(user?._id, values);
            if (res.status == true) {
                message.success(res.message);
                form.resetFields();
            }
        } catch (error) {

            ErrorHandler.showNotification(error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <ParaText size="large" fontWeightBold={600} color="PrimaryColor" >
                Reset Password
            </ParaText>
            <div className="smallTopMargin mt-3"></div>
            <Form layout='vertical' form={form} size='large' onFinish={onFinish}>
                <Row>
                    <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                        <Row gutter={10}>
                            <Col xl={24} md={24} sm={24} xs={24} className="MarginBottomXMobile">
                                {userLogin ? null : <Form.Item
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
                                </Form.Item>}
                            </Col>
                            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                <Form.Item
                                    name="newPassword"
                                    rules={[
                                        { required: true, message: 'Please input your new Password!' },
                                        { validator: validatePassword },
                                    ]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined className="site-form-item-icon" />}
                                        type="password"
                                        placeholder="Enter new password"
                                        maxLength={20}
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
                                <Button type='primary' htmlType='submit'>Submit</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Form>
        </>
    )
}
