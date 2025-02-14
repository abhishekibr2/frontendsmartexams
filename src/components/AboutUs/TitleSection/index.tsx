import React from 'react'
import { Button, Col, Image, Row } from "antd";
import ParaText from "@/app/commonUl/ParaText";
import Titles from "@/app/commonUl/Titles";
import "react-multi-carousel/lib/styles.css";
import './style.css'
import Link from 'next/link';

export default function TitleSection() {
    return (
        <div>
            <section>
                <div id="second-aboutUs" >
                    <img src="/images/1.png" alt="" className='shaps float-bob-y' />
                    <img src="/images/11.png" alt="" className='shaps1 float-bob-y' />
                    <div className="customContainer">
                        <div className="about-content">
                            <Titles level={3} color="PrimaryColor" className="heading-text ">
                                About Us
                            </Titles>
                            <Row gutter={[24, 24]}>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                                    <div className="cardType" style={{ textAlign: 'left', width: '100%', marginTop: "1rem" }}>
                                        <ParaText size="small" color="black" className='dBlock '>
                                            What began as a small initiative has grown into something truly special. Over the years, we&apos;ve evolved, learned, and expanded,
                                            but one thing has remained constant—our commitment to excellence. Our journey is rooted in a passion for
                                            [specific industry or area of expertise], and we continue to push forward with the same energy and enthusiasm as when we first
                                            started.
                                            We are here to [describe your mission—e.g., “provide innovative solutions that help businesses grow,” “deliver high-quality
                                            products that improve lives,” “support clients with tailored strategies for success”]. Every decision we make, every solution
                                            we offer, is driven by the goal of helping others achieve more and build a better future.
                                        </ParaText>
                                    </div>
                                </Col>
                            </Row>
                            <div className="gapMarginTopTwo"></div>
                            <div className="card-text">
                                <Row gutter={[24, 24]}>
                                    <Col
                                        xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}
                                    >
                                        <Image
                                            src="/images/about-us-page.jpeg"
                                            alt="team image"
                                            width="100%"
                                            preview={false}
                                            style={{ borderRadius: '12px' }}
                                        />
                                    </Col>

                                    <Col
                                        xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}
                                    >
                                        <Titles level={4} color="PrimaryColor" className="second-heading-text">
                                            We are a dedicated team focused on providing high-quality and reliable services to clients across a wide range of industries.
                                        </Titles>
                                        <div className="cardType" >
                                            <div className="gapMarginTopOne"></div>
                                            <div className="aboutSectionDesc" />
                                            <ParaText size="small" color="black">
                                                Our success is built on the passion and expertise of the people behind the work. From visionary leaders to dedicated specialists, every
                                                team member plays an integral role in delivering results that exceed expectations. We bring diverse perspectives, experience, and
                                                skills to the table, making us a dynamic, collaborative team focused on achieving great things.
                                            </ParaText>
                                            <br />
                                            <div className='button-top'>
                                                <Link href="/about-us">
                                                    <Button type='primary'>Know More</Button>
                                                </Link>
                                            </div>

                                        </div>
                                    </Col>
                                </Row>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
