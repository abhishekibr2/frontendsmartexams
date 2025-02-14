'use client';
import './style.css';
import Link from 'next/link';
const { Header, Sider } = Layout;
import type { MenuProps } from 'antd';
import { PiExam } from 'react-icons/pi';
import { MdSubject } from 'react-icons/md';
import { GrUpgrade } from 'react-icons/gr';
import { TfiWrite } from "react-icons/tfi";
import { FiPackage } from 'react-icons/fi';
import { SlSupport } from 'react-icons/sl';
import { RiUser3Line } from 'react-icons/ri';
import { AiOutlineLock } from 'react-icons/ai';
import { GiMatterStates } from 'react-icons/gi';
import { useMediaQuery } from 'react-responsive';
import AuthContext from '@/contexts/AuthContext';
import { MenuOutlined } from '@ant-design/icons';
import { MdOutlineAddHome } from "react-icons/md";
import { VscEditorLayout } from "react-icons/vsc";
import { FaClock, FaUsers } from 'react-icons/fa';
import { TbTopologyComplex } from 'react-icons/tb';
import { getBrandDetails } from '@/lib/frontendApi';
import { HiOutlineSquares2X2 } from 'react-icons/hi2';
import { DataProvider } from '@/contexts/DataContext';
import React, { useContext, useEffect, useState } from 'react';
import { AiOutlineLogout, AiOutlineUser } from 'react-icons/ai';
import Notifications from '@/components/notification/Notifications';
import AdminHeaderDropdown from '@/components/Admin/AdminHeaderDropdown';
import { IoLockClosedOutline, IoSettingsOutline } from 'react-icons/io5';
import { Layout, Menu, Drawer, Image, Row, Col, Dropdown, Popover, Flex, Typography } from 'antd';
import { getAllRoles, getUserNotification } from '@/lib/commonApi';
import ErrorHandler from '@/lib/ErrorHandler';

const RoleLayout = ({ children }: { children: React.ReactNode }) => {
	const { user, locale, logout } = useContext(AuthContext);
	const [brandMenu, setBrandMenu]: any = useState([]);
	const [drawerVisible, setDrawerVisible] = useState(false);
	const isMobile = useMediaQuery({ query: '(max-width: 991px)' });
	const [notification, setNotification] = useState<any[]>([]);
	const [notificationCount, setNotificationCount] = useState<{ unreadCount: number }>({ unreadCount: 0 });
	const roleName = user?.roleId?.roleName;
	const [permissions, setPermissions] = useState<Record<string, boolean>>({});

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
	const fetchBrandMenuItems = async () => {
		try {
			const response = await getBrandDetails();
			setBrandMenu(response.data);
		} catch (error) {
			console.error('Error fetching header menus:', error);
		}
	};

	useEffect(() => {
		fetchBrandMenuItems();
	}, []);

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


	const renderIcon = (iconClass: string, bgColorStart: string, bgColorEnd: string) => (
		<div
			className="icon-card-dash dash-icon-g"
			style={{
				background: `linear-gradient(83.31deg, ${bgColorStart} 21.22%, ${bgColorEnd} 88.54%)`,
				width: '20px',
				height: '20px',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				borderRadius: '50%',
			}}
		>
			<i className={iconClass} style={{ fontSize: '10px' }}></i>
		</div>
	);

	const items: MenuProps['items'] = [
		permissions?.Packages && {
			label: 'Packages',
			key: 'packages',
			icon: renderIcon('fa-solid fa-box', 'rgb(233 172 18)', 'rgb(231 117 0)'),
			children: [
				permissions?.Packages && {
					label: 'Packages',
					key: 'packages-main',
					icon: (
						<Link href={`${locale !== 'en' ? `/${locale}` : ''}/${roleName}/packages`}>
							{renderIcon('fa-solid fa-dollar-sign', 'rgb(115 116 116)', 'rgb(64 67 66)')}
						</Link>
					),
				},
				permissions?.PackageEssay && {
					label: 'Package Essay',
					key: 'package-essay',
					icon: (
						<Link href={`${locale !== 'en' ? `/${locale}` : ''}/${roleName}/essayPackage`}>
							{renderIcon('fa-solid fa-hand-holding-dollar', 'rgb(0 207 142)', 'rgb(9 253 188)')}
						</Link>
					),
				},
				permissions?.PackageOrderList && {
					label: 'Order List',
					key: 'package-orders',
					icon: (
						<Link href={`${locale !== 'en' ? `/${locale}` : ''}/${roleName}/package-orders`}>
							{renderIcon('fa-solid fa-list-ol', 'rgb(233 172 18)', 'rgb(231 117 0)')}
						</Link>
					),
				},
				permissions?.SubmitPackageList && {
					label: 'Submitted Package Essays',
					key: 'submitted-package-essay',
					icon: (
						<Link href={`${locale !== 'en' ? `/${locale}` : ''}/${roleName}/submittedPackageEssay`}>
							{renderIcon('fa-solid fa-hand-holding-dollar', 'rgb(146 18 213)', 'rgb(181 95 255)')}
						</Link>
					),
				},
			].filter(Boolean), // Removes falsy items
		},
		permissions?.AllTest && {
			label: 'All Tests',
			key: 'test',
			icon: (
				<Link href={`${locale !== 'en' ? `/${locale}` : ''}/${roleName}/test`}>
					{renderIcon('fa-regular fa-paste', 'rgb(115 116 116)', 'rgb(64 67 66)')}
				</Link>
			),
		},
		permissions?.QuestionBank && {
			label: 'Questions',
			key: 'questions',
			icon: renderIcon('fa-regular fa-circle-question', '#0aabc7', '#8ae9ff'),
			children: [
				permissions?.QuestionBank && {
					label: 'Question Bank',
					key: 'question-bank',
					icon: (
						<Link href={`${locale !== 'en' ? `/${locale}` : ''}/${roleName}/question`}>
							{renderIcon('fa-regular fa-circle-question', '#0aabc7', '#8ae9ff')}
						</Link>
					),
				},
				permissions?.QuestionReport && {
					label: 'Questions Report',
					key: 'questions-report',
					icon: (
						<Link href={`${locale !== 'en' ? `/${locale}` : ''}/${roleName}/questions-report`}>
							{renderIcon('fa-regular fa-circle-question', '#0aabc7', '#8ae9ff')}
						</Link>
					),
				},
			].filter(Boolean),
		},
		permissions?.Ebook && {
			label: 'Ebook',
			key: 'ebooks',
			icon: renderIcon('fa-solid fa-book', 'rgb(119 80 190)', 'rgb(151 94 255)'),
			children: [
				permissions?.Ebook && {
					label: 'Ebook',
					key: 'ebook',
					icon: (
						<Link href={`${locale !== 'en' ? `/${locale}` : ''}/${roleName}/ebook`}>
							{renderIcon('fa-solid fa-book-atlas', 'rgb(0 207 142)', 'rgb(9 253 188)')}
						</Link>
					),
				},
				permissions?.EbookOrderList && {
					label: 'Order List',
					key: 'ebook-order',
					icon: (
						<Link href={`${locale !== 'en' ? `/${locale}` : ''}/${roleName}/ebook-order`}>
							{renderIcon('fa-solid fa-book-atlas', 'rgb(119 80 190)', 'rgb(151 94 255)')}
						</Link>
					),
				},
			].filter(Boolean),
		},
		permissions?.Users && {
			label: 'Users',
			key: 'users',
			icon: (
				<Link href={`${locale !== 'en' ? `/${locale}` : ''}/${roleName}/users`}>
					{renderIcon('fa-solid fa-user-tie', 'rgb(233 172 18)', 'rgb(231 117 0)')}
				</Link>
			),
		},
		permissions?.ContactUs && {
			label: 'Contact Us',
			key: 'contactUs',
			icon: (
				<Link href={`${locale !== 'en' ? `/${locale}` : ''}/${roleName}/contactUs`}>
					{renderIcon('fa-solid fa-phone', 'rgb(10 101 199)', 'rgb(22 138 255)')}
				</Link>
			),
		},
		permissions?.Profile && {
			label: 'Profile',
			key: 'profile',
			icon: (
				<Link href={`${locale !== 'en' ? `/${locale}` : ''}/${roleName}/profile`}>
					{renderIcon('fa-solid fa-user', 'rgb(233 172 18)', 'rgb(231 117 0)')}
				</Link>
			),
		},
	].filter(Boolean) as MenuProps['items']; // This ensures the result is of type MenuProps['items']




	const settingItems: MenuProps['items'] = [
		{
			key: '1',
			label: (

				<Link href={`${locale !== 'en' ? `/${locale}` : ''}/${roleName}/profile`} className='icon-list-top-bar'>
					<RiUser3Line />
					My Account
				</Link>
			),
		},

		{
			key: '4',
			label: (
				<Link href={`${locale !== 'en' ? `/${locale}` : ''}/${roleName}/lock-screen`} className='icon-list-top-bar'>
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
		}

	];

	return (
		<DataProvider>
			<Layout
				style={{
					minHeight: '100vh',
					backgroundColor: '#EAE9F1'
				}}
			>
				<Header className="admin-header toggle-bar" style={{
					position: 'fixed',
					height: 100,
					width: '100%',
					zIndex: 1
				}}>
					<div className='menu-panel'>
						<Link href="/" className='logo-link'>
							<Image
								alt=''
								src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/brandImage/original/${brandMenu?.logo}`}
								preview={false}
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

					<div className="icon-panel">
						<Row className="top-bar-icons">
							<Col>
								{permissions?.Masters && (
									<Popover
										placement="bottomRight"
										content={
											<Row className="popup-dorpdown">

												<Col span={8}>
													<div className="drop-list-icons">
														<Link href={`${locale !== 'en' ? `/${locale}` : ''}/${roleName}/testimonials`}>
															<TbTopologyComplex />
															Testimonial
														</Link>
													</div>
												</Col>
												<Col span={8}>
													<div className="drop-list-icons">
														<Link href={`${locale !== 'en' ? `/${locale}` : ''}/${roleName}/states`}>
															<GiMatterStates />
															States
														</Link>
													</div>
												</Col>
												<Col span={8}>
													<div className="drop-list-icons">
														<Link href={`${locale !== 'en' ? `/${locale}` : ''}/${roleName}/faq`}>
															<TfiWrite />
															F&Q
														</Link>
													</div>
												</Col>
												<Col span={8}>
													<div className="drop-list-icons">
														<Link href={`${locale !== 'en' ? `/${locale}` : ''}/${roleName}/examType`}>
															<PiExam />
															Exam Type
														</Link>
													</div>
												</Col>
												<Col span={8}>
													<div className="drop-list-icons">
														<Link href={`${locale !== 'en' ? `/${locale}` : ''}/${roleName}/subject`}>
															<MdSubject />
															Subject
														</Link>
													</div>
												</Col>
												<Col span={8}>
													<div className="drop-list-icons">
														<Link href={`${locale !== 'en' ? `/${locale}` : ''}/${roleName}/grade`}>
															<GrUpgrade />
															Grade
														</Link>
													</div>
												</Col>
												<Col span={8}>
													<div className="drop-list-icons">
														<Link href={`${locale !== 'en' ? `/${locale}` : ''}/${roleName}/complexity`}>
															<TbTopologyComplex />
															Complexity
														</Link>
													</div>
												</Col>
												<Col span={8}>
													<div className="drop-list-icons">
														<Link href={`${locale !== 'en' ? `/${locale}` : ''}/${roleName}/duration`}>
															<FaClock />
															Duration
														</Link>
													</div>
												</Col>
												<Col span={8}>
													<div className="drop-list-icons">
														<Link href={`${locale !== 'en' ? `/${locale}` : ''}/${roleName}/testConducted`}>
															<TbTopologyComplex />
															Test Conducted
														</Link>
													</div>
												</Col>
												<Col span={8}>
													<div className="drop-list-icons">
														<Link href={`${locale !== 'en' ? `/${locale}` : ''}/${roleName}/homepage-banner`}>
															<MdOutlineAddHome />
															Home Banner
														</Link>
													</div>
												</Col>
												<Col span={8}>
													<div className="drop-list-icons">
														<Link href={`${locale !== 'en' ? `/${locale}` : ''}/${roleName}/terms&condition`}>
															<VscEditorLayout />
															Terms
														</Link>
													</div>
												</Col>
												<Col span={8}>
													<div className="drop-list-icons">
														<Link href={`${locale !== 'en' ? `/${locale}` : ''}/${roleName}/privacy&Policy`}>
															<AiOutlineLock />
															Privacy
														</Link>
													</div>
												</Col>
												<Col span={8}>
													<div className="drop-list-icons">
														<Link href={`${locale !== 'en' ? `/${locale}` : ''}/${roleName}/packageTypes`}>
															<FiPackage />
															Package Type
														</Link>
													</div>
												</Col>
											</Row>
										}
									>
										<HiOutlineSquares2X2 />
									</Popover>
								)}
							</Col>
							<Col>
								<Dropdown menu={{ items: settingItems }} placement="bottomRight" arrow={{ pointAtCenter: true }}>
									<IoSettingsOutline className="setting-icon fa-spin" />
								</Dropdown>
							</Col>
							<Col>
								<Notifications notification={notification} notificationCount={notificationCount} fetchAllNotifications={fetchAllNotifications} />
							</Col>
							<Col>
								<AdminHeaderDropdown />
							</Col>
						</Row>
					</div>



				</Header>
				<Layout>
					{isMobile ? (
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
								<Popover placement="bottomLeft" className='sidebar-popover'>
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
					)}
					{/* <Layout style={{ marginLeft: 250, marginTop: '85px' }}> */}
					<Layout className="responsive-layout">
						<div className='right-bar'>
							{children}
						</div>
					</Layout>
				</Layout>
			</Layout >
		</DataProvider >
	);
};

export default RoleLayout;
