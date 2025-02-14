import { Form, Input, Button, message, Row, Col, Space, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { AddSectionOne, getSectionData } from '@/lib/adminApi';
import ErrorHandler from '@/lib/ErrorHandler';
import { PlusOutlined } from '@ant-design/icons';
import { handleFileCompression } from '@/lib/commonServices';
import { RcFile } from 'antd/es/upload';
import ParaText from '@/app/commonUl/ParaText';

const SectionOne = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState<any>(null);
    const [updateId, setUpdateId] = useState('')
    const [fileListOne, setFileListOne] = useState<any[]>([])
    const [fileListTwo, setFileListTwo] = useState<any[]>([])
    const [fileListThree, setFileListThree] = useState<any[]>([])
    const [fileListFour, setFileListFour] = useState<any[]>([])
    const [isMobile, setIsMobile] = useState(false)


    useEffect(() => {
        const getData = async () => {
            try {
                const response = await getSectionData();
                if (response && response.data.length > 0) {
                    const sectionData = response.data[0];
                    setUpdateId(sectionData._id);
                    setData(response.data);
                    form.setFieldsValue({
                        heading: sectionData.heading,
                        title1: sectionData.titleOne,
                        description1: sectionData.descriptionOne,
                        title2: sectionData.titleTwo,
                        description2: sectionData.descriptionTwo,
                        title3: sectionData.titleThree,
                        description3: sectionData.descriptionThree,
                        title4: sectionData.titleFour,
                        description4: sectionData.descriptionFour,
                        Achievements: sectionData.achievementsHeading,
                        CountOne: sectionData.countOne,
                        countOneDesc: sectionData.countOneDesc,
                        CountTwo: sectionData.countTwo,
                        CountTwoDesc: sectionData.countTwoDesc,
                        CountThree: sectionData.countThree,
                        CountThreeDesc: sectionData.countThreeDesc,
                        CountFour: sectionData.countFour,
                        CountFourDesc: sectionData.countFourDesc,
                        coreHeading: sectionData.coreHeading,
                        numberOneCore: sectionData.numberOneCore,
                        descriptionCore: sectionData.descriptionCore,
                        numberTwoCore: sectionData.numberTwoCore,
                        descriptionTwoCore: sectionData.descriptionTwoCore,
                        numberThreeCore: sectionData.numberThreeCore,
                        descriptionThreeCore: sectionData.descriptionThreeCore,
                        numberFourCore: sectionData.numberFourCore,
                        descriptionFourCore: sectionData.descriptionFourCore,
                        numberFiveCore: sectionData.numberFiveCore,
                        descriptionFiVeCore: sectionData.descriptionFiVeCore,
                        numberSixCore: sectionData.numberSixCore,
                        descriptionSixCore: sectionData.descriptionSixCore,
                    });
                    if (sectionData.IconOne) {
                        const imageUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL}/WhyChoseUsIcons/original/${sectionData.IconOne}`;

                        setFileListOne([
                            {
                                uid: '-1',
                                name: sectionData.image,
                                status: 'done',
                                url: imageUrl,
                                originFileObj: null,
                            },


                        ]);
                    }
                    if (sectionData.IconTwo) {
                        const imageUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL}/WhyChoseUsIcons/original/${sectionData.IconTwo}`;
                        setFileListTwo([
                            {
                                uid: '-2',
                                name: sectionData.IconTwo,
                                status: 'done',
                                url: imageUrl,
                                originFileObj: null,
                            },
                        ]);
                    }
                    if (sectionData.IconThree) {
                        const imageUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL}/WhyChoseUsIcons/original/${sectionData.IconThree}`;
                        setFileListThree([
                            {
                                uid: '-3',
                                name: sectionData.IconThree,
                                status: 'done',
                                url: imageUrl,
                                originFileObj: null,
                            },
                        ]);
                    }
                    if (sectionData.IconFour) {
                        const imageUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL}/WhyChoseUsIcons/original/${sectionData.IconFour}`;
                        setFileListFour([
                            {
                                uid: '-4',
                                name: sectionData.IconFour,
                                status: 'done',
                                url: imageUrl,
                                originFileObj: null,
                            },
                        ]);
                    }

                }
            } catch (error) {
                console.error('Error fetching section data:', error);
            }
        };

        getData();
    }, []);

    const onFinish = async (values: any) => {
        const formData = new FormData();

        formData.append('heading', values.heading);
        formData.append('titleOne', values.title1);
        formData.append('descriptionOne', values.description1);
        formData.append('titleTwo', values.title2);
        formData.append('descriptionTwo', values.description2);
        formData.append('titleThree', values.title3);
        formData.append('descriptionThree', values.description3);
        formData.append('titleFour', values.title4);
        formData.append('descriptionFour', values.description4);
        formData.append('achievementsHeading', values.Achievements);
        formData.append('countOne', values.CountOne);
        formData.append('countOneDesc', values.countOneDesc);
        formData.append('countTwo', values.CountTwo);
        formData.append('countTwoDesc', values.CountTwoDesc);
        formData.append('countThree', values.CountThree);
        formData.append('countThreeDesc', values.CountThreeDesc);
        formData.append('countFour', values.CountFour);
        formData.append('countFourDesc', values.CountFourDesc);
        formData.append('coreHeading', values.coreHeading);
        formData.append('numberOneCore', values.numberOneCore);
        formData.append('descriptionCore', values.descriptionCore);
        formData.append('numberTwoCore', values.numberTwoCore);
        formData.append('descriptionTwoCore', values.descriptionTwoCore);
        formData.append('numberThreeCore', values.numberThreeCore);
        formData.append('descriptionThreeCore', values.descriptionThreeCore);
        formData.append('numberFourCore', values.numberFourCore);
        formData.append('descriptionFourCore', values.descriptionFourCore);
        formData.append('numberFiveCore', values.numberFiveCore);
        formData.append('descriptionFiVeCore', values.descriptionFiVeCore);
        formData.append('numberSixCore', values.numberSixCore);
        formData.append('descriptionSixCore', values.descriptionSixCore);

        if (updateId) {
            formData.append('updateId', updateId);
        }


        if (fileListOne.length > 0 && fileListOne[0]?.originFileObj) {
            const fileOne = fileListOne[0].originFileObj as File;
            formData.append('IconOne', fileOne);
        }

        if (fileListTwo.length > 0 && fileListTwo[0]?.originFileObj) {
            const fileTwo = fileListTwo[0].originFileObj as File;
            formData.append('IconTwo', fileTwo);
        }

        if (fileListThree.length > 0 && fileListThree[0]?.originFileObj) {
            const fileThree = fileListThree[0].originFileObj as File;
            formData.append('IconThree', fileThree);
        }

        if (fileListFour.length > 0 && fileListFour[0]?.originFileObj) {
            const fileFour = fileListFour[0].originFileObj as File;
            formData.append('IconFour', fileFour);
        }

        try {
            const response = await AddSectionOne(formData);
            if (response) {
                message.success(response.message);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };


    const handleBeforeUpload = async (file: RcFile) => {
        try {
            const compressedFiles = await handleFileCompression(file, '');
            setFileListOne(compressedFiles);
            return false;
        } catch (error) {
            ErrorHandler.showNotification(error);
            return true;
        }
    };

    const handleRemove = (file: any) => {
        setFileListOne((prev) => prev.filter((item) => item.uid !== file.uid));
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

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

    const handleRemoveTwo = (file: any) => {
        setFileListTwo((prev) => prev.filter((item) => item.uid !== file.uid));
    };

    const uploadButtonTwo = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
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

    const handleRemoveThree = (file: any) => {
        setFileListThree((prev) => prev.filter((item) => item.uid !== file.uid));
    };

    const uploadButtonThree = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
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

    const handleRemoveFour = (file: any) => {
        setFileListFour((prev) => prev.filter((item) => item.uid !== file.uid));
    };

    const uploadButtonFour = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        handleResize();
        window.addEventListener('resize', handleResize)
        return () => {
            window.addEventListener('resize', handleResize)
        }
    }, [])
    return (
        <>
            <ParaText size="large" fontWeightBold={600} color="PrimaryColor">
                Why Choose Us
            </ParaText>
            <div className={`${isMobile ? 'mobile-view' : 'desktop-view'} card-dash shadow-none top-medium-space`} >

                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Heading"
                        name="heading"
                    >
                        <Input placeholder="Enter heading" maxLength={60} type='text' />
                    </Form.Item>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={6} sm={12}>
                            <Form.Item
                                name="IconOne"
                                label="Icon One"
                                rules={[
                                    {
                                        message: 'Please upload an image',
                                        validator: (_, value) => {
                                            if (fileListOne.length > 0 || value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject('Please upload an image');
                                        },
                                    },
                                ]}
                            >
                                <Upload
                                    listType="picture-card"
                                    fileList={fileListOne}
                                    beforeUpload={handleBeforeUpload}
                                    onRemove={handleRemove}
                                    accept="image/*"
                                >
                                    {fileListOne.length >= 1 ? null : uploadButton}
                                </Upload>
                            </Form.Item>
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <Form.Item label="Title One" name="title1" >
                                    <Input placeholder="Enter title" maxLength={60} type='text' />
                                </Form.Item>
                                <Form.Item label="Description One" name="description1">
                                    <Input.TextArea placeholder="Enter description" rows={4} />
                                </Form.Item>
                            </Space>
                        </Col>

                        <Col sm={12} xs={24} md={6}>
                            <Form.Item
                                name="IconTwo"
                                label="Icon Two"
                                rules={[
                                    {
                                        message: 'Please upload an image',
                                        validator: (_, value) => {
                                            if (fileListTwo.length > 0 || value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject('Please upload an image');
                                        },
                                    },
                                ]}
                            >
                                <Upload
                                    listType="picture-card"
                                    fileList={fileListTwo}
                                    beforeUpload={handleBeforeUploadTwo}
                                    onRemove={handleRemoveTwo}
                                    accept="image/*"
                                >
                                    {fileListTwo.length >= 1 ? null : uploadButtonTwo}
                                </Upload>
                            </Form.Item>
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <Form.Item label="Title Two" name="title2">
                                    <Input placeholder="Enter title" />
                                </Form.Item>
                                <Form.Item label="Description Two" name="description2">
                                    <Input.TextArea placeholder="Enter description" rows={4} />
                                </Form.Item>
                            </Space>
                        </Col>

                        <Col xs={24} md={6} sm={12}>
                            <Form.Item
                                name="IconThree"
                                label="Icon Three"
                                rules={[
                                    {
                                        message: 'Please upload an image',
                                        validator: (_, value) => {
                                            if (fileListThree.length > 0 || value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject('Please upload an image');
                                        },
                                    },
                                ]}
                            >
                                <Upload
                                    listType="picture-card"
                                    fileList={fileListThree}
                                    beforeUpload={handleBeforeUploadThree}
                                    onRemove={handleRemoveThree}
                                    accept="image/*"
                                >
                                    {fileListThree.length >= 1 ? null : uploadButtonThree}
                                </Upload>
                            </Form.Item>
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <Form.Item label="Title Three" name="title3">
                                    <Input placeholder="Enter title" />
                                </Form.Item>
                                <Form.Item label="Description Three" name="description3">
                                    <Input.TextArea placeholder="Enter description" rows={4} />
                                </Form.Item>
                            </Space>
                        </Col>

                        <Col xs={24} md={6} sm={12}>
                            <Form.Item
                                name="IconFour"
                                label="Icon Four"
                                rules={[
                                    {
                                        message: 'Please upload an image',
                                        validator: (_, value) => {
                                            if (fileListFour.length > 0 || value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject('Please upload an image');
                                        },
                                    },
                                ]}
                            >
                                <Upload
                                    listType="picture-card"
                                    fileList={fileListFour}
                                    beforeUpload={handleBeforeUploadFour}
                                    onRemove={handleRemoveFour}
                                    accept="image/*"
                                >
                                    {fileListFour.length >= 1 ? null : uploadButtonFour}
                                </Upload>
                            </Form.Item>
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <Form.Item label="Title Four" name="title4">
                                    <Input placeholder="Enter title" />
                                </Form.Item>
                                <Form.Item label="Description Four" name="description4">
                                    <Input.TextArea placeholder="Enter description" rows={4} />
                                </Form.Item>
                            </Space>
                        </Col>
                    </Row>



                    <Row gutter={[16, 16]}>
                        <Col span={24}>

                            <Form.Item
                                label="Section Three"
                                name="Achievements"
                            >
                                <Input placeholder="Enter Heading" />
                            </Form.Item></Col>
                        <Col xs={12} md={6} sm={12}>

                            <Form.Item
                                label="Count One"
                                name="CountOne"
                            >
                                <Input placeholder="Enter Count" />
                            </Form.Item>
                            <Form.Item
                                label=""
                                name="countOneDesc"
                            >
                                <Input.TextArea placeholder="Enter Description" rows={4} />

                            </Form.Item>
                        </Col>
                        <Col xs={12} md={6} sm={12}>

                            <Form.Item
                                label="Count Two"
                                name="CountTwo"
                            >
                                <Input placeholder="Enter Count" />
                            </Form.Item>
                            <Form.Item
                                label=""
                                name="CountTwoDesc"
                            >
                                <Input.TextArea placeholder="Enter Description" rows={4} />
                            </Form.Item>
                        </Col>
                        <Col xs={12} md={6} sm={12}>

                            <Form.Item
                                label="Count Three"
                                name="CountThree"
                            >
                                <Input placeholder="Enter Count" />
                            </Form.Item>
                            <Form.Item
                                label=""
                                name="CountThreeDesc"
                            >
                                <Input.TextArea placeholder="Enter Description" rows={4} />
                            </Form.Item>
                        </Col>
                        <Col xs={12} md={6} sm={12}>

                            <Form.Item
                                label="Count Four"
                                name="CountFour"
                            >
                                <Input placeholder="Enter Count" />
                            </Form.Item>
                            <Form.Item
                                label=""
                                name="CountFourDesc"
                            >
                                <Input.TextArea placeholder="Enter Description" rows={4} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Form.Item
                                label="Section Four"
                                name="coreHeading"
                            >
                                <Input placeholder="Enter Heading" />
                            </Form.Item>
                        </Col>

                        <Col xs={12} md={8} sm={8}>
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <Form.Item
                                    label="Title One"
                                    name="numberOneCore"
                                >
                                    <Input placeholder="Enter title" />
                                </Form.Item>
                                <Form.Item
                                    label="Description One"
                                    name="descriptionCore"
                                >
                                    <Input.TextArea placeholder="Enter description" rows={4} />
                                </Form.Item>
                            </Space>
                        </Col>

                        <Col xs={12} md={8} sm={8}>
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <Form.Item
                                    label="Title two"
                                    name="numberTwoCore"
                                >
                                    <Input placeholder="Enter title" />
                                </Form.Item>
                                <Form.Item
                                    label="Description Two"
                                    name="descriptionTwoCore"
                                >
                                    <Input.TextArea placeholder="Enter description" rows={4} />
                                </Form.Item>
                            </Space>
                        </Col>

                        <Col xs={12} md={8} sm={8}>
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <Form.Item
                                    label="Title Three"
                                    name="numberThreeCore"
                                >
                                    <Input placeholder="Enter title" />
                                </Form.Item>
                                <Form.Item
                                    label="Description Three"
                                    name="descriptionThreeCore"
                                >
                                    <Input.TextArea placeholder="Enter description" rows={4} />
                                </Form.Item>
                            </Space>
                        </Col>

                        <Col xs={12} md={8} sm={8}>
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <Form.Item
                                    label="Title Four"
                                    name="numberFourCore"
                                >
                                    <Input placeholder="Enter title" />
                                </Form.Item>
                                <Form.Item
                                    label="Description Four"
                                    name="descriptionFourCore"
                                >
                                    <Input.TextArea placeholder="Enter description" rows={4} />
                                </Form.Item>
                            </Space>
                        </Col>
                        <Col xs={12} md={8} sm={8}>
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <Form.Item
                                    label="Title Five"
                                    name="numberFiveCore"
                                >
                                    <Input placeholder="Enter title" />
                                </Form.Item>
                                <Form.Item
                                    label="Description Five"
                                    name="descriptionFiVeCore"
                                >
                                    <Input.TextArea placeholder="Enter description" rows={4} />
                                </Form.Item>
                            </Space>
                        </Col>

                        <Col xs={12} md={8} sm={8}>
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <Form.Item
                                    label="Title Six"
                                    name="numberSixCore"
                                >
                                    <Input placeholder="Enter title" />
                                </Form.Item>
                                <Form.Item
                                    label="Description Six"
                                    name="descriptionSixCore"
                                >
                                    <Input.TextArea placeholder="Enter description" rows={4} />
                                </Form.Item>
                            </Space>
                        </Col>
                    </Row>


                    <Form.Item wrapperCol={{ span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Save
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default SectionOne;
