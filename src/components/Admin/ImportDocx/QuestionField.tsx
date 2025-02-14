import RichText from '@/commonUI/RichText';
import RichTextLoader from '@/commonUI/RichTextLoader';
import { Checkbox, Col, Divider, Flex, Form, Input, Row, Select, Typography } from 'antd';
import React, { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';

interface QuestionFieldProps {
    form: any;
    index: number;
    field: any;
    fields: any;
    complexity: any;
}

export default function QuestionField({
    form,
    index,
    field,
    fields,
    complexity
}: QuestionFieldProps) {
    const [visibleOptionCount, setVisibleOptionCount] = useState(1);
    const optionsPerPage = 1;
    const totalOptions = form.getFieldValue('comprehension')[field.name]?.options?.length || 0;

    const loadMoreOptions = () => {
        if (visibleOptionCount < totalOptions) {
            setVisibleOptionCount((prev) => prev + optionsPerPage);
        }
    };

    return (
        <Row gutter={[24, 24]} key={field.key}>
            <Col span={24}>
                <Divider
                    orientation="left"
                    style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        backgroundColor: '#f4f4f4',
                        padding: '0 20px',
                        marginBottom: '15px',
                        border: 'none',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        borderRadius: '8px',
                    }}
                >
                    <span
                        style={{
                            background: 'linear-gradient(to right, #42a5f5, #66bb6a)',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            color: '#fff',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.15)',
                        }}
                    >
                        <i
                            className="anticon anticon-check-circle"
                            style={{
                                fontSize: '22px',
                                color: '#fff',
                                fontWeight: 'bold',
                            }}
                        ></i>
                        <span style={{ fontSize: '16px', textTransform: 'uppercase' }}>
                            Question {field.key + 1} of {fields.length}
                        </span>
                    </span>
                </Divider>
            </Col>
            <Col span={24}>
                <Form.Item
                    name={[field.name, 'questionText']}
                    label="Question Text"
                    rules={[{ required: true, message: 'Please enter the question text!' }]}
                >
                    {form.getFieldValue('comprehension')[field.name]?.questionText ? (
                        <RichText
                            onChange={(value) => {
                                form.setFieldsValue({
                                    [field.name]: {
                                        questionText: value,
                                    },
                                });
                            }}
                            editorValue={form.getFieldValue('comprehension')[field.name]?.questionText}
                        />
                    ) : (
                        <RichText
                            onChange={(value) => {
                                form.setFieldsValue({
                                    [field.name]: {
                                        questionText: value,
                                    },
                                });
                            }}
                        />
                    )}
                </Form.Item>

                <Row gutter={24} className="mt-20">
                    <Col lg={8} md={8} sm={24} xs={24}>
                        <Form.Item
                            name={[field.name, 'complexityId']}
                            label="Question Complexity"
                            rules={[{ required: true, message: 'Please select complexity!' }]}
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
                            name={[field.name, 'topic']}
                            label="Topic"
                            rules={[{ required: true, message: 'Please select a topic!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col lg={8} md={8} sm={24} xs={24}>
                        <Form.Item
                            name={[field.name, 'subTopic']}
                            label="Sub Topic"
                            rules={[{ required: true, message: 'Please select a sub-topic!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.List
                    name={[field.name, 'options']}
                    rules={[
                        {
                            validator: async (_, options) => {
                                if (!options || options.length < 2) {
                                    return Promise.reject('At least two options are required!');
                                }
                            }
                        }
                    ]}
                    initialValue={[{}]}
                >
                    {(optionFields) => (
                        <>
                            <Col span={24}>
                                <Divider orientation="left">
                                    Question Number: {index + 1} - Options
                                </Divider>
                            </Col>
                            <InfiniteScroll
                                dataLength={visibleOptionCount}
                                next={loadMoreOptions}
                                hasMore={visibleOptionCount < totalOptions}
                                loader={<RichTextLoader />}
                                scrollThreshold={0.7}
                                style={{
                                    overflow: 'hidden'
                                }}
                            >
                                <Row gutter={[24, 24]}>
                                    {optionFields.slice(0, visibleOptionCount).map((optionField, optionIndex) => (
                                        <Col span={24} key={optionField.key}>
                                            <Flex gap={'small'} className="question-choice-option">
                                                <div
                                                    style={{
                                                        marginTop: '7px',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        width: '25px',
                                                        height: '25px',
                                                        borderRadius: '50%',
                                                        color: '#000',
                                                        border: '1px solid #ccc',
                                                        fontSize: '14px',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    {String.fromCharCode(65 + optionIndex)}
                                                </div>
                                                <div className="w-100">
                                                    <Flex justify="space-between" align="flex-end">
                                                        <Form.Item
                                                            name={[optionField.name, 'isCorrect']}
                                                            valuePropName="checked"
                                                            className="m-0"
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message:
                                                                        'Please mark at least one option as the correct answer!'
                                                                }
                                                            ]}
                                                        >
                                                            <Checkbox>Set as correct answer</Checkbox>
                                                        </Form.Item>
                                                        <Typography.Text type="secondary">
                                                            Mandatory
                                                        </Typography.Text>
                                                    </Flex>
                                                    <Form.Item
                                                        name={[optionField.name, 'title']}
                                                        rules={[
                                                            {
                                                                required: optionIndex < 4 ? true : false,
                                                                message: 'Option content cannot be empty!'
                                                            }
                                                        ]}
                                                    >
                                                        {form.getFieldValue('comprehension')[field.name]?.options[optionIndex]?.title ? (
                                                            <RichText
                                                                onChange={(value) => {
                                                                    form.setFieldsValue({
                                                                        [field.name]: {
                                                                            title: value,
                                                                        },
                                                                    });
                                                                }}
                                                                editorValue={form.getFieldValue('comprehension')[field.name]?.options[optionIndex]?.title}
                                                            />
                                                        ) : (
                                                            <RichText
                                                                placeholder="Enter option content"
                                                                onChange={(value: string) => {
                                                                    form.setFieldsValue({
                                                                        [field.name]: {
                                                                            title: value,
                                                                        },
                                                                    });
                                                                }}
                                                            />
                                                        )}
                                                    </Form.Item>
                                                </div>
                                            </Flex>
                                        </Col>
                                    ))}
                                </Row>
                            </InfiniteScroll>
                        </>
                    )}
                </Form.List>
                <Flex className="form-group-title mt-2" align='flex-start' gap={'small'}>
                    <div className="s-number">3</div>
                    <Typography.Title level={5}>Explanation<Typography.Text type='secondary'>optional</Typography.Text></Typography.Title>
                </Flex>
                <Form.Item
                    name={[field.name, 'explanation']}
                    label="Explanation for correct answer"
                >
                    {form.getFieldValue('comprehension')[field.name]?.explanation ? (
                        <RichText
                            key={`rich-text-for-question-option-${field.name}`}
                            onChange={(value) => {
                                form.setFieldsValue({
                                    [field.name]: {
                                        explanation: value,
                                    },
                                });
                            }}
                            editorValue={form.getFieldValue('comprehension')[field.name]?.explanation}
                        />
                    ) : (
                        <RichText
                            key={`rich-text-for-question-option-${field.name}`}
                            placeholder="Enter option content"
                            onChange={(value: string) => {
                                form.setFieldsValue({
                                    [field.name]: {
                                        comprehension: value,
                                    },
                                });
                            }}
                        />
                    )}
                </Form.Item>
            </Col>
        </Row>
    )
}
