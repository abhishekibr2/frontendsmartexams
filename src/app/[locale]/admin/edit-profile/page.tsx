'use client';
import React, { useContext, useEffect } from 'react';
import './style.css';
import { Tabs, Collapse } from 'antd';
import ParaText from '@/app/commonUl/ParaText';
import EditProfile from '@/components/Admin/Profile/EditProfile';
import ResetPassword from '@/components/Admin/Profile/ResetPassword';
import CardInfo from '@/components/Admin/Profile/CardInfo';
import Notification from '@/components/User/Profile/Notification';
import { useSearchParams, useRouter } from 'next/navigation';
import AuthContext from '@/contexts/AuthContext';
const { Panel } = Collapse;

export default function Page() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { user } = useContext(AuthContext);
	const activeTabFromURL = searchParams.get('key');
	const [key, setKey] = React.useState(!activeTabFromURL ? 'edit-profile' : activeTabFromURL);

	const items = [
		{ label: 'Edit Profile', key: 'edit-profile', content: <EditProfile activeKey={key} /> },
		{ label: 'Reset Password', key: 'reset-password', content: <ResetPassword /> },
		{ label: 'Card Information', key: 'card-information', content: <CardInfo activeKey={key} /> },
		{ label: 'Notification', key: 'notification', content: <Notification activeKey={key} /> },
	];

	const handleTabChange = (newKey: string) => {
		setKey(newKey);
		if (newKey === 'edit-profile') {
			router.push(`/${user?.role}/edit-profile`);
		} else
			router.push(`/${user?.role}/edit-profile?key=${newKey}`);
	};

	return (
		<div className="editProfileStyle">
			<ParaText size="large" fontWeightBold={600} color="PrimaryColor">
				Profile
			</ParaText>
			<div className="tabContainer">
				<Tabs
					tabPosition="left"
					activeKey={key}
					items={items.map((item) => ({
						label: item.label,
						key: item.key,
						children: item.content,
					}))}
					onChange={handleTabChange}
				/>
			</div>
			<div className="collapseContainer">
				<Collapse accordion defaultActiveKey={key}>
					{items.map((item) => (
						<Panel header={item.label} key={item.key}>
							{item.content}
						</Panel>
					))}
				</Collapse>
			</div>
		</div>
	);
}
