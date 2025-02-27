'use client';
import React, { useState } from 'react';
import './style.css';
import { Tabs, Collapse } from 'antd';
import ParaText from '@/app/commonUl/ParaText';
import { useSearchParams } from 'next/navigation';
import HomePageContent from '@/components/Admin/CMS/HomePageContent';
import WhyChooseUsContentPage from '@/components/Admin/CMS/WhyChooseUsContentPage';
import TutoringClass from '@/components/Admin/CMS/TutoringClasses';
import AboutPageContent from '@/components/Admin/CMS/AboutPageContent';

const { Panel } = Collapse;

export default function Page() {
    const searchParams = useSearchParams();
    const navigationPath = searchParams.get('key') as string;
    const [key, setKey] = useState(navigationPath);
    const [activeKey, setActiveKey] = useState(navigationPath);

    const items = [
        { label: 'Home Page', key: 'home-page', component: <HomePageContent activeKey={key} /> },
        { label: 'Why Choose Us', key: 'WhyChooseUs', component: <WhyChooseUsContentPage activeKey={key} /> },
        { label: 'Tutoring Classes', key: 'TutoringClasses', component: <TutoringClass activeKey={key} /> },
        { label: 'About Us Page', key: 'AboutUs', component: <AboutPageContent activeKey={key} /> },

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
                    CMS
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

                    />
                </div>
            </div>
        </>
    );
}
