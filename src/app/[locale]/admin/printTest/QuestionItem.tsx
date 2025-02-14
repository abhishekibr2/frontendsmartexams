import { Question, QuestionOption } from '@/lib/types';
import { Card, Col, Radio, Row, Typography } from 'antd'
import React from 'react'


interface QuestionItemProps {
    item: Question;
    index: number;
    questions: Question[];
}

export default function QuestionItem({
    item,
    index,
    questions,
}: QuestionItemProps) {
    return (
        <Col span={24} key={index} className='mb-2'>
            <Card
                style={{ width: '100%' }}
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography.Title level={5} style={{ margin: 0 }}>
                            Question {index + 1} of {questions.length}
                        </Typography.Title>
                        <div style={{ textAlign: 'right' }}>
                            <Typography.Text>
                                {item.questionType === 'comprehension' ? 'Comprehension' : 'Question'} ID: {item._id.slice(-6)}
                            </Typography.Text>
                        </div>
                    </div>
                }
            >
                <Typography.Title level={5} type="secondary" style={{ marginBottom: 16 }}>
                    <div dangerouslySetInnerHTML={{ __html: item.questionText }} />
                </Typography.Title>
                <Radio.Group size="large" style={{ width: '100%' }} value={''}>
                    <Row gutter={[16, 16]}>
                        {item?.questionOptions && item.questionOptions.map((option: QuestionOption, idx: number) => (
                            <Col span={12} key={idx}>
                                <Radio value={option.isCorrect}><div dangerouslySetInnerHTML={{ __html: option.title }} /></Radio>
                            </Col>
                        ))}
                    </Row>
                </Radio.Group>

            </Card>
        </Col>
    )
}
