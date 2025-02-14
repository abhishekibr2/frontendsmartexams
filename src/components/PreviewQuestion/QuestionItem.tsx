import React from 'react'
import { Button, Col, Row, Typography } from 'antd'


interface QuestionItemProps {
    question: any;
    handleOptionClick: any;
    selectedAnswer: any;
    currentIndex: number;
}

export default function QuestionItem({
    question,
    handleOptionClick,
    selectedAnswer,
    currentIndex,
}: QuestionItemProps) {
    return (
        <div key={question._id}>
            <Typography.Text strong>
                {currentIndex + 1}. <span dangerouslySetInnerHTML={{ __html: question?.questionText }} />
            </Typography.Text>

            <Row gutter={[16, 16]} style={{ marginTop: '15px' }}>
                {question?.questionOptions.map((option: any, index: Number) => (
                    <Col span={12} key={option._id}>
                        <Button
                            block
                            size="large"
                            style={{
                                backgroundColor: option.isClicked ? (option.isCorrect ? '#5cb85c' : '#ff4d4f') : '#f0f2f5',
                                color: option.isClicked ? 'white' : '',
                                borderRadius: '8px',
                                transition: 'all 0.3s ease',
                            }}
                            onClick={() => handleOptionClick(question, option)}
                            disabled={selectedAnswer}
                        >
                            {/* @ts-ignore  */}
                            <b>{String.fromCharCode(65 + index)}.</b> <span dangerouslySetInnerHTML={{ __html: option.title }} />
                        </Button>
                    </Col>
                ))}
            </Row>
            <Typography.Title level={5} className='mt-4'>
                Explaination
            </Typography.Title>
            <Typography.Text type='secondary'>
                <span dangerouslySetInnerHTML={{ __html: question?.explanation }} />
            </Typography.Text>
        </div>
    )
}
