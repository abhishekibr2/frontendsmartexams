'use client';
import React, { useEffect, useState } from "react";
import "./style.css";
import { getAboutPageContent } from "@/lib/frontendApi";

export default function AboutUs() {
    const [aboutUsData, setAboutUsData]: any = useState([]);
    const fetchAboutUs = async () => {
        try {
            const response = await getAboutPageContent();
            setAboutUsData(response.data);
        } catch (error) {
            console.error('Error fetching about us content:', error);
        }
    };

    useEffect(() => {
        fetchAboutUs();
    }, []);

    return (
        <>
            <section className="who-we-are">
                <div className="container">
                    <div className="row align">
                        <div className="col-sm-6">
                            <h1 className="title-primary color-primary fw-regular">
                                {aboutUsData?.headingOne || "Who We Are"}
                            </h1>
                            <p className="p-md fw-light color-primary">
                                {aboutUsData?.descriptionOne || "We are a group of educators and developers with a passion for creating innovative technology that expands educational access for all students."}
                            </p>
                            <a className="link-btn bg-secondary " href="/register">
                                {aboutUsData?.buttonText || "Meet Our Team"}
                            </a>
                        </div>
                        <div className="col-sm-6">
                            <img
                                src={aboutUsData?.image ? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/aboutPageImages/original/${aboutUsData.image}` : "/images/smart/teenBoy.jpg"}
                                className="banner-img vert-move digital-img"
                                alt="About Us"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <img
                src="/images/smart/top-border-test.png"
                alt="top-borde"
                className="w-100 top-border-test img-section-fix"
            />
            <section className="testimonial-part">
                <div className="container">
                    <h2 className="text-center title-primary fw-light fw-regular mb-3">
                        {aboutUsData?.headingTwo || "Our Mission"}
                    </h2>
                    <p className="title-lg fw-light color-light text-center">
                        {aboutUsData?.descriptionTwo || "Our mission is to provide students with a positive educational tool that helps them perform their best on standardized tests, unlocking opportunities for their future."}
                    </p>
                </div>
            </section>

            <section className="beliefs-part">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-2"></div>
                        <div className="col-lg-8">
                            <h2 className="text-center title-primary fw-light color-primary mb-3">
                                {aboutUsData?.headingThree || "Our Beliefs"}
                            </h2>
                            <p className="title-lg fw-light color-primary text-center">
                                {aboutUsData?.descriptionThree || "We believe that education is the key to creating an equitable, inclusive, and just world."}
                            </p>
                            <p className="p-lg fw-light color-primary text-center">
                                {aboutUsData?.descriptionFour || "To manifest our beliefs, we have created a number of programs, which are made possible from the support of partners and families."}
                            </p>
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="col-sm-4">
                            <div className="card-round text-center" style={{ background: "#eef5ef" }}>
                                <img
                                    src={aboutUsData?.imageCardOne
                                        ? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/aboutPageImages/original/${aboutUsData.imageCardOne
                                        }` : "/images/smart/card1.png"}
                                    className="round-icon-img"
                                    alt="About Us"
                                />
                                <h4 className="title-lg fw-light color-primary text-center mb-3">
                                    {aboutUsData?.headingCardOne || "ISEE Fee Waiver Program"}
                                </h4>
                                <p className="p-md fw-light color-primary">
                                    {aboutUsData?.descriptionCardOne || "ISEE students with a fee waiver are given free access to our practice platform."}
                                </p>
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <div className="card-round text-center" style={{ background: "#dff5fb" }}>
                                <img
                                    src={aboutUsData?.imageCardTwo
                                        ? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/aboutPageImages/original/${aboutUsData.imageCardTwo
                                        }` : "/images/smart/card1.png"}
                                    className="round-icon-img"
                                    alt="About Us"
                                />
                                <h4 className="title-lg fw-light color-primary text-center mb-3">
                                    {aboutUsData?.headingCardTwo || "Test Practice Scholarships"}
                                </h4>
                                <p className="p-md fw-light color-primary">
                                    {aboutUsData?.descriptionCardTwo || "Students in financial need can apply to our scholarship to get free access to our practice platform."}
                                </p>
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <div className="card-round text-center" style={{ background: "#f0eff8" }}>
                                <img
                                    src={aboutUsData?.imageCardThree
                                        ? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/aboutPageImages/original/${aboutUsData.imageCardThree
                                        }` : "/images/smart/card2.png"}
                                    className="round-icon-img"
                                    alt="About Us"
                                />
                                <h4 className="title-lg fw-light color-primary text-center mb-3">
                                    {aboutUsData?.headingCardThree || "Regina Organization"}
                                </h4>
                                <p className="p-md fw-light color-primary">
                                    {aboutUsData?.descriptionCardThree || "In honor of our founder’s grandmother, who was a WWII Holocaust survivor..."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
