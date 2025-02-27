import React, { useContext, useEffect, useState } from 'react';
import { Col, Button, Collapse, Form, Flex, Divider, Typography, Input, Select, Row, FormInstance, DatePicker, Popconfirm, Spin } from 'antd';
import { useDataContext } from '@/contexts/DataContext';
import axios from 'axios';
import AuthContext from '@/contexts/AuthContext';

const { Panel } = Collapse;

interface FilterQuestionProps {
    filterForm: FormInstance;
    reload: boolean;
    setReload: (reload: boolean) => void;
    takeBulkOwnership: () => void;
    addedIds: string[];
}

const FilterQuestion = ({ filterForm, reload, setReload, takeBulkOwnership, addedIds }: FilterQuestionProps) => {
    const { user } = useContext(AuthContext);
    const [openFilter, setOpenFilter] = useState(false);
    const { complexity, grades, subjects, examTypes } = useDataContext();
    const [topics, setTopics] = useState<string[]>([]);
    const [subTopics, setSubTopics] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleClearFilter = () => {
        filterForm.resetFields();
        setOpenFilter(false);
        setReload(!reload);
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

    useEffect(() => {
        onSearch();
    }, []);

    return (
        <>
            <Col xl={12}>
                <Form.Item layout="vertical" label=" ">
                    <Flex gap="middle" wrap justify="flex-end" align="center">
                        {user?.roleId.roleName === 'admin' && addedIds?.length > 0 && (
                            <Popconfirm
                                title="Are you sure you want to take all questions ownership?"
                                onConfirm={takeBulkOwnership}
                                okText="Yes, take all"
                                cancelText="Cancel"
                            >
                                <Button
                                    style={{
                                        color: '#3EB07D',
                                        borderColor: '#3EB07D',
                                    }}
                                    size="large"
                                >
                                    Take All Questions Ownership
                                </Button>
                            </Popconfirm>
                        )}
                        <Button color="default" variant="solid" size="large" onClick={() => setOpenFilter(!openFilter)}>
                            Filter Now
                        </Button>
                        <Button type="primary" size="large" htmlType="reset" onClick={handleClearFilter}>
                            Clear Filter
                        </Button>
                    </Flex>
                </Form.Item>
            </Col>
            <Col span={24}>
                <Collapse className="filter-collapse" ghost activeKey={openFilter ? ['1'] : []}>
                    <Panel showArrow={false} header="" key="1">
                        <Spin spinning={loading}>
                            <Form onValuesChange={() => setReload(!reload)} form={filterForm} layout="vertical" size="large">
                                <Typography.Title level={5}>
                                    Question Level Fields for Reporting (Multiple Choice, Multiple Response, and True False)
                                </Typography.Title>
                                <Row gutter={24} className="mt-20">
                                    <Col lg={6} md={6} sm={24} xs={24}>
                                        <Form.Item name="_id" label="Question ID">
                                            <Input placeholder="question id" />
                                        </Form.Item>
                                    </Col>
                                    <Col lg={6} md={6} sm={24} xs={24}>
                                        <Form.Item name="complexityId" label="Question Complexity">
                                            <Select placeholder="Select complexity">
                                                <Select.Option value="">All</Select.Option>
                                                {complexity.map((item: any) => (
                                                    <Select.Option key={item._id} value={item._id}>
                                                        {item.complexityLevel}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col lg={6} md={6} sm={24} xs={24}>
                                        <Form.Item name="hasImage" label="Is image present in Question?" initialValue="">
                                            <Select
                                                options={[
                                                    { label: 'All', value: '' },
                                                    { label: 'Yes', value: true },
                                                    { label: 'No', value: false },
                                                ]}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col lg={6} md={6} sm={24} xs={24}>
                                        <Form.Item name="subjectId" label="Subject">
                                            <Select placeholder="Select subject">
                                                <Select.Option value="">All</Select.Option>
                                                {subjects.map((subject: any) => (
                                                    <Select.Option key={subject._id} value={subject._id}>
                                                        {subject.subjectName}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col lg={6} md={6} sm={24} xs={24}>
                                        <Form.Item name="examTypeId" label="Exam Type">
                                            <Select placeholder="Select exam type">
                                                <Select.Option value="">All</Select.Option>
                                                {examTypes.map((examType: any) => (
                                                    <Select.Option key={examType._id} value={examType._id}>
                                                        {`${examType.examType} (${examType.stateId.title})`}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col lg={6} md={6} sm={24} xs={24}>
                                        <Form.Item name="topic" label="Topic">
                                            <Select
                                                showSearch
                                                allowClear
                                                placeholder="Topic"
                                                optionFilterProp="label"
                                                onSearch={(value) => onSearch(value, 'topic')}
                                                onChange={(value) => {
                                                    onSearch(value, 'topic');
                                                    filterForm.setFieldsValue({ subTopic: undefined });
                                                }}
                                                options={topics.map((topic: string) => ({
                                                    label: topic,
                                                    value: topic,
                                                }))}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col lg={6} md={6} sm={24} xs={24}>
                                        <Form.Item name="subTopic" label="Sub Topic">
                                            <Select
                                                showSearch
                                                allowClear
                                                placeholder="Select sub topic"
                                                optionFilterProp="label"
                                                notFoundContent={filterForm.getFieldValue('topic') ? null : 'Please select a topic first'}
                                                options={
                                                    filterForm.getFieldValue('topic')
                                                        ? subTopics.map((subTopic) => ({
                                                            label: subTopic,
                                                            value: subTopic,
                                                        }))
                                                        : []
                                                }
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col lg={6} md={6} sm={24} xs={24}>
                                        <Form.Item name="gradeId" label="Grade">
                                            <Select placeholder="Select grade">
                                                <Select.Option value="">All</Select.Option>
                                                {grades.map((item: any) => (
                                                    <Select.Option key={item._id} value={item._id}>
                                                        {item.gradeLevel}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    {user?.roleId.roleName === 'admin' && (
                                        <Col lg={6} md={6} sm={24} xs={24}>
                                            <Form.Item name="qualityChecked" label="Quality Checked?" initialValue={''}>
                                                <Select
                                                    options={[
                                                        { label: 'All', value: '' },
                                                        { label: 'Yes', value: true },
                                                        { label: 'No', value: false },
                                                    ]}
                                                />
                                            </Form.Item>
                                        </Col>
                                    )}
                                    <Col lg={6} md={6} sm={24} xs={24}>
                                        <Form.Item name="addedFrom" label="Question Added From">
                                            <DatePicker mode="date" className="w-100" />
                                        </Form.Item>
                                    </Col>
                                    <Col lg={6} md={6} sm={24} xs={24}>
                                        <Form.Item name="addedTo" label="Question Added To">
                                            <DatePicker mode="date" className="w-100" />
                                        </Form.Item>
                                    </Col>
                                    {user?.roleId.roleName === 'admin' && (
                                        <Col lg={6} md={6} sm={24} xs={24}>
                                            <Form.Item name="role" label="Created By">
                                                <Select
                                                    placeholder="Created By"
                                                    options={[
                                                        { label: 'All', value: '' },
                                                        { label: 'Admin', value: 'admin' },
                                                        { label: 'Data Operator', value: 'operator' },
                                                    ]}
                                                />
                                            </Form.Item>
                                        </Col>
                                    )}
                                </Row>
                            </Form>
                        </Spin>
                        <Divider />
                    </Panel>
                </Collapse>
            </Col>
        </>
    );
};

export default FilterQuestion;
