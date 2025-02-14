'use client';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import AuthContext from '../../contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import Header from '../Header';
import Footer from '../Footer';
import { Spin } from 'antd';
interface Props {
	children: ReactNode;
}

const Providers = (props: Props) => {
	const pathname = usePathname();
	const [isMobile, setIsMobile] = useState(false);
	const { user } = useContext(AuthContext);
	const roleName = user?.roleId.roleName;
	const [isPathnameReady, setIsPathnameReady] = useState(false);


	const excludedPaths = [
		roleName,
		'/admin',
		'/student',
		'/login',
		'/otp',
		'/register',
		'/forgot-password',
		'/reset-password',
		'/payment',
		'/lock-screen',
		'/test-attempt',
		'/operator'
	];

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 767);
		};
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	useEffect(() => {
		if (pathname) {
			setIsPathnameReady(true);
		}
	}, [pathname]);


	if (!isPathnameReady)
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh',
					width: '100vw',
					backgroundColor: '#f0f2f5',
				}}
			>
				<Spin size="large" />
			</div>
		);


	return (
		<>


			{isPathnameReady && !excludedPaths.some((path) => pathname.includes(path)) && <Header />}
			{/* {!excludedPaths.some((path) => pathname.includes(path)) && <Header />} */}
			<SessionProvider>
				<div className='main-content-wrapper'>
					{props.children}
				</div>
			</SessionProvider>
			{/* {!excludedPaths.some((path) => pathname.includes(path)) && <Footer />} */}
			{isPathnameReady && !excludedPaths.some((path) => pathname.includes(path)) && <Footer />}


		</>

	);
};

export default Providers;
