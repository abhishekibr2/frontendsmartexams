import RichText from '@/commonUI/RichText';
import RichTextLoader from '@/commonUI/RichTextLoader';
import { Checkbox, Col, Divider, Flex, Form, FormInstance, Input, Row, Select, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';

interface OptionFieldProps {
    form: FormInstance;
    index: number;
    field: any;
    fields: any;
}

export default function OptionField({
    form,
    index,
    field,
    fields
}: OptionFieldProps) {
    const [visibleOptionCount, setVisibleOptionCount] = useState(1);
    const optionsPerPage = 1;
    const totalOptions = form.getFieldValue('questions')[field.name]?.options?.length || 0;

    const loadMoreOptions = () => {
        if (visibleOptionCount < totalOptions) {
            setVisibleOptionCount((prev) => prev + optionsPerPage);
        }
    };
    return (
        <Row gutter={[24, 24]} key={form.getFieldValue('questions')[field.name]?.id || field.key}>
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
            <Col span={12}>
                <Flex className="form-group-title" align='flex-start' gap={'small'}>
                    <div className="s-number">1</div>
                    <div>
                        <Typography.Title level={5}>Write Your Question</Typography.Title>
                        <Typography.Text type='secondary'>Enter your question only, without answer.</Typography.Text>
                    </div>
                </Flex>
            </Col>
            <Col span={24}>
                <Form.Item
                    name={[field.name, 'question']}
                    label="Question Text"
                    rules={[{ required: true, message: 'Please enter the question text!' }]}
                >
                    {form.getFieldValue('questions')[field.name]?.question ? (
                        <RichText
                            key={`rich-text-for-question-${index}`}
                            onChange={(value) => {
                                form.setFieldsValue({
                                    [field.name]: {
                                        question: value,
                                    },
                                });
                            }}
                            editorValue={form.getFieldValue('questions')[field.name]?.question}
                        />
                    ) : (
                        <RichText
                            key={`rich-text-for-question-${field.name}`}
                            onChange={(value) => {
                                form.setFieldsValue({
                                    [field.name]: {
                                        question: value,
                                    },
                                });
                            }}
                        />
                    )}
                </Form.Item>
                <Row gutter={24}>
                    <Col xxl={8} xl={8} lg={8} md={8} sm={24} xs={24}>
                        <Form.Item
                            label={'Topic'}
                            name={[field.name, 'topic']}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xxl={8} xl={8} lg={8} md={8} sm={24} xs={24}>
                        <Form.Item
                            name={[field.name, 'subTopic']}
                            label={'Sub Topic'}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xxl={8} xl={8} lg={8} md={8} sm={24} xs={24}>
                        <Form.Item
                            initialValue={false}
                            name={[field.name, 'hasImage']}
                            label={`Is image present in choice ${String.fromCharCode(65 + field.name)}?`}
                        >
                            <Select placeholder="Select">
                                <Select.Option value={true}>Yes</Select.Option>
                                <Select.Option value={false}>No</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Flex className="form-group-title mt-3 mb-3" align='flex-start' gap={'small'} >
                    <div className="s-number">2</div>
                    <div>
                        <Typography.Title level={5} className='m-0'>Add your multiple choice answer options</Typography.Title>
                        <Typography.Text type='secondary'>Test takers will select between these answer options.</Typography.Text>
                    </div>
                </Flex>
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
                                    {optionFields.map((optionField, optionIndex) => (
                                        <Col span={24} key={optionField.key}>
                                            <Flex gap={'small'} className="question-choice-option">
                                                <div
                                                    className="s-number"
                                                    style={{
                                                        marginTop: '10px',
                                                        color: '#ccc',
                                                        background: 'transparent',
                                                        border: '1px solid #ccc'
                                                    }}
                                                >
                                                    {String.fromCharCode(65 + optionIndex)}
                                                </div>
                                                <div className="w-100">
                                                    <Flex justify="space-between" align="center">
                                                        <Form.Item
                                                            name={[optionField.name, 'isCorrect']}
                                                            valuePropName="checked"
                                                            rules={[
                                                                {
                                                                    required: optionIndex < 4 ? true : false,
                                                                    message:
                                                                        'Please mark at least one option as the correct answer!'
                                                                }
                                                            ]}
                                                            className='m-0'
                                                        >
                                                            <Checkbox>Set as correct answer</Checkbox>
                                                        </Form.Item>
                                                        <Typography.Text type="secondary">
                                                            {optionIndex < 4 ? 'Mandatory' : ''}
                                                        </Typography.Text>
                                                    </Flex>
                                                    <Form.Item
                                                        name={[optionField.name, 'title']}
                                                        rules={[
                                                            {
                                                                required: optionIndex < 4 ? true : false,
                                                                message:
                                                                    'Option content cannot be empty!'
                                                            }
                                                        ]}
                                                    >
                                                        {form.getFieldValue('questions')[field.name]?.options[optionIndex]?.title ? (
                                                            <RichText
                                                                key={`rich-text-for-question-option-${field.name}`}
                                                                onChange={(value) => {
                                                                    form.setFieldsValue({
                                                                        [field.name]: {
                                                                            title: value,
                                                                        },
                                                                    });
                                                                }}
                                                                editorValue={form.getFieldValue('questions')[field.name]?.options[optionIndex]?.title}
                                                            />
                                                        ) : (
                                                            <RichText
                                                                key={`rich-text-for-question-option-${field.name}`}
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
                                                    <Form.Item
                                                        initialValue={true}
                                                        name={[optionField.name, 'hasImage']}
                                                        label={`Is image present in choice ${String.fromCharCode(65 + optionIndex)}?`}
                                                    >
                                                        <Select placeholder="Select" value={true} disabled>
                                                            <Select.Option value={true}>Yes</Select.Option>
                                                            <Select.Option value={false}>No</Select.Option>
                                                        </Select>
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
                    <Typography.Title level={5}>Explanation <Typography.Text type='secondary'>optional</Typography.Text></Typography.Title>
                </Flex>
                <Form.Item
                    name={[field.name, 'explanation']}
                    label="Explanation for correct answer"
                >
                    {form.getFieldValue('questions')[field.name]?.explanation ? (
                        <RichText
                            key={`rich-text-for-question-option-${field.name}`}
                            onChange={(value) => {
                                form.setFieldsValue({
                                    [field.name]: {
                                        explanation: value,
                                    },
                                });
                            }}
                            editorValue={form.getFieldValue('questions')[field.name]?.explanation}
                        />
                    ) : (
                        <RichText
                            key={`rich-text-for-question-option-${field.name}`}
                            placeholder="Enter option content"
                            onChange={(value: string) => {
                                form.setFieldsValue({
                                    [field.name]: {
                                        explanation: value,
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
