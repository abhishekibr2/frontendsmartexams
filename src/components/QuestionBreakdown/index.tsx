import React, { useEffect, useState } from "react";
import { Col, Row, Table, Typography } from "antd";

interface QuestionBreakdownProps {
    data: any[];
}

const QuestionsBreakdown = ({ data }: QuestionBreakdownProps) => {
    const [dataSource, setDataSource] = useState<any[]>([]);

    useEffect(() => {
        // Ensure that data is passed as an array
        if (data && data.length > 0) {
            const transformedData = data.map((item, index) => ({
                key: index + 1,
                noOfQuestion: item.limit,
                grade: item.gradeId || "N/A",
                examType: item.examTypeId || "N/A",
                questionType: item.questionType || "N/A",
                complexity: item.complexityId || "N/A",
                topic: item.topic || "N/A",
                subTopic: item.subTopic || "N/A",
            }));
            setDataSource(transformedData);
        }
    }, [data]);

    const columns = [
        {
            title: "No. of Question",
            dataIndex: "noOfQuestion",
            key: "noOfQuestion",
        },
        {
            title: "Grade",
            dataIndex: "grade",
            key: "grade",
        },
        {
            title: "Exam Type",
            dataIndex: "examType",
            key: "examType",
        },
        {
            title: "Question Type",
            dataIndex: "questionType",
            key: "questionType",
        },
        {
            title: "Complexity",
            dataIndex: "complexity",
            key: "complexity",
        },
        {
            title: "Topic",
            dataIndex: "topic",
            key: "topic",
        },
        {
            title: "Sub Topic",
            dataIndex: "subTopic",
            key: "subTopic",
        },
    ];

    return (
        <Row>
            <Col span={24}>
                <Typography.Title level={4}>Questions Breakdown</Typography.Title>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    bordered
                    style={{ backgroundColor: "#f4f3ff" }}
                />
            </Col>
        </Row>
    );
};

export default QuestionsBreakdown;
