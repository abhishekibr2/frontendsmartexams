'use client'
import moment from 'moment';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { User } from '@/lib/types';
import ErrorHandler from '@/lib/ErrorHandler';
import Upload, { RcFile } from 'antd/es/upload';
import AuthContext from '@/contexts/AuthContext';
import { PlusOutlined } from '@ant-design/icons';
import { updateProfileDetails } from '@/lib/studentApi';
import { setLoading } from '@/redux/reducers/profileReducer';
import { handleFileCompression } from '@/lib/commonServices';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, message, UploadFile, DatePicker, Input } from 'antd';

export default function StudentProfile() {
    const [form] = Form.useForm();
    const token = Cookies.get('session_token');
    const { user, setUser } = useContext(AuthContext);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (user) {
            setLoading(false)
            form.setFieldsValue({
                id: user._id,
                name: user.name,
                email: user.email,
                fatherName: user.fatherName,
                dob: user.dob ? moment(user.dob) : null, // Convert DOB to moment
                phoneNumber: user.phoneNumber,
                city: user?.address?.city,
                state: user?.address?.state,
                course: user.course,
                referCode: user.referCode,
            });
            if (user.image) {
                setFileList([{
                    uid: '-1',
                    name: user.image,
                    status: 'done',
                    url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/userImage/original/${user.image}`,
                }]);
            }
        }
    }, [user]);

    const onfinish = async (values: User) => {
        try {
            const formData = new FormData();
            if (fileList && fileList.length > 0) {
                if (fileList[0]?.originFileObj) {
                    const file = fileList[0]?.originFileObj as File;
                    formData.append('image', file);
                } else {
                    const file = fileList[0]?.name;
                    formData.append('image', file as string);
                }
            }
            formData.append('name', values.name);
            formData.append('email', values.email);
            formData.append('fatherName', values.fatherName);
            formData.append('dob', values.dob ? values.dob.format('YYYY-MM-DD') : ''); // Convert date to string format
            formData.append('phoneNumber', values.phoneNumber);
            formData.append('city', values.city);
            formData.append('state', values.state || '  ');
            formData.append('userId', user?._id || '');
            formData.append('course', values.course);
            formData.append('referCode', values.referCode);

            const res = await updateProfileDetails(formData);
            if (res.status) {
                setUser(res.user);
                message.success(res.message);
            } else {
                message.error(res.message);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }

    const handleRemove = () => {
        setFileList([]);
    }

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

    return (
        <>
            <section className="dash-part bg-light-steel ">
                <div className="spac-dash">
                    <div className="row align">
                        <div className="col-sm-5">
                            <h2 className="top-title mb-3">
                                My Profile
                            </h2>
                        </div>
                        <div className="col-sm-7 text-end xs-text-center mb-3">
                            <span>
                                <Link href='/student/change-password'>
                                    <button className="btn-primary fix-content-width btn-spac-lg bg-fresh-green opacity p-md right-gap-15" style={{ fontSize: '16px' }}>
                                        Change Password
                                    </button>
                                </Link>
                            </span>
                            {/* <span>
                                <button className="btn-primary fix-content-width btn-spac-lg bg-fresh-green opacity p-md" style={{ fontSize: '16px' }}>
                                    Edit
                                </button>
                            </span> */}
                        </div>
                    </div>
                    {/* <br /> */}
                    <div className="card-dash ">
                        <Form layout="vertical" form={form} size="large" onFinish={onfinish} initialValues={{
                            id: user?._id,
                        }}>
                            <div className="row">
                                <div className="col-sm-6">
                                    <label >
                                        First Name
                                    </label>
                                    <Form.Item
                                        name={'name'}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter name'
                                            },
                                            { pattern: /^[A-Za-z\s]+$/, message: 'Please enter only alphabets!' }
                                        ]}

                                    >
                                        <Input
                                            placeholder="Enter name"
                                            type="text"
                                            maxLength={50}
                                            style={{ textTransform: 'capitalize' }}

                                        />
                                    </Form.Item>
                                </div>
                                <div className="col-sm-6 ">
                                    <label >
                                        Mobile No
                                    </label>
                                    <Form.Item
                                        name={'phoneNumber'}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter phone number'
                                            }
                                        ]}
                                    >
                                        <Input
                                            placeholder='+91899221182'
                                            type="number"
                                            maxLength={12}

                                        />
                                    </Form.Item>
                                </div>
                                <div className="col-sm-6 ">
                                    <label >
                                        Father Name
                                    </label>
                                    <Form.Item name={'fatherName'}
                                    >
                                        <Input
                                            placeholder='Father Name'
                                            type='text' maxLength={50}

                                        />
                                    </Form.Item>
                                </div>
                                <div className="col-sm-6 ">
                                    <label >
                                        Birth Date
                                    </label>
                                    <Form.Item
                                        name="dob"
                                        rules={[{ required: true, message: 'Please select your Date of Birth!' }]}
                                    >
                                        <DatePicker
                                            format="DD/MM/YYYY"
                                            placeholder="Select Date of Birth"
                                            style={{ width: '100%' }}

                                        />
                                    </Form.Item>
                                </div>
                                <div className="col-sm-6 ">
                                    <label >
                                        User ID
                                    </label>
                                    <Form.Item
                                        name={'id'}
                                    >
                                        <Input
                                            type="text"

                                            disabled

                                        />
                                    </Form.Item>
                                </div>
                                <div className="col-sm-6 ">
                                    <label >
                                        Course
                                    </label>
                                    <Form.Item
                                        name={'course'}
                                    >
                                        <Input
                                            type="text"

                                            placeholder="Selective Online Trial"
                                        />
                                    </Form.Item>

                                </div>
                                <div className="col-sm-6 ">
                                    <label >
                                        Email
                                    </label>
                                    <Form.Item
                                        name={'email'}
                                    >
                                        <Input
                                            placeholder="Enter email"
                                            type="email"
                                            maxLength={50}
                                            disabled
                                            defaultValue={'cunaraly@mailinator.com'}

                                        />
                                    </Form.Item>
                                </div>

                                <div className="col-sm-6 ">
                                    <label >
                                        State
                                    </label>
                                    <Form.Item name={'state'}
                                    >
                                        <Input
                                            placeholder='State'
                                            type='text' maxLength={50}

                                        />
                                    </Form.Item>
                                </div>
                                <div className="col-sm-6 ">
                                    <label >
                                        City
                                    </label>
                                    <Form.Item name={'city'}
                                    >
                                        <Input
                                            placeholder='City'
                                            type='text' maxLength={50}

                                        />
                                    </Form.Item>
                                </div>
                                <div className="col-sm-6 ">
                                    <label >
                                        Refer Code
                                    </label>
                                    <Form.Item name={'referCode'}
                                    >
                                        <Input type="text" placeholder="Refer Code" />
                                    </Form.Item>
                                </div>
                            </div>
                            <Form.Item name={'image'} label='Profile Image'>
                                <Upload
                                    listType="picture-card"
                                    fileList={fileList}
                                    beforeUpload={handleBeforeUpload}
                                    onRemove={handleRemove}
                                    accept=".jpg,.jpeg,.png"
                                    headers={{ Authorization: `Bearer ${token}` }}
                                    name='file'
                                    action={`${process.env['NEXT_PUBLIC_API_URL']}/user/profile/update-profile-details`}
                                >
                                    {fileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            </Form.Item>
                            <Button className="btn-primary fix-content-width btn-spac-lg bg-fresh-green opacity p-md text-white text-end"
                                onClick={() => form.submit()} style={{ fontSize: '16px' }}>
                                Submit
                            </Button>
                        </Form>
                    </div>
                </div>
            </section>
        </>
    )
}
