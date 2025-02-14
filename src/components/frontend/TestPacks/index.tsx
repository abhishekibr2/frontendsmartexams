'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import ChooseState from '../ExamInfoFrontend/ChooseState';
import { Test, TestPacksProps } from '@/lib/types';
import './style.css';

export default function TestPacks({ menuItemdata, allData, stateDataExam, homepageContent }: TestPacksProps) {
    const [stateId, setStateId] = useState('All');
    const [activeState, setActiveState] = useState('All');
    const [filteredTests, setFilteredTests] = useState<Test[]>(stateDataExam);

    const handleStateClick = (title: string, stateId: string) => {
        setActiveState(title);
        setStateId(stateId);
        if (stateId !== 'All') {
            const selectedState = stateDataExam.find((state: any) => state._id === stateId);
            if (selectedState) {
                setFilteredTests(selectedState.examTypes || []);
            }
        } else {
            setFilteredTests(stateDataExam.flatMap((state: any) => state.examTypes));
        }
    };

    const handleGetStartedClick = (stateId: string, stateTitle: string) => {
        setActiveState(stateTitle);
        setStateId(stateId);
        const selectedState = stateDataExam.find((state: any) => state._id === stateId);
        if (selectedState) {
            setFilteredTests(selectedState.examTypes || []);
        }

    };


    const getBackgroundColor = (title: string) => {
        switch (title) {
            case 'VIC':
                return '#73ffd6';
            case 'NSW':
                return '#9fc1ff';
            case 'QLD':
                return '#acc0e9';
            case 'SA':
                return '#9ad9ff';
            case 'WA':
                return '#a3d0e7';
            case 'ACT':
                return '#ffc6e3';
            case 'NT':
                return '#ff97a3';
            case 'TAS':
                return '#acc0e9';
            default:
                return '#ffffff';
        }
    };
    const colors = [
        'rgba(159, 193, 255, 0.2)',
        'rgba(159, 193, 255, 0.3)',
        'rgba(172, 192, 233, 0.3)',
        'rgba(154, 217, 255, 0.3)',
        'rgba(163, 208, 231, 0.25)',
        'rgba(255, 198, 227, 0.35)',
        'rgba(255, 151, 163, 0.3)',
        'rgba(172, 192, 233, 0.2)'
    ];
    const getBackgroundColorQ = () => colors[Math.floor(Math.random() * colors.length)];

    return (
        <>
            <section className="section-gap bg-light-white test-packs-mobile">
                <div className="container">
                    {stateId === 'All' ? (
                        <>
                            <h2 className="text-center title-secondary fw-medium">{homepageContent?.headingThree || 'EXPLORE EXAMS ACROSS AUSTRALIA'}</h2>
                            <h5 className="text-center title-tertiary fw-medium top-ultra-space">
                                {homepageContent?.subHeadingThree || 'Find details on exams for VIC, NSW, ACT, WA, QLD, and NT'}

                            </h5>
                            <p className="text-center p-md fw-regular top-large-space">
                                {homepageContent?.descriptionThree || 'Exams in Australia are conducted by different organizations like ACER and EDUTest, as well as locally by schools. Each state including VIC, NSW, ACT, WA, QLD, and NT, has its own exam providers and systems.'}
                            </p>
                        </>
                    ) : (
                        <h2 className="color-dark-gray title-lg bottom-ultra-space fw-regular">
                            {homepageContent?.stateHeading || 'Explore our proven, all-in-one exam preparation packages'}

                        </h2>
                    )}
                    <ChooseState activeState={activeState} stateMenu={menuItemdata} handleStateClick={handleStateClick} />
                    <br />


                </div>
            </section>
            <div >

                {stateId === 'All' ? (
                    <div className='front-card-bg card-section-above'>
                        <div className='container'>
                            <div className="row pt-5">
                                {stateDataExam.map((stateMenuItem: any) => (
                                    <div key={stateMenuItem._id} className="col-lg-3 col-md-6">

                                        <div className="card-panel">
                                            <div
                                                className="card-name"
                                                style={{ background: getBackgroundColor(stateMenuItem.title) }}
                                            >
                                                <h2>{stateMenuItem?.title?.toUpperCase()}</h2>
                                            </div>
                                            <div className="card-pane">
                                                <div className="card-state2">
                                                    {Array.isArray(stateMenuItem.examTypes) && stateMenuItem.examTypes.length > 0 ? (
                                                        stateMenuItem.examTypes.map((test: { examType: string, _id: string },) => (
                                                            <p className="p-sm color-dark-gray" key={test._id}>
                                                                {test?.examType}
                                                            </p>
                                                        ))
                                                    ) : (
                                                        <p className="p-sm color-dark-gray">No Tests Available</p>
                                                    )}
                                                </div>
                                                <p
                                                    style={{ cursor: 'pointer', fontSize: '15px' }}
                                                    className="link-btn bg-secondary m-auto"
                                                    onClick={() => handleGetStartedClick(stateMenuItem._id, stateMenuItem.title.toUpperCase())}

                                                >
                                                    GET STARTED
                                                </p>
                                            </div>
                                        </div>

                                    </div>
                                ))}


                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="spacing-right-left-xs mb-5">
                        <h3 className="text-center title-cards-top mb-3" style={{ background: getBackgroundColor(activeState) }}>{activeState}</h3>
                        <div className="max-box-center">
                            <div className="row">
                                {filteredTests.length > 0 ? (
                                    filteredTests.map((test) => (
                                        <div className="col-sm-4" key={test.key}>
                                            <div className="card card-state text-center mt-3" style={{ background: getBackgroundColorQ() }}>
                                                <h3 className="color-accent fw-medium title-small">
                                                    <span className='icon-title' style={{ background: "#3098a0", color: "#fff" }}>
                                                        <i className="fa-regular fa-circle-stop"></i>
                                                    </span>
                                                    <Link
                                                        href={{
                                                            pathname: "/practice-package",
                                                            query: {
                                                                stateId: stateId,
                                                                examTypeId: test._id,
                                                            },
                                                        }} style={{ color: "#000" }}>
                                                        {test.examType}
                                                    </Link>
                                                    {/* <img
                                                    src="/images/smart/icon-round-title.png"
                                                    alt="icon"
                                                    className="icon-round-title"
                                                /> */}
                                                </h3>
                                                <Link
                                                    href={{
                                                        pathname: "/practice-package",
                                                        query: {
                                                            stateId: stateId,
                                                            examTypeId: test._id,
                                                        },
                                                    }} style={{ color: "#202020" }}>
                                                    <p className="p-sm fw-regular color-dark-gray mt-3 mb-3">{test.onlineAvailability}</p></Link>

                                                <Link
                                                    href={{
                                                        pathname: "/practice-package",
                                                        query: {
                                                            stateId: stateId,
                                                            examTypeId: test._id,
                                                        },
                                                    }}
                                                    className="link-btn bg-secondary m-auto">
                                                    Learn More
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-sm-12 text-center mt-3">
                                        <h5 className="color-dark-gray">No Exam Type Found</h5>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                )}


            </div>
        </>
    );
}
