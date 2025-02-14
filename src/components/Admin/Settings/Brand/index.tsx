'use client'
import './style.css'
import ParaText from '@/app/commonUl/ParaText';
import { handleFileCompression } from '@/lib/commonServices';
import { Button, Col, Form, Input, message, Row, Upload, UploadFile } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import ErrorHandler from '@/lib/ErrorHandler';
import { getSingleBrandDetails, updateBrandDetails, deleteBrandLogo } from '@/lib/adminApi';
import { validationRules } from '@/lib/validations';
import AuthContext from '@/contexts/AuthContext';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

interface Props {
    activeKey: string
}

interface fromData {
    brandName: string | Blob;
    tagLine: string | Blob;
    email: string | Blob;
    emailPassword: string | Blob;
    phone: string | Blob;
    address: string | Blob;
    googleMap: string | Blob;
    whatsApp: string | Blob;
    website: string | Blob;
    time: string | Blob;
    footerDescriptionOne: string | Blob;
    footerDescriptionTwo: string | Blob;
    footerSubHeadingOne: string | Blob;
    footerSubHeadingTwo: string | Blob;

}

export default function Brands({ activeKey }: Props) {
    const [logoList, setLogoList] = useState<UploadFile[]>([]);
    const [favIconList, setFavIconList] = useState<UploadFile[]>([]);
    const [watermark, setWatermark] = useState<UploadFile[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const [form] = Form.useForm();
    // const { sendNotification } = useSocket()
    const [brandID, setbrandID] = useState([])

    useEffect(() => {
        if (user?._id) {
            fetchBrandDetail(user?._id);
        }
    }, [activeKey, user])

    const fetchBrandDetail = async (id: string) => {
        try {
            const data = {
                userId: id
            }
            const res = await getSingleBrandDetails(data);
            if (res.status === true && res.data) {
                form.setFieldsValue({
                    brandName: res.data.brandName,
                    tagLine: res.data.tagLine,
                    email: res.data.email,
                    emailPassword: res.data.emailPassword,
                    phone: res.data.phone,
                    address: res.data.address,
                    googleMap: res.data.googleMap,
                    whatsApp: res.data.whatsApp,
                    website: res.data.website,
                    time: res.data.time,
                    footerDescriptionOne: res.data.footerDescriptionOne,
                    footerDescriptionTwo: res.data.footerDescriptionTwo,
                    footerSubHeadingOne: res.data.footerSubHeadingOne,
                    footerSubHeadingTwo: res.data.footerSubHeadingTwo,
                })
                setbrandID(res.data._id)

                if (res.data.waterMarkIcon) {
                    setWatermark([{
                        uid: '1',
                        name: res.data.waterMarkIcon,
                        status: 'done',
                        url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/brandImage/original/${res.data.waterMarkIcon}`,
                    }]);
                } else {
                    setWatermark([]);  // Ensure empty list when no favicon

                }


                if (res.data.favIcon) {
                    setFavIconList([{
                        uid: '2',
                        name: res.data.favIcon,
                        status: 'done',
                        url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/brandImage/original/${res.data.favIcon}`,
                    }]);
                } else {
                    setFavIconList([]);  // Ensure empty list when no favIcon
                }

                if (res.data.logo) {
                    setLogoList([{
                        uid: '3',
                        name: res.data.logo,
                        status: 'done',
                        url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/brandImage/original/${res.data.logo}`,
                    }]);
                } else {
                    setLogoList([]);  // Ensure empty list when no favicon
                }
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }

    const onfinish = async (values: fromData) => {
        try {
            setLoading(true);
            const formData = new FormData();
            if (logoList.length > 0) {
                const fileLogo = logoList[0]?.originFileObj as Blob;
                formData.append('logo', fileLogo);
            }
            // Append favicon file if available
            if (favIconList.length > 0) {
                const fileFavIcon = favIconList[0]?.originFileObj as Blob;
                formData.append('favIcon', fileFavIcon);
            }
            // Append watermark file if available
            if (watermark.length > 0) {
                const fileWatermark = watermark[0]?.originFileObj as Blob;
                formData.append('waterMarkIcon', fileWatermark);
            }
            formData.append('brandName', values.brandName);
            formData.append('tagLine', values.tagLine);
            formData.append('email', values.email);
            formData.append('emailPassword', values.emailPassword);
            formData.append('phone', values.phone);
            formData.append('address', values.address);
            formData.append('googleMap', values.googleMap);
            formData.append('whatsApp', values.whatsApp);
            formData.append('website', values.website);
            formData.append('time', values.time);
            formData.append('footerDescriptionOne', values.footerDescriptionOne);
            formData.append('footerDescriptionTwo', values.footerDescriptionTwo);
            formData.append('footerSubHeadingOne', values.footerSubHeadingOne);
            formData.append('footerSubHeadingTwo', values.footerSubHeadingTwo);



            formData.append('userId', user?._id || '');

            const res = await updateBrandDetails(formData);
            if (res.status == true) {
                message.success(res.message);
                setLoading(false);
                setLogoList([]);
                setFavIconList([]);
                setWatermark([])

                fetchBrandDetail(user && user?._id as any)
            }
        } catch (error) {
            setLoading(false);
            ErrorHandler.showNotification(error);
        }
    }

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const handleLogoUpload = async (file: File): Promise<boolean> => {
        try {
            const compressedFiles = await handleFileCompression(file, '');
            setLogoList(compressedFiles);
            return false;
        } catch (error) {
            ErrorHandler.showNotification(error);
            return true;
        }
    };

    const handleIconUpload = async (file: File): Promise<boolean> => {
        try {
            const compressedFiles = await handleFileCompression(file, '');
            setFavIconList(compressedFiles);
            return false;
        } catch (error) {
            ErrorHandler.showNotification(error);
            return true;
        }
    };

    const handleWatermarkUpload = async (file: File): Promise<boolean> => {
        try {
            const compressedFiles = await handleFileCompression(file, '');
            setWatermark(compressedFiles);
            return false;
        } catch (error) {
            ErrorHandler.showNotification(error);
            return true;
        }
    }

    const handleRemoveWatermark = async () => {
        try {
            const data = {
                brandId: brandID,
                userId: user?._id,
                waterMarkIcon: 'waterMarkIcon'
            }
            const res = await deleteBrandLogo(data);
            if (res.status === true) {
                setWatermark([]);

                message.success('Logo deleted successfully');

            } else {
                message.error('Failed to delete the logo');
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }
    const handleRemoveFavIcon = async () => {
        try {
            const data = {
                brandId: brandID,
                userId: user?._id,
                favIcon: 'favIcon'
            }
            const res = await deleteBrandLogo(data);
            if (res.status === true) {
                setFavIconList([]);

                message.success('Logo deleted successfully');

            } else {
                message.error('Failed to delete the logo');
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }

    const handleRemoveLogo = async () => {
        try {
            const data = {
                brandId: brandID,
                userId: user?._id,
                logo: 'logo'
            }
            const res = await deleteBrandLogo(data);
            if (res.status === true) {
                setLogoList([]);

                message.success('Logo deleted successfully');

            } else {
                message.error('Failed to delete the logo');
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    return (
        <>
            <ParaText size="large" fontWeightBold={600} color="PrimaryColor">
                Brand Details
            </ParaText>
            <div className="gapMarginTopOne"></div>
            <Form layout='vertical' size='large' form={form} onFinish={onfinish} >
                <Row gutter={10}>
                    <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                        <Form.Item
                            name={'brandName'}
                            label={'Brand Name'}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter brand name'
                                },
                                {
                                    max: validationRules.textLength.maxLength,
                                    message: `Brand name must be at most ${validationRules.textLength.maxLength} characters`
                                }
                            ]}
                        >
                            <Input
                                placeholder='Enter brand name'
                                type='text'
                            />
                        </Form.Item>
                    </Col>
                    <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                        <Form.Item name={'tagLine'} label='Tag Line'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter tag line'
                                },
                                {
                                    max: validationRules.textLongLength.maxLength,
                                    message: `Tag line must be at most ${validationRules.textLongLength.maxLength} characters`
                                }
                            ]}
                        >
                            <Input
                                placeholder='Enter tag line'
                                type='text'
                            />
                        </Form.Item>
                    </Col>
                    <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                        <Form.Item name={'email'} label='Email Address'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter email',
                                    type: 'email'
                                },
                                {
                                    min: validationRules.email.minLength,
                                    max: validationRules.email.maxLength,
                                    pattern: validationRules.email.pattern,
                                    message: `Email must be at most ${validationRules.textLength.maxLength} characters`
                                }
                            ]}
                        >
                            <Input
                                placeholder='Enter email'
                                type='email' maxLength={50}
                            />
                        </Form.Item>
                    </Col>
                    <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                        <Form.Item name={'emailPassword'} label='Email Password' rules={[
                            {
                                required: true, message: 'Please  enter a password!'
                            },
                            {
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+={}\[\]:;'"<>,.?/\\]).{8,10}$/,
                                message: 'Password must be between 8 and 10 characters long and include uppercase, lowercase, number, and special character.'
                            }
                        ]}>
                            <Input.Password
                                type='password'
                                placeholder="Password"
                                maxLength={10} />
                        </Form.Item>
                    </Col>
                    <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                        <Form.Item name={'phone'} label='Phone Number'
                            rules={
                                [
                                    {
                                        required: true,
                                        message: 'Please enter phone number'
                                    },
                                    {
                                        pattern: validationRules.phoneNumber.pattern,
                                        message: 'Please enter a valid phone number'
                                    }
                                ]
                            }
                        >
                            <PhoneInput
                                inputStyle={{ width: '100%', height: '40px', borderRadius: '8px' }}
                                country={'us'}
                                onChange={value => { value }}

                            />
                        </Form.Item>

                    </Col>
                    <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                        <Form.Item name={'address'} label='Address' rules={[
                            {
                                required: true,
                                message: 'Please enter address'
                            },
                            {
                                max: validationRules.textLongLength.maxLength,
                                message: `Address must be at most ${validationRules.textLongLength.maxLength} characters`
                            }
                        ]}>
                            <Input
                                placeholder='Enter address'
                                type='text'
                            />
                        </Form.Item>
                    </Col>
                    <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                        <Form.Item name={'googleMap'} label='Google Map Address'
                            rules={[
                                {
                                    max: validationRules.textLongLength.maxLength,
                                    message: `Google map address must be at most ${validationRules.textLongLength.maxLength} characters`
                                }
                            ]}
                        >
                            <Input
                                placeholder='Enter google map address'
                                type='text'
                            />
                        </Form.Item>
                    </Col>
                    <Col lg={8} xl={8} md={8} sm={24} xs={24}>
                        <Form.Item
                            name={'whatsApp'}
                            label='WhatsApp Number'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter WhatsApp number',
                                },
                            ]}
                        >
                            <PhoneInput
                                inputStyle={{ width: '100%', height: '40px', borderRadius: '8px' }}
                                country={'us'}
                            // onChange={value => { phone_number: value }}

                            />
                        </Form.Item>
                    </Col>
                    <Col lg={8} xl={8} md={8} sm={24} xs={24}>
                        <Form.Item name={'website'} label='Website'
                            rules={[
                                {
                                    pattern: validationRules.websiteURL.pattern,
                                    message: 'Please enter a valid website url'
                                }
                            ]}
                        >
                            <Input
                                placeholder='Enter website'
                                type='text'
                            />
                        </Form.Item>
                    </Col>

                    <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                        <Form.Item
                            name={'time'}
                            label={'Time'}
                        >
                            <Input
                                placeholder='Enter time'
                                type='text'
                            />
                        </Form.Item>

                    </Col>
                    <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                        <Form.Item name={'footerSubHeadingOne'} label='Footer Subheading One'

                        >
                            <Input
                                placeholder='Enter Footer Subheading One'
                                type='text'
                            />
                        </Form.Item>
                    </Col>
                    <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                        <Form.Item name={'footerSubHeadingTwo'} label='Footer Subheading Two'

                        >
                            <Input
                                placeholder='Enter Footer Subheading Two'
                                type='text'
                            />
                        </Form.Item>
                    </Col>

                    <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                        <Form.Item
                            label="Footer Description One"
                            name="footerDescriptionOne"
                        >
                            <Input.TextArea rows={4} placeholder="Enter  Footer Description One " style={{
                                width: '100%',
                                height: '133px'
                            }} />
                        </Form.Item>
                    </Col>
                    <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                        <Form.Item
                            label="Footer Description Two"
                            name="footerDescriptionTwo"
                        >
                            <Input.TextArea rows={4} placeholder="Enter Footer Description Two " style={{
                                width: '100%',
                                height: '133px'
                            }} />
                        </Form.Item>
                    </Col>

                    <Col lg={3} xl={3} md={3} sm={24} xs={24}>
                        <Form.Item name='logo' label='Brand Logo'
                        >
                            <Upload
                                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-330c5e6a2138"
                                listType="picture-card"
                                fileList={logoList}
                                accept=".jpg,.jpeg,.png"
                                style={{ width: '100%' }}
                                beforeUpload={handleLogoUpload}
                                onRemove={handleRemoveLogo}

                            >
                                {logoList.length >= 1 ? null : uploadButton}
                            </Upload>

                        </Form.Item>
                    </Col>
                    <Col xl={3} lg={3} md={3} sm={24} xs={24}>
                        <Form.Item name='favIcon' label='Favicon'
                        >
                            <Upload
                                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                listType="picture-card"
                                fileList={favIconList}
                                beforeUpload={handleIconUpload}
                                onRemove={handleRemoveFavIcon}
                                accept=".jpg,.jpeg,.png"
                                style={{ width: '100%' }}
                            >
                                {favIconList.length >= 1 ? null : uploadButton}
                            </Upload>
                        </Form.Item>
                    </Col>
                    {/* here waterMark */}
                    <Col lg={3} xl={3} md={3} sm={24} xs={24}>
                        <Form.Item name='waterMarkIcon' label='Watermark' >
                            <Upload
                                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-330c5e6a2138"
                                listType="picture-card"
                                fileList={watermark}
                                beforeUpload={handleWatermarkUpload}
                                accept=".jpg,.jpeg,.png"
                                style={{ width: '100%' }}
                                onRemove={handleRemoveWatermark}
                            >
                                {watermark.length >= 1 ? null : uploadButton}
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col md={24} style={{ textAlign: 'end' }}>
                        <div className="smallTopMargin"></div>
                        <Button type='primary' loading={loading} htmlType='submit'>{loading ? 'Submitting' : 'Save Brand Details'}</Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}
// function useSocket(): { sendNotification: any; } {
//     throw new Error('Function not implemented.');
// }

