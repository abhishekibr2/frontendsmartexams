import React, { useState } from 'react';
import RichText from '@/commonUI/RichText';
import { Checkbox, Col, Flex, Form, FormInstance, Radio, Row, Select, Typography } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import RichTextLoader from '@/commonUI/RichTextLoader';

interface ComprehensionMultipleResponseFormItemProps {
    field: any;
    fields: any;
    remove: any;
    index: number;
    questionId?: string;
    form: FormInstance;
}

export default function ComprehensionMultipleResponseFormItem({
    field,
    index,
    questionId,
    form,
}: ComprehensionMultipleResponseFormItemProps) {
    const [visibleOptionCount, setVisibleOptionCount] = useState(1);
    const optionsPerPage = 1;
    const totalOptions = form.getFieldValue('comprehension')[index]?.options?.length || 0;

    const loadMoreOptions = () => {
        if (visibleOptionCount < totalOptions) {
            setVisibleOptionCount((prev) => prev + optionsPerPage);
        }
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
            initialValue={[{}, {}, {}, {}, {}, {}]}
        >
            {(optionFields) => (
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
                                            border: '1px solid #ccc',
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
                                                        required: index === 0 && optionIndex < 4 ? true : false,
                                                        message:
                                                            'Please mark at least one option as the correct answer!',
                                                    },
                                                ]}
                                                className="m-0"
                                                initialValue={false}
                                            >
                                                <Checkbox>Set as correct answer</Checkbox>
                                            </Form.Item>
                                            <Typography.Text type="secondary">Mandatory</Typography.Text>
                                        </Flex>
                                        <Form.Item
                                            name={[optionField.name, 'title']}
                                            rules={[
                                                {
                                                    required: index === 0 && optionIndex < 4 ? true : false,
                                                    message: 'Option content cannot be empty!',
                                                },
                                            ]}
                                        >
                                            {form.getFieldValue('comprehension')[field.name]?.options[optionIndex]?.title ? (
                                                <RichText
                                                    onChange={(value) => {
                                                        form.setFieldsValue({
                                                            [field.name]: {
                                                                title: value,
                                                            }
                                                        });
                                                    }}
                                                    editorValue={form.getFieldValue('comprehension')[field.name]?.options[optionIndex]?.title}
                                                />
                                            ) : (
                                                <RichText
                                                    onChange={(value) => {
                                                        form.setFieldsValue({
                                                            [field.name]: {
                                                                title: value,
                                                            }
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
                </InfiniteScroll>
            )}
        </Form.List>
    );
}
