'use client'
import React from "react";
import { Col, Image, Row } from "antd";
import "./style.css";
import Titles from "@/app/commonUl/Titles";

interface Testimonial {
    name: string;
    description: string;
    image?: string;
}

export default function Testimonial({ testimonialData }: any) {
    const shuffledTestimonials = [...testimonialData.data].sort(() => Math.random() - 0.5).slice(0, 3);

    return (
        <>
            <section id="sliderContent">
                <div className="customContainer" >
                    <Row>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                            <div className="textCenter">
                                <Titles level={3} color="PrimaryColor">
                                    <span className="">What Our</span> Clients Are Saying About <br className="mobileNone" />Our Exceptional Services
                                </Titles>
                            </div>
                        </Col>
                    </Row>
                    <br />
                    <br />
                    <Row gutter={[16, 16]} justify='center'>
                        {shuffledTestimonials?.map((item: any, index: any) => (
                            <Col key={index} xs={24} sm={24} md={8} lg={12} xl={8} xxl={8}>
                                <div id="testimonial-slider" className="owl-carousel">
                                    <div className="testimonial">
                                        <div className="pic">
                                            <Image
                                                preview={false}
                                                src={
                                                    item.image
                                                        ? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/testimonials/original/${item.image}`
                                                        : `/home/avatar.png`
                                                }
                                                alt="image"
                                                style={{ width: 130, height: 130, borderRadius: '130px', marginTop: '10px' }}
                                            />
                                        </div>
                                        <h2 className="testimonial-title">{item.name}</h2>
                                        <p className="description">
                                            {item.description.trim().slice(0, 200)}...
                                        </p>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div >
            </section>
        </>
    );
}
