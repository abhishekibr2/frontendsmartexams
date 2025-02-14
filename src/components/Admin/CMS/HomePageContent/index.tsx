'use client'
import './style.css'
import { HomeFormValues } from '@/lib/types';
import ErrorHandler from '@/lib/ErrorHandler';
import ParaText from '@/app/commonUl/ParaText';
import AuthContext from '@/contexts/AuthContext';
import { handleFileCompression } from '@/lib/commonServices';
import { RcFile, UploadFile } from 'antd/es/upload/interface';
import React, { useContext, useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { addFrontendHomePageContent, getHomepageContent } from '@/lib/adminApi';
import { Button, Col, Form, Input, InputNumber, message, Row, Space, Upload } from 'antd';

interface Props {
    activeKey: string
}

export default function HomePageContent({ activeKey }: Props) {
    const [form] = Form.useForm();
    const { user } = useContext(AuthContext);
    const [editId, setEditId] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [homeData, setHomeData] = useState<HomeFormValues[]>([]);
    const [isMobile, setIsMobile] = useState(false);
    const [fileListOne, setFileListOne] = useState<UploadFile[]>([])
    const [fileListTwo, setFileListTwo] = useState<UploadFile[]>([])
    const [fileListThree, setFileListThree] = useState<UploadFile[]>([])
    const [fileListFour, setFileListFour] = useState<UploadFile[]>([])
    const [fileListFive, setFileListFive] = useState<UploadFile[]>([])
    const [fileListSix, setFileListSix] = useState<UploadFile[]>([])

    useEffect(() => {
        if (user?._id) {
        }
    }, [activeKey, user])

    const getData = async () => {
        const response = await getHomepageContent();
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
                buttonOne: homeData[0]?.buttonOne,

                headingTwo: homeData[0]?.headingTwo,
                subHeadingTwo: homeData[0]?.subHeadingTwo,
                sectionTwoTitleOne: homeData[0]?.sectionTwoTitleOne,
                sectionTwoTitleTwo: homeData[0]?.sectionTwoTitleTwo,
                sectionTwoTitleThree: homeData[0]?.sectionTwoTitleThree,
                sectionTwoTitleFour: homeData[0]?.sectionTwoTitleFour,
                sectionTwoTitleFive: homeData[0]?.sectionTwoTitleFive,
                sectionTwoTitleSix: homeData[0]?.sectionTwoTitleSix,

                headingThree: homeData[0]?.headingThree,
                subHeadingThree: homeData[0]?.subHeadingThree,
                descriptionThree: homeData[0]?.descriptionThree,
                subDescription: homeData[0]?.subDescription,
                stateHeading: homeData[0]?.stateHeading,

                headingFour: homeData[0]?.headingFour,
                descriptionFour: homeData[0]?.descriptionFour,
                cardTextOne: homeData[0]?.cardTextOne,
                cardTextTwo: homeData[0]?.cardTextTwo,
                cardTextThree: homeData[0]?.cardTextThree,
                cardTextFour: homeData[0]?.cardTextFour,
                cardCountOne: homeData[0]?.cardCountOne,
                cardCountTwo: homeData[0]?.cardCountTwo,
                cardCountThree: homeData[0]?.cardCountThree,
                cardCountFour: homeData[0]?.cardCountFour,

            });

            if (homeData[0]?.imageOne) {
                setFileList([
                    {
                        uid: '-1',
                        name: homeData[0]?.imageOne,
                        status: 'done',
                        url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/homeImages/original/${homeData[0]?.imageOne}`,
                    },
                ]);
            }

            if (homeData[0]?.sectionTwoImageOne) {
                setFileListOne([
                    {
                        uid: '-2',
                        name: homeData[0]?.sectionTwoImageOne,
                        status: 'done',
                        url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/homeImages/original/${homeData[0]?.sectionTwoImageOne}`,
                    },
                ]);
            }

            if (homeData[0]?.sectionTwoImageTwo) {
                setFileListTwo([
                    {
                        uid: '-3',
                        name: homeData[0]?.sectionTwoImageTwo,
                        status: 'done',
                        url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/homeImages/original/${homeData[0]?.sectionTwoImageTwo}`,
                    },
                ]);
            }

            if (homeData[0]?.sectionTwoImageThree) {
                setFileListThree([
                    {
                        uid: '-4',
                        name: homeData[0]?.sectionTwoImageThree,
                        status: 'done',
                        url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/homeImages/original/${homeData[0]?.sectionTwoImageThree}`,
                    },
                ]);
            }

            if (homeData[0]?.sectionTwoImageFour) {
                setFileListFour([
                    {
                        uid: '-5',
                        name: homeData[0]?.sectionTwoImageFour,
                        status: 'done',
                        url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/homeImages/original/${homeData[0]?.sectionTwoImageFour}`,
                    },
                ]);
            }

            if (homeData[0]?.sectionTwoImageFive) {
                setFileListFive([
                    {
                        uid: '-6',
                        name: homeData[0]?.sectionTwoImageFive,
                        status: 'done',
                        url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/homeImages/original/${homeData[0]?.sectionTwoImageFive}`,
                    },
                ]);
            }

            if (homeData[0]?.sectionTwoImageSix) {
                setFileListSix([
                    {
                        uid: '-7',
                        name: homeData[0]?.sectionTwoImageSix,
                        status: 'done',
                        url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/homeImages/original/${homeData[0]?.sectionTwoImageSix}`,
                    },
                ]);
            }
        }
    }, [homeData]);

    useEffect(() => {
        getData();
    }, []);

    const onFinish = async (values: HomeFormValues) => {
        try {
            const formData = new FormData();

            if (fileList && fileList.length > 0 && fileList[0]?.originFileObj) {
                const file = fileList[0].originFileObj as File;
                formData.append('imageOne', file);
            }

            if (fileListOne && fileListOne.length > 0 && fileListOne[0]?.originFileObj) {
                const file = fileListOne[0].originFileObj as File;
                formData.append('sectionTwoImageOne', file);
            }

            if (fileListTwo && fileListTwo.length > 0 && fileListTwo[0]?.originFileObj) {
                const file = fileListTwo[0].originFileObj as File;
                formData.append('sectionTwoImageTwo', file);
            }
            if (fileListThree && fileListThree.length > 0 && fileListThree[0]?.originFileObj) {
                const file = fileListThree[0].originFileObj as File;
                formData.append('sectionTwoImageThree', file);
            }
            if (fileListFour && fileListFour.length > 0 && fileListFour[0]?.originFileObj) {
                const file = fileListFour[0].originFileObj as File;
                formData.append('sectionTwoImageFour', file);
            }
            if (fileListFive && fileListFive.length > 0 && fileListFive[0]?.originFileObj) {
                const file = fileListFive[0].originFileObj as File;
                formData.append('sectionTwoImageFive', file);
            }
            if (fileListSix && fileListSix.length > 0 && fileListSix[0]?.originFileObj) {
                const file = fileListSix[0].originFileObj as File;
                formData.append('sectionTwoImageSix', file);
            }

            formData.append('headingOne', values.headingOne);
            formData.append('descriptionOne', values.descriptionOne);
            formData.append('buttonOne', values.buttonOne);

            formData.append('headingTwo', values.headingTwo);
            formData.append('subHeadingTwo', values.subHeadingTwo);
            formData.append('sectionTwoTitleOne', values.sectionTwoTitleOne);
            formData.append('sectionTwoTitleTwo', values.sectionTwoTitleTwo);
            formData.append('sectionTwoTitleThree', values.sectionTwoTitleThree);
            formData.append('sectionTwoTitleFour', values.sectionTwoTitleFour);
            formData.append('sectionTwoTitleFive', values.sectionTwoTitleFive);
            formData.append('sectionTwoTitleSix', values.sectionTwoTitleSix);

            formData.append('headingThree', values.headingThree);
            formData.append('subHeadingThree', values.subHeadingThree);
            formData.append('descriptionThree', values.descriptionThree);
            formData.append('subDescription', values.subDescription);
            formData.append('stateHeading', values.stateHeading);

            formData.append('headingFour', values.headingFour);
            formData.append('descriptionFour', values.descriptionFour);
            formData.append('cardTextOne', values.cardTextOne);
            formData.append('cardTextTwo', values.cardTextTwo);
            formData.append('cardTextThree', values.cardTextThree);
            formData.append('cardTextFour', values.cardTextFour);
            formData.append('cardCountOne', values.cardCountOne);
            formData.append('cardCountTwo', values.cardCountTwo);
            formData.append('cardCountThree', values.cardCountThree);
            formData.append('cardCountFour', values.cardCountFour);

            if (editId) {
                formData.append('editId', editId);
            }

            const res = await addFrontendHomePageContent(formData);
            if (res.status === true) {
                getHomepageContent();
                message.success(res.message);
            } else {
                message.error('Failed to add homepage content');
            }
        } catch (error) {
            console.log(error, 'add error');
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

    const handleBeforeUploadFour = async (file: RcFile) => {
        try {
            const compressedFiles = await handleFileCompression(file, '');
            setFileListFour(compressedFiles);
            return false;
        } catch (error) {
            ErrorHandler.showNotification(error);
            return true;
        }
    };

    const handleRemoveFour = () => {
        setFileListFour([]);
    };

    const handleBeforeUploadFive = async (file: RcFile) => {
        try {
            const compressedFiles = await handleFileCompression(file, '');
            setFileListFive(compressedFiles);
            return false;
        } catch (error) {
            ErrorHandler.showNotification(error);
            return true;
        }
    };

    const handleRemoveFive = () => {
        setFileListFive([]);
    };

    const handleBeforeUploadSix = async (file: RcFile) => {
        try {
            const compressedFiles = await handleFileCompression(file, '');
            setFileListSix(compressedFiles);
            return false;
        } catch (error) {
            ErrorHandler.showNotification(error);
            return true;
        }
    };

    const handleRemoveSix = () => {
        setFileListSix([]);
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
                Home Page
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
                            <Form.Item label="Button Text One" name="buttonOne" >
                                <Input placeholder="Enter Button Text" maxLength={100} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} xl={3} sm={5} lg={6}>
                            <Form.Item label=" Image One" name="imageOne">
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

                    <ParaText size="medium" fontWeightBold={600} color="PrimaryColor">
                        Section Two
                    </ParaText>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={12} sm={12}>
                            <Form.Item label="Heading Two" name="headingTwo">
                                <Input placeholder="Enter Second Heading" maxLength={100} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} sm={12}>
                            <Form.Item label="Sub Heading Two" name="subHeadingTwo">
                                <Input placeholder="Enter Sub Heading" maxLength={100} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <Form.Item
                                    label="Title One"
                                    name="sectionTwoTitleOne"
                                >
                                    <Input placeholder="Enter title" />
                                </Form.Item>
                                <Form.Item label=" Image One" name="sectionTwoImageOne">
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

                        <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <Form.Item
                                    label="Title Two"
                                    name="sectionTwoTitleTwo"
                                >
                                    <Input placeholder="Enter title" />
                                </Form.Item>
                                <Form.Item label=" Image Two" name="sectionTwoImageTwo">
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

                        <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <Form.Item
                                    label="Title Three"
                                    name="sectionTwoTitleThree"
                                >
                                    <Input placeholder="Enter title" />
                                </Form.Item>
                                <Form.Item label=" Image Three" name="sectionTwoImageThree">
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

                        <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <Form.Item
                                    label="Title Four"
                                    name="sectionTwoTitleFour"
                                >
                                    <Input placeholder="Enter title" />
                                </Form.Item>
                                <Form.Item label=" Image Four" name="sectionTwoImageFour">
                                    <div style={{ width: "100%", display: 'flex', alignItems: 'center' }}>
                                        <Upload
                                            listType="picture-card"
                                            fileList={fileListFour}
                                            beforeUpload={handleBeforeUploadFour}
                                            onRemove={handleRemoveFour}
                                            onPreview={handlePreview}
                                            style={{ width: '100%', height: '350px' }}
                                        >
                                            {fileListFour.length >= 1 ? null : uploadButton}
                                        </Upload>
                                    </div>

                                </Form.Item>
                            </Space>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <Form.Item
                                    label="Title Five"
                                    name="sectionTwoTitleFive"
                                >
                                    <Input placeholder="Enter title" />
                                </Form.Item>
                                <Form.Item label=" Image Five" name="sectionTwoImageFive">
                                    <div style={{ width: "100%", display: 'flex', alignItems: 'center' }}>
                                        <Upload
                                            listType="picture-card"
                                            fileList={fileListFive}
                                            beforeUpload={handleBeforeUploadFive}
                                            onRemove={handleRemoveFive}
                                            onPreview={handlePreview}
                                            style={{ width: '100%', height: '350px' }}
                                        >
                                            {fileListFive.length >= 1 ? null : uploadButton}
                                        </Upload>
                                    </div>

                                </Form.Item>
                            </Space>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={4} xl={4}>
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <Form.Item
                                    label="Title Six"
                                    name="sectionTwoTitleSix"
                                >
                                    <Input placeholder="Enter title" />
                                </Form.Item>
                                <Form.Item label=" Image Six" name="sectionTwoImageSix">
                                    <div style={{ width: "100%", display: 'flex', alignItems: 'center' }}>
                                        <Upload
                                            listType="picture-card"
                                            fileList={fileListSix}
                                            beforeUpload={handleBeforeUploadSix}
                                            onRemove={handleRemoveSix}
                                            onPreview={handlePreview}
                                            style={{ width: '100%', height: '350px' }}
                                        >
                                            {fileListSix.length >= 1 ? null : uploadButton}
                                        </Upload>
                                    </div>

                                </Form.Item>
                            </Space>
                        </Col>
                    </Row>

                    {/* Section Three */}
                    <div className="mt-5"></div>
                    <ParaText size="medium" fontWeightBold={600} color="PrimaryColor">
                        Section Three
                    </ParaText>
                    <Row gutter={16}>
                        <Col xs={24} md={12} sm={24} xl={12}>
                            <Form.Item label="Heading Three" name="headingThree" >
                                <Input placeholder="Enter Third Heading" maxLength={100} />
                            </Form.Item>
                            <Form.Item label="Sub Heading " name="subHeadingThree" >
                                <Input placeholder="Enter Heading" maxLength={100} />
                            </Form.Item>
                            <Form.Item label="State Heading " name="stateHeading" >
                                <Input placeholder="Enter State Heading" maxLength={100} />
                            </Form.Item>

                        </Col>
                        <Col xs={24} md={12} sm={24} xl={12}>
                            <Col xs={24} md={24} sm={24}>
                                <Form.Item
                                    label="Description Three"
                                    name="descriptionThree"
                                >
                                    <Input.TextArea rows={4} placeholder="Enter Third Description " style={{
                                        width: '100%',
                                        height: '227px'
                                    }} />
                                </Form.Item>
                            </Col>
                        </Col>

                    </Row>

                    {/* {/ Section Four /} */}
                    <div className="mt-5"></div>
                    <ParaText size="medium" fontWeightBold={600} color="PrimaryColor">
                        Section Four
                    </ParaText>
                    <Row gutter={[16, 16]}>

                        <Col xs={24} md={24} sm={24}>
                            <Form.Item label="Heading Four" name="headingFour" >
                                <Input placeholder="Enter Forth Heading" maxLength={100} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={12} sm={12}>
                            <Form.Item label="Card Text One" name="cardTextOne" >
                                <Input placeholder="Enter Card One Text" maxLength={100} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} sm={12}>
                            <Form.Item label="Card Text Two" name="cardTextTwo" >
                                <Input placeholder="Enter Card Two Text" maxLength={100} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} sm={12}>
                            <Form.Item label="Card Text Three" name="cardTextThree" >
                                <Input placeholder="Enter Card Three Text" maxLength={100} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} sm={12}>
                            <Form.Item label="Card Text Four" name="cardTextFour" >
                                <Input placeholder="Enter Card Four Text" maxLength={100} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={12} sm={12}>
                            <Form.Item label="Card Count One" name="cardCountOne" >
                                <InputNumber placeholder="Enter Card One Count" maxLength={100} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} sm={12}>
                            <Form.Item label="Card Count Two" name="cardCountTwo" >
                                <InputNumber placeholder="Enter Card Two Count" maxLength={100} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} sm={12}>
                            <Form.Item label="Card Count Three" name="cardCountThree" >
                                <InputNumber placeholder="Enter Card Three Count" maxLength={100} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} sm={12}>
                            <Form.Item label="Card Count Four" name="cardCountFour" >
                                <InputNumber placeholder="Enter Card Four Count" maxLength={100} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Form.Item
                                label="Description Four"
                                name="descriptionFour"
                            >
                                <Input.TextArea rows={4} placeholder="Enter Forth Description " />
                            </Form.Item>
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
