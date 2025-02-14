'use client';
import React from 'react';
import Image from 'next/image';
import CountUp from "react-countup";

export default function Page({ data }: any) {
    return (
        <>
            <div className="trust-section">
                <div className="container text-center">

                    <div className="row">
                        {data.map((item: any) => (
                            <>
                                <h2 className="mb-5 title-secondary text-center fw-regular ">{item.heading || 'Why Students Trust SmartExams'}</h2>
                                <div key={item._id} className="col-md-3 trust-item mb-4">
                                    <div className="icon-circle">

                                        {data[0]?.IconOne ? (
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/WhyChoseUsIcons/original/${data[0].IconOne}`}
                                                alt="Icon"
                                                className="icon-class"
                                                width={100}
                                                height={100}
                                            />
                                        ) : (
                                            <i className="fa-solid fa-chart-area"></i>
                                        )}


                                    </div>
                                    <h5>{item.titleOne || 'Comprehensive'}</h5>
                                    <p>{item.descriptionOne || 'Enim velit qui qui cAll of the materials and tools you need to prepare for the ACT.'}</p>
                                </div>

                                <div key={item._id} className="col-md-3 trust-item mb-4">
                                    <div className="icon-circle">

                                        {data[0]?.IconTwo ? (
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/WhyChoseUsIcons/original/${data[0].IconTwo}`}
                                                alt="Icon"
                                                className="icon-class"
                                                width={100}
                                                height={100}
                                            />
                                        ) : (
                                            <i className="fa-solid fa-trophy"></i>
                                        )}

                                    </div>
                                    <h5>{item.titleTwo || 'Insightful'}</h5>
                                    <p>{item.descriptionTwo || 'Interactive score reports that quickly identify strengths and weaknesses.'}</p>
                                </div>

                                <div key={item._id} className="col-md-3 trust-item mb-4">
                                    <div className="icon-circle">

                                        {data[0]?.IconThree ? (
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/WhyChoseUsIcons/original/${data[0].IconThree}`}
                                                alt="Icon"
                                                className="icon-class"
                                                width={100}
                                                height={100}
                                            />
                                        ) : (
                                            <i className="fa-solid fa-chart-line"></i>
                                        )}

                                    </div>
                                    <h5>{item.titleThree || 'Personalized'}</h5>
                                    <p>{item.descriptionThree || 'Non facilis dolor acPrep Plan that provides guidance based on performance.'}</p>
                                </div>

                                <div key={item._id} className="col-md-3 trust-item mb-4">
                                    <div className="icon-circle">
                                        {data[0]?.IconFour ? (
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/WhyChoseUsIcons/original/${data[0].IconFour}`}
                                                alt="Icon"
                                                className="icon-class"
                                                width={100}
                                                height={100}
                                            />
                                        ) : (
                                            <i className="fa-solid fa-chart-area"></i>
                                        )}
                                    </div>
                                    <h5>{item.titleFour || 'Authentic'}</h5>
                                    <p>{item.descriptionFour || 'Full-length practice tests that mirror the style and format of the ACT.'}</p>
                                </div>
                            </>
                        ))}

                    </div>
                </div>
            </div>

            <section className="hero-part">
                <div className="container">
                    <h2 className="title-secondary fw-regular color-neutral mt-3 text-center">
                        Comprehension Exam Preparation Packages for All Australian Exams
                    </h2>
                    <div className="top-extra-max-space" />
                    <div className="d-flex align-items-start selective-tab">
                        <div
                            className="nav flex-column nav-pills me-3"
                            id="v-pills-tab"
                            role="tablist"
                            aria-orientation="vertical"
                        >
                            <button
                                className="nav-link active"
                                id="v-pills-home-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#v-pills-home"
                                type="button"
                                role="tab"
                                aria-controls="v-pills-home"
                                aria-selected="true"
                            >
                                Hundreds of Practice Tests
                            </button>
                            <button
                                className="nav-link"
                                id="v-pills-profile-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#v-pills-profile"
                                type="button"
                                role="tab"
                                aria-controls="v-pills-profile"
                                aria-selected="false"
                            >
                                Over 50,000+ Digital Practice Questions
                            </button>
                            <button
                                className="nav-link"
                                id="v-pills-messages-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#v-pills-messages"
                                type="button"
                                role="tab"
                                aria-controls="v-pills-messages"
                                aria-selected="false"
                            >
                                Immediate Score Reports
                            </button>
                            <button
                                className="nav-link"
                                id="v-pills-settings-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#v-pills-settings"
                                type="button"
                                role="tab"
                                aria-controls="v-pills-settings"
                                aria-selected="false"
                            >
                                Detailed Performance Analysis
                            </button>
                            <button
                                className="nav-link"
                                id="v-pills-settings-tab2"
                                data-bs-toggle="pill"
                                data-bs-target="#v-pills-settings2"
                                type="button"
                                role="tab"
                                aria-controls="v-pills-settings"
                                aria-selected="false"
                            >
                                Full Answer Explnations
                            </button>
                            <button
                                className="nav-link"
                                id="v-pills-settings-tab3"
                                data-bs-toggle="pill"
                                data-bs-target="#v-pills-settings3"
                                type="button"
                                role="tab"
                                aria-controls="v-pills-settings"
                                aria-selected="false"
                            >
                                Suggested Areas of Improvements
                            </button>
                        </div>
                        <div className="tab-content" id="v-pills-tabContent">
                            <div
                                className="tab-pane fade show active"
                                id="v-pills-home"
                                role="tabpanel"
                                aria-labelledby="v-pills-home-tab"
                            >
                                <img
                                    src="images/smart/dash-file.png"
                                    alt="dash-file"
                                    className="tab-img-active vert-move"
                                />
                            </div>
                            <div
                                className="tab-pane fade"
                                id="v-pills-profile"
                                role="tabpanel"
                                aria-labelledby="v-pills-profile-tab"
                            >
                                <img
                                    src="images/smart/dash-file2.png"
                                    alt="dash-file2"
                                    className="tab-img-active vert-move"
                                />
                            </div>
                            <div
                                className="tab-pane fade"
                                id="v-pills-messages"
                                role="tabpanel"
                                aria-labelledby="v-pills-messages-tab"
                            >
                                <img
                                    src="images/smart/dash-file3.png"
                                    alt="dash-file3"
                                    className="tab-img-active vert-move"
                                />
                            </div>
                            <div
                                className="tab-pane fade"
                                id="v-pills-settings"
                                role="tabpanel"
                                aria-labelledby="v-pills-settings-tab"
                            >
                                <img
                                    src="images/smart/dash-file4.png"
                                    alt="dash-file4"
                                    className="tab-img-active vert-move"
                                />
                            </div>
                            <div
                                className="tab-pane fade"
                                id="v-pills-settings2"
                                role="tabpanel"
                                aria-labelledby="v-pills-settings-tab2"
                            >
                                <img
                                    src="images/smart/dash-file5.png"
                                    alt="dash-file5"
                                    className="tab-img-active vert-move"
                                />
                            </div>
                            <div
                                className="tab-pane fade"
                                id="v-pills-settings3"
                                role="tabpanel"
                                aria-labelledby="v-pills-settings-tab3"
                            >
                                <img
                                    src="images/smart/dash-file6.png"
                                    alt="dash-file6"
                                    className="tab-img-active vert-move"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="trusted-part section-gap ourAchievements">
                <div className="container">

                    <div className="row">
                        {data.map((core: any) => (
                            <>
                                <h2 className="title-secondary color-primary bottom-ultra-space fw-medium fw-regular">
                                    {core.achievementsHeading || 'Our Achievements'}
                                </h2>
                                <div key={core._id} className="col-lg-3 col-md-6">
                                    <div className="card-number hover-effects-up text-center bg-warning">
                                        <h3 className="color-light title-secondary fw-semi-bold">
                                            <CountUp
                                                start={0}
                                                end={Number(core.countOne) || 1500}
                                                duration={4}
                                                separator=","
                                            />
                                        </h3>
                                        <p className="p-md fw-medium color-light">{core.countOneDesc || 'Students Helped'}</p>
                                    </div>
                                </div>

                                <div key={core._id} className="col-lg-3 col-md-6">
                                    <div className="card-number hover-effects-up text-center bg-muted-purple">
                                        <h3 className="color-light title-secondary fw-semi-bold">
                                            <CountUp
                                                start={0}
                                                end={Number(core.countTwo) || 30000}
                                                duration={4}
                                                separator=","
                                            />
                                        </h3>
                                        <p className="p-md fw-medium color-light">{core.countTwoDesc || 'Tests Conducted'}</p>
                                    </div>
                                </div>

                                <div key={core._id} className="col-lg-3 col-md-6">
                                    <div className="card-number hover-effects-up text-center bg-info-blue">
                                        <h3 className="color-light title-secondary fw-semi-bold">
                                            <CountUp
                                                start={0}
                                                end={Number(core.countThree) || 50000}
                                                duration={4}
                                                separator=","
                                            />
                                        </h3>
                                        <p className="p-md fw-medium color-light">{core.countThreeDesc || 'Questions in Databank'}</p>
                                    </div>
                                </div>

                                <div key={core._id} className="col-lg-3 col-md-6">
                                    <div className="card-number hover-effects-up text-center bg-info-blue">
                                        <h3 className="color-light title-secondary fw-semi-bold">
                                            <CountUp
                                                start={0}
                                                end={Number(core.countFour) || 60}
                                                duration={4}
                                                separator=","
                                            />
                                        </h3>
                                        <p className="p-md fw-medium color-light">{core.countFourDesc || 'Tutors Helped'}</p>
                                    </div>
                                </div>
                            </>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section-gap ourCoreValues">
                <div className="container">

                    <div className="row">
                        {data.map((core: any) => (
                            <>
                                <h2 className="title-secondary text-start color-primary bottom-ultra-space fw-medium fw-regular">
                                    {core.coreHeading || 'Our Core Values'}
                                </h2>
                                <div className="col-lg-3 col-md-4" key={core._id}>
                                    <div className="coreValues mysticIndigo">
                                        <h4 className="title-tertiary fw-semi-bold">{core.numberOneCore || '01'}</h4>
                                        <p className="title-small fw-bold bottom-large-space top-large-space">
                                            {core.descriptionCore || 'Deliver the best customer student experience'}
                                        </p>
                                        <div className="line" />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-4" key={core._id}>
                                    <div className="coreValues skyRipple">
                                        <h4 className="title-tertiary fw-semi-bold">{core.numberTwoCore || '02'}</h4>
                                        <p className="title-small fw-bold bottom-large-space top-large-space">
                                            {core.descriptionTwoCore || 'Embrace Hard Work'}
                                        </p>
                                        <div className="line" />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-4" key={core._id}>
                                    <div className="coreValues rosyBliss">
                                        <h4 className="title-tertiary fw-semi-bold">{core.numberThreeCore || '03'}</h4>
                                        <p className="title-small fw-bold bottom-large-space top-large-space">
                                            {core.descriptionThreeCore || 'Drive Excellence'}
                                        </p>
                                        <div className="line" />
                                    </div>
                                </div>


                            </>
                        ))}
                    </div>

                    <div>
                        {data.map((item: any) => (
                            <div className="row top-ultra-space" key={item._id}>
                                <div key="1" className="col-lg-3 col-md-4">
                                    <div className="coreValues goldenGlow">
                                        <h4 className="title-tertiary fw-semi-bold">{item.numberFourCore || '04'}</h4>
                                        <p className="title-small fw-bold bottom-large-space top-large-space">
                                            {item.descriptionFourCore || 'Empower Students'}
                                        </p>
                                        <div className="line" />
                                    </div>
                                </div>

                                <div key="2" className="col-lg-3 col-md-4">
                                    <div className="coreValues tealSerenity">
                                        <h4 className="title-tertiary fw-semi-bold">{item.numberFiveCore || '05'}</h4>
                                        <p className="title-small fw-bold bottom-large-space top-large-space">
                                            {item.descriptionFiVeCore || 'Innovate'}
                                        </p>
                                        <div className="line" />
                                    </div>
                                </div>

                                <div key="3" className="col-lg-3 col-md-4">
                                    <div className="coreValues sunsetKiss">
                                        <h4 className="title-tertiary fw-semi-bold">{item.numberSixCore || '06'}</h4>
                                        <p className="title-small fw-bold bottom-large-space top-large-space">
                                            {item.descriptionSixCore || 'Support'}
                                        </p>
                                        <div className="line" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>


        </>
    )
}
