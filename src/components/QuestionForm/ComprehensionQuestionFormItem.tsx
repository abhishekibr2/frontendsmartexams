import React, { useEffect } from 'react'
import RichText from '@/commonUI/RichText';
import { useDataContext } from '@/contexts/DataContext';
import { Col, Divider, Flex, Form, FormInstance, Input, Row, Select, Typography } from 'antd';
import ComprehensionMultipleResponseFormItem from './ComprehensionMultipleResponseFormItem';

interface ComprehensionQuestionFormItemProps {
    field: any;
    fields: any;
    remove: any;
    index: number;
    questionId?: string;
    form: FormInstance;
}

export default function ComprehensionQuestionFormItem({
    field,
    index,
    questionId,
    form,
    remove,
    fields
}: ComprehensionQuestionFormItemProps) {
    const { complexity } = useDataContext();

    return (
        <Row gutter={[24, 24]} key={field.key} className='mb-5' justify='center'>
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
                <Form.Item style={{ display: 'none' }} name={[field.name, 'questionType']} initialValue={'comprehension'}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name={[field.name, 'questionText']}
                    label="Question Text"
                    rules={[{ required: index === 0 ? true : false, message: 'Please enter the question text!' }]}
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
                            rules={[{ required: index === 0 ? true : false, message: 'Please select complexity!' }]}
                            initialValue={complexity[0]?._id || ''}
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
                            rules={[{ required: index === 0 ? true : false, message: 'Please select a topic!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col lg={8} md={8} sm={24} xs={24}>
                        <Form.Item
                            name={[field.name, 'subTopic']}
                            label="Sub Topic"
                            rules={[{ required: index === 0 ? true : false, message: 'Please select a sub-topic!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Divider orientation="left">Options</Divider>
                <ComprehensionMultipleResponseFormItem
                    field={field}
                    fields={fields}
                    remove={remove}
                    index={index}
                    form={form}
                />
            </Col>
            <Col span={24} className="text-right">
                <Flex className="form-group-title mb-2" gap="small">
                    <div className="s-number">3</div>
                    <div>
                        <Typography.Title level={5} className='m-0'>Answer Explaination <Typography.Text type='secondary'>Optional</Typography.Text></Typography.Title>
                        <Typography.Text type='secondary'>
                            Explanation for correct answer
                        </Typography.Text>
                    </div>
                </Flex>
                <Form.Item
                    name={[field.name, 'explanation']}
                >
                    {
                        !questionId ?
                            <RichText
                                placeholder="Enter Explanation"
                                editorValue={form.getFieldValue('comprehension')[field.name]?.explanation}
                                onChange={(value) => {
                                    form.setFieldsValue({
                                        explanation: value
                                    });
                                }}
                            />
                            :
                            <RichText
                                onChange={(value) => {
                                    form.setFieldsValue({
                                        explanation: value
                                    });
                                }}
                                editorValue={form.getFieldValue('comprehension')[field.name]?.explanation ? form.getFieldValue('comprehension')[field.name]?.explanation : ''}
                            />
                    }
                </Form.Item>
            </Col>
        </Row>
    )
}
