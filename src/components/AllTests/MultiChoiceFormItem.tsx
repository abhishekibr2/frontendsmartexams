import React from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Divider, Button, Select, Row, Col, Typography, Checkbox, Flex } from "antd";
import RichText from "@/commonUI/RichText";

function MultiChoiceFormItem() {
    return (
        <Form.List name="fields">
            {(fields, { add, remove }) => {
                return (
                    <Row gutter={[24, 24]}>
                        {fields.map((field, index) => {
                            const optionLetter = String.fromCharCode(65 + index);

                            return (
                                <Col span={16} key={field.key}>
                                    <Flex className="question-choice-option" gap={'small'}>
                                        <div
                                            className="s-number"
                                            style={{
                                                marginTop: "10px",
                                                color: "#ccc",
                                                background: "transparent",
                                                border: "1px solid #ccc",
                                            }}
                                        >
                                            {optionLetter}
                                        </div>
                                        <div>
                                            <Flex justify="space-between" align="center">
                                                <Form.Item name={[index, "name"]}>
                                                    <Checkbox>Set as correct answer</Checkbox>
                                                </Form.Item>
                                                <Typography.Text type="secondary">Mandatory</Typography.Text>
                                            </Flex>
                                            <Form.Item
                                                name={[index, "type"]}
                                                rules={[{ required: true }]}
                                            >
                                                <RichText />
                                            </Form.Item>
                                            <Flex gap={'small'} align='center'>
                                                <Form.Item name={[index, "options"]} label={`Is image present in choice ${optionLetter}?`} initialValue={false}>
                                                    <Select defaultValue={"no"}>
                                                        <Select.Option value={true}>Yes</Select.Option>
                                                        <Select.Option value={false}>No</Select.Option>
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item label={' '}>
                                                    {fields.length > 1 && (
                                                        <Button
                                                            danger
                                                            className="dynamic-delete-button"
                                                            onClick={() => remove(field.name)}
                                                            icon={<MinusCircleOutlined />}
                                                        >
                                                            Remove Above Field
                                                        </Button>
                                                    )}
                                                </Form.Item>
                                            </Flex>
                                        </div>
                                    </Flex>
                                </Col>
                            );
                        })}
                        <Divider />
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()}>
                                <PlusOutlined /> Add field
                            </Button>
                        </Form.Item>
                    </Row>
                );
            }}
        </Form.List>
    );
}

export default MultiChoiceFormItem;
