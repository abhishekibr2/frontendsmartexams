import Link from 'next/link';
import './style.css';
import {
	getBrandDetails,
	getStateWithExamTypes
} from '@/lib/frontendApi';
import { usePathname } from 'next/navigation';
import StudentHeaderDropdown from '../Student/StudentHeaderDropdown';
import AuthContext from '@/contexts/AuthContext';
import { Dropdown, Space, Menu, Image } from 'antd';
import AdminHeaderDropdown from '../Admin/AdminHeaderDropdown';
import React, { useContext, useEffect, useState } from 'react';

interface CustomMenuItem {
	key: string;
	label: React.ReactNode;
	children?: CustomMenuItem[];
}

export default function Header() {
	const { user } = useContext(AuthContext)
	const [isMobile, setIsMobile] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [menuItems, setMenuItems] = useState<CustomMenuItem[]>([]);
	const [stateId, setStateId] = useState([]);
	const [brandMenu, setBrandMenu]: any = useState([]);
	const pathname = usePathname();
	const [activeMenu, setActiveMenu] = useState<string | null>(null);
	const [activeState, setActiveState] = useState<string | null>(null);
	const [isScrolled, setIsScrolled] = useState(false);

	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const roleName = user?.roleId?.roleName;

	useEffect(() => {
		fetchMenuItems();
		fetchBrandMenuItems();
	}, []);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 992);
		};
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	const fetchBrandMenuItems = async () => {
		try {
			const response = await getBrandDetails();
			setBrandMenu(response.data);
		} catch (error) {
			console.error('Error fetching header menus:', error);
		}
	};

	const fetchMenuItems = async () => {

		try {
			const response = await getStateWithExamTypes();
			const stateIds = response.data.map((item: any) => item._id);
			setStateId(stateIds);

			if (response?.data) {
				const formattedMenuItems = response.data.map((item: any) => {
					return {
						key: item._id,
						label: (
							<Link href='/test-packs' onClick={handleMenuClick} className="dropdown-item">
								{item.title.toUpperCase()}
							</Link>
						),
						children: item.examTypes.map((examType: any) => ({

							key: examType._id,
							label: <Link href={`/state/${item.slug}/${examType.slug}`}
								className="dropdown-item">{examType.examType}</Link>
						})),

					};
				});
				setMenuItems(formattedMenuItems);
			}
		} catch (error) {
			console.log('Error fetching header menus:', error);
		}
	};

	const handleMenuClick = () => {
		setDropdownOpen(false);
	};
	const isActive = (path: string) => {
		return pathname === path ? 'active' : '';
	};


	const handleMobileMenuToggle = (key: string) => {
		setActiveMenu(activeMenu === key ? null : key);
	};



	const handleStateClick = (e: React.MouseEvent, key: string) => {
		e.stopPropagation();
		setActiveState((prevState) => (prevState === key ? '' : key));
		setIsMenuOpen(true);
	};

	const menu = <Menu items={menuItems} className="custom-dropdown-menu-data" />;

	const handleMenuItemClick = () => {
		setIsMenuOpen(false);
		const collapseElement = document.getElementById("navbarSupportedContent");
		if (collapseElement) {
			collapseElement.classList.remove("show");
		}
	};
	const handleChildItemClick = () => {
		setDropdownOpen(false); // Close the dropdown when a child item is clicked
		setIsMenuOpen(false); // Close the menu when a child item is clicked
		handleMobileMenuToggle("");
		const collapseElement = document.getElementById("navbarSupportedContent");
		if (collapseElement) {
			collapseElement.classList.remove("show");
		}

	};

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 50) {
				setIsScrolled(true);
			} else {
				setIsScrolled(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<header className={`header-part ${isScrolled ? "fixed-header" : ""}`}>
			<div className="container-fluid">
				<nav className="navbar navbar-expand-lg navbar-light">
					<Link href="/" className='navbar-brand'>
						<Image
							alt=''
							src={brandMenu
								? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/brandImage/original/${brandMenu?.logo}`
								: '/images/logo.svg'}
							preview={false}
							width={200}
							className='class="logo-header"'
						/>
					</Link>

					<button
						className="navbar-toggler"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarSupportedContent"
						aria-controls="navbarSupportedContent"
						// aria-expanded="false"
						aria-label="Toggle navigation"
						onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle button ka click
						aria-expanded={isMenuOpen ? 'true' : 'false'}


					>
						<span className="navbar-toggler-icon" />
					</button>
					<div
						className={`${isMobile ? 'collapse navbar-collapse' : 'navbar-collapse'}`}
						id="navbarSupportedContent"
					>
						<ul className="navbar-nav ms-auto mb-lg-0">
							<li className="nav-item">
								<Link className={`nav-link ${isActive('/')}`} aria-current="page" href="/" onClick={handleMenuItemClick}>
									Home
								</Link>
							</li>
							<div className='mobile-view-exam'>
								<li className="border-exam-info" onClick={() => handleMobileMenuToggle('examInfo')}>
									<li className="nav-link">
										<Space className='nav-link-mob-expand'>Exam Info

											<span className={`arrow-icon ${activeMenu === 'examInfo' ? 'expanded' : ''}`}></span>

										</Space>


									</li>
									{activeMenu === 'examInfo' && (
										<ul className="mobile-dropdown custom-dropdown">
											{menuItems.map((item) => (


												<li key={item.key} className="dropdown-state-item">
													<span
														onClick={handleMenuItemClick}
														className="dropdown-state-label"

													>
														{item.label}
														<span onClick={(e) => { handleStateClick(e, item.key) }}
															className={`arrow-icon ${activeState === item.key ? 'expanded' : ''}`}
														></span>
													</span>

													{/* Only toggle the visibility of child items under the clicked state */}
													{activeState === item.key && item.children && (
														<ul className="dropdown-children">
															{item.children.map((child) => (
																<li key={child.key} className="dropdown-child-item-meun" >
																	<span className="dropdown-child-link" onClick={(e) => { handleStateClick(e, item.key); handleChildItemClick(); }}>
																		{child.label}
																	</span>

																</li>
															))}
														</ul>
													)}
												</li>
											))}
										</ul>
									)}
								</li>
							</div>
							<div className='desktop-view-exam'>
								<li className="nav-item dropdown">
									<Dropdown
										overlay={menu}
										trigger={['hover']}
										open={dropdownOpen}
										onOpenChange={(open) => setDropdownOpen(open)}
										className="w-100 custom-dropdown"
									>
										<Link
											className="nav-link dropdown-toggle"
											href="/"
											id="navbarDropdown"
											role="button"
											aria-expanded="false"
										>
											<Space>Exam Info</Space>
										</Link>
									</Dropdown>
								</li>
							</div>
							<li className="nav-item">
								<Link className={`nav-link ${isActive('/test-packs')}`} href="/test-packs" onClick={handleMenuItemClick}>
									Test Packs
								</Link>
							</li>
							<li className="nav-item">
								<Link className={`nav-link ${isActive('/ebooks')}`} href="/ebooks" onClick={handleMenuItemClick}>
									Ebooks
								</Link>
							</li>
							<li className="nav-item dropdown">
								<Link className={`nav-link ${isActive('/tutoring-classes')}`} href="/tutoring-classes" onClick={handleMenuItemClick}>
									Tutoring & Classes
								</Link>
							</li>
							<li className="nav-item">
								<Link className={`nav-link ${isActive('/why-choose-us')}`} href="/why-choose-us" onClick={handleMenuItemClick}>
									Why Choose Us?
								</Link>
							</li>
							<div className='user-and-logout'>
								{user ? (
									user?.roleId?.roleName === "student" ? (
										<div className="nav-user">
											<StudentHeaderDropdown />
										</div>
									) : user?.roleId?.roleName === "admin" || user?.roleId?.roleName === user?.roleId?.roleName ? (
										<div className="nav-user">
											<AdminHeaderDropdown />

										</div>
									) : null
								) : (
									<li className="nav-item">
										<Link className="nav-link" href="/login">
											Login
										</Link>
									</li>
								)}


								<li className="nav-item">
									<Link className={`nav-link ${isActive('/cart')}`} href="/cart">
										<i className="fa-solid fa-bag-shopping" />
									</Link>
								</li>


							</div>
						</ul>
					</div>
				</nav>
			</div>
		</header>

	);
}
