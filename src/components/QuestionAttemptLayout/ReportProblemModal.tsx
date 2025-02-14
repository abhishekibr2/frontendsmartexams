import React, { useState } from "react";
import { Modal, Form, Select, Input, Button, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

interface ReportProblemModalProps {
    visible: boolean;
    onClose: () => void;
    testId: string;
    userId: string;
}

const ReportProblemModal: React.FC<ReportProblemModalProps> = ({
    visible,
    onClose,
    testId,
    userId,
}) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            await axios.post("/admin/test/report-problem", {
                testId,
                userId,
                issueType: values.issueType,
                description: values.description,
            });

            message.success("Your report has been submitted successfully!");
            form.resetFields();
            onClose();
        } catch (error) {
            message.error("Failed to submit the report. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            title={
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />
                    <span>Report a Problem</span>
                </div>
            }
            onCancel={onClose}
            footer={null}
            centered
            width={500}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label="Issue Type"
                    name="issueType"
                    rules={[{ required: true, message: "Please select an issue type!" }]}
                >
                    <Select placeholder="Select Issue Type">
                        <Option value="Incorrect Question">Incorrect Question</Option>
                        <Option value="Wrong Answer">Wrong Answer</Option>
                        <Option value="Technical Issue">Technical Issue</Option>
                        <Option value="Other">Other</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: "Please enter a description!" }]}
                >
                    <Input.TextArea placeholder="Describe the issue..." rows={4} />
                </Form.Item>

                <div style={{ textAlign: "right", marginTop: "10px" }}>
                    <Button onClick={onClose} style={{ marginRight: "10px" }}>
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Submit Report
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default ReportProblemModal;
