'use client'
import React, { useState } from 'react';
import { Col, Row, Steps, Typography, Form, Spin, Space } from 'antd';
import Download from './Download';
import Upload from './Upload';
import ReviewQuestion from './ReviewQuestion';
import { Question } from '@/lib/types';
import SaveQuestions from './SaveQuestions';

export default function ImportExcel() {
    const [current, setCurrent] = useState(0);
    const [defaultQuestionData, setDefaultQuestionData] = useState<any>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const steps: any[] = [
        {
            title: 'Download',
            content: <Download next={next} prev={prev} />,
        },
        {
            title: 'Upload questions',
            content: (
                <Upload
                    next={next}
                    prev={prev}
                    form={form}
                    questions={questions}
                    setQuestions={setQuestions}
                    defaultQuestionData={defaultQuestionData}
                    setDefaultQuestionData={setDefaultQuestionData}
                    loading={loading}
                    setLoading={setLoading}
                />
            ),
        },
        {
            title: 'Review questions',
            content: (
                <ReviewQuestion
                    next={next}
                    prev={prev}
                    form={form}
                    questions={questions}
                    setQuestions={setQuestions}
                    defaultQuestionData={defaultQuestionData}
                    setDefaultQuestionData={setDefaultQuestionData}
                />
            ),
        },
        {
            title: 'Save questions',
            content: (
                <SaveQuestions
                    next={next}
                    prev={prev}
                    form={form}
                    questions={questions}
                    setQuestions={setQuestions}
                    defaultQuestionData={defaultQuestionData}
                    setDefaultQuestionData={setDefaultQuestionData}
                    setCurrent={setCurrent}
                />
            ),
        },
    ];

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    return (
        <Row className="import-excel-wrapper">
            <Spin spinning={loading} fullscreen />
            <Col xxl={24} xl={24} lg={24}>
                <div>
                    <Typography.Title
                        level={2}
                        className="page-title"
                        style={{
                            fontWeight: 400,
                        }}
                    >
                        Import Excel
                    </Typography.Title>
                    <Steps current={current} labelPlacement="vertical" items={items} />
                </div>
                <Col xxl={24} xl={24} lg={24} className="mt-2">
                    {steps[current].content}
                </Col>
            </Col>
        </Row>
    );
}
