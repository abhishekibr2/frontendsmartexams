'use client';

import React, { useState } from 'react';
import {
    Card,
    Col,
    Form,
    Row,
    Upload as AntdUpload,
    UploadProps,
    message,
    Button,
    Typography,
    FormInstance,
    Spin,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Question } from '@/lib/types';
import ParagraphFormItem from '@/components/QuestionForm/ParagraphFormItem';
import mammoth from 'mammoth';

const { Dragger } = AntdUpload;

interface UploadFileProps {
    next: () => void;
    prev: () => void;
    form: FormInstance;
    questions: Question[];
    setQuestions: (question: Question[]) => void;
    defaultQuestionData?: any;
    setDefaultQuestionData: (questionData: Question[]) => void;
}

export default function Upload({
    next,
    form
}: UploadFileProps) {
    const [fileList, setFileList] = useState<any[]>([]);
    const [comprehensionData, setComprehensionData] = useState<any>([])
    const [loading, setLoading] = useState(false)

    const handleDocxFileUpload = async (file: any) => {
        const reader = new FileReader();

        reader.onloadend = async (e: any) => {
            const arrayBuffer = e.target.result;
            try {
                const result = await mammoth.extractRawText({ arrayBuffer });
                const docContent = result.value;
                const questionData: any = parseDocContent(docContent);

                if (!questionData) {
                    message.error('The DOCX file format is incorrect or missing required sections (topic, sub-topic, comprehension, questions).');
                    return;
                }

                if (!questionData.topic) {
                    message.error('The DOCX file is missing the topic section.');
                    return;
                }

                if (!questionData.subTopic) {
                    message.error('The DOCX file is missing the sub-topic section.');
                    return;
                }

                if (!questionData.comprehension || questionData.comprehension.length === 0) {
                    message.error('The DOCX file is missing comprehension questions.');
                    return;
                }

                for (const question of questionData.comprehension) {
                    if (!question.questionText) {
                        message.error('One or more questions are missing question text.');
                        return;
                    }
                    if (question.options.length === 0) {
                        message.error('One or more questions are missing answer choices.');
                        return;
                    }
                    if (!question.correct) {
                        message.error('One or more questions are missing the correct answer.');
                        return;
                    }
                }

                console.log('questionData: ', questionData)

                form.setFieldsValue({
                    topic: questionData.topic,
                    subTopic: questionData.subTopic,
                    comprehension: questionData.comprehension
                });

                setFileList([file]);

                setComprehensionData(questionData);
                message.success('Comprehension data uploaded successfully!');
            } catch (error) {
                console.error('Error parsing DOCX file:', error);
                message.error('Failed to upload comprehension data. Please try again.');
            }
        };

        reader.readAsArrayBuffer(file);
    };

    const parseDocContent = (docContent: string) => {
        const lines = docContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);

        let paragraph = '';
        let topic = '';
        let subTopic = '';
        const questions: any[] = [];
        let currentQuestion: any = null;
        let completeFields = {
            question: false,
            choices: false,
            correct: false,
            explanation: false,
            topic: false,
            subTopic: false,
            paragraph: false
        };

        lines.forEach((line) => {
            if (line.startsWith('Text###') && !completeFields.paragraph) {
                paragraph = ''; // Reset text for a new section
            } else if (line.startsWith('End of Text###')) {
                completeFields.paragraph = true;
            } else if (line.startsWith('Text Topic###')) {
                topic = line.replace('Text Topic###', '').trim();
            } else if (line.startsWith('End of Text Topic###')) {
                completeFields.topic = true;
            } else if (line.startsWith('Text SubTopic###')) {
                subTopic = line.replace('Text SubTopic###', '').trim();
            } else if (line.startsWith('End of Text SubTopic###')) {
                completeFields.subTopic = true;
            } else if (line.startsWith('Question###')) {
                if (currentQuestion) {
                    questions.push(currentQuestion);
                }

                currentQuestion = {
                    questionText: line.replace('Question###', '').trim(),
                    options: [],
                    correct: '',
                    explanation: '',
                    topic,
                    subTopic,
                };
            } else if (line.startsWith('Choice A#:')) {
                currentQuestion.options.push({ option: 'A', title: line.replace('Choice A#:', '').trim(), isCorrect: false });
            } else if (line.startsWith('Choice B#:')) {
                currentQuestion.options.push({ option: 'B', title: line.replace('Choice B#:', '').trim(), isCorrect: false });
            } else if (line.startsWith('Choice C#:')) {
                currentQuestion.options.push({ option: 'C', title: line.replace('Choice C#:', '').trim(), isCorrect: false });
            } else if (line.startsWith('Choice D#:')) {
                currentQuestion.options.push({ option: 'D', title: line.replace('Choice D#:', '').trim(), isCorrect: false });
            } else if (line.startsWith('Choice E#:')) {
                currentQuestion.options.push({ option: 'E', title: line.replace('Choice E#:', '').trim(), isCorrect: false });
            } else if (line.startsWith('Choice F#:')) {
                currentQuestion.options.push({ option: 'F', title: line.replace('Choice F#:', '').trim(), isCorrect: false });
            } else if (line.startsWith('Correct#:')) {
                const correctAnswer = line.replace('Correct#:', '').trim();
                currentQuestion.options.forEach((choice: any) => {
                    if (choice.option.toLowerCase() === correctAnswer.toLowerCase()) {
                        choice.isCorrect = true;
                    }
                });
                currentQuestion.correct = correctAnswer;
            } else if (line.startsWith('Explanation#:')) {
                currentQuestion.explanation = line.replace('Explanation#:', '').trim();
                currentQuestion.answerFeedback = line.replace('Explanation#:', '').trim();
            } else if (line.startsWith('Question Topic#:')) {
                currentQuestion.topic = line.replace('Question Topic#:', '').trim();
            } else if (line.startsWith('Question SubTopic#:')) {
                currentQuestion.subTopic = line.replace('Question SubTopic#:', '').trim();
            } else if (line.startsWith('End of Question###')) {
                if (currentQuestion) {
                    questions.push(currentQuestion);
                    currentQuestion = null;
                }
            } else {
                if (!completeFields.paragraph) {
                    paragraph += `${line} `;
                } else if (!completeFields.topic) {
                    topic += `${line} `;
                } else if (!completeFields.subTopic) {
                    subTopic += `${line} `;
                }
            }
        });

        if (currentQuestion) {
            questions.push(currentQuestion);
        }

        if (!topic || !subTopic || questions.length === 0) {
            return null;
        }

        return {
            paragraph: paragraph.trim(),
            topic,
            subTopic,
            comprehension: questions
        };
    };

    const props: UploadProps = {
        fileList,
        onRemove: () => {
            setFileList([]);
        },
        multiple: false,
        customRequest: async ({ file, onSuccess, onError }: any) => {
            try {
                await handleDocxFileUpload(file);
                onSuccess('ok');
            } catch (error) {
                console.error('Error during file upload:', error);
                onError(error);
            }
        },
        accept: ".docx",
    };

    const onFinish = async (values: any) => {
        const updatedComprehension = comprehensionData.comprehension.map((data: any) => {
            return { ...data, ...values }
        })
        const updatedComprehensionData = { ...comprehensionData, comprehension: updatedComprehension }
        await form.setFieldsValue({
            ...updatedComprehensionData
        })
        next();
    };

    return (
        <Row justify="center" className="upload-questions-wrapper">
            <Col xxl={24} xl={24} lg={24} md={20} sm={24} xs={24}>
                <Card>
                    <div style={{
                        padding: '9px 10px 1px 5px',
                        background: 'rgb(239 238 238)',
                        width: 'fit-content',
                        borderRadius: '8px',
                        marginBottom: '20px'
                    }}>
                        <Typography.Title level={5}>
                            Question Level Information For Reporting
                        </Typography.Title>
                    </div>
                    <Form form={form} layout="vertical" size="large" onFinish={onFinish}>
                        <Form.Item
                            label="Upload .DOC File"
                            rules={[{ required: true, message: 'Please upload a file!' }]}
                        >
                            <Dragger {...props}>
                                <p className="ant-upload-drag-icon">
                                    <UploadOutlined />
                                </p>
                                {fileList.length > 0 ? (
                                    <p className="ant-upload-text">
                                        <strong>Uploaded File: {fileList[0].name}</strong>
                                    </p>
                                ) : (
                                    <>
                                        <p className="ant-upload-text">Drag or click to upload a file</p>
                                        <p className="ant-upload-hint">Supports only .DOC files.</p>
                                    </>
                                )}
                            </Dragger>
                        </Form.Item>
                        <ParagraphFormItem form={form} showRichText={false} required={false} isUploadedByFile={true} isDocxUpload={true} />
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
}
