'use client'
import React, { useState } from 'react'
import { Card, Col, Form, Row, Select, Button, FormInstance, Divider, Flex, Typography, Input, message, Pagination } from 'antd'
import { useDataContext } from '@/contexts/DataContext'
import { Grade, Question } from '@/lib/types'
import RichText from '@/commonUI/RichText'
import './style.css'
import axios from 'axios'
import QuestionField from './QuestionField'

interface ReviewQuestionProps {
    next: () => void;
    prev: () => void;
    form: FormInstance;
    questions: Question[];
    setQuestions: (question: Question[]) => void;
    defaultQuestionData?: any;
    setDefaultQuestionData: (questionData: Question[]) => void;
}

export default function ReviewQuestion({
    next,
    form,
    setQuestions,
    setDefaultQuestionData
}: ReviewQuestionProps) {
    const { subjects, grades, complexity, examTypes } = useDataContext()
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalQuestion, setTotalQuestion] = useState(0)
    const itemsPerPage = 1;

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const onSingleSubmit = async (data: any, index: number, total: number, saveAll = false) => {
        setLoading(true)
        await axios.post('/admin/question', data);
        if (!saveAll) {
            message.success(`Question ${index + 1} saved successfully`);
        } else {
            message.success(`All questions saved successfully`);
        }
        setLoading(false);
    };

    const onFinish = async (values: any) => {
        const questions = values.questions;
        const totalQuestions = values.comprehension.length;

        setLoading(true);

        await onSingleSubmit(values, 0, totalQuestions, true);

        setLoading(false);
        setQuestions(questions);
        setDefaultQuestionData(questions);
        next()
    };

    return (
        <Row justify='center' className='upload-questions-wrapper'>
            <Col xxl={24} xl={24} lg={24} md={20} sm={24} xs={24}>
                <Card>
                    <Form layout='vertical' size='large' form={form} onFinish={onFinish}>
                        <div className="question-input-wrapper">
                            <React.Fragment>
                                <Flex className="form-group-title mt-20" gap={'small'}>
                                    <div className="s-number">2</div>
                                    <div>
                                        <Typography.Title level={5}>Enter Your Question Paragraph</Typography.Title>
                                        <Typography style={{ color: '#ccc' }}>
                                            Enter the paragraph or description of your question here, without including the answer choices.
                                        </Typography>
                                    </div>
                                </Flex>
                                <Divider />
                                <Form.Item
                                    name="paragraph"
                                    label="Paragraph"
                                    rules={[{ required: true, message: 'Please enter the paragraph!' }]}
                                >
                                    {
                                        form.getFieldValue('paragraph') &&
                                        <RichText
                                            placeholder="Enter your paragraph here"
                                            onChange={(value) => {
                                                form.setFieldsValue({
                                                    paragraph: value
                                                });
                                            }}
                                            editorValue={form.getFieldValue('paragraph')}
                                        />
                                    }
                                </Form.Item>
                            </React.Fragment>
                            <Row gutter={24} className="mt-20">
                                <Col lg={8} md={8} sm={24} xs={24}>
                                    <Form.Item
                                        name="complexityId"
                                        label="Paragraph Complexity"
                                        rules={[{ required: true, message: 'Please select the paragraph complexity!' }]}
                                    >
                                        <Select
                                            placeholder="Select complexity"
                                            options={complexity.map((item: any) => {
                                                return {
                                                    label: item.complexityLevel,
                                                    value: item._id
                                                };
                                            })}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col lg={8} md={8} sm={24} xs={24}>
                                    <Form.Item
                                        name="examTypeId"
                                        label="Exam Type"
                                        rules={[{ required: true, message: 'Please select the question type!' }]}
                                    >
                                        <Select
                                            placeholder="Select question type"
                                            options={examTypes?.map((item: any) => {
                                                return {
                                                    label: `${item.examType} (${item.stateId.title})`,
                                                    value: item._id
                                                };
                                            })}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col lg={8} md={8} sm={24} xs={24}>
                                    <Form.Item
                                        name=""
                                        label="Is Image Present in Paragraph?"
                                        rules={[{ required: true, message: 'Please select whether an image is present!' }]}
                                        initialValue={false}
                                    >
                                        <Select
                                            disabled
                                            placeholder="Select yes or no"
                                            options={[
                                                { label: 'Yes', value: true },
                                                { label: 'No', value: false }
                                            ]}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col lg={8} md={8} sm={24} xs={24}>
                                    <Form.Item
                                        name="subjectId"
                                        label="Subject"
                                        rules={[{ required: true, message: 'Please select the subject!' }]}
                                    >
                                        <Select
                                            placeholder="Select subject"
                                            options={subjects.map((subject: any) => {
                                                return {
                                                    label: subject.subjectName,
                                                    value: subject._id
                                                };
                                            })}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col lg={8} md={8} sm={24} xs={24}>
                                    <Form.Item
                                        name="topic"
                                        label="Paragraph Topic"
                                        rules={[{ required: true, message: 'Please select the paragraph topic!' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col lg={8} md={8} sm={24} xs={24}>
                                    <Form.Item
                                        name="subTopic"
                                        label="Paragraph Sub-Topic"
                                        rules={[{ required: true, message: 'Please select the paragraph sub-topic!' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col lg={8} md={8} sm={24} xs={24}>
                                    <Form.Item
                                        name="gradeId"
                                        label="Grade"
                                        rules={[{ required: true, message: 'Please select the grade!' }]}
                                    >
                                        <Select
                                            placeholder="Select grade"
                                            options={grades.map((item: Grade) => {
                                                return {
                                                    label: item.gradeLevel,
                                                    value: item._id
                                                };
                                            })}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col lg={8} md={8} sm={24} xs={24}>
                                    <Form.Item
                                        name="qualityChecked"
                                        label="Quality Checked?"
                                        rules={[{ required: true, message: 'Please select if the question is quality checked!' }]}
                                    >
                                        <Select
                                            placeholder="Select yes or no"
                                            options={[
                                                { label: 'Yes', value: true },
                                                { label: 'No', value: false }
                                            ]}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col lg={8} md={8} sm={24} xs={24}>
                                    <Form.Item
                                        name="totalQuestions"
                                        label="Total Questions"
                                    >
                                        <Select
                                            disabled
                                            placeholder="Select total questions"
                                            options={[
                                                { label: '5 Questions', value: 5 },
                                                { label: '10 Questions', value: 10 },
                                                { label: '20 Questions', value: 20 },
                                                { label: '30 Questions', value: 30 }
                                            ]}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>
                        <Flex justify="flex-end" gap={'small'} align='center' className="pagination-buttons mb-2">
                            <Pagination
                                defaultCurrent={currentPage + 1}
                                total={totalQuestion}
                                pageSize={itemsPerPage}
                                onChange={(page) => setCurrentPage(page - 1)}
                                itemRender={(page, type, originalElement) => {
                                    if (type === 'prev') {
                                        return (
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={handlePreviousPage}
                                                disabled={currentPage === 0}
                                                style={{
                                                    height: 32
                                                }}
                                            >
                                                Previous
                                            </Button>
                                        );
                                    }
                                    if (type === 'next') {
                                        return (
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={handleNextPage}
                                                style={{
                                                    height: 32
                                                }}
                                                disabled={(currentPage + 1) * itemsPerPage >= totalQuestion}
                                            >
                                                Next
                                            </Button>
                                        );
                                    }
                                    return originalElement;
                                }}
                            />
                        </Flex>
                        <Form.List name="comprehension" key="comprehensionFields">
                            {(fields) => {
                                setTotalQuestion(fields.length)
                                const currentFields = fields.slice(
                                    currentPage * itemsPerPage,
                                    (currentPage + 1) * itemsPerPage
                                );
                                return (
                                    <>
                                        {currentFields.map((field, index) => (
                                            <QuestionField
                                                form={form}
                                                index={index}
                                                field={field}
                                                fields={fields}
                                                complexity={complexity}
                                                key={field.key}
                                            />
                                        ))}
                                    </>
                                );
                            }}
                        </Form.List>
                        <Flex align='center' justify='space-between'>
                            <Form.Item label={' '}>
                                <Button type='primary' htmlType='submit'>Save all questions</Button>
                            </Form.Item>
                            <Flex justify="flex-end" gap={'small'} align='center' className="pagination-buttons mb-2">
                                <Pagination
                                    defaultCurrent={currentPage + 1}
                                    total={totalQuestion}
                                    pageSize={itemsPerPage}
                                    onChange={(page) => setCurrentPage(page - 1)}
                                    itemRender={(page, type, originalElement) => {
                                        if (type === 'prev') {
                                            return (
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={handlePreviousPage}
                                                    disabled={currentPage === 0}
                                                    style={{
                                                        height: 32
                                                    }}
                                                >
                                                    Previous
                                                </Button>
                                            );
                                        }
                                        if (type === 'next') {
                                            return (
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={handleNextPage}
                                                    style={{
                                                        height: 32
                                                    }}
                                                    disabled={(currentPage + 1) * itemsPerPage >= totalQuestion}
                                                >
                                                    Next
                                                </Button>
                                            );
                                        }
                                        return originalElement;
                                    }}
                                />
                            </Flex>
                        </Flex>
                    </Form>
                </Card>
            </Col>
        </Row>
    )
}
