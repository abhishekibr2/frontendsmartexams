'use client';
import React from "react";
import { Image } from "antd";
import ParaText from "@/app/commonUl/ParaText";
import Titles from "@/app/commonUl/Titles";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import TitleSection from "./TitleSection";
import "./style.css";

export default function AboutUs() {
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 4,
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 4,
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
        },
    };

    const carouselItems = [
        { src: "/images/about-us.jpg", alt: "team image" },
        { src: "/images/client-2.jpg", alt: "team image" },
        { src: "/images/client-3+.jpg", alt: "team image" },
        { src: "/images/about-us.jpg", alt: "team image" },
    ];

    return (
        <>
            <section className="who-we-are">
                <div className="container">
                    <div className="row align">
                        <div className="col-sm-6">
                            <h1 className="title-primary color-primary fw-regular">Who We Are</h1>
                            <p className="p-md fw-light color-primary">We are a group of educators and developers with a passion for creating innovative technology that expands educational access for all students.</p>
                            <a className="link-btn bg-secondary " href="/register">Meet Our Team</a>
                        </div>
                        <div className="col-sm-6">
                            <img src="images/digital-img-1.png" className="banner-img vert-move digital-img" />
                        </div>
                    </div>
                </div>
            </section>

            <img src="/images/smart/top-border-test.png" alt="top-borde" className="w-100 top-border-test img-section-fix" />
            <section className="testimonial-part">
                <div className="container">
                    <h2 className="text-center title-primary fw-light fw-regular mb-3">Our Mission </h2>
                    <p className="title-lg fw-light color-light text-center">Our mission is to provide students with a positive educational tool that helps them perform their best on standardized tests, unlocking opportunities for their future.
                    </p>
                </div>
            </section>

            <section className="beliefs-part">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-2"></div>
                        <div className="col-lg-8">
                            <h2 className="text-center title-primary fw-light color-primary   mb-3">Our Beliefs</h2>
                            <p className="title-lg fw-light color-primary text-center">We believe that education is the key to creating an equitable, inclusive, and just world.</p>
                            <p className="p-lg fw-light color-primary text-center">To manifest our beliefs, we have created a number of programs, which are made possible from the support of partners and families.
                            </p>
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="col-sm-4">
                            <div className="card-round text-center" style={{ background: "#eef5ef" }}   >
                                <img src="images/round-icon-1.png" alt="round-icon-1" className="round-icon-img" />
                                <h4 className="title-lg fw-light color-primary text-center mb-3">ISEE Fee Waiver Program</h4>
                                <p className="p-md fw-light color-primary">ISEE students with a fee waiver are given free access to our practice platform.</p>
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <div className="card-round text-center" style={{ background: "#dff5fb" }}   >
                                <img src="images/round-icon-1.png" alt="round-icon-2" className="round-icon-img" />
                                <h4 className="title-lg fw-light color-primary text-center mb-3">Test Practice Scholarships</h4>
                                <p className="p-md fw-light color-primary">Students in financial need can apply to our scholarship to get free access to our practice platform.</p>
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <div className="card-round text-center" style={{ background: "#f0eff8" }}   >
                                <img src="images/round-icon-3.png" alt="round-icon-3" className="round-icon-img" />
                                <h4 className="title-lg fw-light color-primary text-center mb-3">Regina Organization</h4>
                                <p className="p-md fw-light color-primary">In honor of our founder’s grandmother, who was a WWII Holocaust survivor...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


        </>
    );
}
