'use client'
import ParaText from '@/app/commonUl/ParaText';
import { Button, Col, Form, Input, message, Row, Spin, Upload, UploadFile } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import ErrorHandler from '@/lib/ErrorHandler';
import { validationRules } from '@/lib/validations';
import AuthContext from '@/contexts/AuthContext';
import { RcFile } from 'antd/es/upload';
import { updateProfileDetails } from '@/lib/userApi';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import Cookies from 'js-cookie';
import { handleFileCompression } from '@/lib/commonServices';
import './style.css'

interface Props {
    activeKey: string;
}


interface formValues {
    name: string;
    email: string;
    phoneNumber: string;
    country: string;
    state: string;
    image?: string;
}

export default function Brands({ activeKey }: Props) {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [loading, setLoading] = useState(true)
    const { user, setUser } = useContext(AuthContext);
    const [form] = Form.useForm();
    const [phone, setPhone] = useState<formValues>({} as formValues);
    const [country, setCountry] = useState('');
    const token = Cookies.get('session_token');

    const handlePhoneChange = (value: string, countryData: { name: string; }) => {
        setPhone((prev) => ({
            ...prev,
            phoneNumber: value, // Set the phone number string
            country: countryData.name, // Update the country data
        }));
    };
    useEffect(() => {
        if (user) {
            setLoading(false)
            form.setFieldsValue({
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                country: user?.address?.country,
                state: user?.address?.state,
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
    }, [user, activeKey]);

    const onfinish = async (values: formValues) => {
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
            formData.append('phoneNumber', values.phoneNumber);
            formData.append('country', values.country);
            formData.append('state', values.state || '  ');
            formData.append('userId', user?._id || '');

            const res = await updateProfileDetails(formData);
            if (res.status) {
                setUser(res.brand);
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
            {loading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin style={{ marginTop: '-20vh' }} />
            </div>
                :
                <div style={{ margin: '10px' }}>
                    <ParaText size="large" fontWeightBold={600} color="PrimaryColor">
                        Profile Details
                    </ParaText>
                    <div className="smallTopMargin"></div>
                    <Form layout='vertical' form={form} size='large' onFinish={onfinish} >
                        <Row>
                            <Col sm={24} xs={24} xl={24} lg={24} md={24}>
                                <Row gutter={10}>
                                    <Col sm={24} xs={24} xl={8} lg={8} md={8}>
                                        <Form.Item name={'name'} label={'Name'}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please enter name'
                                                },
                                                {
                                                    max: validationRules.textLength.maxLength,
                                                    message: `Name must be at most ${validationRules.textLength.maxLength} characters`
                                                },
                                                { pattern: /^[A-Za-z\s]+$/, message: 'Please enter only alphabets!' }
                                            ]}
                                        >
                                            <Input
                                                placeholder='Enter name'
                                                type='text' maxLength={50}
                                                style={{ textTransform: "capitalize" }}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col sm={24} xs={24} xl={8} lg={8} md={8}>
                                        <Form.Item name={'email'} label='Email'
                                            rules={[{
                                                required: true,
                                                message: 'Please enter email',
                                                type: 'email'
                                            }]}
                                        >
                                            <Input
                                                placeholder='Enter email'
                                                type='email' maxLength={50} disabled
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col sm={24} xs={24} xl={8} lg={8} md={8}>
                                        <Form.Item name='phoneNumber' label='Phone Number'
                                            rules={
                                                [
                                                    {
                                                        required: true,
                                                        message: 'Please enter phone number'
                                                    },
                                                    { pattern: /^[0-9]+$/, message: 'Please enter a valid phone number' },
                                                ]
                                            }
                                        >
                                            <PhoneInput
                                                inputStyle={{ width: '100%', borderRadius: '8px', height: '40px' }}
                                                country={'us'}
                                                value={phone.phoneNumber} // Use phoneNumber for the value prop
                                                onChange={handlePhoneChange} // Correct onChange signature
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col sm={24} xs={24} xl={8} lg={8} md={8}>
                                        <Form.Item name={'country'} label='Country'
                                            rules={
                                                [
                                                    // {
                                                    //     required: true,
                                                    //     message: 'Please enter country'
                                                    // },
                                                ]
                                            }
                                        >
                                            <Input
                                                placeholder='Enter country'
                                                type='text' maxLength={30}
                                                value={country}
                                                readOnly
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col sm={24} xs={24} xl={8} lg={8} md={8}>
                                        <Form.Item name={'state'} label='State'
                                            rules={[
                                                // {
                                                //     required: true,
                                                //     message: 'Please enter state'
                                                // },
                                                {
                                                    max: validationRules.textLength.maxLength,
                                                    message: `Name must be at most ${validationRules.textLength.maxLength} characters`
                                                },
                                                { pattern: /^[A-Za-z\s]+$/, message: 'Please enter only alphabets!' }
                                            ]}
                                        >
                                            <Input
                                                placeholder='Enter state'
                                                type='text' maxLength={50}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col lg={24} xl={24} md={24} sm={24} xs={24}>
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
                                    </Col>
                                    <Col md={24} style={{ textAlign: 'end' }}>
                                        <div>
                                            <Button type='primary' htmlType='submit'>Submit</Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </div>
            }
        </>
    )
}
