'use client';
import ParaText from '@/app/commonUl/ParaText';
import AuthContext from '@/contexts/AuthContext';
import ErrorHandler from '@/lib/ErrorHandler';
import { getUserNotification, deleteAllMessages, deleteMessage } from '@/lib/commonApi';
import { Col, Row, Avatar, Tag, Checkbox, Button, message, List, Popconfirm, notification } from 'antd';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
//@ts-ignore
import { useRouter } from 'nextjs-toploader/app';
import { IoNotificationsOffOutline } from 'react-icons/io5';
import './style.css';
import type { Notification as NotificationType } from '@/lib/types';

interface Props {
    activeKey: string
}

import { setNotification, selectAllNotification, setSelectedNotifications, setLoading } from '@/redux/reducers/notificationReducer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Loading from '@/app/commonUl/Loading';

export default function Notification({ activeKey }: Props) {
    const { user } = useContext(AuthContext);
    const router = useRouter();
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const dispatch = useDispatch();
    const notificationData = useSelector((state: RootState) => state.notificationReducer.notification)
    const selectAll = useSelector((state: RootState) => state.notificationReducer.selectAll)
    const selectedNotifications = useSelector((state: RootState) => state.notificationReducer.selectedNotifications);
    const loading = useSelector((state: RootState) => state.notificationReducer.loading);

    useEffect(() => {
        if (user) fetchAllNotifications();
    }, [activeKey, user])

    const fetchAllNotifications = async () => {
        try {
            const res = await getUserNotification(user?._id);
            if (res.status === true) {
                dispatch(setNotification(res.data))
                dispatch(setLoading(false))
            }
        } catch (error) {
            dispatch(setLoading(false))
            ErrorHandler.showNotification(error);
        }
    };

    const handleNavigation = (notification: NotificationType) => {
        router.push(`${process.env.NEXT_PUBLIC_SITE_URL}/${notification.url}`);
    };

    const handleSelectNotification = (id: string) => {
        dispatch(setSelectedNotifications(
            selectedNotifications.includes(id)
                ? selectedNotifications.filter((notificationId: string) => notificationId !== id)
                : [...selectedNotifications, id]
        ));
    };


    const handleSelectAll = (checked: boolean, currentPageNotifications: NotificationType[]) => {
        if (checked) {
            const newSelectedNotifications = [
                ...selectedNotifications,
                ...currentPageNotifications.map((notification) => notification._id),
            ];
            dispatch(setSelectedNotifications(newSelectedNotifications));
        } else {
            const newSelectedNotifications = selectedNotifications.filter(
                (id) => !currentPageNotifications.some((notification) => notification._id === id)
            );
            dispatch(setSelectedNotifications(newSelectedNotifications));
        }
        dispatch(selectAllNotification(checked));
    };


    const handleDeleteSelected = async () => {
        try {
            if (selectedNotifications.length === 0) {
                notification.warning({
                    message: 'No Notifications Selected',
                    description: 'Please select at least one notification to delete.',
                });
                return;
            }
            const currentPageNotifications = notificationData.slice(
                (pagination.current - 1) * pagination.pageSize,
                pagination.current * pagination.pageSize
            );

            const notificationsToDelete = selectedNotifications.filter((id) =>
                currentPageNotifications.some((notification) => notification._id === id)
            );

            if (notificationsToDelete.length === 0) return;

            if (notificationsToDelete.length === 1) {
                const res = await deleteMessage({ userId: user?._id, notificationId: notificationsToDelete[0] });
                if (res.success) {
                    message.success(res.message);
                    fetchAllNotifications();
                }
            } else {
                const res = await deleteAllMessages({ userId: user?._id, notificationIds: notificationsToDelete });
                if (res.success) {
                    message.success(res.message);
                    fetchAllNotifications();
                }
            }

            const newSelectedNotifications = selectedNotifications.filter(
                (id) => !notificationsToDelete.includes(id)
            );
            dispatch(setSelectedNotifications(newSelectedNotifications));
            dispatch(selectAllNotification(false))
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };


    return (
        <>
            <ParaText size="large" fontWeightBold={600} color="PrimaryColor">
                Notification
            </ParaText>
            <div className='gapMarginTopOne'></div>
            <Row>
                <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                    <div className="notifications">
                        <div className="notificationList">
                            {loading ? <Loading /> :
                                notificationData.length > 0 ? (
                                    <>
                                        <Checkbox
                                            checked={selectAll}
                                            onChange={(e) =>
                                                handleSelectAll(
                                                    e.target.checked,
                                                    notificationData.slice(
                                                        (pagination.current - 1) * pagination.pageSize,
                                                        pagination.current * pagination.pageSize
                                                    )
                                                )
                                            }
                                        >
                                            Select All
                                        </Checkbox>

                                        {selectedNotifications.length > 0 && (
                                            <Popconfirm
                                                title="Are you sure you want to delete the selected notifications?"
                                                onConfirm={handleDeleteSelected}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <Button
                                                    type="primary"
                                                    danger
                                                    style={{ marginLeft: '10px' }}
                                                    disabled={selectedNotifications.length === 0}
                                                >
                                                    {selectedNotifications.length === 1 ? 'Delete Notification' : 'Delete All Notifications'}
                                                </Button>
                                            </Popconfirm>
                                        )}

                                        <div className="gapMarginTopTwo"></div>
                                        <List
                                            itemLayout="horizontal"
                                            pagination={{
                                                pageSize: pagination.pageSize,
                                                current: pagination.current,
                                                position: 'bottom',
                                                align: 'end',
                                                showSizeChanger: false,
                                                onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
                                            }}
                                            dataSource={notificationData}
                                            renderItem={(item) => (
                                                <List.Item
                                                    actions={[
                                                        <Checkbox
                                                            key={item._id}
                                                            checked={selectedNotifications.includes(item._id)}
                                                            onChange={() => handleSelectNotification(item._id)}
                                                        />,
                                                    ]}
                                                >
                                                    <List.Item.Meta
                                                        avatar={
                                                            <Avatar
                                                                src={
                                                                    item?.notifyBy?.image
                                                                        ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/userImage/original/${item?.notifyBy?.image}`
                                                                        : `${process.env.NEXT_PUBLIC_BASE_URL}/images/dummy-avatar.jpg`
                                                                }
                                                            />
                                                        }
                                                        title={
                                                            item.url ? (
                                                                <Link href={item.url}>
                                                                    <span
                                                                        onClick={() => handleNavigation(item)}
                                                                        dangerouslySetInnerHTML={{ __html: item?.notification }}
                                                                    />
                                                                </Link>
                                                            ) : (
                                                                <span dangerouslySetInnerHTML={{ __html: item?.notification }} />
                                                            )
                                                        }
                                                        description={
                                                            <div style={{ display: 'flex', gap: '5px', fontSize: '11px' }}>
                                                                <span>
                                                                    {new Intl.DateTimeFormat('en-US', {
                                                                        month: 'long',
                                                                        day: 'numeric',
                                                                        hour: 'numeric',
                                                                        minute: 'numeric',
                                                                        hour12: true,
                                                                    }).format(new Date(item?.createdAt))}
                                                                </span>
                                                                {item?.tag && (
                                                                    <Tag color={item.tag === 'registered' ? 'green' : 'blue'}>
                                                                        {item.tag}
                                                                    </Tag>
                                                                )}
                                                            </div>
                                                        }
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    </>
                                ) : (
                                    <div className="textCenter marginTopThree">
                                        <IoNotificationsOffOutline style={{ fontSize: '50px' }} />
                                        <br />
                                        <ParaText size="small" color="defaultColor" className="weight700">
                                            No New Notifications
                                        </ParaText>
                                        <br />
                                    </div>
                                )}
                        </div>
                    </div>
                </Col>
            </Row >
        </>
    );
}
