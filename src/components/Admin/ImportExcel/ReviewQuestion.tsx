'use client'
import React, { useState } from 'react'
import { Card, Col, Form, Row, Select, Button, FormInstance, Divider, Flex, message, Progress, Pagination } from 'antd'
import { useDataContext } from '@/contexts/DataContext'
import { Complexity, ExamType, Grade, Question, Subject } from '@/lib/types'
import './style.css'
import axios from 'axios'
import OptionField from './OptionField'
import InfiniteScroll from 'react-infinite-scroll-component'
import RichTextLoader from '@/commonUI/RichTextLoader'

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
    prev,
    form,
    questions,
    setQuestions,
    setDefaultQuestionData
}: ReviewQuestionProps) {
    const { subjects, grades, complexity, examTypes } = useDataContext()
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
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
        try {
            await axios.post('/admin/question', data);
            !saveAll && message.success(`Question ${index + 1} saved successfully`);

            setProgress(Number(((index + 1) / total) * 100));

            if (!saveAll) {
                const currentQuestions = form.getFieldValue('questions');
                const updatedQuestions = currentQuestions.filter((_: any, i: number) => i !== index);
                form.setFieldsValue({ questions: updatedQuestions });
            }

        } catch (error) {
            message.error(`Failed to save question ${index + 1}. Please try again.`);
        }
    };

    const onFinish = async (values: any) => {
        const questions = values.questions;
        const totalQuestions = questions.length;

        setLoading(true);
        setProgress(0);

        for (let index = 0; index < totalQuestions; index++) {
            await onSingleSubmit(questions[index], index, totalQuestions, true);
        }

        setLoading(false);
        setProgress(0);
        setQuestions(questions);
        setDefaultQuestionData(questions);
        next()
    };

    return (
        <Row justify='center' className='upload-questions-wrapper'>
            <Col xxl={24} xl={24} lg={24} md={20} sm={24} xs={24}>
                <Card>
                    <Form layout='vertical' size='large' form={form} onFinish={onFinish}>
                        <Row gutter={[16, 16]}>
                            <Col xl={6} md={6} sm={24} xs={24}>
                                <Form.Item
                                    label='Subject'
                                    name={'subjectId'}
                                >
                                    <Select
                                        options={subjects.map((subject: Subject) => {
                                            return { label: subject.subjectName, value: subject._id }
                                        })}
                                        placeholder='Select a subject'
                                    />
                                </Form.Item>

                            </Col>
                            <Col xl={6} md={6} sm={24} xs={24}>
                                <Form.Item
                                    label='Grade'
                                    name={'gradeId'}
                                >
                                    <Select
                                        placeholder='Select Grade'
                                        options={grades.map((grade: Grade) => {
                                            return { label: grade.gradeLevel, value: grade._id }
                                        })}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} md={6} sm={24} xs={24}>
                                <Form.Item
                                    label='Exam Type'
                                    name={'examTypeId'}
                                >
                                    <Select
                                        placeholder='Select Exam Type'
                                        options={examTypes.map((examType: ExamType) => {
                                            return { label: examType.examType, value: examType._id }
                                        })}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} md={6} sm={24} xs={24}>

                                <Form.Item
                                    label='Complexity'
                                    name={'complexityId'}
                                >
                                    <Select
                                        options={complexity.map((item: Complexity) => {
                                            return { label: item.complexityLevel, value: item._id }
                                        })}
                                        placeholder='Select Complexity'
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
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
                        <Form.List
                            name="questions"
                            key="comprehensionFields"
                            initialValue={questions.map((q, i) => ({
                                ...q,
                                id: q._id || `${q.questionText}-${i}`,
                            }))}
                        >
                            {(fields) => {
                                setTotalQuestion(fields.length)
                                const currentFields = fields.slice(
                                    currentPage * itemsPerPage,
                                    (currentPage + 1) * itemsPerPage
                                );
                                return (
                                    <>
                                        {currentFields.map((field, index) => (
                                            <OptionField
                                                key={field.key}
                                                form={form}
                                                field={field}
                                                fields={fields}
                                                index={index}
                                            />
                                        ))}
                                        {loading && (
                                            <div className='mt-2 mb-2'>
                                                <Progress percent={progress} />
                                                <p>Saving Questions: {progress.toFixed(0)}%</p>
                                            </div>
                                        )}
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
                                    </>
                                );
                            }}
                        </Form.List>
                    </Form>
                </Card>
            </Col>
        </Row>
    )
}
