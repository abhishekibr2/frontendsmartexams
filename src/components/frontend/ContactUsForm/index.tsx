'use client';
import React, { useState } from 'react';
import { Form, Input, message, Row, Col, Image } from 'antd';
import ErrorHandler from '@/lib/ErrorHandler';
import { contactUs } from '@/lib/frontendApi';
import { FaSquareFacebook } from 'react-icons/fa6';
import { MdCall } from 'react-icons/md';
import { IoMailSharp } from 'react-icons/io5';
import { IoLocationSharp } from 'react-icons/io5';
import { TbWorld } from 'react-icons/tb';
import './style.css';
import Titles from '@/app/commonUl/Titles';
import ParaText from '@/app/commonUl/ParaText';


interface formValues {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}
const ContactUsForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [messageLength, setMessageLength] = useState(0);

    const onFinish = async (values: formValues) => {
        try {
            setLoading(true);
            const response = await contactUs(values);
            setLoading(false);
            if (response.status === true) {
                setModalVisible(true);
                form.resetFields();
                message.success('Your message has been sent successfully!'); // Show success message
            } else {
                // Check for specific error message
                if (response.message === 'Spam detected') {
                    message.error('Your message has been flagged as spam. Please try again later.');
                } else {
                    message.error(response.message || 'Failed to submit contact form.');
                }
            }
        } catch (error) {
            setLoading(false);
            ErrorHandler.showNotification(error);
        }
    };

    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessageLength(e.target.value.length);
    };

    return (
        <>
            <div className="gapMarginTopThree">
                <div className="contactFrom">
                    <img src="/images/10.png" alt="" className='shaps2 float-bob-y' />
                    <div className="customContainer">
                        <Row gutter={[24, 24]}>
                            <Col xs={18} sm={24} md={24} lg={10} xl={10} xxl={10}>
                                <Titles level={3} color="PrimaryColor" className="text-font-mb">
                                    Get in touch with us right now!
                                </Titles>
                                <div className="gapMarginTopTwo"></div>
                                <div className="contact-para">
                                    <p>
                                        We&apos;re here for you! Your satisfaction is our top priority. Whether you have
                                        questions, need support, or just want to share your thoughts, reaching out is
                                        easy. Contact us via phone, email, or our user-friendly online form, and our
                                        dedicated team will assist you promptly.
                                    </p>
                                </div>
                                <div className="gapMarginTop"></div>
                                <ul className='favIcon'>
                                    <li>
                                        <p>
                                            <MdCall className="site-form-item-icon" size={25} color='#02143c' /> <span>062391 25514</span>
                                        </p>
                                    </li>
                                    <li>
                                        <p>
                                            <IoMailSharp className="site-form-item-icon" size={25} color='#02143c' />{' '}
                                            <span>hr.binarydata@gmail.com</span>
                                        </p>
                                    </li>
                                    <li>
                                        <p>
                                            <TbWorld className="site-form-item-icon" size={25} color='#02143c' />
                                            <span>
                                                <a href="https://www.binarydata.in/" target="_blank">
                                                    https://www.binarydata.in/
                                                </a>
                                            </span>
                                        </p>
                                    </li>
                                    <li>
                                        <p>
                                            <IoLocationSharp className="site-form-item-icon" size={25} color='#02143c' />
                                            <span>STPI Sector 75, Mohali, Punjab, India.</span>
                                        </p>
                                    </li>
                                    <li>
                                        <p>
                                            <FaSquareFacebook className="site-form-item-icon" size={25} color='#02143c' />
                                            <span>
                                                <a href="https://www.facebook.com/BinaryDataPvtLtd" target="_blank">
                                                    https://www.facebook.com/BinaryDataPvtLtd
                                                </a>
                                            </span>
                                        </p>
                                    </li>
                                </ul>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={14} xl={14} xxl={14}>
                                <ParaText size="medium" color="PrimaryColor" fontWeightBold={700}>
                                    Send us a message
                                </ParaText>
                                <div className="gapMarginTopOne"></div>
                                <Form layout="vertical" onFinish={onFinish} form={form}>
                                    <Row gutter={[24, 0]}>
                                        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                                            <Form.Item
                                                name="name"
                                                rules={[
                                                    { required: true, message: 'Please enter name!' },
                                                    {
                                                        pattern: /^[A-Za-z\s]*$/,
                                                        message: 'Name should not include numbers & special characters!'
                                                    }
                                                ]}
                                            >
                                                <Input
                                                    placeholder="Name*"
                                                    maxLength={40}
                                                    style={{ textTransform: 'capitalize' }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                                            <Form.Item
                                                name="email"
                                                rules={[
                                                    {
                                                        type: 'email',
                                                        message: 'The input is not a valid email address!'
                                                    },
                                                    { required: true, message: 'Please input your email address!' },
                                                    {
                                                        pattern: /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
                                                        message: 'Please enter a valid email address!'
                                                    }
                                                ]}
                                            >
                                                <Input placeholder="Email*" maxLength={30} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={[24, 24]}>
                                        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                                            <Form.Item
                                                name="number"
                                                rules={[{ required: true, message: 'Please enter your Phone number' }]}
                                            >
                                                <Input placeholder="Phone Number*" maxLength={10} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Form.Item
                                        name="message"
                                        rules={[{ required: true, message: 'Please enter your message' }]}
                                    >
                                        <Input.TextArea
                                            placeholder="Message*"
                                            maxLength={400}
                                            autoSize={{ minRows: 3, maxRows: 6 }}
                                            onChange={handleMessageChange}
                                        />
                                    </Form.Item>
                                    <Form.Item>
                                        <input type="submit" value={loading ? 'Submitting...' : 'Submit'} />
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>

                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.544567900751!2d76.68959877614516!3d30.703087687063693!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390feef45533cde3%3A0x6492bea79120e89a!2sBinary%20Data%20Private%20Limited!5e0!3m2!1sen!2sin!4v1717495983978!5m2!1sen!2sin"
                            height="400"
                            style={{ border: '0px', width: '100%' }}
                            loading="lazy"
                            title="Google Map"
                        ></iframe>
                    </div>
                </div>
            </div>
            {/* <Modal
                title="Message Sent"
                open={modalVisible}
                onOk={() => setModalVisible(false)}
                onCancel={() => setModalVisible(false)}
            >
                <p>Thank you for contacting us! We will get back to you as soon as possible.</p>
            </Modal> */}
        </>
    );
};
export default ContactUsForm;
