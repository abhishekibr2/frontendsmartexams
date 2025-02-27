import React from 'react'
import { Question, QuestionAndComprehension } from '@/lib/types'
import { Card, Collapse, Divider, Flex, List, Typography } from 'antd'
import ButtonGroup from './ButtonGroup';

interface ComprehensionListProps {
    item: QuestionAndComprehension;
    reload: boolean;
    setReload: (reload: boolean) => void;
    testId?: string;
    existingQuestionIds?: string[];
    showAllAnswer?: boolean;
    index?: number;
}

export default function ComprehensionList({
    item,
    reload,
    setReload,
    testId,
    existingQuestionIds,
    showAllAnswer = false,
    index = 0
}: ComprehensionListProps) {
    return (
        <React.Fragment>
            <Typography.Text className="question-text">
                <div dangerouslySetInnerHTML={{ __html: item.paragraph }} />
            </Typography.Text>
            <Divider />
            <Collapse defaultActiveKey={[]} ghost>
                <Collapse.Panel
                    header={
                        <Typography.Title level={5}>
                            Associated Questions
                        </Typography.Title>
                    }
                    key="1"
                >
                    <List
                        bordered
                        dataSource={item.questionId}
                        renderItem={(question: Question, i) => {
                            return (
                                <List.Item style={{ width: '100%' }}>
                                    <Card
                                        style={{
                                            width: '100%',
                                            boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                                        }}
                                        title={
                                            <Flex justify="space-between">
                                                <span>{`Question ${i + index + 1}`}</span>
                                                <Typography.Text type="secondary">
                                                    Question ID: {question._id.slice(18, 24)}
                                                </Typography.Text>
                                            </Flex>
                                        }
                                        className='question-list'
                                    >
                                        <Typography.Text type="secondary" className="question-text">
                                            <div dangerouslySetInnerHTML={{ __html: question.questionText }} />
                                        </Typography.Text>
                                        <Divider />
                                        <ButtonGroup
                                            item={question}
                                            reload={reload}
                                            setReload={setReload}
                                            testId={testId}
                                            existingQuestionIds={existingQuestionIds}
                                            showAllAnswer={showAllAnswer}
                                        />
                                        <Divider />
                                    </Card>
                                </List.Item>
                            )
                        }}
                    />
                </Collapse.Panel>
            </Collapse>
            <Divider />
            <ButtonGroup
                item={item}
                reload={reload}
                setReload={setReload}
                showAnswerButton={false}
                showDuplicateButton={false}
                testId={testId}
                existingQuestionIds={existingQuestionIds}
            />
        </React.Fragment>
    )
}
