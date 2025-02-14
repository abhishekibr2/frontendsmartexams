'use client'
import React, { useEffect, useState, useContext } from "react";
import { Button, Col, Drawer, Dropdown, Flex, MenuProps, Row, Typography } from "antd";
import { EyeFilled, PlusOutlined } from "@ant-design/icons";
import Link from "next/link";
// @ts-ignore
import { useRouter } from 'nextjs-toploader/app';
import { Test } from "@/lib/types";
import axios from "axios";
import AuthContext from '@/contexts/AuthContext';

export default function EditorLayout({
    params,
    children,
}: {
    params: { id: string };
    children: React.ReactNode;
}) {
    const { id } = params;
    const [test, setTest] = useState<Test>()
    const router = useRouter()
    const { user } = useContext(AuthContext);
    const roleName = user?.roleId?.roleName;
    useEffect(() => {
        const getTestQuestions = async (id: string) => {
            try {
                const response = await axios.get(`/${roleName}/test/${id}/questions`);
                const test = response.data.data
                setTest(test)
            } catch (error) {
                console.error('Error fetching test questions:', error);
            }
        };

        if (id) {
            getTestQuestions(id);
        }
    }, [id]);

    const items: MenuProps["items"] = [
        {
            label: (
                <Link href={`/${roleName}/test/${id}/editor/create-question`}>
                    Add new question
                </Link>
            ),
            key: "0",
        },
        {
            label: (
                <Link href={`/${roleName}/test/${id}/editor/reuse`}>
                    Reuse from question bank
                </Link>
            ),
            key: "1",
        },
        {
            label: (
                <Link href={`/${roleName}/test/${id}/editor/random-question`}>
                    Add random questions
                </Link>
            ),
            key: "2",
        },
    ];

    const actionItems: MenuProps["items"] = [
        {
            label: (
                <Link href={`/${roleName}/test/${id}/editor/reorder`}>
                    Set question order
                </Link>
            ),
            key: "0",
        },
        {
            label: (
                <Link href={`/${roleName}/printTest?printId=${id}`}>
                    Print this page
                </Link>
            ),
            key: "1",
        }
    ];

    const onFinsih = async () => {
        const values = {
            testId: id,
            mode: 'preview',
            timer: 'untimed'
        };
        const response = await axios.post('/student/test/attempt', values);
        const { testAttempt } = response.data;

        router.push(`/${roleName}/test/${id}/editor/preview/${testAttempt._id}`)

    }

    return (
        <Row className="test-editor-layout">
            <Col span={24}>{children}</Col>
            <Col span={24}>
                <Drawer
                    placement="top"
                    width={80}
                    height={90}
                    open={true}
                    headerStyle={{ display: "none" }}
                    style={{
                        backgroundColor: "#202020",
                    }}
                    mask={false}
                >
                    <Flex justify="space-between" align="center">
                        <Link href={`/${roleName}/test/${id}`}>
                            <Button
                                color="default"
                                variant="filled"
                                size="large"
                                style={{
                                    background: "#454545",
                                    color: "#fff",
                                }}
                            >
                                Exit Text Editor
                            </Button>
                        </Link>
                        <Typography.Title level={4} style={{ color: "#fff", margin: 0 }}>
                            Test Name: {test?.testDisplayName}
                        </Typography.Title>
                        <Flex gap={"small"} align="center">
                            <Button
                                type="text"
                                size="large"
                                icon={<EyeFilled />}
                                style={{
                                    background: "#000",
                                    color: "#fff",
                                }}
                                onClick={onFinsih}
                            >
                                Preview
                            </Button>
                            {/* </Link> */}
                            <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
                                <Button size="large" icon={<PlusOutlined />} type="primary">
                                    Add Question
                                </Button>
                            </Dropdown>
                            <Dropdown menu={{ items: actionItems }} trigger={["click"]} placement="bottomRight">
                                <Button
                                    type="text"
                                    size="large"
                                    style={{
                                        background: "#000",
                                        color: "#fff",
                                    }}
                                >
                                    Actions
                                </Button>
                            </Dropdown>
                        </Flex>
                    </Flex>
                </Drawer>
            </Col>
        </Row>
    );
}
