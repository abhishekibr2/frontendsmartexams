'use client'
import React from 'react'
import { Col, Row } from 'antd'
import Questions from '../Admin/Questions';

interface EditTestIntroProps {
    testId?: string;
}

export default function EditTestIntro({
    testId
}: EditTestIntroProps) {
    return (
        <Row gutter={[24, 24]} className='edit-test-intro-wrapper'>
            <Col span={24} className='mt-4'>
                <Questions
                    testId={testId}
                    showOnlyTestQuestion={true}
                    title='Edit Test'
                    showFilter={false}
                    showIntroCard={true}
                />
            </Col>
        </Row>
    )
}
