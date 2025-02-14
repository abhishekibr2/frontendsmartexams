'use client'
import React, { useContext, useState } from 'react';
import axios from 'axios';
import { Button, Card, Col, Collapse, Divider, Flex, Form, Input, List, Row, Select, Typography } from 'antd';
import LayoutWrapper from '@/app/commonUl/LayoutWrapper';
import { useDataContext } from '@/contexts/DataContext';
import { Grade } from '@/lib/types';
import QuestionsBreakdown from '../QuestionBreakdown';
// @ts-ignore
import { useRouter } from 'nextjs-toploader/app';
import AuthContext from '@/contexts/AuthContext';
import Swal from 'sweetalert2';

interface RandomQuestionProps {
    testId: string;
}

export default function RandomQuestion({
    testId
}: RandomQuestionProps) {
    const [openFilter, setOpenFilter] = useState(true);
    const [formData, setFormData] = useState<{}>({});
    const { grades, complexity, subjects, examTypes } = useDataContext();
    const [success, setSuccess] = useState<boolean>(false);
    const [topics, setTopics] = useState<string[]>([])
    const [subTopics, setSubTopics] = useState<string[]>([])
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const router = useRouter();
    const { user } = useContext(AuthContext);
    const roleName = user?.roleId?.roleName;
    const [addedQuestions, setAddedQuestions] = useState<any[]>([]);

    const onFinish = async (values: any) => {
        try {
            const { limit, questionType, topic, gradeId, subjectId, examTypeId, complexityId, subTopic, hasImage } = values;
            const filterValues = {
                gradeId,
                subjectId,
                examTypeId,
                complexityId,
                hasImage,
                topic,
                subTopic
            };
            setFormData(values);

            const response = await axios.get(`/admin/question`, {
                params: {
                    filterQuery: filterValues,
                    limit,
                    questionType
                }
            });

            const { questions } = response.data;

            if (questions.length === 0) {
                Swal.fire({
                    title: 'No Questions Found!',
                    text: 'No matching questions were found. Try reducing some filter criteria and try again.',
                    icon: 'warning',
                    confirmButtonText: 'OK'
                });
                return;
            }

            let addedQuestionList: any[] = [];

            for (const question of questions) {
                await axios.post('/admin/test/assignQuestions', {
                    ...values,
                    testIds: [testId],
                    questionId: question?._id,
                    questionType: question?.questionType || 'comprehension'
                });

                addedQuestionList.push(question);
            }

            setAddedQuestions([...addedQuestions, ...addedQuestionList]);
            setSuccess(true);

            Swal.fire({
                title: 'What would you like to do next?',
                text: 'Do you want to add more questions or go to the test editor?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Add More',
                cancelButtonText: 'Go to Editor',
                customClass: {
                    confirmButton: 'swal-confirm-button',
                    cancelButton: 'swal-cancel-button'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    form.resetFields();
                } else {
                    router.push(`/${roleName}/test/${testId}/editor/edit`);
                }
            });

        } catch (error) {
            console.error('Error fetching questions:', error);
            Swal.fire({
                title: 'Error!',
                text: 'An error occurred while fetching questions. Please try again later.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };


    const handleClearFilter = () => {
        form.resetFields();
    };

    const onSearch = async (value: string = '', field: string = '') => {
        const params: { topic?: string; subTopic?: string } = {};
        if (field === 'topic') params.topic = value;
        if (field === 'subTopic') params.subTopic = value;

        setLoading(true);
        try {
            const response = await axios.get(`/admin/question/search/topic`, { params });
            const data = response.data.data;

            if (data) {
                setTopics(() => {
                    const newTopics = data.map((item: { topic: string }) => item.topic);
                    return Array.from(new Set([...topics, ...newTopics]));
                });
                setSubTopics(() => {
                    const newSubTopics = data.map((item: { subTopic: string }) => item.subTopic);
                    return Array.from(new Set([...newSubTopics]));
                });
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Row className="flex-container">
            <Col span={24}>
                <Typography.Title
                    level={2}
                    className="top-title m-0 mb-2 mt-2"
                    style={{ fontWeight: 400, marginBottom: 24 }}
                >
                    Add Random Questions
                </Typography.Title>
            </Col>
            <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                <LayoutWrapper>
                    <Form layout="vertical" size="large" onFinish={onFinish} form={form}>
                        <Row>
                            <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                <Form.Item initialValue={''} name="questionType" label={' '}>
                                    <Select placeholder="Please select" onChange={() => setOpenFilter(true)}>
                                        <Select.Option value="">Select Question Type</Select.Option>
                                        <Select.Option value="multipleChoice">Multiple Choice</Select.Option>
                                        <Select.Option value="trueFalse">True/False</Select.Option>
                                        <Select.Option value="multipleResponse">Multiple Response</Select.Option>
                                        <Select.Option value="comprehension">Comprehension</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                <Form.Item label=" ">
                                    <Flex gap="middle" wrap justify="flex-end" align="center">
                                        <Button
                                            type="default"
                                            size="large"
                                            onClick={() => setOpenFilter(!openFilter)}
                                        >
                                            Filter Now
                                        </Button>
                                        <Button
                                            type="primary"
                                            size="large"
                                            htmlType="reset"
                                            onClick={handleClearFilter}
                                        >
                                            Clear Filter
                                        </Button>
                                    </Flex>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Collapse
                                    className="filter-collapse p-0 m-0"
                                    ghost
                                    activeKey={openFilter ? ['1'] : []}
                                    style={{ padding: 0 }}
                                >
                                    <Collapse.Panel showArrow={false} header="" key="1" className='p-0 m-0'>
                                        <Row gutter={24}>
                                            <Col span={24}>
                                                <Divider />
                                            </Col>
                                            <Col lg={8} md={8} sm={24} xs={24}>
                                                <Form.Item
                                                    name="complexityId"
                                                    label="Question Complexity"
                                                    initialValue={''}
                                                >
                                                    <Select placeholder="Select complexity">
                                                        <Select.Option value="">Select complexity</Select.Option>
                                                        {complexity.map((item: any) => (
                                                            <Select.Option key={item._id} value={item._id}>
                                                                {item.complexityLevel}
                                                            </Select.Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col lg={8} md={8} sm={24} xs={24}>
                                                <Form.Item initialValue={''} name="hasImage" label="Is image present in Question?">
                                                    <Select>
                                                        <Select.Option value="">Select image presence</Select.Option>
                                                        <Select.Option value={true}>Yes</Select.Option>
                                                        <Select.Option value={false}>No</Select.Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col lg={8} md={8} sm={24} xs={24}>
                                                <Form.Item initialValue={''} name="subjectId" label="Subject">
                                                    <Select>
                                                        <Select.Option value="">Select subject</Select.Option>
                                                        {subjects.map((subject: any) => (
                                                            <Select.Option key={subject._id} value={subject._id}>
                                                                {subject.subjectName}
                                                            </Select.Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col lg={8} md={8} sm={24} xs={24}>
                                                <Form.Item initialValue={''} name="examTypeId" label="Exam Type">
                                                    <Select>
                                                        <Select.Option value="">Select exam type</Select.Option>
                                                        {examTypes.map((item: any) => (
                                                            <Select.Option key={item._id} value={item._id}>
                                                                {item.examType}
                                                            </Select.Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col lg={8} md={8} sm={24} xs={24}>
                                                <Form.Item
                                                    name="topic"
                                                    label="Topic"
                                                    rules={[{ required: false, message: 'Please select the topic!' }]}
                                                >
                                                    <Select
                                                        showSearch
                                                        allowClear
                                                        placeholder="Topic"
                                                        optionFilterProp="label"
                                                        onSearch={(value) => onSearch(value, 'topic')}
                                                        options={topics.map((topic: string) => ({
                                                            label: topic,
                                                            value: topic
                                                        }))}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={8} md={8} sm={24} xs={24}>
                                                <Form.Item initialValue={''} name="gradeId" label="Grade">
                                                    <Select>
                                                        <Select.Option value="">Select grade</Select.Option>
                                                        {grades.map((item: Grade) => (
                                                            <Select.Option key={item._id} value={item._id}>
                                                                {item.gradeLevel}
                                                            </Select.Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col lg={8} md={8} sm={24} xs={24}>
                                                <Form.Item
                                                    name="subTopic"
                                                    label="Sub Topic"
                                                    rules={[{ required: false, message: 'Please select the sub-topic!' }]}
                                                >
                                                    <Select
                                                        showSearch
                                                        allowClear
                                                        placeholder="Search SubTopic"
                                                        optionFilterProp="label"
                                                        onSearch={(value) => onSearch(value, 'subTopic')}
                                                        options={subTopics.map((subTopic) => ({
                                                            label: subTopic,
                                                            value: subTopic,
                                                        }))}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={8} md={8} sm={24} xs={24}>
                                                <Form.Item
                                                    name="limit"
                                                    label="Number of questions to add"
                                                    rules={[{ required: true, message: 'Please select the limit!' }]}
                                                >
                                                    <Input placeholder="5" />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={8} md={8} sm={24} xs={24}>
                                                <Form.Item label={' '}>
                                                    <Button
                                                        className="w-100"
                                                        htmlType="submit"
                                                        type="primary"
                                                    >
                                                        Add Question to Test
                                                    </Button>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Collapse.Panel>
                                </Collapse>
                            </Col>
                            <Col span={24}>
                                {addedQuestions.length > 0 && (
                                    <Col span={24} style={{ marginTop: '20px' }}>
                                        <Typography.Title level={4}>Added Questions</Typography.Title>
                                        <List
                                            grid={{ gutter: 16, column: 1 }}
                                            dataSource={addedQuestions}
                                            renderItem={(question) => (
                                                <List.Item>
                                                    <Card title={question.questionText}>
                                                        <p><strong>Topic:</strong> {question.topic}</p>
                                                        <p><strong>Sub-Topic:</strong> {question.subTopic}</p>
                                                        <p><strong>Complexity:</strong> {question.complexityId?.complexityLevel}</p>
                                                        <p><strong>Answer:</strong> {question.questionOptions.find((opt: any) => opt.isCorrect)?.title}</p>
                                                    </Card>
                                                </List.Item>
                                            )}
                                        />
                                    </Col>
                                )}
                            </Col>
                        </Row>
                    </Form>
                </LayoutWrapper>
            </Col>
        </Row>
    );
}
