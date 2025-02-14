import React from 'react';
import RichText from '@/commonUI/RichText';
import { Col, Flex, Form, FormInstance, Radio, Row, Select, Typography } from 'antd';

interface ComprehensionQuestionFormItemProps {
    field: any;
    fields: any;
    remove: any;
    index: number;
    questionId?: string;
    form: FormInstance;
}

export default function ComprehensionTrueFalseFormItem({
    field,
    index,
    questionId,
    form,
}: ComprehensionQuestionFormItemProps) {
    const handleIsCorrectChange = (index: number) => {
        const currentValues = form.getFieldValue('comprehension')[field.name, 'options'];
        console.log('currentValues: ', currentValues)
        const updatedValues = [...currentValues];

        updatedValues.forEach((item, idx) => {
            if (idx === index) {
                item.isCorrect = true;
            } else {
                item.isCorrect = false;
            }
        });

        form.setFieldsValue({
            [field.name]: {
                options: updatedValues,
            },
        });
    };

    return (
        <Form.List
            name={[field.name, 'options']}
            rules={[
                {
                    validator: async (_, options) => {
                        if (!options || options.length < 2) {
                            return Promise.reject('At least two options are required!');
                        }
                    },
                },
            ]}
            initialValue={[{}, {}]}
        >
            {(optionFields) => (
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
                                        border: '1px solid #ccc',
                                    }}
                                >
                                    {String.fromCharCode(65 + optionIndex)}
                                </div>
                                <div className="w-100">
                                    <Flex justify="space-between" align="center">
                                        <Form.Item
                                            name={[optionField.name, 'isCorrect']}
                                            label="Correct answer"
                                            initialValue={false}
                                            className='m-0'
                                        >
                                            <Radio.Group
                                                onChange={() => handleIsCorrectChange(optionIndex)}
                                            >
                                                <Radio value={true}>Set as correct answer</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        <Typography.Text type="secondary">Mandatory</Typography.Text>
                                    </Flex>
                                    <Form.Item
                                        name={[optionField.name, 'title']}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Option content cannot be empty!',
                                            },
                                        ]}
                                    >
                                        {questionId &&
                                            form.getFieldValue('comprehension')[index]?.options[optionIndex]
                                                ?.title ? (
                                            <RichText
                                                onChange={(value) => {
                                                    form.setFieldsValue({
                                                        [field.name]: {
                                                            title: value,
                                                        },
                                                    });
                                                }}
                                                editorValue={
                                                    form.getFieldValue('comprehension')[index]?.options[
                                                        optionIndex
                                                    ]?.title
                                                }
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
                            <Form.Item
                                name={[optionField.name, 'hasImage']}
                                style={{
                                    marginLeft: '30px',
                                }}
                                label={`Is image present in choice ${String.fromCharCode(65 + optionIndex)}?`}
                                initialValue={false}
                            >
                                <Select placeholder="Select" className="w-50">
                                    <Select.Option value={true}>Yes</Select.Option>
                                    <Select.Option value={false}>No</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    ))}
                </Row>
            )}
        </Form.List>
    );
}
