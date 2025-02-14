'use client'

import React from 'react'
import { Col, Row } from 'antd'
import PracticeArea from '@/components/PracticeArea'

export default function Page() {
    return (
        <Row className='practice-area-wrapper'>
            <Col span={24}>
                <PracticeArea />
            </Col>
        </Row>
    )
}
