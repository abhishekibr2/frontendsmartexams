'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useContext } from 'react';
import { Button, Card, Col, Flex, Radio, Row, Spin, Typography } from 'antd';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { HiOutlinePrinter } from "react-icons/hi2";
import './styles.css';
import axios from 'axios';
import { FaCheckCircle } from "react-icons/fa";
import Link from 'next/link';
//@ts-ignore
import { useRouter } from 'nextjs-toploader/app';
import { usePDF } from 'react-to-pdf';
import { QuestionAndComprehension, QuestionOption } from '@/lib/types';
import QuestionItem from './QuestionItem';
import AuthContext from '@/contexts/AuthContext';

interface Test {
    testName: string;
    testDisplayName: string;
    subject: {
        _id: string;
        subjectName: string;
    };
    testConductedBy?: {
        name: string;
    };
    packageName?: {
        packageName: string;
    };
    state?: {
        title: string;
    };
    maxQuestions?: number;
    duration?: string;
    status?: string;
}

const Page = () => {
    const params = useSearchParams();
    const printId = params.get('printId');
    const [printData, setPrintData] = useState<Test | null>(null);
    const [questions, setQuestions] = useState<QuestionAndComprehension[]>([])
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [pdfLoading, setPdfLoading] = useState(false);
    const { toPDF, targetRef } = usePDF({ filename: `${printData?.testDisplayName || 'test'}.pdf` });
    const router = useRouter();
    const { user } = useContext(AuthContext);
    const roleName = user?.roleId?.roleName;

    const getDataHandler = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`/${roleName}/test/${printId}/questions`);
            const test = response.data.data
            const normalizedData = test.questions.map((item: any) => ({
                ...item,
                questionType: item.paragraph ? 'comprehension' : item.questionType,
            }));
            console.log('normalizedData: ', normalizedData)
            setPrintData(response.data.data);
            setQuestions(normalizedData)
        } catch (error) {
            router.push(`/${roleName}/test`);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        if (printId) {
            getDataHandler();
        } else {
            router.push(`/${roleName}/test`);
        }
    }, [printId]);

    const handlePrintTest = () => {
        setPdfLoading(true);
        toPDF()
            // @ts-ignore
            .then(() => {
                setPdfLoading(false);
            })
            // @ts-ignore
            .catch((error) => {
                console.error("Error generating PDF: ", error);
                setPdfLoading(false);
            });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <Row gutter={[24, 24]}>
            <Spin spinning={loading} fullscreen />
            <Col span={24}>
                <Typography.Title level={2} className="top-title m-0"
                    style={{
                        fontWeight: 400
                    }}>
                    Print for Paper Test
                </Typography.Title>
            </Col>
            <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                <Flex
                    justify='space-around'
                    align='center'
                    style={{
                        background: '#fff',
                        padding: '32px 24px 0 24px'
                    }}>
                    <Button
                        onClick={handlePrintTest}
                        type='primary'
                        size='large'
                        loading={pdfLoading}
                    >
                        <HiOutlinePrinter /> Print Test
                    </Button>
                    <Button type='primary' size='large' onClick={() => router.push(`/${roleName}/test`)}>
                        <IoMdArrowRoundBack /> Back To Test
                    </Button>
                </Flex>
                <div ref={targetRef}>
                    <Card
                        id='print-test-question'
                        style={{
                            borderTop: 'none',
                            borderRadius: 0
                        }}
                    >
                        <Card
                            style={{
                                border: 'none',
                                padding: '24px',
                                margin: 24,
                                background: '#F9FAFB',
                                borderRadius: '4px',
                                boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.16)',
                            }}
                        >
                            <Row>
                                <Col span={12}>
                                    <p className="table-cell">Test Name</p>
                                    <p className="table-cell">Subject</p>
                                    <p className="table-cell">Test Conducted By</p>
                                    <p className="table-cell">Package Name</p>
                                    <p className="table-cell">State</p>
                                    <p className="table-cell">Total Questions</p>
                                    <p className="table-cell">Duration</p>
                                    <p className="table-cell">Status</p>
                                </Col>

                                <Col span={12} style={{ paddingLeft: '30px' }}>
                                    <p className="table-cell">{printData?.testDisplayName || "No Data Found"}</p>
                                    <p className="table-cell">{printData?.subject?.subjectName || "No Data Found"}</p>
                                    <p className="table-cell">{printData?.testConductedBy?.name || "No Data Found"}</p>
                                    <p className="table-cell">{printData?.packageName?.packageName || "No Data Found"}</p>
                                    <p className="table-cell">{printData?.state?.title || "No Data Found"}</p>
                                    <p className="table-cell">{questions.length || "No Data Found"}</p>
                                    <p className="table-cell">{printData?.duration || "No Data Found"}</p>
                                    <p className="table-cell">{printData?.status || "No Data Found"}</p>
                                </Col>
                            </Row>
                            {isModalVisible && (
                                <div className="custom-modal-overlay">
                                    <div className="custom-modal-content">
                                        <div className="modal-header" style={{ textAlign: 'center' }}>
                                            <span className="tick-icon"><FaCheckCircle style={{ fontSize: '25px', marginRight: '2rem' }} /></span>
                                            <h5>Your Test Printed Successfully</h5>
                                        </div>
                                        <div className="back-button">
                                            <Link type="primary" onClick={handleCancel} href={''}>
                                                <IoMdArrowRoundBack style={{ fontSize: '27px', color: 'black' }} />   <span style={{ fontSize: '17px', color: 'black' }}>Back to Print Test Page</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>
                        <Row
                            gutter={[0, 24]}
                            style={{ margin: 24 }}
                        >
                            {questions?.map((item: QuestionAndComprehension, index: number) => {
                                if (item.questionType === 'comprehension') {
                                    return (
                                        <Col span={24} key={index}>
                                            <Card key={index} title='Comprehension Question'>
                                                <div dangerouslySetInnerHTML={{ __html: item.paragraph }} />
                                                {
                                                    item.questionId.map((paraItem: any, paraIndex: number) => {
                                                        return (
                                                            <QuestionItem index={paraIndex} questions={item.questionId} item={paraItem} key={paraItem._id} />
                                                        )
                                                    })
                                                }
                                            </Card>
                                        </Col>
                                    )
                                } else {
                                    return (
                                        <QuestionItem index={index} questions={questions} item={item} key={item._id} />
                                    )
                                }
                            })}
                        </Row>
                    </Card>
                </div>
            </Col>
        </Row>
    );
};

export default Page;
