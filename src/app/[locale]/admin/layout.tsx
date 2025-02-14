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
import { SiPayloadcms } from "react-icons/si";
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
import { getUserNotification } from '@/lib/commonApi';
import ErrorHandler from '@/lib/ErrorHandler';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
	const { user, locale, logout } = useContext(AuthContext);
	const [brandMenu, setBrandMenu]: any = useState([]);
	const [drawerVisible, setDrawerVisible] = useState(false);
	const isMobile = useMediaQuery({ query: '(max-width: 991px)' });
	const [notification, setNotification] = useState<any[]>([]);
	const [notificationCount, setNotificationCount] = useState<{ unreadCount: number }>({ unreadCount: 0 });

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


	const items: MenuProps['items'] = [
		{
			label: 'Dashboard',
			key: 'dashboard',
			icon: (
				<Link href={`${locale !== 'en' ? `/${locale}` : ''}/admin/dashboard`}>
					<div className="icon-card-dash dash-icon-g" style={{
						background: 'linear-gradient(83.31deg, rgb(146 18 213) 21.22%, rgb(181 95 255) 88.54%)',
						width: '20px', height: '20px', display: 'flex',
						justifyContent: 'center',  // Centers the icon horizontally
						alignItems: 'center',
						borderRadius: '50%',
					}} >
						<i className="fa-solid fa-dashboard" style={{
							fontSize: '10px',

						}}></i>
					</div>

				</Link>
			)
		},

		{
			label: 'Packages',
			key: 'packages',
			icon:
				<div className="icon-card-dash dash-icon-g" style={{
					background: 'linear-gradient(83.31deg, rgb(233 172 18) 21.22%, rgb(231 117 0) 88.54%)',
					width: '20px', height: '20px', display: 'flex',
					justifyContent: 'center',  // Centers the icon horizontally
					alignItems: 'center',
				}} >
					<i className="fa-solid fa-box" style={{
						fontSize: '10px',

					}}></i>
				</div>,

			children: [
				{
					label: 'Packages',
					key: 'packages',
					icon: (
						<Link href={`${locale !== 'en' ? `/${locale}` : ''}/admin/packages`}>
							<div className="icon-card-dash dash-icon-g" style={{
								background: 'linear-gradient(83.31deg, rgb(115 116 116) 21.22%, rgb(64 67 66) 88.54%)',
								width: '20px', height: '20px', display: 'flex',
								justifyContent: 'center',  // Centers the icon horizontally
								alignItems: 'center',
								borderRadius: '50%',
							}} >
								<i className="fa-solid fa-dollar-sign" style={{
									fontSize: '10px',

								}}></i>
							</div>

						</Link>
					),
				},

				{
					label: 'Package Essay',
					key: 'packageEssay',
					icon: (
						<Link href={`${locale !== 'en' ? `/${locale}` : ''}/admin/essayPackage`}>
							<div className="icon-card-dash dash-icon-g" style={{
								background: 'linear-gradient(83.31deg, rgb(0 207 142) 21.22%, rgb(9 253 188) 88.54%)',
								width: '20px', height: '20px', display: 'flex',
								justifyContent: 'center',  // Centers the icon horizontally
								alignItems: 'center',
								borderRadius: '50%',
							}} >
								<i className="fa-solid fa-hand-holding-dollar" style={{
									fontSize: '10px',

								}}></i>
							</div>
						</Link>
					),
				},
				{
					label: 'Order List',
					key: 'package-orders',
					icon: (
						<Link href={`${locale !== 'en' ? `/${locale}` : ''}/admin/package-orders`}>
							<div className="icon-card-dash dash-icon-g" style={{
								background: 'linear-gradient(83.31deg, rgb(233 172 18) 21.22%, rgb(231 117 0) 88.54%)',
								width: '20px', height: '20px', display: 'flex',
								justifyContent: 'center',  // Centers the icon horizontally
								alignItems: 'center',
								borderRadius: '50%',
							}} >
								<i className="fa-solid fa-list-ol" style={{
									fontSize: '10px',

								}}></i>
							</div>
						</Link>
					),
				},
				{
					label: 'Submitted Package Essays',
					key: 'submittedPackageEssay',
					icon: (
						<Link href={`${locale !== 'en' ? `/${locale}` : ''}/admin/submittedPackageEssay`}>
							<div className="icon-card-dash dash-icon-g" style={{
								background: 'linear-gradient(83.31deg, rgb(146 18 213) 21.22%, rgb(181 95 255) 88.54%)',
								width: '20px', height: '20px', display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								borderRadius: '50%',
							}} >
								<i className="fa-solid fa-hand-holding-dollar" style={{
									fontSize: '10px',

								}}></i>
							</div>

						</Link>
					),
				},

			],
		},

		// All Tests

		{
			label: 'All Tests',
			key: 'test',
			icon: (
				<Link href={`${locale !== 'en' ? `/${locale}` : ''}/admin/test`}>
					<div className="icon-card-dash dash-icon-g" style={{
						background: 'linear-gradient(83.31deg, rgb(115 116 116) 21.22%, rgb(64 67 66) 88.54%)',
						width: '20px', height: '20px', display: 'flex',
						justifyContent: 'center',  // Centers the icon horizontally
						alignItems: 'center',
						borderRadius: '50%',
					}} >
						<i className="fa-regular fa-paste" style={{
							fontSize: '10px',

						}}></i>
					</div>
				</Link>
			)
		},

		// Question Bank

		{
			label: 'Questions',
			key: 'questions',
			icon: <div className="icon-card-dash dash-icon-g" style={{
				background: 'linear-gradient(83.31deg, #0aabc7 21.22%, #8ae9ff 88.54%)', width: '20px', height: '20px', display: 'flex',
				justifyContent: 'center',  // Centers the icon horizontally
				alignItems: 'center',
				borderRadius: '50%',

			}} >
				<i className="fa-regular fa-circle-question" style={{
					fontSize: '10px',

				}}></i>
			</div>,
			children: [
				{
					label: 'Question Bank',
					key: 'question-bank',
					icon: (
						<Link href={`${locale !== 'en' ? `/${locale}` : ''}/admin/question`}>
							<div className="icon-card-dash dash-icon-g" style={{
								background: 'linear-gradient(83.31deg, #0aabc7 21.22%, #8ae9ff 88.54%)', width: '20px', height: '20px', display: 'flex',
								justifyContent: 'center',  // Centers the icon horizontally
								alignItems: 'center',
								borderRadius: '50%',
							}} >
								<i className="fa-regular fa-circle-question" style={{
									fontSize: '10px',

								}}></i>
							</div>
						</Link>
					)
				},

				{
					label: 'Questions Report',
					key: 'questions-report',
					icon: (
						<Link href={`${locale !== 'en' ? `/${locale}` : ''}/admin/questions-report`}>
							<div className="icon-card-dash dash-icon-g" style={{
								background: 'linear-gradient(83.31deg, #0aabc7 21.22%, #8ae9ff 88.54%)', width: '20px', height: '20px', display: 'flex',
								justifyContent: 'center',  // Centers the icon horizontally
								alignItems: 'center',
								borderRadius: '50%',
							}} >
								<i className="fa-regular fa-circle-question" style={{
									fontSize: '10px',

								}}></i>
							</div>
						</Link>
					)
				},

			]
		},

		// Ebook
		{
			label: 'Ebook',
			key: 'ebooks',
			icon: <div className="icon-card-dash dash-icon-g" style={{
				background: 'linear-gradient(83.31deg, rgb(119 80 190) 21.22%, rgb(151 94 255) 88.54%)', width: '20px', height: '20px', display: 'flex',
				justifyContent: 'center',  // Centers the icon horizontally
				alignItems: 'center',
				borderRadius: '50%',
			}} >
				<i className="fa-solid fa-book" style={{
					fontSize: '10px',

				}}></i>
			</div>,
			children: [
				{
					label: 'Ebook',
					key: 'ebook',
					icon: (
						<Link href={`${locale !== 'en' ? `/${locale}` : ''}/admin/ebook`}>
							<div className="icon-card-dash dash-icon-g" style={{
								background: 'linear-gradient(83.31deg, rgb(0 207 142) 21.22%, rgb(9 253 188) 88.54%)', width: '20px', height: '20px', display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								borderRadius: '50%',
							}} >
								<i className="fa-solid fa-book-atlas" style={{
									fontSize: '10px',

								}}></i>
							</div>
						</Link>
					),
				},
				{
					label: 'Order List',
					key: 'ebook-order',
					icon: (
						<Link href={`${locale !== 'en' ? `/${locale}` : ''}/admin/ebook-order`}>
							<div className="icon-card-dash dash-icon-g" style={{
								background: 'linear-gradient(83.31deg, rgb(119 80 190) 21.22%, rgb(151 94 255) 88.54%)', width: '20px', height: '20px', display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								borderRadius: '50%',
							}} >
								<i className="fa-solid fa-book-atlas" style={{
									fontSize: '10px',

								}}></i>
							</div>
						</Link>
					),
				},
			]
		},


		// Users
		{
			label: 'Users',
			key: 'users',
			icon: (
				<Link href={`${locale !== 'en' ? `/${locale}` : ''}/admin/users`}>
					<div className="icon-card-dash dash-icon-g" style={{
						background: 'linear-gradient(83.31deg, rgb(233 172 18) 21.22%, rgb(231 117 0) 88.54%)',
						width: '20px', height: '20px', display: 'flex',
						justifyContent: 'center',  // Centers the icon horizontally
						alignItems: 'center',
						borderRadius: '50%',  // Makes the div a circle

					}} >
						<i className="fa-solid fa-user-tie" style={{
							fontSize: '10px',

						}}></i>
					</div>
				</Link>
			)
		},

		// Contact- Us
		{
			label: 'Contact Us',
			key: 'contactUs',
			icon: (
				<Link href={`${locale !== 'en' ? `/${locale}` : ''}/admin/contactUs`}>
					<div className="icon-card-dash dash-icon-g" style={{
						background: 'linear-gradient(83.31deg, rgb(10 101 199) 21.22%, rgb(22 138 255) 88.54%)',
						width: '20px', height: '20px', display: 'flex',
						justifyContent: 'center',  // Centers the icon horizontally
						alignItems: 'center',
						borderRadius: '50%',
					}} >
						<i className="fa-solid fa-phone" style={{
							fontSize: '10px',

						}}></i>
					</div>
				</Link>
			)
		},
	];

	const settingItems: MenuProps['items'] = [
		{
			key: '1',
			label: (

				<Link href={`${locale !== 'en' ? `/${locale}` : ''}/admin/profile`} className='icon-list-top-bar'>
					<RiUser3Line />
					My Account
				</Link>
			),
		},
		{
			key: '2',
			label: (
				<Link href={`${locale !== 'en' ? `/${locale}` : ''}/admin/settings`} className='icon-list-top-bar'>
					<IoSettingsOutline />
					Settings
				</Link>
			),
		},
		{
			key: '3',
			label: (
				<Link href={`${locale !== 'en' ? `/${locale}` : ''}/admin/contactUs`} className='icon-list-top-bar'>
					<SlSupport />
					Support
				</Link>

			),
		},
		{
			key: '4',
			label: (
				<Link href={`${locale !== 'en' ? `/${locale}` : ''}/admin/lock-screen`} className='icon-list-top-bar'>
					<IoLockClosedOutline />
					Lock Screen
				</Link>

			),
		},
		// {
		// 	key: '5',
		// 	label: (
		// 		<a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com" className='icon-list-top-bar'>
		// 			<AiOutlineLogout />
		// 			Logout
		// 		</a>
		// 	),
		// },
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
					<div className='icon-panel'>
						<Row className='top-bar-icons'>
							<Col>
								<Popover placement="bottomRight"
									content={
										<Row className='popup-dorpdown'>
											< Col span={8} >
												<div className='drop-list-icons'>
													<Link href={`${locale !== 'en' ? `/${locale}` : ''}/admin/roles`}>
														<FaUsers />
														Roles
													</Link>
												</div>
											</Col>
											<Col span={8}>
												<div className='drop-list-icons'>
													<Link href={`${locale !== 'en' ? `/${locale}` : ''}/admin/testimonials`}>
														<TbTopologyComplex />
														Testimonial
													</Link>
												</div>
											</Col>
											<Col span={8}>
												<div className='drop-list-icons'>
													<Link href={`${locale !== 'en' ? `/${locale}` : ''}/admin/states`}>
														<GiMatterStates />

														States
													</Link>
												</div>
											</Col>
											<Col span={8}>
												<div className='drop-list-icons'>
													<Link href={`${locale !== 'en' ? `/${locale}` : ''}/admin/faq`}>
														<TfiWrite />

														F&Q
													</Link>
												</div>
											</Col>
											<Col span={8}>
												<div className='drop-list-icons'>
													<Link href={`${locale !== 'en' ? `/${locale}` : ''}/admin/examType`}>
														<PiExam />

														Exam Type
													</Link>
												</div>
											</Col>
											<Col span={8}>
												<div className='drop-list-icons'>
													<Link href={`${locale !== 'en' ? `/${locale}` : ''}/admin/subject`}>
														<MdSubject />

														Subject
													</Link>
												</div>
											</Col>
											<Col span={8}>
												<div className='drop-list-icons'>
													<Link href={`${locale !== 'en' ? `/${locale}` : ''}/admin/grade`}>
														<GrUpgrade />

														Grade
													</Link>
												</div>
											</Col>
											<Col span={8}>
												<div className='drop-list-icons'>

													<Link href={`${locale !== 'en' ? `/${locale}` : ''}/admin/complexity`}>
														<TbTopologyComplex />

														Complexity
													</Link>
												</div>
											</Col>
											<Col span={8}>
												<div className='drop-list-icons'>

													<Link href={`${locale !== 'en' ? `/${locale}` : ''}/admin/duration`}>
														<FaClock />
														Duration
													</Link>
												</div>
											</Col>
											<Col span={8}>
												<div className='drop-list-icons'>

													<Link href={`${locale !== 'en' ? `/${locale}` : ''}/admin/testConducted`}>
														<TbTopologyComplex />

														Test Conducted
													</Link>
												</div>
											</Col>
											<Col span={8}>
												<div className='drop-list-icons'>

													<Link href={`${locale !== 'en' ? `/${locale}` : ''}/admin/homepage-banner`}>
														<MdOutlineAddHome />

														Home Banner
													</Link>
												</div>
											</Col>

											<Col span={8}>
												<div className='drop-list-icons'>

													<Link href={`${locale !== 'en' ? `/${locale}` : ''}/admin/terms&condition`}>
														<VscEditorLayout />

														Terms
													</Link>
												</div>
											</Col>
											<Col span={8}>
												<div className="drop-list-icons">
													<Link href={`${locale !== 'en' ? `/${locale}` : ''}/admin/privacy&Policy`}>
														<AiOutlineLock />
														Privacy
													</Link>
												</div>
											</Col>
											<Col span={8}>
												<div className='drop-list-icons'>
													<Link href={`${locale !== 'en' ? `/${locale}` : ''}/admin/packageTypes`}>
														<FiPackage />
														Package Type
													</Link>
												</div>
											</Col>


										</Row>}><HiOutlineSquares2X2 />
								</Popover>
							</Col>
							<Col >
								<Dropdown menu={{ items: settingItems }} placement="bottomRight" arrow={{ pointAtCenter: true }}>
									<IoSettingsOutline className='setting-icon fa-spin ' />
								</Dropdown>
							</Col>
							<Col >
								<Notifications notification={notification} notificationCount={notificationCount} fetchAllNotifications={fetchAllNotifications} />
							</Col>

							<Col >
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
								<Popover placement="bottomLeft" className='sidebar-popover' content={
									<Row className='left-menu-drop'>
										<Col span={12}>
											<div className='drop-list-icons'>
												<Link href={`${locale !== 'en' ? `/${locale}` : ''}/admin/profile`} >
													<AiOutlineUser />
													My Account
												</Link>
											</div>
										</Col>
										<Col span={12}>
											<div className='drop-list-icons'>
												<Link href={`${locale !== 'en' ? `/${locale}` : ''}/admin/settings`} >
													<IoSettingsOutline />
													Settings
												</Link>
											</div>
										</Col>
										<Col span={12}>
											<div className='drop-list-icons'>
												<Link href={`${locale !== 'en' ? `/${locale}` : ''}/admin/cms`}>
													<SiPayloadcms />
													CMS
												</Link>

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

export default AdminLayout;
