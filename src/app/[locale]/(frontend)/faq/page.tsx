"use client";

import { getFaq } from "@/lib/frontendApi";
import { Row, Collapse, Col } from "antd";
import { useEffect, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";

const { Panel } = Collapse;

interface getFaqs {
    questions: string;
    answer: string;
}

export default function FaqPage() {
    const [data, setData] = useState<getFaqs[]>([]);

    const faqHandler = async () => {
        const faqs = await getFaq();
        if (faqs) {
            setData(faqs.data);
        }
    };

    useEffect(() => {
        faqHandler();
    }, []);


    // const styleAnswerContent = (content: string) => {
    //     return content.replace(
    //         /<img [^>]*>/g,
    //         (imgTag) => {
    //             // Add inline styles to the image tag
    //             return imgTag.replace(
    //                 /<img/,
    //                 '<img style="width: 200px !important; height: 200px !important; object-fit: cover;"'
    //             );
    //         }
    //     );
    // };

    return (
        <>
            <Row
                justify="center"
                style={{
                    marginTop: "20px",
                    marginBottom: "2rem",
                    width: "100%",

                    padding: "2rem",
                }}
            >
                <div
                    style={{
                        width: "100%",

                        textAlign: "center",
                    }}
                >
                    <h1 style={{ marginBottom: '2rem' }}>Frequently Asked Questions</h1>

                    <Col span={24}>
                        <Collapse
                            accordion
                            className="faqPart"
                            style={{ width: "100%" }}
                            defaultActiveKey={['0']}
                            expandIcon={({ isActive }) => (
                                <IoIosArrowUp
                                    style={{
                                        fontSize: "20px",
                                        transition: "transform 0.3s",
                                        transform: isActive ? "rotate(0deg)" : "rotate(180deg)",
                                    }}

                                />
                            )}
                        >
                            {data.map((faq, index) => (
                                <Panel
                                    header={<span style={{ fontSize: "16px" }}>{faq.questions}</span>}
                                    key={index}
                                >
                                    <div
                                        style={{ margin: 0 }}
                                        dangerouslySetInnerHTML={{
                                            __html: (faq.answer),
                                        }}
                                    />
                                </Panel>
                            ))}
                        </Collapse>
                    </Col>
                </div>
            </Row>
        </>
    );
}
