'use client'
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Col, Row, Typography, Flex, Button, Modal, Form, Input, message } from "antd";
import { EditOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
// @ts-ignore
import { useRouter } from "nextjs-toploader/app";
import "./style.css";

const { confirm } = Modal;

export default function TopicList() {
    const [question, setQuestion] = useState<any[]>([]);
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [type, setType] = useState<"topic" | "subTopic">("topic");
    const [editData, setEditData] = useState<{ key: string; label: string; value: string }>({
        key: "topic",
        label: "Topic",
        value: "",
    });

    const fetchData = async () => {
        const response = await axios.get("/admin/question/list/group");
        const { data, comprehension } = response.data;
        setQuestion([...data, ...comprehension]);
    };

    useEffect(() => {
        fetchData();
        if (editData.value) {
            form.setFieldsValue({ [editData.key]: editData.value });
        }
    }, [editData]);

    const handleSubTopicClick = (subTopic: string, topic: string, questionType: string) => {
        router.push(`/student/practice-area/question?topic=${topic}&subtopic=${subTopic}&questionType=${questionType}`);
    };

    const handleEdit = (type: "topic" | "subTopic", value: string) => {
        setType(type);
        setEditData({
            key: type === "topic" ? "topic" : "subTopic",
            label: type === "topic" ? "Topic" : "Subtopic",
            value: value,
        });
        setIsModalOpen(true);
    };

    const handleConfirmSubmit = (values: { [key: string]: string }) => {
        confirm({
            title: "Are you sure?",
            icon: <ExclamationCircleOutlined />,
            content: `You want to update "${editData.label}" from "${values[editData.key]}" to "${values[`new${editData.label}`]}"?`,
            okText: "Yes, Update",
            cancelText: "Cancel",
            onOk() {
                handleSubmit(values);
            },
        });
    };

    const handleSubmit = async (values: { [key: string]: string }) => {
        setIsModalOpen(false);
        const response: any = await axios.post("/admin/question/updateTopics", { ...values, type });
        message.success(`${response.data.message}`);
        fetchData();
        form.resetFields();
    };

    return (
        <Row gutter={[16, 16]} justify="start" style={{ width: "100%" }}>
            <Col span={24}>
                <Typography.Title level={2}>Smart Exam Online Practice</Typography.Title>
                <div className="masonry">
                    {question &&
                        question.length > 0 &&
                        question.map((item, index) => (
                            <div key={index} className="item">
                                <Typography.Title
                                    level={4}
                                    style={{
                                        marginBottom: "8px",
                                        display: "flex",
                                        gap: "10px",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        {String.fromCharCode(65 + index)}:
                                        <Typography.Title
                                            level={4}
                                            style={{ display: "flex", gap: "10px", alignItems: "center", margin: 0 }}
                                        >
                                            {item._id}
                                            {item?.questionType && (
                                                <Typography.Text
                                                    type="secondary"
                                                    style={{ color: "#1890ff", fontWeight: "bold" }}
                                                >
                                                    ({item.questionType})
                                                </Typography.Text>
                                            )}
                                        </Typography.Title>
                                    </div>
                                    <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit("topic", item._id)} />
                                </Typography.Title>
                                <Flex vertical>
                                    {item.subTopic.map((subTopic: any, subtopicIndex: number) => (
                                        <Typography.Text
                                            type="secondary"
                                            key={subtopicIndex}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "10px",
                                                marginBottom: 8,
                                                justifyContent: "space-between",
                                                paddingRight: '15px'
                                            }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                {subtopicIndex + 1}.
                                                <Typography.Text
                                                    key={subtopicIndex}
                                                    style={{
                                                        display: "inline-block",
                                                        cursor: "pointer",
                                                        textDecoration: "underline",
                                                    }}
                                                    onClick={() =>
                                                        handleSubTopicClick(
                                                            subTopic.slug,
                                                            item.topicSlug,
                                                            subTopic.comprehensionId ? "comprehension" : subTopic.questionType
                                                        )
                                                    }
                                                >
                                                    {subTopic.title}
                                                </Typography.Text>
                                            </div>
                                            <Button
                                                type="text"
                                                icon={<EditOutlined />}
                                                onClick={() => handleEdit("subTopic", subTopic.title)}
                                            />
                                        </Typography.Text>
                                    ))}
                                </Flex>
                            </div>
                        ))}
                </div>
            </Col>

            {/* Modal for Editing */}
            <Modal title={editData.label} open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
                <Form form={form} layout="vertical" onFinish={handleConfirmSubmit}>
                    <Form.Item
                        label={editData.label}
                        name={editData.key}
                        rules={[{ required: true, message: `Please enter the ${editData.label.toLowerCase()}` }]}
                    >
                        <Input placeholder={`Enter current ${editData.label.toLowerCase()}`} disabled />
                    </Form.Item>

                    <Form.Item
                        label={`New ${editData.label}`}
                        name={`new${editData.label}`}
                        rules={[{ required: true, message: `Please enter the new ${editData.label.toLowerCase()}` }]}
                    >
                        <Input placeholder={`Enter new ${editData.label.toLowerCase()}`} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Row>
    );
}
