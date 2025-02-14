'use client';

import React, { useState } from 'react';
import {
    Card,
    Col,
    Form,
    Row,
    Select,
    Upload as AntdUpload,
    UploadProps,
    message,
    Button,
    Progress,
    Divider,
    List,
    Typography,
    FormInstance,
    Tag,
    Flex,
} from 'antd';
import readXlsxFile from 'read-excel-file';
import { UploadOutlined } from '@ant-design/icons';
import { useDataContext } from '@/contexts/DataContext';
import { Complexity, ExamType, Grade, Question, Subject } from '@/lib/types';
import { FaCheckCircle } from 'react-icons/fa';

const { Dragger } = AntdUpload;

interface UploadFileProps {
    next: () => void;
    prev: () => void;
    form: FormInstance;
    questions: Question[];
    setQuestions: (question: Question[]) => void;
    defaultQuestionData?: any;
    setDefaultQuestionData: (questionData: Question[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void
}

export default function Upload({
    next,
    prev,
    form,
    questions = [],
    setQuestions,
    defaultQuestionData = {},
    setDefaultQuestionData,
    loading = false,
    setLoading
}: UploadFileProps) {
    const { subjects, grades, examTypes, complexity } = useDataContext();
    const [uploading, setUploading] = useState(false);
    const [processedResults, setProcessedResults] = useState<any[]>([]);
    const [progress, setProgress] = useState(0);
    const [fileList, setFileList] = useState<any[]>([]);
    const [fileUploading, setFileUploading] = useState(false)

    const handleExcelFileUpload = async (file: any) => {
        setFileUploading(true)
        const isExcelFile =
            file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.type === 'application/vnd.ms-excel';

        if (!isExcelFile) {
            message.error('You can only upload Excel files!');
            return;
        }

        try {
            const rows = await readXlsxFile(file);

            // if (rows.length > 51) {
            //     message.error('You can only upload a maximum of 50 records.');
            //     setFileUploading(false);
            //     setFileList([])
            //     setQuestions([])
            //     setProcessedResults([])
            //     return;
            // }

            const processedData = rows.slice(1).map((row: any) => {

                const questionType =
                    row[0] === 'multiplechoice' ? 'multipleChoice' :
                        row[0] === 'multipleresponse' ? 'multipleResponse' :
                            row[0] === 'truefalse' ? 'trueFalse' : '';
                form.setFieldValue('questionType', questionType)
                const options =
                    questionType === 'trueFalse'
                        ? [
                            { title: row[2], isCorrect: row[4] === 'A', hasImage: false },
                            { title: row[3], isCorrect: row[4] === 'B', hasImage: false },
                        ]
                        : row.slice(2, 8).map((choice: string | null, index: number) => ({
                            title: choice || '',
                            isCorrect: row[8] && row[8].includes(String.fromCharCode(65 + index)),
                            hasImage: false,
                        }));

                return {
                    question: row[1],
                    options,
                    explanation: questionType === 'trueFalse' ? row[5] : row[9],
                    answerFeedback: questionType === 'trueFalse' ? row[5] : row[9],
                    topic: questionType === 'trueFalse' ? row[6] : row[10],
                    subTopic: questionType === 'trueFalse' ? row[7] : row[11],
                    questionType,
                    ...defaultQuestionData,
                };
            });

            setUploading(true);
            setQuestions(processedData);
            setProcessedResults(
                processedData.map((data) => ({
                    success: true,
                    question: data.question,
                    options: data.options,
                    message: 'Uploaded successfully',
                }))
            );
            setProgress(100);
            message.success('File uploaded and processed successfully!');
        } catch (error) {
            console.error('Error uploading file:', error);
            message.error('Failed to process the file. Please check its format.');
        } finally {
            setFileUploading(false)
        }
    };

    const props: UploadProps = {
        customRequest: async ({ file, onSuccess, onError }) => {
            try {
                await handleExcelFileUpload(file);
                setFileList([file]);
                if (onSuccess) onSuccess('File uploaded successfully!');
            } catch (error: any) {
                if (onError) onError(error);
            }
        },
        fileList,
        onRemove: () => {
            setFileList([]);
        },
        showUploadList: true,
        accept: '.xlsx,.xls',
        multiple: false
    };

    const onFinish = (values: any) => {
        const updatedQuestions = questions.map((question) => ({
            ...question,
            ...values,
        }));

        form.setFieldsValue({
            questions: updatedQuestions,
            ...values
        });
        setQuestions(updatedQuestions);
        setDefaultQuestionData(updatedQuestions);
        next();
    };

    return (
        <Row justify="center" className="upload-questions-wrapper">
            <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                <Card>
                    <Form form={form} layout="vertical" size="large" onFinish={onFinish} scrollToFirstError>
                        <Form.Item
                            label="Question Type"
                            name="questionType"
                            rules={[{ required: true, message: 'Please select a question type!' }]}
                        >
                            <Select
                                placeholder="Select The Type Of Questions To Upload"
                                options={[
                                    { label: 'Multiple Choice', value: 'multipleChoice' },
                                    { label: 'True/False', value: 'trueFalse' },
                                    { label: 'Multiple Response', value: 'multipleResponse' },
                                    { label: 'Comprehension', value: 'comprehension' },
                                ]}
                                disabled
                            />
                        </Form.Item>
                        <Flex gap={'small'}>
                            <Form.Item
                                className='w-25'
                                label="Subject"
                                name="subjectId"
                                rules={[{ required: true, message: 'Please select a subject!' }]}
                            >
                                <Select
                                    options={subjects.map((subject: Subject) => ({
                                        label: subject.subjectName,
                                        value: subject._id,
                                    }))}
                                    placeholder="Select a subject"
                                />
                            </Form.Item>
                            <Form.Item
                                className='w-25'
                                label="Grade"
                                name="gradeId"
                                rules={[{ required: true, message: 'Please select a grade!' }]}
                            >
                                <Select
                                    placeholder="Select Grade"
                                    options={grades.map((grade: Grade) => ({
                                        label: grade.gradeLevel,
                                        value: grade._id,
                                    }))}
                                />
                            </Form.Item>
                            <Form.Item
                                className='w-25'
                                label="Exam Type"
                                name="examTypeId"
                                rules={[{ required: true, message: 'Please select an exam type!' }]}
                            >
                                <Select
                                    placeholder="Select Exam Type"
                                    options={examTypes.map((examType: ExamType) => ({
                                        label: `${examType.examType} (${examType.stateId.title})`,
                                        value: examType._id,
                                    }))}
                                />
                            </Form.Item>
                            <Form.Item
                                className='w-25'
                                label="Complexity"
                                name="complexityId"
                                rules={[{ required: true, message: 'Please select a complexity!' }]}
                            >
                                <Select
                                    options={complexity.map((item: Complexity) => ({
                                        label: item.complexityLevel,
                                        value: item._id,
                                    }))}
                                    placeholder="Select Complexity"
                                />
                            </Form.Item>
                        </Flex>
                        <Form.Item
                            label="Upload Your Questions File"
                            rules={[{ required: true, message: 'Please upload a file!' }]}
                        >
                            <Dragger {...props}>
                                <p className="ant-upload-drag-icon">
                                    <UploadOutlined />
                                </p>
                                {fileUploading ? (
                                    <p className="ant-upload-text">
                                        <strong>Uploading...</strong>
                                    </p>
                                ) : fileList.length > 0 ? (
                                    <p className="ant-upload-text">
                                        <strong>Uploaded File: {fileList[0].name}</strong>
                                    </p>
                                ) : (
                                    <>
                                        <p className="ant-upload-text">Drag or click to upload a file</p>
                                        <p className="ant-upload-hint">Supports only Excel files.</p>
                                    </>
                                )}
                            </Dragger>
                            {uploading && (
                                <>
                                    <Progress percent={progress} status="active" style={{ marginTop: 20 }} />
                                    <Divider />
                                    <List
                                        header={<div>Upload Completed</div>}
                                        bordered
                                        dataSource={processedResults}
                                        renderItem={(item: any, index) => (
                                            <List.Item key={index}>
                                                {item.success ? (
                                                    <React.Fragment>
                                                        <Flex vertical>
                                                            <Typography.Text>
                                                                <Tag color="blue" style={{ fontWeight: 'bold', marginRight: 8 }}>
                                                                    #{index + 1}
                                                                </Tag>
                                                                {item.question} - {item.message}
                                                            </Typography.Text>
                                                            <Flex gap={'small'} wrap className='mt-2'>
                                                                {item.options.map((option: any) => (
                                                                    option.title &&
                                                                    <Button
                                                                        icon={option.isCorrect && <FaCheckCircle style={{
                                                                            color: '#52c41a'
                                                                        }}
                                                                        />}
                                                                        iconPosition='end'
                                                                        size='small'
                                                                        variant={`${option.isCorrect ? 'solid' : 'outlined'}`}
                                                                        style={{
                                                                            // background:`${option.isCorrect ? 'solid' : 'outlined'}`,
                                                                            borderColor: `${option.isCorrect ? '#52c41a' : 'gray'}`,
                                                                            color: '#333',
                                                                        }}
                                                                        key={option}
                                                                    >{option?.title}</Button>
                                                                ))}
                                                            </Flex>
                                                        </Flex>
                                                    </React.Fragment>
                                                ) : (
                                                    <Typography.Text type="danger">
                                                        <Tag color="red" style={{ fontWeight: 'bold', marginRight: 8 }}>
                                                            Question #{index + 1}
                                                        </Tag>
                                                        {item.question} - {item.message}
                                                    </Typography.Text>
                                                )}
                                            </List.Item>
                                        )}
                                    />
                                </>
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Continue and Edit
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
}
