'use client';
import React, { useContext, useEffect, useState } from 'react';
import { Layout, Menu, Drawer, Image, Row, Col, Dropdown, Popover, Flex, Typography, Badge } from 'antd';
import Link from 'next/link';
const { Header, Sider } = Layout;
import type { MenuProps } from 'antd';
import { IoLockClosedOutline, IoSettingsOutline } from 'react-icons/io5';
import AuthContext from '@/contexts/AuthContext';
import { FiLock } from 'react-icons/fi';
import { CiUser } from 'react-icons/ci';
import { getBrandDetails } from '@/lib/frontendApi';
import { MenuOutlined } from '@ant-design/icons';
import './style.css';
import { HiShoppingCart } from 'react-icons/hi2';
import { AiOutlineLogout, AiOutlineUser } from 'react-icons/ai';
import StudentHeaderDropdown from '@/components/Student/StudentHeaderDropdown';
import { FaNoteSticky } from "react-icons/fa6";
import { TfiWrite } from "react-icons/tfi";
import { SlSupport } from 'react-icons/sl';
import { RiUser3Line } from 'react-icons/ri';
import { MdDashboard, MdOutlineContactPage } from 'react-icons/md';
import { TbArrowGuide } from "react-icons/tb";
import { DataProvider } from '@/contexts/DataContext';
import ErrorHandler from '@/lib/ErrorHandler';
import { getStudentCartDetails } from '@/lib/studentApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCartItems, setTotalCount } from '@/redux/reducers/userCartReducer';
import { useMediaQuery } from 'react-responsive';
import { GiProgression, GiWhiteBook } from 'react-icons/gi';
import { BiPurchaseTagAlt } from 'react-icons/bi';
import Notifications from '@/components/notification/Notifications';
import { getUserNotification } from '@/lib/commonApi';
import { usePathname } from 'next/navigation';
import { PiBrainLight } from 'react-icons/pi';


const StudentLayout = ({ children }: { children: React.ReactNode }) => {
	const { user, locale, logout } = useContext(AuthContext);
	const [drawerVisible, setDrawerVisible] = useState(false);
	const isMobile = useMediaQuery({ query: '(max-width: 991px)' });
	const dispatch = useAppDispatch();
	const [notification, setNotification] = useState<any[]>([]);
	const [notificationCount, setNotificationCount] = useState<{ unreadCount: number }>({ unreadCount: 0 });
	const pathname = usePathname()
	const hideHeaderAndSider = pathname.includes('/student/test/');
	const totalCount = useAppSelector((state) => state.userCartReducer.totalCount);

	const fetchCartDetails = async () => {
		try {
			const response = await getStudentCartDetails(user?._id as string);
			if (response.status) {
				dispatch(setCartItems(response.data));
				dispatch(setTotalCount(response.totalCount));
			}

		} catch (err) {
			ErrorHandler.showNotification(err);
		}
	}

	useEffect(() => {
		if (user?._id) fetchCartDetails();
	}, [user])

	useEffect(() => {
		if (user?._id) {
			fetchAllNotifications()
		}
	}, [user?._id])

	const fetchAllNotifications = async () => {
		try {
			if (user) {
				const res = await getUserNotification(user?._id);
				if (res.status === true) {
					setNotification(res.data);
					const unreadNotifications = res.data.filter((notification: { isRead: string }) => notification.isRead === "no");
					setNotificationCount({
						unreadCount: unreadNotifications.length
					});
				}
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	};
	function handleClick() {
		fetchAllNotifications();
	}


	const items: MenuProps['items'] = [
		{
			label: 'Dashboard',
			key: 'dashboard',
			icon: (
				<Link href={`${locale !== 'en' ? `/${locale}` : ''}/student/dashboard`}>
					<MdDashboard />
				</Link>
			)
		},
		{
			label: 'Tests',
			key: 'test',
			icon: (
				<Link href={`${locale !== 'en' ? `/${locale}` : ''}/student/test`}>
					<FaNoteSticky />
				</Link>
			)
		},
		{
			label: 'My Essays',
			key: 'myessays',
			icon: (
				<Link href={`${locale !== 'en' ? `/${locale}` : ''}/student/myEssay`}>
					<TfiWrite />
				</Link>
			)
		},
		{
			label: 'Test Results',
			key: 'testResult',
			icon: (
				<Link href={`${locale !== 'en' ? `/${locale}` : ''}/student/test-result`}>
					<GiProgression />
				</Link>
			)
		},


		// here Add free Ebooks
		{
			label: 'My ebooks',
			key: 'myEbooks',
			icon: (
				<Link href={`${locale !== 'en' ? `/${locale}` : ''}/student/my-ebooks`}>
					<GiWhiteBook />
				</Link>
			)
		},
		{
			label: 'Buy test',
			key: 'buytest',
			icon: (
				<Link href={`${locale !== 'en' ? `/${locale}` : ''}/student/buy-test`}>
					<BiPurchaseTagAlt />
				</Link>
			)
		},
		{
			label: 'Buy Study Guides',
			key: 'ebooks',
			icon: (
				<Link href={`${locale !== 'en' ? `/${locale}` : ''}/student/ebooks`}>
					<TbArrowGuide />
				</Link>
			)
		},
		{
			label: 'Profile',
			key: 'profile',
			icon: (
				<Link href={`${locale !== 'en' ? `/${locale}` : ''}/student/my-profile`}>
					<CiUser />
				</Link>
			)
		},
		{
			label: 'Contact Us',
			key: 'contactUs',
			icon: (
				<Link href={`${locale !== 'en' ? `/${locale}` : ''}/student/contact-us`}>
					<MdOutlineContactPage />
				</Link>
			)
		},
		{
			label: 'Practice Area',
			key: 'practice',
			icon: (
				<Link href={'/student/practice-area'}>
					<PiBrainLight />
				</Link>
			)
		}

	];

	const settingItems: MenuProps['items'] = [
		{
			key: '1',
			label: (
				<Link href={`${locale !== 'en' ? `/${locale}` : ''}/student/my-profile`} className='icon-list-top-bar'>
					<RiUser3Line />
					My Account
				</Link>
			),
		},
		{
			key: '2',
			label: (
				<Link href={`${locale !== 'en' ? `/${locale}` : ''}/student/my-profile`} className='icon-list-top-bar'>
					<IoSettingsOutline />
					Settings
				</Link>
			),
		},
		{
			key: '3',
			label: (
				<Link href={`${locale !== 'en' ? `/${locale}` : ''}/student/contactUs`} className='icon-list-top-bar'>
					<SlSupport />
					Support
				</Link>
			),
		},
		{
			key: '4',
			label: (
				<Link href={`${locale !== 'en' ? `/${locale}` : ''}/student/change-password`} className='icon-list-top-bar'>
					<IoLockClosedOutline />
					Lock Screen
				</Link>
			),
		},
		{
			key: '5',
			label: (
				<Link href='/login' onClick={() => logout()} className='icon-list-top-bar'>
					<AiOutlineLogout />
					Logout
				</Link>
			),
		},
	];

	return (
		<DataProvider>
			<Layout
				style={{
					minHeight: '100vh',
					backgroundColor: '#EAE9F1'
				}}
			>
				{!hideHeaderAndSider && (
					<Header className="admin-header toggle-bar" style={{
						position: 'fixed',
						height: 100,
						width: '100%',
						zIndex: 1
					}}>
						<div className='menu-panel'>
							<Link href="/" className='logo-link'>
								<Image
									// src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/brandImage/original/${brandMenu?.logo}`}
									src='/images/logo.png'
									preview={false}
									alt=''
									width={200}
								/>

							</Link>
							{isMobile && (
								<MenuOutlined
									className="menu-toggle"
									onClick={() => setDrawerVisible(true)}
								/>
							)}
						</div>
						<div className='icon-panel'>
							<Row className='top-bar-icons'>
								<Col >
									<Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/cart`}>
										<Badge count={totalCount}>
											<HiShoppingCart />
										</Badge>
									</Link>
								</Col>
								<Col >
									<Dropdown menu={{ items: settingItems }} placement="bottomRight" arrow={{ pointAtCenter: true }} >
										<IoSettingsOutline className='setting-icon fa-spin' />
									</Dropdown>
								</Col>

								<Col >
									<Notifications notification={notification} notificationCount={notificationCount} fetchAllNotifications={fetchAllNotifications} />
								</Col>

								<Col >
									<StudentHeaderDropdown />
								</Col>
							</Row>
						</div>
					</Header>
				)}
				<Layout>
					{
						!hideHeaderAndSider && !isMobile && (
							isMobile ? (
								<Drawer
									title="SMART EXAMS"
									placement="left"
									onClose={() => setDrawerVisible(false)}
									visible={drawerVisible}
									bodyStyle={{ padding: 0 }}
								>
									<Menu
										mode="inline"
										style={{ height: '100%', borderRight: 0 }}
										items={items}
									/>
								</Drawer>
							) : (
								<Sider
									width={300}
									style={{
										background: '#fff',
										height: '91vh',
										position: 'fixed',
										marginTop: '85px'
									}}
									id="left-menubar"
								>
									<Menu
										className='admin-sidebar'
										mode="inline"
										defaultSelectedKeys={['1']}
										defaultOpenKeys={['sub1']}
										style={{ height: '100%', borderRight: 0, marginBottom: '15px' }}
										items={items}
										onClick={handleClick}
									/>
									<div className='loginBottom loginBottomList'>
										<Popover placement="bottomLeft" className='sidebar-popover' content={
											<Row className='left-menu-drop'>
												<Col span={12}>
													<div className='drop-list-icons'>
														<a href="#">
															<AiOutlineUser />

															My Account
														</a>
													</div>
												</Col>
												<Col span={12}>
													<div className='drop-list-icons'>
														<a href="#">
															<IoSettingsOutline />

															Settings
														</a>
													</div>
												</Col>
												<Col span={12}>
													<div className='drop-list-icons'>
														<a href="#">
															<FiLock />

															Lock Screen
														</a>
													</div>
												</Col>
												<Col span={12}>
													<div className='drop-list-icons'>
														<Link href="/login" onClick={() => logout()}>
															<AiOutlineLogout />

															Logout
														</Link>
													</div>
												</Col>
											</Row>}>
											<Flex className='flx-name'>

												{user && user.image ? (
													<Image
														src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/original/${user.image}`}
														alt="Avatar"
														preview={false}
														style={{ width: 35, height: 35, objectFit: 'cover', borderRadius: '30px' }}
													/>
												) : (
													<Image
														src={`/user.jpg`}
														alt="Profile"
														preview={false}


														style={{ width: 45, height: 45, objectFit: 'cover', borderRadius: '30px' }}
													/>
												)}

												< div className='name-list'>
													<Typography.Title level={5}>
														{user?.name}
													</Typography.Title>
													<Typography.Text type="secondary">
														{user?.email}
													</Typography.Text>
												</div>
											</Flex>
										</Popover>
									</div>
								</Sider>
							))}
					<Layout className={!hideHeaderAndSider ? 'responsive-layout' : ''}>
						<div className='right-bar'>
							{children}
						</div>
					</Layout>
				</Layout>
			</Layout>
		</DataProvider>
	);
};

export default StudentLayout;
