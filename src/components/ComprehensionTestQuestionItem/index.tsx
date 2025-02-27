import React, { useEffect, useRef } from 'react'
import { Button, Carousel } from 'antd';
import { Question, QuestionAndComprehension } from '@/lib/types';
import TestQuestionItem from '../TestQuestionItem';
import { useTestContext } from '@/contexts/TestContext';

interface ComprehensionTestQuestionItemProps {
    question: QuestionAndComprehension;
    index: number;
    form: any;
    onFinish: any;
    getOptionLabel: any;
    testAttempt?: any;
}

export default function ComprehensionTestQuestionItem({
    question,
    index,
    form,
    onFinish,
    getOptionLabel,
    testAttempt,
}: ComprehensionTestQuestionItemProps) {
    const { isFlagged, setIsFlagged, currentIndex, questions, setCurrentIndex } = useTestContext()
    const innerCarouselRef = useRef<any>(null);

    return (
        <React.Fragment>
            <Carousel
                arrows={false}
                infinite={false}
                ref={innerCarouselRef}
                fade={true}
                afterChange={(current: number) => {
                    setCurrentIndex(currentIndex + current)
                }}
                autoplaySpeed={500}
            >
                {question?.questionId?.map(
                    (innerQuestion: Question, innerIndex: number) => (
                        <TestQuestionItem
                            question={innerQuestion}
                            index={innerIndex}
                            form={form}
                            onFinish={onFinish}
                            getOptionLabel={getOptionLabel}
                            key={innerQuestion?._id || innerIndex}
                            testAttempt={testAttempt}
                        />
                    )
                )}
            </Carousel>
            <div className="d-flex gap-2 align-items-center mt-4">
                <div className="text-center bottom-large-space">
                    <div className="round-icon m-auto"
                        onClick={() => {
                            setIsFlagged(!isFlagged);
                            form.setFieldsValue({
                                isFlagged: !isFlagged
                            });
                        }}
                        style={{
                            background: isFlagged ? 'green' : '',
                            cursor: "pointer",
                            color: isFlagged ? '#fff' : ''
                        }}>
                        <i className="fa-solid fa-flag" />
                    </div>
                </div>
                <div style={{ width: 150 }} className="text-center bottom-large-space">
                    <Button
                        disabled={currentIndex === 0}
                        className="btn-primary btn-spac"
                        style={{
                            background: '#09a6eb',
                            color: '#fff'
                        }}
                        htmlType='button'
                        onClick={() => innerCarouselRef.current.prev()}
                    >
                        Previous
                    </Button>
                </div>
                <div style={{ width: 150 }} className="text-center bottom-large-space">
                    <Button className="btn-primary btn-spac clear-btn" onClick={() => form.resetFields()}>
                        <i className="fa-solid fa-eraser" /> Clear
                    </Button>
                </div>
                <div style={{ width: 150 }} className="text-center bottom-large-space">
                    <Button
                        className="btn-primary btn-spac"
                        disabled={currentIndex === questions.length - 1}
                        style={{
                            background: '#09a6eb',
                            color: '#fff'
                        }}
                        htmlType='button'
                        // onClick={() => innerCarouselRef.current.next()}
                        onClick={() => form.submit()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </React.Fragment>
    )
}
