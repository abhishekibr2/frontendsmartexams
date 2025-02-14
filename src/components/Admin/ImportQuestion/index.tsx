'use client'
import React, { useState } from 'react';
import axios from 'axios';
import { Col, Row, Typography, Upload, Button, message, List, Progress, Divider } from 'antd';
import * as mammoth from 'mammoth';
import readXlsxFile from 'read-excel-file';
import { UploadOutlined } from '@ant-design/icons';
import LayoutWrapper from '@/app/commonUl/LayoutWrapper';

export default function ImportQuestion() {
    const [uploading, setUploading] = useState(false);
    const [processedResults, setProcessedResults] = useState<any[]>([]);
    const [progress, setProgress] = useState(0);

    const handleExcelFileUpload = async (file: any): Promise<boolean> => {
        const isExcelFile = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel';
        if (!isExcelFile) {
            message.error('You can only upload Excel files!');
            return false;
        }

        try {
            await readXlsxFile(file).then(async (rows) => {
                console.log('File content:', rows);
                const processedData = rows.slice(1).map((row: any) => {
                    const question = row[1];
                    const questionType = row[0] === 'multiplechoice' ? 'multipleChoice' :
                        row[0] === 'multipleresponse' ? 'multipleResponse' :
                            row[0] === 'truefalse' ? 'trueFalse' : '';
                    const choices = row.slice(2, 4);
                    const correctAnswer = row[4];
                    const explanation = row[5];
                    const topic = row[6];
                    const subTopic = row[7];

                    let options = [];

                    if (questionType === 'trueFalse') {
                        options = [
                            { title: row[2], isCorrect: correctAnswer === 'A' },
                            { title: row[3], isCorrect: correctAnswer === 'B' },
                        ];
                    } else {
                        options = choices.map((choice: string, index: number) => ({
                            title: choice,
                            isCorrect: correctAnswer.includes(String.fromCharCode(65 + index)),
                        }));
                    }

                    const questionData = {
                        question,
                        options,
                        explanation,
                        topic,
                        subTopic,
                        questionType,
                        status: 'draft'
                    };

                    return questionData;
                });

                setUploading(true);
                let processedCount = 0;

                for (let i = 0; i < processedData.length; i++) {
                    const questionData: any = processedData[i];
                    try {
                        const response = await axios.post('/admin/question', questionData);
                        processedCount++;

                        setProcessedResults((prevResults: any) => [
                            ...prevResults,
                            { success: true, question: questionData.question, message: 'Uploaded successfully' },
                        ]);

                        setProgress(Math.round((processedCount / processedData.length) * 100));
                    } catch (error) {
                        setProcessedResults((prevResults: any) => [
                            ...prevResults,
                            { success: false, question: questionData.question, message: 'Failed to upload' },
                        ]);
                    }
                }

                setUploading(false);
                message.success('File uploaded and processed successfully!');
            });
            return true;
        } catch (error) {
            console.error('Error uploading file:', error);
            message.error('Failed to upload the file. Please try again.');
            setUploading(false);
            return false;
        }
    };

    const handleDocxFileUpload = async (file: any) => {
        const reader = new FileReader();

        reader.onloadend = async (e: any) => {
            const arrayBuffer = e.target.result;
            try {
                const result = await mammoth.extractRawText({ arrayBuffer });
                const docContent = result.value;

                // Check if docContent is correctly extracted
                console.log('Extracted DOCX Content:', docContent);

                // Parse the docContent to create structured data
                const questionData = parseDocContent(docContent);
                console.log('Parsed question data:', questionData); // Output for debugging

                if (questionData.length === 0) {
                    message.error('No valid question data found in DOCX file.');
                    return;
                }

                setUploading(true);
                let processedCount = 0;

                for (let i = 0; i < questionData.length; i++) {
                    const questionItem = questionData[i];

                    try {
                        const response = await axios.post('/admin/question', questionItem);
                        processedCount++;

                        setProcessedResults((prevResults: any) => [
                            ...prevResults,
                            { success: true, question: questionItem.question, message: 'Uploaded successfully' },
                        ]);

                        setProgress(Math.round((processedCount / questionData.length) * 100));
                    } catch (error) {
                        setProcessedResults((prevResults: any) => [
                            ...prevResults,
                            { success: false, question: questionItem.question, message: 'Failed to upload' },
                        ]);
                    }
                }

                setUploading(false);
                message.success('Comprehension data uploaded successfully!');
            } catch (error) {
                console.error('Error parsing DOCX file:', error);
                setUploading(false);
                message.error('Failed to upload comprehension data. Please try again.');
            }
        };

        reader.readAsArrayBuffer(file);
    };

    const parseDocContent = (docContent: string) => {
        const lines = docContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);

        const questionData: any = [];
        let currentQuestion: any = null;

        lines.forEach((line) => {
            if (line.toLowerCase().startsWith('question:')) {
                // Push the previous question if available
                if (currentQuestion) {
                    questionData.push(currentQuestion);
                }

                // Create a new question object
                currentQuestion = {
                    question: line.replace('Question:', '').trim(),
                    options: [],
                    correctAnswer: null,
                    explanation: '',
                    topic: 'Topic Example', // Add your logic to capture topics dynamically
                    subTopic: 'SubTopic Example', // Add your logic to capture subtopics dynamically
                    questionType: 'multipleChoice', // Set this according to your doc structure
                    status: 'draft',
                };
            } else if (line.toLowerCase().startsWith('option:')) {
                // Assuming the option starts with 'Option A:', 'Option B:', etc.
                if (currentQuestion) {
                    const optionText = line.replace('Option:', '').trim();
                    currentQuestion.options.push({ title: optionText, isCorrect: false });
                }
            } else if (line.toLowerCase().startsWith('answer:')) {
                // The correct answer (e.g., 'Answer: A')
                if (currentQuestion) {
                    const correctOption = line.replace('Answer:', '').trim();
                    const optionIndex = currentQuestion.options.findIndex((option: any) => option.title.startsWith(correctOption));
                    if (optionIndex !== -1) {
                        currentQuestion.options[optionIndex].isCorrect = true;
                    }
                }
            } else if (line.toLowerCase().startsWith('explanation:')) {
                // Add explanation if present
                if (currentQuestion) {
                    currentQuestion.explanation = line.replace('Explanation:', '').trim();
                }
            }
        });

        // Push the last question
        if (currentQuestion) {
            questionData.push(currentQuestion);
        }

        return questionData;
    };


    return (
        <Row className="questions-wrapper" align="middle">
            <Col lg={24} xl={24} xxl={24} md={24} sm={24} xs={24}>
                <Typography.Title level={2} className="page-title" style={{ fontWeight: 400 }}>
                    Import Data Files
                </Typography.Title>
            </Col>
            <Col xs={24} sm={24} md={24} lg={15} xl={15} xxl={15}>
                <LayoutWrapper>
                    <Typography.Title level={5}>Upload Questions (Multiple-Choice, Multiple Response, True-False)</Typography.Title>
                    <Typography.Text type="secondary">Upload questions in Excel (XLSX) format</Typography.Text>
                    <br />
                    <Upload
                        customRequest={({ file, onSuccess, onError }) => {
                            handleExcelFileUpload(file)
                                .then(() => onSuccess && onSuccess('ok'))
                                .catch((error) => onError && onError(error));
                        }}
                        showUploadList={true}
                        accept=".xlsx,.xls"
                    >
                        <Button icon={<UploadOutlined />} style={{ marginTop: 20 }}>
                            Upload Question Excel File
                        </Button>
                    </Upload>

                    <Divider />

                    <Typography.Title level={5}>Upload Comprehension Data (DOCX)</Typography.Title>
                    <Typography.Text type="secondary">Upload comprehension paragraph, topic, and subtopic in DOCX format</Typography.Text>
                    <br />
                    <Upload
                        customRequest={({ file, onSuccess, onError }) => {
                            handleDocxFileUpload(file)
                                .then(() => onSuccess && onSuccess('ok'))
                                .catch((error) => onError && onError(error));
                        }}
                        showUploadList={false}
                        accept=".docx"
                    >
                        <Button icon={<UploadOutlined />} style={{ marginTop: 20 }}>
                            Upload Comprehension DOCX File
                        </Button>
                    </Upload>

                    {uploading && (
                        <>
                            <Progress percent={progress} status="active" style={{ marginTop: 20 }} />
                            <Divider />
                            <List
                                header={<div>Upload Progress</div>}
                                bordered
                                dataSource={processedResults}
                                renderItem={(item: any, index) => (
                                    <List.Item key={index}>
                                        {item.success ? (
                                            <Typography.Text type="success">{item.question} - {item.message}</Typography.Text>
                                        ) : (
                                            <Typography.Text type="danger">{item.question} - {item.message}</Typography.Text>
                                        )}
                                    </List.Item>
                                )}
                            />
                        </>
                    )}
                </LayoutWrapper>
            </Col>
        </Row>
    );
}
