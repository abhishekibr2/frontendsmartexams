'use client';
import React, { useContext, useState } from 'react'
import AuthContext from '@/contexts/AuthContext';
import ErrorHandler from '@/lib/ErrorHandler';
import { updatePassword } from '@/lib/studentApi';
import { Button, Form, message, Input } from 'antd'
import validatePassword from '@/commonUI/PasswordValidator';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import Link from 'next/link';

export default function Page() {
    const { user } = useContext(AuthContext);
    const [form] = Form.useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onFinish = async (values: string) => {

        try {
            const res = await updatePassword(user?._id, values);
            if (res.status == true) {
                message.success(res.message);
                form.resetFields();
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };
    return (
        <>
            <section className="dash-part bg-light-steel ">
                <Form layout='vertical' form={form} size='large' onFinish={onFinish}>

                    <div className="spac-dash">
                        <div className="row">
                            <div className="col-sm-5">
                                <h2 className="top-title">
                                    Change Password
                                </h2>
                            </div>

                        </div>
                        <div className="card-dash spac-mobile-sm mt-3">
                            <div className="row">
                                <div className="col-sm-12">
                                    <label className="p-sm color-dark-gray w-100 bottom-small-space">
                                        Old Password
                                    </label>

                                    <Form.Item
                                        name="currentPassword"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter your current password!',
                                            },
                                        ]}
                                    >
                                        <div style={{ position: 'relative' }}>
                                            <Input
                                                type={showPassword ? 'text' : 'password'}

                                                maxLength={20}
                                                placeholder="Enter your password"
                                                style={{ paddingRight: '30px', width: '100%' }}
                                            />
                                            <span
                                                onClick={togglePasswordVisibility}
                                                style={{
                                                    position: 'absolute',
                                                    right: '10px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    cursor: 'pointer',
                                                    color: '#888',
                                                }}
                                            >
                                                {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                            </span>
                                        </div>
                                    </Form.Item>
                                </div>
                                <div className="col-sm-12">
                                    <label className="p-sm color-dark-gray w-100 bottom-small-space">
                                        New Password
                                    </label>

                                    <Form.Item
                                        name="newPassword"
                                        rules={[
                                            { required: true, message: 'Please input your new Password!' },
                                            { validator: validatePassword },
                                        ]}
                                    >
                                        <div style={{ position: 'relative' }}>
                                            <Input
                                                type={showNewPassword ? 'text' : 'password'}
                                                maxLength={20}
                                                placeholder="Enter your new password"
                                                style={{ paddingRight: '30px', width: '100%' }}
                                            />
                                            <span
                                                onClick={toggleNewPasswordVisibility}
                                                style={{
                                                    position: 'absolute',
                                                    right: '10px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    cursor: 'pointer',
                                                    color: '#888',
                                                }}
                                            >
                                                {showNewPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                            </span>
                                        </div>
                                    </Form.Item>
                                </div>
                                <div className="col-sm-12">
                                    <label className="p-sm color-dark-gray w-100 bottom-small-space">
                                        Confirm Password
                                    </label>
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
                                                },
                                            }),
                                        ]}
                                    >
                                        <div style={{ position: 'relative' }}>
                                            <Input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                maxLength={20}
                                                placeholder="Confirm your new password"
                                                style={{ paddingRight: '30px', width: '100%' }}
                                            />
                                            <span
                                                onClick={toggleConfirmPasswordVisibility}
                                                style={{
                                                    position: 'absolute',
                                                    right: '10px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    cursor: 'pointer',
                                                    color: '#888',
                                                }}
                                            >
                                                {showConfirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                            </span>
                                        </div>
                                    </Form.Item>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-sm-7 text-end xs-text-center mt-4">
                        <span>
                            <Button htmlType='submit' className="btn-primary fix-content-width btn-spac-lg bg-fresh-green opacity p-md right-gap-15 text-white "
                                style={{ fontSize: '16px' }}>
                                Submit
                            </Button>
                        </span>
                        <span>
                            <Link href='/student/my-profile'>
                                <Button className="btn-primary fix-content-width btn-spac-lg bg-fresh-green opacity p-md" style={{ color: '#fff', fontSize: '16px' }}>
                                    Cancel
                                </Button>
                            </Link>
                        </span>
                    </div>
                </Form>
            </section>
        </>
    )
}
