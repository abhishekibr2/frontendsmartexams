'use client'
import './style.css'
import { AboutFormValues } from '@/lib/types';
import ErrorHandler from '@/lib/ErrorHandler';
import ParaText from '@/app/commonUl/ParaText';
import AuthContext from '@/contexts/AuthContext';
import { handleFileCompression } from '@/lib/commonServices';
import { RcFile, UploadFile } from 'antd/es/upload/interface';
import React, { useContext, useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { addFrontendAboutPageContent, getAboutPageContent } from '@/lib/adminApi';
import { Button, Col, Form, Input, message, Row, Space, Upload } from 'antd';

interface Props {
    activeKey: string
}

export default function AboutPageContent({ activeKey }: Props) {
    const [form] = Form.useForm();
    const { user } = useContext(AuthContext);
    const [editId, setEditId] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [homeData, setHomeData] = useState<AboutFormValues[]>([]);
    const [isMobile, setIsMobile] = useState(false);
    const [fileListOne, setFileListOne] = useState<UploadFile[]>([])
    const [fileListTwo, setFileListTwo] = useState<UploadFile[]>([])
    const [fileListThree, setFileListThree] = useState<UploadFile[]>([])


    useEffect(() => {
        if (user?._id) {
        }
    }, [activeKey, user])

    const getData = async () => {
        const response = await getAboutPageContent();
        if (response.status === true) {
            setHomeData(response.data);
        }
    };

    useEffect(() => {
        if (homeData && Object.keys(homeData).length > 0) {
            setEditId(homeData[0]?._id);

            form.setFieldsValue({
                headingOne: homeData[0]?.headingOne,
                descriptionOne: homeData[0]?.descriptionOne,
                buttonText: homeData[0]?.buttonText,

                headingTwo: homeData[0]?.headingTwo,
                descriptionTwo: homeData[0]?.descriptionTwo,

                headingThree: homeData[0]?.headingThree,
                descriptionThree: homeData[0]?.descriptionThree,
                descriptionFour: homeData[0]?.descriptionFour,

                headingCardOne: homeData[0]?.headingCardOne,
                descriptionCardOne: homeData[0]?.descriptionCardOne,
                headingCardTwo: homeData[0]?.headingCardTwo,
                descriptionCardTwo: homeData[0]?.descriptionCardTwo,
                headingCardThree: homeData[0]?.headingCardThree,
                descriptionCardThree: homeData[0]?.descriptionCardThree,


            });

            if (homeData[0]?.image) {
                setFileList([
                    {
                        uid: '-1',
                        name: homeData[0]?.image,
                        status: 'done',
                        url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/aboutPageImages/original/${homeData[0]?.image}`,
                    },
                ]);
            }

            if (homeData[0]?.imageCardOne) {
                setFileListOne([
                    {
                        uid: '-2',
                        name: homeData[0]?.imageCardOne,
                        status: 'done',
                        url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/aboutPageImages/original/${homeData[0]?.imageCardOne}`,
                    },
                ]);
            }

            if (homeData[0]?.imageCardTwo) {
                setFileListTwo([
                    {
                        uid: '-3',
                        name: homeData[0]?.imageCardTwo,
                        status: 'done',
                        url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/aboutPageImages/original/${homeData[0]?.imageCardTwo}`,
                    },
                ]);
            }

            if (homeData[0]?.imageCardThree) {
                setFileListThree([
                    {
                        uid: '-4',
                        name: homeData[0]?.imageCardThree,
                        status: 'done',
                        url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/aboutPageImages/original/${homeData[0]?.imageCardThree}`,
                    },
                ]);
            }

        }
    }, [homeData]);

    useEffect(() => {
        getData();
    }, []);

    const onFinish = async (values: AboutFormValues) => {
        try {
            const formData = new FormData();

            if (fileList && fileList.length > 0 && fileList[0]?.originFileObj) {
                const file = fileList[0].originFileObj as File;
                formData.append('image', file);
            }

            if (fileListOne && fileListOne.length > 0 && fileListOne[0]?.originFileObj) {
                const file = fileListOne[0].originFileObj as File;
                formData.append('imageCardOne', file);
            }

            if (fileListTwo && fileListTwo.length > 0 && fileListTwo[0]?.originFileObj) {
                const file = fileListTwo[0].originFileObj as File;
                formData.append('imageCardTwo', file);
            }
            if (fileListThree && fileListThree.length > 0 && fileListThree[0]?.originFileObj) {
                const file = fileListThree[0].originFileObj as File;
                formData.append('imageCardThree', file);
            }


            formData.append('headingOne', values.headingOne);
            formData.append('descriptionOne', values.descriptionOne);
            formData.append('buttonText', values.buttonText);

            formData.append('headingTwo', values.headingTwo);
            formData.append('descriptionTwo', values.descriptionTwo);

            formData.append('headingThree', values.headingThree);
            formData.append('descriptionThree', values.descriptionThree);
            formData.append('descriptionFour', values.descriptionFour);


            formData.append('headingCardOne', values.headingCardOne);
            formData.append('descriptionCardOne', values.descriptionCardOne);

            formData.append('headingCardTwo', values.headingCardTwo);
            formData.append('descriptionCardTwo', values.descriptionCardTwo);

            formData.append('headingCardThree', values.headingCardThree);
            formData.append('descriptionCardThree', values.descriptionCardThree);

            if (editId) {
                formData.append('editId', editId);
            }

            const res = await addFrontendAboutPageContent(formData);
            if (res.status === true) {
                getAboutPageContent();
                message.success(res.message);
            } else {
                message.error('Failed to add homepage content');
            }
        } catch (error) {
            console.error("Error occurred:", error);
            message.error("An error occurred while saving the content");
        }
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

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

    const handleRemove = () => {
        setFileList([]);
    };

    const handleBeforeUploadOne = async (file: RcFile) => {
        try {
            const compressedFiles = await handleFileCompression(file, '');
            setFileListOne(compressedFiles);
            return false;
        } catch (error) {
            ErrorHandler.showNotification(error);
            return true;
        }
    };

    const handleRemoveOne = () => {
        setFileListOne([]);
    };

    const handleBeforeUploadTwo = async (file: RcFile) => {
        try {
            const compressedFiles = await handleFileCompression(file, '');
            setFileListTwo(compressedFiles);
            return false;
        } catch (error) {
            ErrorHandler.showNotification(error);
            return true;
        }
    };

    const handleRemoveTwo = () => {
        setFileListTwo([]);
    };

    const handleBeforeUploadThree = async (file: RcFile) => {
        try {
            const compressedFiles = await handleFileCompression(file, '');
            setFileListThree(compressedFiles);
            return false;
        } catch (error) {
            ErrorHandler.showNotification(error);
            return true;
        }
    };

    const handleRemoveThree = () => {
        setFileListThree([]);
    };


    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, []);

    return (
        <>
            <ParaText size="large" fontWeightBold={600} color="PrimaryColor">
                About Us Page
            </ParaText>
            <div
                className={`card-dash shadow-none top-medium-space ${isMobile ? 'mobile-view' : 'desktop-view'
                    }`}
            >        <Form form={form} onFinish={onFinish} layout="vertical" size='large'>
                    <ParaText size="medium" fontWeightBold={600} color="PrimaryColor">
                        Section One
                    </ParaText>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} xl={21} sm={19} lg={18}>
                            <Form.Item label="Heading One" name="headingOne" >
                                <Input placeholder="Enter First Heading" maxLength={100} />
                            </Form.Item>
                            <Form.Item label="Button Text One" name="buttonText" >
                                <Input placeholder="Enter Button Text" maxLength={100} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} xl={3} sm={5} lg={6}>
                            <Form.Item label=" Image One" name="image">
                                <div style={{ width: "100%", display: 'flex', alignItems: 'center' }}>
                                    <Upload
                                        listType="picture-card"
                                        fileList={fileList}
                                        beforeUpload={handleBeforeUpload}
                                        onRemove={handleRemove}
                                        onPreview={handlePreview}
                                        style={{ width: '100%', height: '350px' }}
                                    >
                                        {fileList.length >= 1 ? null : uploadButton}
                                    </Upload>
                                </div>

                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24}>
                            <Form.Item
                                label="Description One"
                                name="descriptionOne"
                            >
                                <Input.TextArea rows={4} placeholder="Enter First Description " style={{
                                    width: '100%',
                                    height: '133px'
                                }} />
                            </Form.Item>
                        </Col>
                    </Row>


                    <div className="mt-3"></div>
                    <ParaText size="medium" fontWeightBold={600} color="PrimaryColor">
                        Section Two
                    </ParaText>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} >
                            <Form.Item label="Heading Two" name="headingTwo">
                                <Input placeholder="Enter Second Heading" maxLength={100} />
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item
                                label="Description Two "
                                name="descriptionTwo"
                            >
                                <Input.TextArea rows={4} placeholder="Enter Two Description " style={{
                                    width: '100%',
                                    height: '135px'
                                }} />
                            </Form.Item>
                        </Col>
                    </Row>


                    {/* Section Three */}
                    <div className="mt-3"></div>
                    <ParaText size="medium" fontWeightBold={600} color="PrimaryColor">
                        Section Three
                    </ParaText>
                    <Row gutter={16}>
                        <Col xs={24} md={12} sm={24} xl={12}>
                            <Form.Item label="Heading Three" name="headingThree" >
                                <Input placeholder="Enter Third Heading" maxLength={100} />
                            </Form.Item>
                            <Form.Item label="Sub Heading " name="descriptionThree" >
                                <Input placeholder="Enter Heading" maxLength={100} />
                            </Form.Item>


                        </Col>
                        <Col xs={24} md={12} sm={24} xl={12}>
                            <Col xs={24} md={24} sm={24}>
                                <Form.Item
                                    label="Description Three"
                                    name="descriptionFour"
                                >
                                    <Input.TextArea rows={4} placeholder="Enter Third Description " style={{
                                        width: '100%',
                                        height: '135px'
                                    }} />
                                </Form.Item>
                            </Col>
                        </Col>

                    </Row>

                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <Form.Item
                                    label="Card One"
                                    name="headingCardOne"
                                >
                                    <Input placeholder="Enter title" />
                                </Form.Item>
                                <Form.Item
                                    label="Card Description One"
                                    name="descriptionCardOne"
                                >
                                    <Input.TextArea rows={4} placeholder="Enter First Description " style={{
                                        width: '100%',
                                        height: '133px'
                                    }} />
                                </Form.Item>
                                <Form.Item label="Card Image One" name="imageCardOne">
                                    <div style={{ width: "100%", display: 'flex', alignItems: 'center' }}>
                                        <Upload
                                            listType="picture-card"
                                            fileList={fileListOne}
                                            beforeUpload={handleBeforeUploadOne}
                                            onRemove={handleRemoveOne}
                                            onPreview={handlePreview}
                                            style={{ width: '100%', height: '350px' }}
                                        >
                                            {fileListOne.length >= 1 ? null : uploadButton}
                                        </Upload>
                                    </div>

                                </Form.Item>
                            </Space>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <Form.Item
                                    label="Card Two"
                                    name="headingCardTwo"
                                >
                                    <Input placeholder="Enter title" />
                                </Form.Item>
                                <Form.Item
                                    label="Card Description Two"
                                    name="descriptionCardTwo"
                                >
                                    <Input.TextArea rows={4} placeholder="Enter First Description " style={{
                                        width: '100%',
                                        height: '133px'
                                    }} />
                                </Form.Item>
                                <Form.Item label="Card Image Two" name="imageCardTwo">
                                    <div style={{ width: "100%", display: 'flex', alignItems: 'center' }}>
                                        <Upload
                                            listType="picture-card"
                                            fileList={fileListTwo}
                                            beforeUpload={handleBeforeUploadTwo}
                                            onRemove={handleRemoveTwo}
                                            onPreview={handlePreview}
                                            style={{ width: '100%', height: '350px' }}
                                        >
                                            {fileListTwo.length >= 1 ? null : uploadButton}
                                        </Upload>
                                    </div>

                                </Form.Item>
                            </Space>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <Form.Item
                                    label="Card Three"
                                    name="headingCardThree"
                                >
                                    <Input placeholder="Enter title" />
                                </Form.Item>
                                <Form.Item
                                    label="Card Description Three"
                                    name="descriptionCardThree"
                                >
                                    <Input.TextArea rows={4} placeholder="Enter First Description " style={{
                                        width: '100%',
                                        height: '133px'
                                    }} />
                                </Form.Item>
                                <Form.Item label="Card Image Three" name="imageCardThree">
                                    <div style={{ width: "100%", display: 'flex', alignItems: 'center' }}>
                                        <Upload
                                            listType="picture-card"
                                            fileList={fileListThree}
                                            beforeUpload={handleBeforeUploadThree}
                                            onRemove={handleRemoveThree}
                                            onPreview={handlePreview}
                                            style={{ width: '100%', height: '350px' }}
                                        >
                                            {fileListThree.length >= 1 ? null : uploadButton}
                                        </Upload>
                                    </div>

                                </Form.Item>
                            </Space>
                        </Col>

                    </Row>

                    <Button type="primary" htmlType="submit" style={{ height: 40 }}>
                        Save
                    </Button>
                </Form>
            </div>

        </>
    )
}

function getBase64(originFileObj: RcFile | undefined): string | PromiseLike<string> {
    throw new Error('Function not implemented.');
}
