'use client'
import { getAllForums } from '@/lib/commonApi';
import ErrorHandler from '@/lib/ErrorHandler';
import { Avatar, Badge, Col, Divider, Empty, Image, Row, Tooltip } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
// import './style.css';
import RelativeTime from '@/app/commonUl/RelativeTime';
import ParaText from '@/app/commonUl/ParaText';
import RightSection from '@/components/Forums/SingleForum/RightSection';
import Link from 'next/link';
import { LikeOutlined, DislikeOutlined, UserOutlined, LikeFilled, DislikeFilled, MessageOutlined, EyeFilled } from '@ant-design/icons';
import AuthContext from '@/contexts/AuthContext';
import { submitForumVote } from '@/lib/frontendApi';
// import Loading from '@/ChatUI/components/Loading';
import { truncateLongString } from '@/helper/stringFunctions';
interface Forum {
    userId: {
        image: string,
        name: string
    };
    _id: string;
    title: string;
    slug: string;
    description: string;
    attachment?: string;
    likes: string[];
    dislikes: string[];
    comments: string[];
    viewCount: number;
    createdAt: string;
}

export default function Page() {
    const [forums, setForums] = useState<any[]>([]);
    const { user } = useContext(AuthContext);
    const [modal, setModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState<string>();
    const roleName = user?.roleId?.roleName;


    useEffect(() => {
        fetchData();
    }, [searchQuery])


    const fetchData = async () => {

        try {
            const res = await getAllForums({});
            if (res.status == true) {
                setForums(res.data)
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }

    const handleVote = async (forumId: string, vote: string) => {
        try {
            if (!user) {
                setModal(true);
                return;
            }
            const data = {
                forumId: forumId,
                userId: user?._id,
                type: vote
            }

            const res = await submitForumVote(data);
            if (res.status == true) {
                setForums(prevForums =>
                    prevForums.map(forum => {
                        if (forum._id === forumId) {
                            if (vote === 'like') {
                                const hasDisliked = forum.dislikes.includes(user?._id);
                                const hasLiked = forum.likes.includes(user?._id);
                                return {
                                    ...forum,
                                    likes: hasLiked ? forum.likes.filter((id: string | null | undefined) => id !== user?._id) : [...forum.likes, data.userId],
                                    dislikes: hasDisliked ? forum.dislikes.filter((id: string | null | undefined) => id !== user?._id) : forum.dislikes
                                };
                            } else if (vote === 'dislike') {
                                const hasLiked = forum.likes.includes(user?._id);
                                const hasDisliked = forum.dislikes.includes(user?._id);
                                return {
                                    ...forum,
                                    dislikes: hasDisliked ? forum.dislikes.filter((id: string | null | undefined) => id !== user?._id) : [...forum.dislikes, data.userId],
                                    likes: hasLiked ? forum.likes.filter((id: string | null | undefined) => id !== user?._id) : forum.likes
                                };
                            }
                        }
                        return forum;
                    })
                );
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    const handleSearch = (data: string) => {
        const query = {
            search: data
        }



        const queryString = JSON.stringify(query);
        setSearchQuery(queryString);
    };

    function handleCallback(data: string) {
        throw new Error('Function not implemented.');
    }

    if (!user) {
        // return <Loading />;
    }


    return (
        <>
            <div className='formPageStyle'>
                <div className='forums'>
                    <Row>
                        <Col md={1}></Col>
                        <Col md={15}>
                            {forums.length > 0 ?
                                <Row>
                                    {forums.map((forum: Forum) => {
                                        return (
                                            <>
                                                <Col md={23}>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <div style={{ marginTop: '15px' }}>
                                                            {forum.userId?.image ?
                                                                <Image
                                                                    src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/original/${forum.userId.image}`
                                                                    }
                                                                    alt="Avatar"
                                                                    width="50px"
                                                                    height="50px"
                                                                    style={{ borderRadius: '50px' }}
                                                                    preview={false}
                                                                />
                                                                :
                                                                <Avatar size={50} icon={<UserOutlined />} />
                                                            }
                                                        </div>
                                                        <div style={{ marginTop: '14px' }}>

                                                            <span style={{ fontSize: '20px', textTransform: "capitalize" }}>
                                                                {forum.userId?.name}
                                                                <Badge status='default' />
                                                            </span>

                                                            <div>
                                                                <div className="gapMarginTopOne"></div>
                                                                <Tooltip title="Tap to view" trigger={['hover', 'click']}>
                                                                    <span>
                                                                        <ParaText size="large" fontWeightBold={600} color="PrimaryColor" >
                                                                            <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/${roleName}/questions/${forum.slug}`}>
                                                                                {forum.title.length > 95 ? `${forum.title.slice(0, 95)}...` : forum.title}
                                                                            </Link>
                                                                        </ParaText>
                                                                    </span>
                                                                </Tooltip>

                                                                <div className="gapMarginTopOne"></div>
                                                                <div dangerouslySetInnerHTML={{ __html: `${forum?.description && forum.description.length > 750 ? forum.description.slice(0, 150) + '...' : forum.description}` }}></div>


                                                                <div className="gapPaddingTopOTwo"></div>
                                                                {forum.attachment ?
                                                                    <Image
                                                                        src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/forumImages/original/${forum.attachment}`}
                                                                        alt="Avatar"
                                                                        width={'40%'}
                                                                        height={'200px'}
                                                                        style={{ borderRadius: '5px' }}
                                                                        preview={false}
                                                                    />
                                                                    :
                                                                    <Avatar size={50} icon={<UserOutlined />} />

                                                                }
                                                                <div className="smallTopMargin"></div>
                                                                {!forum.attachment &&
                                                                    <div dangerouslySetInnerHTML={{ __html: truncateLongString(forum?.description, 200) }}></div>
                                                                }

                                                                <div className="gapPaddingTopOTwo"></div>
                                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                                    <div style={{ display: 'flex', gap: '10px' }} className='likeCommentRadius'>
                                                                        <div style={{ cursor: 'pointer' }} onClick={() => handleVote(forum._id, 'like')}>
                                                                            {user?._id && forum.likes.includes(user._id) ? (
                                                                                <LikeFilled style={{ fontSize: '16px' }} />
                                                                            ) : (
                                                                                <LikeOutlined style={{ fontSize: '16px' }} />
                                                                            )}
                                                                            {forum.likes.length}
                                                                        </div>
                                                                        <div style={{ cursor: 'pointer' }} onClick={() => handleVote(forum._id, 'dislike')}>
                                                                            {user?._id && forum.dislikes.includes(user._id) ? (
                                                                                <DislikeFilled style={{ fontSize: '16px' }} />
                                                                            ) : (
                                                                                <DislikeOutlined style={{ fontSize: '16px' }} />
                                                                            )}
                                                                            {forum.dislikes.length}
                                                                        </div>

                                                                    </div>
                                                                    <div className='likeCommentRadius'>
                                                                        <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/${roleName}/questions/${forum.slug}`}>
                                                                            <MessageOutlined style={{ fontSize: '16px' }} /> {forum.comments.length}
                                                                        </Link>
                                                                    </div>
                                                                    <div className='likeCommentRadius'>
                                                                        <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/${roleName}/questions/${forum.slug}`}>
                                                                            Views {forum.viewCount}
                                                                        </Link>
                                                                    </div>
                                                                    <div className='likeCommentRadius'>
                                                                        <RelativeTime date={forum.createdAt} />
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>




                                                    <Divider />
                                                </Col>
                                                <Col md={1}></Col>
                                            </>
                                        )
                                    })}
                                </Row>
                                :
                                <div className='textCenter'>
                                    <Image
                                        width={'50%'}
                                        height={'100%'}
                                        preview={false}
                                        src={'http://localhost:5000/images/Nodata-amico.png'}
                                        alt="card__image"
                                        className="card__image"
                                        fallback='/images/Nodata-amico.png'
                                    />
                                </div>
                            }
                        </Col>
                        <Col md={6}>
                            <RightSection onCallBack={(data: string) => { handleCallback(data) }} onSearch={(data: string) => handleSearch(data)} />
                        </Col>
                    </Row>
                </div></div>
        </>

    )
}
