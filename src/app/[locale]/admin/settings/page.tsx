'use client';
import React, { useContext, useState } from 'react';
import './style.css';
import { Tabs, Collapse } from 'antd';
import ParaText from '@/app/commonUl/ParaText';
import Brand from '@/components/Admin/Settings/Brand';
import SEO from '@/components/Admin/Settings/SEO';
import SocialMedia from '@/components/Admin/Settings/SocialMedia';
import Payment from '@/components/Admin/Settings/Payment';
import EmailSignature from '@/components/Admin/Settings/EmailSignature';
import EmailTemplate from '@/components/Admin/Settings/EmailTemplate';
import HeaderMenu from '@/components/Admin/Settings/HeaderMenu';
import FooterMenu from '@/components/Admin/Settings/FooterMenu';
import AuthContext from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';

const { Panel } = Collapse;

export default function Page() {
	const searchParams = useSearchParams();
	const navigationPath = searchParams.get('key') as string;
	const [key, setKey] = useState(navigationPath);
	const [activeKey, setActiveKey] = useState(navigationPath);
	const { user } = useContext(AuthContext);
	const router = useRouter();

	const items = [
		{ label: 'Brand Setting', key: 'brand-setting', component: <Brand activeKey={key} /> },
		{ label: 'Payment Method Integration', key: 'payment-method', component: <Payment activeKey={key} /> },
		{ label: 'SEO Integration', key: 'seo', component: <SEO activeKey={key} /> },
		{ label: 'Social Media Integration', key: 'social-media', component: <SocialMedia activeKey={key} /> },
		{ label: 'Email Signature', key: 'email-signature', component: <EmailSignature activeKey={key} /> },
		{ label: 'Email Templates', key: 'email-template', component: <EmailTemplate activeKey={key} /> },
		// { label: 'Header Setting', key: 'header-setting', component: <HeaderMenu activeKey={key} /> },
		// { label: 'Footer Setting', key: 'footer-setting', component: <FooterMenu activeKey={key} /> },
	].map((item) => ({
		label: item.label,
		key: item.key,
		children: item.component
	}));

	const handleAccordionChange = (key: string | string[]) => {
		const activeKey = Array.isArray(key) ? key[0] : key;
		setActiveKey(activeKey as string);
	};

	return (
		<>
			<div className="settingStyle">
				<ParaText size="large" fontWeightBold={600} color="PrimaryColor">
					Settings
				</ParaText>
				<div className="largeTopMargin"></div>

				<div className="mobile-view">
					<Collapse activeKey={activeKey} onChange={handleAccordionChange} accordion>
						{items.map((item) => (
							<Panel header={item.label} key={item.key}>
								{item.children}
							</Panel>
						))}
					</Collapse>
				</div>

				<div className="desktop-view">
					<Tabs
						tabPosition="left"
						defaultActiveKey={key}
						items={items}
						onChange={(value) => {
							router.push(`/${user?.role}/settings?key=${value}`);
							setKey(value);
						}}
					/>
				</div>
			</div>
		</>
	);
}
