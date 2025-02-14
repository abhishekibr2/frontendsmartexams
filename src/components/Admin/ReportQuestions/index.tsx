'use client';
import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Typography, Select, Button, Pagination, Flex } from 'antd';
import { GetAllQuestionsReport } from '@/lib/adminApi';

const { Option } = Select;
const { Title } = Typography;

export default function QuestionBank() {
    const [questions, setQuestions] = useState<any[]>([]);
    const [questionType, setQuestionType] = useState<string>('all');
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [complexityLevel, setComplexityLevel] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const getAllQuestionData = async () => {
        const response = await GetAllQuestionsReport();
        if (response?.questions) {
            setQuestions(response.questions);
        }
    };

    useEffect(() => {
        getAllQuestionData();
    }, []);

    useEffect(() => {
        let data = questions;

        // Filter by questionType
        if (questionType !== 'all') {
            data = data.filter(q => q.questionType === questionType);
        }

        // Filter by complexityLevel
        if (complexityLevel !== 'all') {
            data = data.filter(q => q.complexityLevel === complexityLevel);
        }
        setFilteredData(data);
    }, [questionType, complexityLevel, questions]);

    const handlePaginationChange = (page: number, pageSize: number) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    const columns = [
        {
            title: 'TOPIC',
            dataIndex: 'topic',
            key: 'topic',
            render: (text: string) => text || 'N/A',
            sorter: (a: any, b: any) => (a.topic || '').localeCompare(b.topic || ''),
        },
        {
            title: 'SUB-TOPIC',
            dataIndex: 'subTopic',
            key: 'subTopic',
            render: (text: string) => text || 'N/A',
            sorter: (a: any, b: any) => (a.subTopic || '').localeCompare(b.subTopic || ''),
        },
        {
            title: 'COMPLEXITY',
            dataIndex: 'complexityLevel',
            key: 'complexityLevel',
            render: (complexityLevel: string) => complexityLevel || 'N/A',
            sorter: (a: any, b: any) => (a.complexityLevel || '').localeCompare(b.complexityLevel || ''),
        },
        {
            title: 'NUMBER OF QUESTIONS',
            dataIndex: 'totalQuestions',
            key: 'totalQuestions',
            render: (totalQuestions: number) => totalQuestions || 'N/A',
            sorter: (a: any, b: any) => (a.totalQuestions || 0) - (b.totalQuestions || 0),
        },
    ];

    return (
        <div className="p-8">
            <Row justify="space-between" align="middle" className="mb-4">
                {/* First Row */}
                <Col span={18}>
                    <Title level={4} className="top-title">
                        Question Bank Analysis Report (Multiple Choice, Multiple Response & True False)
                    </Title>
                </Col>
                <Col span={6} style={{ textAlign: "right" }}>
                    <Select
                        defaultValue="all"
                        style={{ width: 200 }}
                        onChange={(value) => setComplexityLevel(value)}
                    >
                        <Option value="all">All Complexity Levels</Option>
                        <Option value="easy">Easy</Option>
                        <Option value="medium">Medium</Option>
                        <Option value="hard">Hard</Option>
                    </Select>
                </Col>
            </Row>

            <Flex justify="space-between" align="middle">
                {/* Second Row */}
                <div>
                    <h6 style={{ textAlign: "start", margin: 0 }}>Count: {filteredData.length}</h6>
                </div>
                <div style={{ textAlign: "right" }}>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={filteredData.length}
                        onChange={handlePaginationChange}
                        style={{ margin: 0 }}
                    />
                </div>
            </Flex>


            <div className="p-8">
                {/* Multiple Choice Table */}
                {questionType === 'all' || questionType === 'multipleChoice' ? (
                    <Row className="mb-8">
                        <Col span={24}>
                            <Title level={4} className="text-purple-600">
                                (A) Multiple Choice Questions
                            </Title>
                            <Table
                                dataSource={filteredData
                                    .filter((q) => q.questionType === 'multipleChoice')
                                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                                columns={columns}
                                pagination={false}
                                rowKey="_id"
                            />
                        </Col>
                    </Row>
                ) : null}

                {/* Multiple Response Table */}
                {questionType === 'all' || questionType === 'multipleResponse' ? (
                    <Row className="mb-8">
                        <Col span={24}>
                            <Title level={4} className="text-purple-600">
                                (B) Multiple Response Questions
                            </Title>
                            <Table
                                dataSource={filteredData
                                    .filter((q) => q.questionType === 'multipleResponse')
                                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                                columns={columns}
                                pagination={false}
                                rowKey="_id"
                            />
                        </Col>
                    </Row>
                ) : null}

                {/* True/False Table */}
                {questionType === 'all' || questionType === 'trueFalse' ? (
                    <Row className="mb-8">
                        <Col span={24}>
                            <Title level={4} className="text-purple-600">
                                (C) True/False Questions
                            </Title>
                            <Table
                                dataSource={filteredData
                                    .filter((q) => q.questionType === 'trueFalse')
                                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                                columns={columns}
                                pagination={false}
                                rowKey="_id"
                            />
                        </Col>
                    </Row>
                ) : null}

                {/* Reading Comprehension Table */}
                {questionType === 'all' || questionType === 'comprehension' ? (
                    <Row className="mb-8">
                        <Col span={24}>
                            <Title level={4} className="text-purple-600">
                                (D) Reading Comprehension Questions
                            </Title>
                            <Table
                                dataSource={filteredData
                                    .filter((q) => q.questionType === 'comprehension')
                                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                                columns={columns}
                                pagination={false}
                                rowKey="_id"
                            />
                        </Col>
                    </Row>
                ) : null}

                <Flex justify='flex-end' align="middle" className="mb-4 mt-4 pb-4">
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={filteredData.length}
                        onChange={handlePaginationChange}
                    // style={{ marginTop: '20px', textAlign: 'end', width: '100%' }}
                    />
                </Flex>
            </div>
        </div>
    );
}
