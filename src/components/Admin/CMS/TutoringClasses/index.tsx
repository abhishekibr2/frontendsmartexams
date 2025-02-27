'use client';
import React, { useEffect, useState } from 'react';
import { Form, Input, Row, Col, Upload, Button, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { PlusOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/es/upload';
import { handleFileCompression } from '@/lib/commonServices';
import ErrorHandler from '@/lib/ErrorHandler';
import { AddTutorial, GetTutorial } from '@/lib/adminApi';
import ParaText from '@/app/commonUl/ParaText';
import './style.css'

interface props {
    activeKey: string;
}

const TutoringClass = ({ activeKey }: props) => {
    const [fileList, setFileList] = useState<any[]>([]);
    const [form] = Form.useForm();
    const [updateId, setUpdateId] = useState('')
    const [isMobile, setIsMobile] = useState(false)

    const getTutorialDataHandler = async () => {
        try {
            const response = await GetTutorial();
            const tutorialData = response[0];
            setUpdateId(tutorialData._id);
            form.setFieldsValue({
                title: tutorialData.title,
                description: tutorialData.description,
                mainHeading: tutorialData.mainHeading,
                VirtualInstruction: tutorialData.VirtualInstruction,
                expertTutors: tutorialData.expertTutors,
                classRecording: tutorialData.classRecording,
                // English Fields
                englishOne: tutorialData.englishOne,
                englishTwo: tutorialData.englishTwo,
                englishThree: tutorialData.englishThree,
                englishFour: tutorialData.englishFour,
                englishFive: tutorialData.englishFive,
                englishSix: tutorialData.englishSix,
                // Math Fields
                MathOne: tutorialData.MathOne,
                MathTwo: tutorialData.MathTwo,
                MathThree: tutorialData.MathThree,
                MathFour: tutorialData.MathFour,
                MathFive: tutorialData.MathFive,
                MathSix: tutorialData.MathSix,
                // Section Three Fields
                readingUpperLevel: tutorialData.readingUpperLevel,
                readingUpperLevelDesc: tutorialData.readingUpperLevelDesc,
                readingLowerLevel: tutorialData.readingLowerLevel,
                readingLowerLevelDesc: tutorialData.readingLowerLevelDesc,
                writingLevel: tutorialData.writingLevel,
                WritingDesc: tutorialData.WritingDesc,
                verbalLevel: tutorialData.verbalLevel,
                verbalLevelDesc: tutorialData.verbalLevelDesc,
                // Math Section Fields for Upper/Lower Levels and Descriptions
                readingUpperLevelMath: tutorialData.readingUpperLevelMath,
                readingUpperLevelDescMath: tutorialData.readingUpperLevelDescMath,
                readingLowerLevelMath: tutorialData.readingLowerLevelMath,
                readingLowerLevelDescMath: tutorialData.readingLowerLevelDescMath,
                writingMath: tutorialData.writingMath,
                writingDescMath: tutorialData.writingDescMath,
                verbalLevelMath: tutorialData.verbalLevelMath,
                verbalLevelDescMath: tutorialData.verbalLevelDescMath,
                // Sub Heading Fields
                subHeadingEnglishOne: tutorialData.subHeadingEnglishOne,
                subHeadingEnglishTwo: tutorialData.subHeadingEnglishTwo,
                subHeadingEnglishThree: tutorialData.subHeadingEnglishThree,
                subHeadingEnglishFour: tutorialData.subHeadingEnglishFour,
                subHeadingEnglishFive: tutorialData.subHeadingEnglishFive,
                subHeadingEnglishSix: tutorialData.subHeadingEnglishSix,
                subHeadingEnglishSeven: tutorialData.subHeadingEnglishSeven,
                subHeadingEnglishEight: tutorialData.subHeadingEnglishEight,
                subHeadingMathOne: tutorialData.subHeadingMathOne,
                subHeadingMathTwo: tutorialData.subHeadingMathTwo,
                subHeadingMathThree: tutorialData.subHeadingMathThree,
                subHeadingMathFour: tutorialData.subHeadingMathFour,
                subHeadingMathFive: tutorialData.subHeadingMathFive,
                subHeadingMathSix: tutorialData.subHeadingMathSix,
                subHeadingMathSeven: tutorialData.subHeadingMathSeven,
                subHeadingMathEight: tutorialData.subHeadingMathEight,

                // English Section Fields for Upper/Lower Levels and Descriptions
                titleyrFiveSix: tutorialData.titleyrFiveSix,
                titleyrFiveSixDesc: tutorialData.titleyrFiveSixDesc,
                subHeadingOneYrFiveSix: tutorialData.subHeadingOneYrFiveSix,
                subHeadingTwoYrFiveSix: tutorialData.subHeadingTwoYrFiveSix,
                titleyrSixSeven: tutorialData.titleyrSixSeven,
                titleyrSixSevenDesc: tutorialData.titleyrSixSevenDesc,
                subHeadingOneYrSixSeven: tutorialData.subHeadingOneYrSixSeven,
                subHeadingTwoYrSixSeven: tutorialData.subHeadingTwoYrSixSeven,

                // Math Section Fields for Upper/Lower Levels and Descriptions
                titleyrMathFiveSix: tutorialData.titleyrMathFiveSix,
                titleYrMathFiveSixDesc: tutorialData.titleYrMathFiveSixDesc,
                subHeadingMathOneYrFiveSix: tutorialData.subHeadingMathOneYrFiveSix,
                subHeadingMathTwoYrFiveSix: tutorialData.subHeadingMathTwoYrFiveSix,
                titleyrMathSixSeven: tutorialData.titleyrMathSixSeven,
                titleYrMathSixSevenDesc: tutorialData.titleYrMathSixSevenDesc,
                subHeadingMathOneYrSixSeven: tutorialData.subHeadingMathOneYrSixSeven,
                subHeadingMathTwoYrSixSeven: tutorialData.subHeadingMathTwoYrSixSeven,
            });

            // Handle image if available
            if (tutorialData.image) {
                const imageUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL}/tutorialsImage/original/${tutorialData.image}`;
                setFileList([
                    {
                        uid: '-1',
                        name: tutorialData.image,
                        status: 'done',
                        url: imageUrl,
                        originFileObj: null,
                    },
                ]);
            } else {
                setFileList([]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getTutorialDataHandler();
    }, []);

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

    const handleRemove = (file: any) => {
        setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const onFinish = async (values: any) => {
        const formData = new FormData();

        // Append the input values
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('mainHeading', values.mainHeading);

        // English class subheadings
        formData.append('englishOne', values.englishOne || '');
        formData.append('englishTwo', values.englishTwo || '');
        formData.append('englishThree', values.englishThree || '');
        formData.append('englishFour', values.englishFour || '');
        formData.append('englishFive', values.englishFive || '');
        formData.append('englishSix', values.englishSix || '');
        // Math class subheadings
        formData.append('MathOne', values.MathOne || '');
        formData.append('MathTwo', values.MathTwo || '');
        formData.append('MathThree', values.MathThree || '');
        formData.append('MathFour', values.MathFour || '');
        formData.append('MathFive', values.MathFive || '');
        formData.append('MathSix', values.MathSix || '');

        // Levels and descriptions
        formData.append('readingUpperLevel', values.readingUpperLevel || '');
        formData.append('readingLowerLevel', values.readingLowerLevel || '');
        formData.append('writingLevel', values.writingLevel || '');
        formData.append('verbalLevel', values.verbalLevel || '');
        formData.append('readingUpperLevelDesc', values.readingUpperLevelDesc || '');
        formData.append('readingLowerLevelDesc', values.readingLowerLevelDesc || '');
        formData.append('WritingDesc', values.WritingDesc || '');
        formData.append('verbalLevelDesc', values.verbalLevelDesc || '');

        formData.append('readingUpperLevelMath', values.readingUpperLevelMath || '');
        formData.append('readingUpperLevelDescMath', values.readingUpperLevelDescMath || '');
        formData.append('readingLowerLevelMath', values.readingLowerLevelMath || '');
        formData.append('readingLowerLevelDescMath', values.readingLowerLevelDescMath || '');
        formData.append('writingMath', values.writingMath || '');
        formData.append('writingDescMath', values.writingLevelDescMath || '');
        formData.append('verbalLevelMath', values.verbalLevelMath || '');
        formData.append('verbalLevelDescMath', values.verbalLevelDescMath || '');

        // Add the subheading fields for both English and Math classes
        formData.append('subHeadingEnglishOne', values.subHeadingEnglishOne || '');
        formData.append('subHeadingEnglishTwo', values.subHeadingEnglishTwo || '');
        formData.append('subHeadingEnglishThree', values.subHeadingEnglishThree || '');
        formData.append('subHeadingEnglishFour', values.subHeadingEnglishFour || '');
        formData.append('subHeadingEnglishFive', values.subHeadingEnglishFive || '');
        formData.append('subHeadingEnglishSix', values.subHeadingEnglishSix || '');
        formData.append('subHeadingEnglishSeven', values.subHeadingEnglishSeven || '');
        formData.append('subHeadingEnglishEight', values.subHeadingEnglishEight || '');

        formData.append('subHeadingMathOne', values.subHeadingMathOne || '');
        formData.append('subHeadingMathTwo', values.subHeadingMathTwo || '');
        formData.append('subHeadingMathThree', values.subHeadingMathThree || '');
        formData.append('subHeadingMathFour', values.subHeadingMathFour || '');
        formData.append('subHeadingMathFive', values.subHeadingMathFive || '');
        formData.append('subHeadingMathSix', values.subHeadingMathSix || '');
        formData.append('subHeadingMathSeven', values.subHeadingMathSeven || '');
        formData.append('subHeadingMathEight', values.subHeadingMathEight || '');

        formData.append('titleyrFiveSix', values.titleyrFiveSix || '');
        formData.append('titleyrFiveSixDesc', values.titleyrFiveSixDesc || '');
        formData.append('subHeadingOneYrFiveSix', values.subHeadingOneYrFiveSix || '');
        formData.append('subHeadingTwoYrFiveSix', values.subHeadingTwoYrFiveSix || '');
        formData.append('titleyrSixSeven', values.titleyrSixSeven || '');
        formData.append('titleyrSixSevenDesc', values.titleyrSixSevenDesc || '');
        formData.append('subHeadingOneYrSixSeven', values.subHeadingOneYrSixSeven || '');
        formData.append('subHeadingTwoYrSixSeven', values.subHeadingTwoYrSixSeven || '');

        formData.append('titleyrMathFiveSix', values.titleyrMathFiveSix || '');
        formData.append('titleYrMathFiveSixDesc', values.titleYrMathFiveSixDesc || '');
        formData.append('subHeadingMathOneYrFiveSix', values.subHeadingMathOneYrFiveSix || '');
        formData.append('subHeadingMathTwoYrFiveSix', values.subHeadingMathTwoYrFiveSix || '');
        formData.append('titleyrMathSixSeven', values.titleyrMathSixSeven || '');
        formData.append('titleYrMathSixSevenDesc', values.titleYrMathSixSevenDesc || '');
        formData.append('subHeadingMathOneYrSixSeven', values.subHeadingMathOneYrSixSeven || '');
        formData.append('subHeadingMathTwoYrSixSeven', values.subHeadingMathTwoYrSixSeven || '');


        formData.append('VirtualInstruction', values.VirtualInstruction || '');
        formData.append('expertTutors', values.expertTutors || '');
        formData.append('classRecording', values.classRecording || '');

        if (fileList && fileList.length > 0 && fileList[0]?.originFileObj) {
            const file = fileList[0].originFileObj as File;
            formData.append('image', file);
        } else {
            const file = fileList[0]?.name;
            formData.append('image', file as string);
        }

        if (updateId) {
            formData.append('updateId', updateId);
        }

        const res = await AddTutorial(formData);
        if (res) {
            message.success('Tutorial updated successfully!');
            getTutorialDataHandler();
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [])


    return (
        <>
            <ParaText size="large" fontWeightBold={600} color="PrimaryColor">
                Tutoring Classes
            </ParaText>
            <div className={`${isMobile ? 'mobile-view' : 'desktop-view'} card-dash shadow-none top-medium-space`} >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <ParaText size="medium" fontWeightBold={600} color="PrimaryColor">
                        Section One
                    </ParaText>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Form.Item
                                name="title"
                                label="Title"
                                rules={[
                                    { required: true, message: 'Please enter a title!' },
                                ]}
                            >
                                <Input placeholder="Enter Title" maxLength={150} />
                            </Form.Item>
                        </Col>
                        <Col xl={21} xs={24} sm={24} md={24}>
                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[
                                    { required: true, message: 'Please enter a description!' },
                                ]}
                            >
                                <Input.TextArea
                                    placeholder="Enter Description"
                                    rows={5}
                                    showCount
                                    maxLength={900}
                                />
                            </Form.Item>

                        </Col>
                        <Col xl={3} xs={24} sm={24} md={24}>
                            <Form.Item
                                name="image"
                                label="Image"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please upload an image',
                                        validator: (_, value) => {
                                            if (fileList.length > 0 || value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject('Please upload an image');
                                        }
                                    },
                                ]}
                            >
                                <Upload
                                    listType="picture-card"
                                    fileList={fileList}
                                    beforeUpload={handleBeforeUpload}
                                    onRemove={handleRemove}
                                    accept="image/*"
                                >
                                    {fileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>


                    <section>
                        <ParaText size="medium" fontWeightBold={600} color="PrimaryColor">
                            Section Two
                        </ParaText>                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={24} sm={24}>
                                <Form.Item label='Main Heading' name='mainHeading'>
                                    <Input placeholder="Enter Main Heading" maxLength={50} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8} sm={12}>
                                <Form.Item label='English One' name='englishOne'>
                                    <Input placeholder="Enter English One" maxLength={50} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8} sm={12}>
                                <Form.Item label='English Two' name='englishTwo'>
                                    <Input placeholder="Enter English Two" maxLength={50} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8} sm={12}>
                                <Form.Item label='English Three' name='englishThree'>
                                    <Input placeholder="Enter English Three" maxLength={50} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8} sm={12}>
                                <Form.Item label='English Four' name='englishFour'>
                                    <Input placeholder="Enter English Four" maxLength={50} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8} sm={12}>
                                <Form.Item label='English Five' name='englishFive'>
                                    <Input placeholder="Enter English Five" maxLength={50} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8} sm={12}>
                                <Form.Item label='English Six' name='englishSix'>
                                    <Input placeholder="Enter English Six" maxLength={50} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={8} sm={8}>
                                <Form.Item label='Math One' name='MathOne'>
                                    <Input placeholder="Enter Math One" maxLength={50} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8} sm={8}>
                                <Form.Item label='Math Two' name='MathTwo'>
                                    <Input placeholder="Enter Math Two" maxLength={50} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8} sm={8}>
                                <Form.Item label='Math Three' name='MathThree'>
                                    <Input placeholder="Enter Math Three" maxLength={50} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8} sm={8}>
                                <Form.Item label='Math Four' name='MathFour'>
                                    <Input placeholder="Enter Math Four" maxLength={50} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8} sm={8}>
                                <Form.Item label='Math Five' name='MathFive'>
                                    <Input placeholder="Enter Math Five" maxLength={50} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8} sm={8}>
                                <Form.Item label='Math Six' name='MathSix'>
                                    <Input placeholder="Enter Math Six" maxLength={50} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </section>

                    <section>
                        <ParaText size="medium" fontWeightBold={600} color="PrimaryColor">
                            Section Three English Classes
                        </ParaText>
                        <Row gutter={[16, 16]}>
                            <Col xs={12} md={12} sm={12}>
                                <Form.Item label='Enter Reading Upper Level' name='readingUpperLevel'>
                                    <Input placeholder="Enter Reading Upper Level" maxLength={50} />
                                </Form.Item>
                                <Form.Item name='readingUpperLevelDesc' label='Upper Level Description '>
                                    <Input.TextArea placeholder='Enter Reading Upper Level Description' rows={4} style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item name='subHeadingEnglishOne' label='Sub Heading One'>
                                    <Input placeholder='Sub Heading One' />
                                </Form.Item>
                                <Form.Item name='subHeadingEnglishTwo' label='Sub Heading Two'>
                                    <Input placeholder='Sub Heading Two' />
                                </Form.Item>
                            </Col>
                            <Col xs={12} md={12} sm={12}>
                                <Form.Item label='Enter Reading Lower Level' name='readingLowerLevel'>
                                    <Input placeholder="Enter Reading Lower Level" maxLength={50} />
                                </Form.Item>
                                <Form.Item name='readingLowerLevelDesc' label='Upper Lower Level Description '>
                                    <Input.TextArea placeholder='Enter Reading Lower Level Description' rows={4} style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item name='subHeadingEnglishThree' label='Sub Heading One'>
                                    <Input placeholder='Sub Heading One' />
                                </Form.Item>
                                <Form.Item name='subHeadingEnglishFour' label='Sub Heading Two'>
                                    <Input placeholder='Sub Heading Two' />
                                </Form.Item>
                            </Col>
                            <Col xs={12} md={12} sm={12}>
                                <Form.Item label='Enter Writing' name='writingLevel'>
                                    <Input placeholder="Enter Writing Level" maxLength={50} />
                                </Form.Item>
                                <Form.Item name='WritingDesc' label='Upper Writing Level Description '>
                                    <Input.TextArea placeholder='Enter Writing Level Description' rows={4} style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item name='subHeadingEnglishFive' label='Sub Heading One'>
                                    <Input placeholder='Sub Heading One' />
                                </Form.Item>
                                <Form.Item name='subHeadingEnglishSix' label='Sub Heading Two'>
                                    <Input placeholder='Sub Heading Two' />
                                </Form.Item>
                            </Col>
                            <Col xs={12} md={12} sm={12}>
                                <Form.Item label='Enter Verbal' name='verbalLevel'>
                                    <Input placeholder="Enter Verbal Level" maxLength={50} />
                                </Form.Item>
                                <Form.Item name='verbalLevelDesc' label='Upper Verbal Level Description '>
                                    <Input.TextArea placeholder='Enter Verbal Level Description' rows={4} style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item name='subHeadingEnglishSeven' label='Sub Heading One'>
                                    <Input placeholder='Sub Heading One' />
                                </Form.Item>
                                <Form.Item name='subHeadingEnglishEight' label='Sub Heading Two'>
                                    <Input placeholder='Sub Heading Two' />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} sm={12}>
                                <Form.Item label="Enter English Title Yr5-Yr6" name="titleyrFiveSix">
                                    <Input placeholder="Enter Verbal Level" maxLength={50} />
                                </Form.Item>
                                <Form.Item name="titleyrFiveSixDesc" label="Upper Verbal Level Math Description">
                                    <Input.TextArea placeholder="Enter Verbal Math Level Description" rows={4} style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item name='subHeadingOneYrFiveSix' label='Sub Heading One'>
                                    <Input placeholder='Sub Heading One' />
                                </Form.Item>
                                <Form.Item name='subHeadingTwoYrFiveSix' label='Sub Heading Two'>
                                    <Input placeholder='Sub Heading Two' />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} sm={12}>
                                <Form.Item label="Enter English Title Yr6-Yr7" name="titleyrSixSeven">
                                    <Input placeholder="Enter Verbal Level" maxLength={50} />
                                </Form.Item>
                                <Form.Item name="titleyrSixSevenDesc" label="Upper Verbal Level Math Description">
                                    <Input.TextArea placeholder="Enter Verbal Math Level Description" rows={4} style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item name='subHeadingOneYrSixSeven' label='Sub Heading One'>
                                    <Input placeholder='Sub Heading One' />
                                </Form.Item>
                                <Form.Item name='subHeadingTwoYrSixSeven' label='Sub Heading Two'>
                                    <Input placeholder='Sub Heading Two' />
                                </Form.Item>
                            </Col>
                        </Row>
                    </section>
                    <section>
                        <ParaText size="medium" fontWeightBold={600} color="PrimaryColor">
                            Section Four Math Classes
                        </ParaText>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={12} sm={12}>
                                <Form.Item label="Enter Reading Upper Level Math" name="readingUpperLevelMath">
                                    <Input placeholder="Enter Reading Upper Level Math" maxLength={50} />
                                </Form.Item>
                                <Form.Item name="readingUpperLevelDescMath" label="Upper Level Math Description">
                                    <Input.TextArea placeholder="Enter Reading Upper Level Math Description" rows={4} style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item name='subHeadingMathOne' label='Sub Heading One'>
                                    <Input placeholder='Sub Heading One' />
                                </Form.Item>
                                <Form.Item name='subHeadingMathTwo' label='Sub Heading Two'>
                                    <Input placeholder='Sub Heading Two' />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} sm={12}>
                                <Form.Item label="Enter Reading Lower Math Level" name="readingLowerLevelMath">
                                    <Input placeholder="Enter Reading Lower Math Level" maxLength={50} />
                                </Form.Item>
                                <Form.Item name="readingLowerLevelDescMath" label="Enter Lower Level Math Description">
                                    <Input.TextArea placeholder="Enter Reading Lower Level Description" rows={4} style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item name='subHeadingMathThree' label='Sub Heading One'>
                                    <Input placeholder='Sub Heading One' />
                                </Form.Item>
                                <Form.Item name='subHeadingMathFour' label='Sub Heading Two'>
                                    <Input placeholder='Sub Heading Two' />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} sm={12}>
                                <Form.Item label="Enter Writing Math Level" name="writingMath">
                                    <Input placeholder="Enter Writing Math Level" maxLength={50} />
                                </Form.Item>
                                <Form.Item name="writingLevelDescMath" label="Upper Writing Level Math Description">
                                    <Input.TextArea placeholder="Enter Writing Level Description" rows={4} style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item name='subHeadingMathFive' label='Sub Heading One'>
                                    <Input placeholder='Sub Heading One' />
                                </Form.Item>
                                <Form.Item name='subHeadingMathSix' label='Sub Heading Two'>
                                    <Input placeholder='Sub Heading Two' />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} sm={12}>
                                <Form.Item label="Enter Verbal Math" name="verbalLevelMath">
                                    <Input placeholder="Enter Verbal Level" maxLength={50} />
                                </Form.Item>
                                <Form.Item name="verbalLevelDescMath" label="Upper Verbal Level Math Description">
                                    <Input.TextArea placeholder="Enter Verbal Math Level Description" rows={4} style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item name='subHeadingMathSeven' label='Sub Heading One'>
                                    <Input placeholder='Sub Heading One' />
                                </Form.Item>
                                <Form.Item name='subHeadingMathEight' label='Sub Heading Two'>
                                    <Input placeholder='Sub Heading Two' />
                                </Form.Item>
                            </Col>
                            {/* ======= */}

                            <Col xs={24} md={12} sm={12}>
                                <Form.Item label="Enter Math Title Yr5-Yr6" name="titleyrMathFiveSix">
                                    <Input placeholder="Enter Verbal Level" maxLength={50} />
                                </Form.Item>
                                <Form.Item name="titleYrMathFiveSixDesc" label="Upper Verbal Level Math Description">
                                    <Input.TextArea placeholder="Enter Verbal Math Level Description" rows={4} style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item name='subHeadingMathOneYrFiveSix' label='Sub Heading One'>
                                    <Input placeholder='Sub Heading One' />
                                </Form.Item>
                                <Form.Item name='subHeadingMathTwoYrFiveSix' label='Sub Heading Two'>
                                    <Input placeholder='Sub Heading Two' />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} sm={12}>
                                <Form.Item label="Enter Math Title Yr6-Yr7" name="titleyrMathSixSeven">
                                    <Input placeholder="Enter Verbal Level" maxLength={50} />
                                </Form.Item>
                                <Form.Item name="titleYrMathSixSevenDesc" label="Upper Verbal Level Math Description">
                                    <Input.TextArea placeholder="Enter Verbal Math Level Description" rows={4} style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item name='subHeadingMathOneYrSixSeven' label='Sub Heading One'>
                                    <Input placeholder='Sub Heading One' />
                                </Form.Item>
                                <Form.Item name='subHeadingMathTwoYrSixSeven' label='Sub Heading Two'>
                                    <Input placeholder='Sub Heading Two' />
                                </Form.Item>
                            </Col>
                        </Row>
                    </section>

                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </Form>
            </div >
        </>
    );
};

export default TutoringClass;
