import React from 'react'
import { Col, Divider, Row, Typography } from 'antd'
import { Question } from '@/lib/types';
import ButtonGroup from '../Questions/ButtonGroup';

interface QuestionListItemProps {
    item: Question;
    reload: boolean;
    setReload: (reload: boolean) => void;
    testId?: string;
    existingQuestionIds?: string[];
    showAllAnswer?: boolean;
}

export default function QuestionListItem({
    item,
    reload,
    setReload,
    testId,
    existingQuestionIds = [],
    showAllAnswer = false
}: QuestionListItemProps) {
    return (
        <Row className='question-list-item'>
            <Col span={24}>
                <Typography.Text type="secondary" className="question-text">
                    <div dangerouslySetInnerHTML={{ __html: item.questionText }} />
                </Typography.Text>
                <Divider />
                <ButtonGroup
                    item={item}
                    reload={reload}
                    setReload={setReload}
                    testId={testId}
                    existingQuestionIds={existingQuestionIds}
                    showAllAnswer={showAllAnswer}
                />
            </Col>
        </Row>
    )
}
