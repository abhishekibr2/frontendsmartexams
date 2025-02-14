'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { getServicesFrontEnd, getTestsFrontEnd } from '@/lib/frontendApi';
import ChooseState from '../ChooseState';

export default function Page() {
    const [stateMenu, setStateMenu]: any = useState([]);
    const [activeState, setActiveState] = useState('All');
    const [menuItems, setMenuItems] = useState<any>([]);


    const fetchStateMenu = async () => {
        try {
            const response = await getServicesFrontEnd();
            setStateMenu(response.data);
        } catch (error) {
            console.error('Error fetching state menus:', error);
        }
    };

    const fetchTestMenu = async (stateId: string) => {
        try {
            let response;

            if (stateId === 'All') {
                response = await getTestsFrontEnd({ stateId: 'All' });
            } else {
                response = await getTestsFrontEnd({ stateId });
            }

            const testItemsByState = response.data.reduce((acc: any, test: any) => {
                const stateKey = test.state;
                if (!stateKey) {
                    return acc;
                }
                if (!acc[stateKey]) acc[stateKey] = [];
                acc[stateKey].push({
                    key: test._id,
                    label: (
                        <Link href={`/exam-info/${test.state}/${test.testDisplayName.toLowerCase()}`}>
                            {test.testDisplayName}
                        </Link>
                    ),
                    description: test.testDescription || 'No description available',
                });
                return acc;
            }, {});
            if (stateId === 'All') {
                const allTests = Object.values(testItemsByState).flat();
                setMenuItems(allTests);
            } else if (testItemsByState[stateId]) {
                setMenuItems(testItemsByState[stateId]);
            } else {
                setMenuItems([]);
            }
        } catch (error) {
            console.error('Error fetching test menus:', error);
            setMenuItems([]);
        }
    };

    const handleStateClick = (title: string, stateId: string) => {
        setActiveState(title);
        fetchTestMenu(stateId);
    };


    useEffect(() => {
        fetchStateMenu();
        fetchTestMenu('All');
    }, []);

    return (
        <>
            <section className="section-gap bg-light-white">
                <div className="container">
                    <h2 className="color-dark-gray title-lg bottom-ultra-space fw-regular">
                        Explore our proven, all-in-one exam preparation packages
                    </h2>

                    <ChooseState
                        activeState={activeState}
                        stateMenu={stateMenu}
                        handleStateClick={handleStateClick}
                    />

                    <h2 className="text-center title-secondary fw-regular top-ultra-space bottom-ultra-space">
                        {activeState !== 'All' ? `${activeState.toUpperCase()} ` : ''}
                    </h2>

                    {/* Dynamic Test List */}
                    <div className="max-box-center spacing-right-left-xs">
                        <div className="row">
                            {menuItems.length === 0 ? (
                                <div className="col-12 text-center">
                                    <p className="p-sm fw-regular color-dark-gray">No tests available</p>
                                </div>
                            ) : (
                                menuItems.map((test: any) => (
                                    <div className="col-sm-6" key={test.key}>
                                        <div className="card card-state text-center mt-3">
                                            <h3 className="color-accent fw-medium title-small">
                                                <img
                                                    src="/images/smart/icon-round-title.png"
                                                    alt="icon-round-title"
                                                    className="icon-round-title"
                                                />
                                                {test.label}
                                                <img
                                                    src="/images/smart/icon-round-title.png"
                                                    alt="icon-round-title"
                                                    className="icon-round-title"
                                                />
                                            </h3>
                                            <p className="p-sm fw-regular color-dark-gray">
                                                {test.description}
                                            </p>
                                            <br />
                                            <Link href='/practice-package' className="link-btn bg-secondary m-auto">
                                                Learn More
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
