import Link from 'next/link';
//@ts-ignore
import { useRouter } from 'nextjs-toploader/app';
import ErrorHandler from '@/lib/ErrorHandler';
import React, { useContext, useState } from 'react';
import { Badge, Drawer, Row, Col, Divider, Tooltip, Spin } from 'antd';
import ParaText from '@/app/commonUl/ParaText';
import { updateAllReadStatus } from '@/lib/commonApi';
import AuthContext from '@/contexts/AuthContext';
import { IoNotificationsSharp } from 'react-icons/io5';
import './style.css'

interface Notification {
    _id: string;
    url: string;
    notification: string | TrustedHTML;
    isRead: string;
    createdAt: string;
}

interface Props {
    notificationCount: { unreadCount: number };
    notification: Notification[];
    fetchAllNotifications: () => void
}


const Notifications = ({ notificationCount, notification, fetchAllNotifications }: Props) => {
    const router = useRouter();
    const { user } = useContext(AuthContext);
    const [showNotificationBell, setShowNotificationBell] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDivClickBell = async (event: { stopPropagation: () => void; }) => {
        try {
            event.stopPropagation();
            setShowNotificationBell(true);
            if (user) {
                const data = { userId: user?._id, isRead: 'yes' };
                const res = await updateAllReadStatus(data);
                if (res.success) {
                    setShowNotificationBell(true);
                }
                fetchAllNotifications();
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    const handleNavigation = async () => {
        try {
            setLoading(true);
            const data = { userId: user?._id, isRead: 'yes' };
            const res = await updateAllReadStatus(data);
            if (res.success) {
                setShowNotificationBell(false);
                router.push(`/${user?.roleId?.roleName}/notifications`);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div>

            <Tooltip title="Notifications">
                <Badge count={notificationCount?.unreadCount} overflowCount={99}>
                    <IoNotificationsSharp onClick={handleDivClickBell} />
                </Badge>
            </Tooltip>

            {showNotificationBell && (
                <Drawer
                    title="Notifications"
                    footer={
                        <div className="textCenter">
                            <ParaText size="small" color="SecondaryColor">
                                <b style={{ cursor: 'pointer' }} onClick={handleNavigation}>
                                    {loading ? <Spin size="small" /> : 'View All'}
                                </b>

                            </ParaText>
                        </div>
                    }
                    onClose={() => setShowNotificationBell(false)}
                    open={showNotificationBell}
                    width={500}
                >
                    {notification.length > 0 ? (
                        <>
                            {notification.slice(0, 15).map((notification) => (
                                <Row key={notification._id}>
                                    <Col span={23}>
                                        <ParaText size="extraSmall" color="black">
                                            {notification.url ? (
                                                <Link href={notification.url} onClick={() => setShowNotificationBell(false)}>
                                                    <div dangerouslySetInnerHTML={{ __html: notification.notification }} style={{ cursor: 'pointer', fontSize: '13px', color: 'black' }} />
                                                </Link>
                                            ) : (
                                                <div style={{ cursor: 'pointer', fontSize: '13px', color: 'black' }} dangerouslySetInnerHTML={{ __html: notification.notification }} onClick={() => setShowNotificationBell(false)} />
                                            )}
                                        </ParaText>
                                        <span style={{ fontSize: '10px' }}>
                                            {notification.createdAt && (
                                                <span style={{ fontSize: '11px' }}>
                                                    {new Intl.DateTimeFormat('en-US', {
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: 'numeric',
                                                        minute: 'numeric',
                                                        hour12: true,
                                                    })
                                                        .format(new Date(notification.createdAt))
                                                        .replace('at', ',')}
                                                </span>
                                            )}
                                        </span>
                                    </Col>
                                    <Col span={1}>
                                        {notification.isRead === 'no' && <Badge status="processing" text="" />}
                                    </Col>
                                    <Divider />
                                </Row>
                            ))}
                        </>
                    ) : (
                        <div className="textCenter marginTopThree">
                            <ParaText size="small" color="defaultColor" className="weight700">
                                No New Notifications
                            </ParaText>
                        </div>
                    )}
                </Drawer>
            )}
        </div>
    );
};

export default Notifications;
