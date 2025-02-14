/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useState, useEffect, useContext } from 'react';
// import './style.css'
import { Col, Divider, Drawer, Image, Row, Badge, Avatar, Button } from 'antd';
import { FaRegBell } from 'react-icons/fa6';
import AuthContext from '@/contexts/AuthContext';
import Link from 'next/link';
import ParaText from '../ParaText';
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { LuMenu } from "react-icons/lu";
import { UserOutlined } from '@ant-design/icons';
import { IoNotificationsOffOutline } from 'react-icons/io5';
import { usePathname, useRouter } from 'next/navigation';
import { getUserNotification, updateAllReadStatus } from '@/lib/commonApi';
import UserAvatarForHeader from '../UserAvatarForHeader';
import LastLoginDateTime from '@/components/frontend/LastLoginDateTime';
import { CiDark } from 'react-icons/ci';
import { MdDarkMode } from 'react-icons/md';
import ErrorHandler from '@/lib/ErrorHandler';
import { getAllRoles } from '@/lib/commonApi';

export default function TopBar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const handleToggle1 = () => {
		setIsMenuOpen(!isMenuOpen);
	};
	const [open, setOpen] = useState(false);

	const showDrawer = () => {
		setOpen(true);
	};

	const onClose = () => {
		setOpen(false);
		setIsMenuOpen(!isMenuOpen);
	};
	const [showNotificationBell, setShowNotificationBell] = useState(false);
	const [notificationData, setNotificationData] = useState<any[]>([]);
	const [latestBell, setLatestBell]: any = useState('');
	const { user, locale } = useContext(AuthContext);
	const [darkMode, setDarkMode] = useState(false);
	const pathName = usePathname();
	const router = useRouter();
	const roleName = user?.roleId?.roleName;
	const [permissions, setPermissions] = useState<Record<string, boolean>>({});

	const handleDivClickBell = (event: any) => {
		event.stopPropagation();
		if (user) {
			fetchAllNotifications();
		}
		setShowNotificationBell(true);
	};



	const fetchAllNotifications = async () => {
		try {
			if (user) {
				const res = await getUserNotification(user?._id);
				if (res.status === true) {
					setNotificationData(res.data);
					if (res.data.length > 0) {
						setLatestBell(res.data[0]);
					}
				}
			}
		} catch (error) { }
	};

	const handleDashboardHeading = () => {
		const pathSegments = pathName.split('/');
		let specificPath: string | undefined = pathSegments.pop();
		if (specificPath && /\d+/.test(specificPath)) {
			specificPath = pathSegments.pop();
		}
	};

	const handleWindowClick = () => {
		setShowNotificationBell(false);
	};
	useEffect(() => {

		handleDashboardHeading();
		window.addEventListener('click', handleWindowClick);

		// Retrieve notification data from session storage when the component mounts
		const storedNotificationData = sessionStorage.getItem('notificationData');
		if (storedNotificationData) {
			setNotificationData(JSON.parse(storedNotificationData));
		}
	}, [handleDashboardHeading]);

	const handleNavigation = async () => {

		try {
			const data = {
				userId: user?._id,
				isRead: 'yes'
			};
			const res = await updateAllReadStatus(data);
			if (res.success === true) {
				setShowNotificationBell(false);
				router.push(`${process.env['NEXT_PUBLIC_SITE_URL']}/${user?.role}/notifications`);
			}
		} catch (error) {
			// ErrorHandler.showNotification(error);
		}
	};

	const handleToggle = () => {
		setDarkMode(!darkMode);

	};


	useEffect(() => {
		if (darkMode) {
			document.body.classList.add('dark-mode');
		} else {
			document.body.classList.remove('dark-mode');
		}
	}, [darkMode]);

	useEffect(() => {
		if (user) {
			fetchData();
		}
	}, [user]);

	const fetchData = async () => {

		try {
			const res = await getAllRoles();
			if (res.status === true) {
				const currentRole = res.data.find((r: any) => r.roleName === roleName);
				if (currentRole) {
					setPermissions(currentRole.permissions);
				}
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	};

	return (
		<>
			<div style={{
				position: 'fixed',    // Make the TopBar fixed to the screen
				top: 0,               // Keep it at the top of the page
				left: 0,             // Align it to the right side of the page
				padding: '16px',      // Adjust padding as needed
				width: '19%',         // You can adjust the width based on your requirements
				zIndex: 1000,         // Ensure it stays above other content
			}}>
				{permissions?.Chat && (
					<Link href={`${locale !== 'en' ? `/${locale}` : ''}/${roleName}/chat`}>
						<IoChatboxEllipsesOutline style={{ fontSize: '20px' }} className='chatIcon' />
					</Link>
				)}
				<div >
					<Button onChange={handleToggle} defaultChecked type="text" onClick={handleToggle} icon={darkMode ? < MdDarkMode size={20} /> : <CiDark size={20} />} />
				</div>
				<div onClick={handleDivClickBell}>
					{latestBell.isRead === '' ? (
						<FaRegBell size={20} />
					) : (
						<div
							className='bell'
							onClick={(e) => {
								handleDivClickBell(e);
							}}
						>
							<FaRegBell size={20} />
						</div>
					)}
				</div>

				{showNotificationBell && (
					<Drawer
						title="Notifications"
						footer={
							<div className="textCenter">
								<ParaText size="small" color="SecondaryColor">
									<b style={{ cursor: 'pointer' }} onClick={handleNavigation}>

									</b>
								</ParaText>
							</div>
						}
						onClose={() => setShowNotificationBell(false)}
						open={showNotificationBell}
					>
						{notificationData.length > 0 ? (
							<>
								{notificationData.map((notification: any, index: any) => {
									if (index < 15) {
										return (
											<Row key={notification._id} gutter={24}>
												<Col xs={4} sm={4} md={4} lg={4} xl={4} xxl={4}>
													{notification?.notifyBy?.image ? (
														<div
															style={{
																borderRadius: '50%',
																marginTop: 'auto',
																width: '60px',
																height: '60px'
															}}
														>
															<Image
																src={
																	notification?.notifyBy?.image
																		? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/original/${notification?.notifyBy?.image}`
																		: `/images/avatar.png`
																}
																alt="Avatar"
																width="40px"
																height="40px"
																style={{ borderRadius: '50px' }}
																preview={false}
															/>
														</div>
													) : (
														<Avatar size={44} icon={<UserOutlined />} />
													)}
												</Col>
												<Col xs={18} sm={18} md={18} lg={18} xl={18} xxl={18}>
													<div key={index}
													>
														<ParaText size="extraSmall" color="black">
															{
																notification.url ?
																	<Link href={notification.url} >

																		<div dangerouslySetInnerHTML={{ __html: notification?.notification }} style={{ cursor: 'pointer', fontSize: '13px' }} />

																	</Link>
																	:
																	<div style={{ cursor: 'pointer', fontSize: '13px' }} dangerouslySetInnerHTML={{ __html: notification.notification }} />
															}
														</ParaText></div>
													<span style={{ fontSize: '10px' }}>
														{notification?.createdAt && (
															<span style={{ fontSize: '11px' }}>
																{new Intl.DateTimeFormat('en-US', {
																	month: 'long',
																	day: 'numeric',
																	hour: 'numeric',
																	minute: 'numeric',
																	hour12: true
																})
																	.format(new Date(notification.createdAt))
																	.replace('at', ',')}
															</span>
														)}
													</span>
												</Col>
												<Col xs={1} sm={1} md={2} lg={2} xl={2} xxl={2}>
													<div>
														{notification?.isRead == 'no' ? (
															<Badge status="processing" text="" />
														) : (
															''
														)}
													</div>
												</Col>
												<Divider />
											</Row>
										);
									} else {
										return false;
									}
								})}
							</>
						) : (
							<div className="textCenter marginTopThree">
								<IoNotificationsOffOutline className='notificationsNone' />
								<br />
								<ParaText size="small" color="defaultColor" className="weight700">
									No New Notifications
								</ParaText>
								<br />
								<ParaText size="small" color="defaultColor">
									Check this section for job updates, and general notifications.
								</ParaText>
							</div>
						)}
					</Drawer>
				)}
				<div className="textCenter">
					<UserAvatarForHeader />
				</div>
			</div>
			<div>
				<LastLoginDateTime />
			</div>
			<Drawer
				placement='left'
				className='admin-menu-drawer-wrapper'
				onClose={onClose}
				open={open}
				size='large'
				style={{ backgroundColor: '#073e74' }}
			>
				{/* <MenuUserMobile onClose={onClose} /> */}
			</Drawer>
		</>
	);
}
