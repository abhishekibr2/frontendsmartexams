'use client';
import React, { useState } from 'react';
import { Tabs } from 'antd';
import { useMediaQuery } from 'react-responsive';
import './style.css';
import ParaText from '@/app/commonUl/ParaText';
import EditProfile from '@/components/User/Profile/EditProfile';
import ResetPassword from '@/components/User/Profile/ResetPassword';
import IdentityUpload from '@/components/User/Profile/IdentityUpload';
import DigitalSignature from '@/components/User/Profile/DigitalSignature';
import Notification from '@/components/User/Profile/Notification';

export default function Page() {
	const [key, setKey] = useState('1');
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const items = [
		{
			label: 'Edit Profile',
			key: '1',
			children: <EditProfile activeKey={key} />,
		},
		{
			label: 'Reset Password',
			key: '2',
			children: <ResetPassword activeKey={key} />,
		},
		{
			label: 'Identity Upload',
			key: '3',
			children: <IdentityUpload activeKey={key} />,
		},
		{
			label: 'Digital Signature',
			key: '4',
			children: <DigitalSignature activeKey={key} />,
		},
		{
			label: 'Notifications',
			key: '5',
			children: <Notification activeKey={key} />,
		},
	];

	return (
		<>
			<div className='editProfile'>
				<ParaText size="large" fontWeightBold={600} color="PrimaryColor">
					Profile
				</ParaText>
				<div className="largeTopMargin"></div>
				<Tabs
					tabPosition={isMobile ? 'top' : 'left'}
					defaultActiveKey="1"
					items={items}
					onChange={(value) => setKey(value)}
				/>
			</div>
		</>
	);
}
