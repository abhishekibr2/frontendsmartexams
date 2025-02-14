'use client';
import React from 'react';
import { List, Typography, Row, Col, Image, Avatar, Space } from 'antd';
import './style.css';
import { Forum } from "../../../lib/types";
import { MessageOutlined, EyeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Titles from '@/app/commonUl/Titles';
import ParaText from '@/app/commonUl/ParaText';
const { Text } = Typography;

interface AllForumProps {
    forums: { data: Forum[] };
}


const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);
export default function AllForum({ forums }: AllForumProps) {
    const forumData = forums?.data || [];

    return (
        <>
            <div className="customContainer" id='forums'>
                <Titles level={3} color="PrimaryColor">Q&A</Titles>
                <ParaText color="black" className='dBlock'>
                    We&apos;d love to hear from you! Whether you have a question, feedback, or just want to say hello, our team is here to assist you.
                    Please fill out the form below, and we&apos;ll get back to you as soon as possible.
                </ParaText>
            </div>
            <div className='gapMarginTop'></div>
            <div className="recently-asked-questions">
                <Row justify="space-between" align="middle" style={{ justifyContent: 'center' }}>
                    <Col>
                        <h2 >Recently asked questions</h2>
                    </Col>
                </Row>
                <div className='gapMarginTop'></div>
                <div className="customContainer" id='latest-post'>
                    <Row justify='center' gutter={[16, 16]}>
                        <Col xl={20}>
                            <List
                                itemLayout="vertical"
                                size="small"
                                pagination={{
                                    onChange: (page) => {
                                        console.log(page);
                                    },
                                    pageSize: 10,
                                }}
                                dataSource={forumData}
                                renderItem={(item) => (

                                    <List.Item
                                        key={item?.id || item?.slug}
                                        actions={[
                                            <IconText icon={EyeOutlined} text={`${item?.viewCount || 0}`} key="list-vertical-star-o" />,
                                            <IconText
                                                icon={MessageOutlined}
                                                text={`${item?.comments?.length || 0}`}
                                                key="list-vertical-message"
                                            />
                                        ]}
                                        extra={
                                            item?.attachment ? (
                                                <Image
                                                    width={272}
                                                    alt="logo"
                                                    preview={false}
                                                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/forumImages/original/${item?.attachment}`}
                                                    onError={(e) => {
                                                        e.currentTarget.onerror = null;
                                                        e.currentTarget.src = '/images/default.png';
                                                    }}
                                                />
                                            ) : (
                                                <>
                                                    <Image
                                                        width={272}
                                                        preview={false}
                                                        alt="logo"
                                                        src="/images/default.png"
                                                    />
                                                </>
                                            )
                                        }
                                    >
                                        <List.Item.Meta
                                            avatar={<Image
                                                src={
                                                    item?.userId?.image
                                                        ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/userImage/original/${item?.userId?.image}`
                                                        : `${process.env.NEXT_PUBLIC_BASE_URL}/images/dummy-avatar.jpg`
                                                }
                                                width={40}
                                                height={40}
                                                style={{ objectFit: 'cover', borderRadius: '50%' }}
                                                alt="User Avatar"

                                            />

                                            }

                                            title={<Link href={`/questions/${item?.slug}`}>{item.title}</Link>}
                                            description={
                                                <div
                                                    dangerouslySetInnerHTML={{ __html: (item?.description?.trim().slice(0, 100) + (item?.description?.length > 100 ? '...' : '')) }}
                                                />
                                            }
                                        />
                                        <Text className="posted-info">
                                            <strong>Category:</strong> {item?.categoryId?.name}
                                        </Text>
                                    </List.Item>
                                )}
                            />
                        </Col>
                    </Row>
                    <div className='gapMarginTop'></div>
                </div>
            </div>
        </>
    );
}
