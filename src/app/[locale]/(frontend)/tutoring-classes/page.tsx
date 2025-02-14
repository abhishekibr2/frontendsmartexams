'use client';
import React, { useEffect, useState } from 'react'
import { Button, Col, Image, Row, Card } from 'antd';
import { GetTutorial, getTutorialTestimonials } from '@/lib/frontendApi';
import './style.css'
import { FaArrowRight, FaCalendarCheck } from "react-icons/fa";
import { FaUserLarge } from 'react-icons/fa6';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { LiaLaptopSolid } from "react-icons/lia";
import { PiStudent } from "react-icons/pi";
import { AiOutlineYoutube } from "react-icons/ai";

export default function page() {
    const [data, setData] = useState<any>([])
    const [testimonialData, setTestimonialData]: any = useState([]);
    // fetchData
    const getTutorialDataHandler = async () => {
        try {
            const response = await GetTutorial();
            setData([response[0]]);
        } catch (error) {
            console.log('error');
        }
    }
    useEffect(() => {
        getTutorialDataHandler();
        fetchTestimonials();
    }, [])

    const fetchTestimonials = async () => {
        try {
            const response = await getTutorialTestimonials();
            setTestimonialData(response.data);
        } catch (error) {
            console.error('Error fetching testimonials:', error);
        }
    };
    return (
        <div>
            <section className='hero-part digital-banner'>
                <div className='container'>
                    {data.map((tut: any, index: any) => (
                        <div className='row align' key={index}>
                            <div className='col-sm-6'>
                                <h1 className='title-primary color-primary fw-regular'>  {tut.title || 'Digital SAT Prep Classes'}
                                </h1>
                                <p className='p-md fw-light color-primary'>

                                    {tut.description || 'Take your digital SAT prep to the next level with our small-group classes. You ll learn key strategies and master content from an expert SAT tutor in an engaging online environment.'}
                                </p>
                            </div>
                            <div className='col-sm-6'>
                                <Image
                                    src={
                                        data[0]?.image
                                            ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/tutorialsImage/original/${data[0].image}`
                                            : '/images/smart/teen-boy-headphones-on-laptop.jpg'
                                    }
                                    alt='digital-img-1' className='banner-img vert-move digital-img'
                                    preview={false}
                                    height={300}
                                    width={500}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className='classes-part'>
                <div className='container'>
                    {data.map((data: any) => (
                        <>
                            <h2 className='title-secondary text-center fw-regular color-neutral mt-3 mb-4'>{data.mainHeading || 'English and Maths Classes'}
                            </h2>
                            <div className='row'>
                                <div className='col-lg-2 col-md-4'>
                                    <a href="#englishClass1">
                                        <div className="card-classes bg-7ddaff">
                                            <p className="p-sm color-dark">{data.englishOne || 'English Classes'} </p>
                                            <p className="p-sm color-dark">(Prep-Yr1)</p>
                                        </div>
                                    </a>
                                </div>
                                <div className='col-lg-2 col-md-4'>
                                    <a href="#englishClass2">
                                        <div className="card-classes bg-7ddaff">
                                            <p className="p-sm color-dark">{data.englishTwo || 'English Classes'}</p>
                                            <p className="p-sm color-dark">(Yr2-Yr3)</p>
                                        </div>
                                    </a>
                                </div>
                                <div className='col-lg-2 col-md-4'>
                                    <a href="#englishClass3">
                                        <div className="card-classes bg-7ddaff">
                                            <p className="p-sm color-dark">{data.englishThree || 'English Classes'}</p>
                                            <p className="p-sm color-dark">(Yr3-Yr4)</p>
                                        </div>
                                    </a>
                                </div>
                                <div className='col-lg-2 col-md-4'>
                                    <a href="#englishClass4">
                                        <div className="card-classes bg-7ddaff">
                                            <p className="p-sm color-dark">{data.englishFour || 'English Classes'}</p>
                                            <p className="p-sm color-dark">(Yr5-Yr6)</p>
                                        </div>
                                    </a>
                                </div>
                                <div className='col-lg-2 col-md-4'>
                                    <a href="#englishClass5">
                                        <div className="card-classes bg-7ddaff">
                                            <p className="p-sm color-dark">{data.englishFive || 'English Classes'}</p>
                                            <p className="p-sm color-dark">(Yr5-Yr6)</p>
                                        </div>
                                    </a>
                                </div>
                                <div className='col-lg-2 col-md-4'>
                                    <a href="#englishClass6">
                                        <div className="card-classes bg-7ddaff">
                                            <p className="p-sm color-dark">{data.englishSix || 'English Classes'}</p>
                                            <p className="p-sm color-dark">(Yr6-Yr7)</p>
                                        </div>
                                    </a>
                                </div>
                            </div>


                            <div className='row'>
                                <div className='col-lg-2 col-md-4'>
                                    <a href="#mathsClass1">
                                        <div className="card-classes bg-8C52FF">
                                            <p className="p-sm color-light">{data.MathOne || 'Math Classes'} </p>
                                            <p className="p-sm color-light">(Prep-Yr1)</p>
                                        </div>
                                    </a>
                                </div>
                                <div className='col-lg-2 col-md-4'>
                                    <a href="#mathsClass2">
                                        <div className="card-classes bg-8C52FF">
                                            <p className="p-sm color-light">{data.MathTwo || 'Math Classes'}</p>
                                            <p className="p-sm color-light">(Yr2-Yr3)</p>
                                        </div>
                                    </a>
                                </div>
                                <div className='col-lg-2 col-md-4'>
                                    <a href="#mathsClass3">
                                        <div className="card-classes bg-8C52FF">
                                            <p className="p-sm color-light">{data.MathThree || 'Math Classes'}</p>
                                            <p className="p-sm color-light">(Yr3-Yr4)</p>
                                        </div>
                                    </a>
                                </div>
                                <div className='col-lg-2 col-md-4'>
                                    <a href="#mathsClass4">
                                        <div className="card-classes bg-8C52FF">
                                            <p className="p-sm color-light">{data.MathFour || 'Math Classes'}</p>
                                            <p className="p-sm color-light">(Yr4-Yr5)</p>
                                        </div>
                                    </a>
                                </div>
                                <div className='col-lg-2 col-md-4'>
                                    <a href="#mathsClass5">
                                        <div className="card-classes bg-8C52FF">
                                            <p className="p-sm color-light">{data.MathFive || 'Math Classes'}</p>
                                            <p className="p-sm color-light">(Yr5-Yr6)</p>
                                        </div>
                                    </a>
                                </div>
                                <div className='col-lg-2 col-md-4'>
                                    <a href="#mathsClass6">
                                        <div className="card-classes bg-8C52FF">
                                            <p className="p-sm color-light">{data.MathSix || 'Math Classes'}</p>
                                            <p className="p-sm color-light">(Yr6-Yr7)</p>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </>
                    ))}
                </div>
            </section>
            <div className='line-gradient'></div>
            <section className='syllabus-part'>
                <div className='container'>
                    <h2 className='title-secondary text-center fw-regular color-neutral mt-3 mb-4 title-bg' id='englishClass1'> ENGLISH CLASSES </h2>
                    {data.map((data: any, index: any) => (
                        <h3 key={index} className='top-title text-center mt-3'>{data.englishOne || 'English Classes'}(Prep-Yr1)</h3>
                    ))}
                    <div className='choose-your mt-3'>
                        {data.map((data: any, index: any) => (
                            <div className='row align' key={index}>
                                <div className='col-sm-9'>
                                    <h3>{data.readingUpperLevel || 'Reading: Middle and Upper Level'}</h3>
                                    <p className='p-md fw-light color-primary'>{data.readingUpperLevelDesc || 'This class focuses on the Reading Comprehension section, teaching students key strategies for reading passages and answering each question type. Students will learn and practice crucial skills like active reading, elimination, time management, and more.'}</p>
                                    <ul className="list-classes mt-3">
                                        <li><i className="fa-solid fa-user"></i> {data.subHeadingEnglishOne || 'Perferendis quis sun'}</li>
                                        <li><i className="fa-solid fa-calendar-days"></i> {data.subHeadingEnglishTwo || 'Voluptates consectet'}</li>
                                    </ul>
                                </div>
                                <div className='col-sm-3'>
                                    <a className="link-btn bg-secondary " href="/register"> <i className="fa-solid fa-question"></i>  Contact Us</a>
                                </div>
                            </div>
                        ))}
                    </div>

                    <hr className='line-part mt-5 mb-5' />
                    {data.map((data: any, index: any) => (
                        <h3 key={index} className='top-title text-center mt-3' id='englishClass2'>{data.englishTwo || 'English Classes'}(Yr2-Yr3)</h3>
                    ))}
                    <div className='choose-your mt-3' >
                        {data.map((data: any, index: any) => (
                            <div className='row align' key={index}>
                                <div className='col-sm-9'>
                                    <h3>{data.readingLowerLevel || 'Reading: Middle and Upper Level'}</h3>
                                    <p className='p-md fw-light color-primary'>{data.readingLowerLevelDesc || 'This class focuses on the Reading Comprehension section, teaching students key strategies for reading passages and answering each question type. Students will learn and practice crucial skills like active reading, elimination, time management, and more.'}</p>
                                    <ul className="list-classes mt-3">
                                        <li><i className="fa-solid fa-user"></i> {data.subHeadingEnglishThree || 'Perferendis quis sun'}</li>
                                        <li><i className="fa-solid fa-calendar-days"></i> {data.subHeadingEnglishFour || 'Voluptates consectet'}</li>
                                    </ul>
                                </div>
                                <div className='col-sm-3'>
                                    <a className="link-btn bg-secondary " href="/register"> <i className="fa-solid fa-question"></i>  Contact Us</a>
                                </div>
                            </div>
                        ))}

                    </div>

                    <hr className='line-part mt-5 mb-5' />
                    {data.map((data: any, index: any) => (
                        <h3 key={index} className='top-title text-center mt-3' id='englishClass3'>{data.englishThree || 'English Classes'} (Yr3-Yr4)</h3>
                    ))}
                    <div className='choose-your mt-3' >
                        {data.map((data: any, index: any) => (
                            <div className='row align' key={index}>
                                <div className='col-sm-9'>
                                    <h3>{data.writingLevel || 'Reading: Middle and Upper Level'}</h3>
                                    <p className='p-md fw-light color-primary'>{data.WritingDesc || 'This class focuses on the Reading Comprehension section, teaching students key strategies for reading passages and answering each question type. Students will learn and practice crucial skills like active reading, elimination, time management, and more.'}</p>
                                    <ul className="list-classes mt-3">
                                        <li><i className="fa-solid fa-user"></i> {data.subHeadingEnglishFive || 'Perferendis quis sun'}</li>
                                        <li><i className="fa-solid fa-calendar-days"></i> {data.subHeadingEnglishSix || 'Voluptates consectet'}</li>
                                    </ul>
                                </div>
                                <div className='col-sm-3'>
                                    <a className="link-btn bg-secondary " href="/register"> <i className="fa-solid fa-question"></i>  Contact Us</a>
                                </div>
                            </div>
                        ))}

                    </div>

                    <hr className='line-part mt-5 mb-5' />
                    {data.map((data: any, index: any) => (
                        <h3 key={index} className='top-title text-center mt-3' id='englishClass4'>{data.englishFour || 'English Classes'} (Yr4-Yr5)</h3>
                    ))}
                    <div className='choose-your mt-3' >
                        {data.map((data: any, index: any) => (
                            <div className='row align' key={index}>
                                <div className='col-sm-9'>
                                    <h3>{data.verbalLevel || 'Reading: Middle and Upper Level'}</h3>
                                    <p className='p-md fw-light color-primary'>{data.verbalLevelDesc || 'This class focuses on the Reading Comprehension section, teaching students key strategies for reading passages and answering each question type. Students will learn and practice crucial skills like active reading, elimination, time management, and more.'}</p>
                                    <ul className="list-classes mt-3">
                                        <li><i className="fa-solid fa-user"></i> {data.subHeadingEnglishSeven || 'Perferendis quis sun'}</li>
                                        <li><i className="fa-solid fa-calendar-days"></i> {data.subHeadingEnglishEight || 'Voluptates consectet'}</li>
                                    </ul>
                                </div>
                                <div className='col-sm-3'>
                                    <a className="link-btn bg-secondary " href="/register"> <i className="fa-solid fa-question"></i>  Contact Us</a>
                                </div>
                            </div>
                        ))}
                    </div>

                    <hr className='line-part mt-5 mb-5' />
                    {data.map((data: any, index: any) => (
                        <h3 key={index} className='top-title text-center mt-3' id='englishClass5'>{data.englishFive || 'English Classes'} (Yr5-Yr6)</h3>
                    ))}
                    <div className='choose-your mt-3' >
                        {data.map((data: any, index: any) => (
                            <div className='row align' key={index}>
                                <div className='col-sm-9'>
                                    <h3>{data.titleyrFiveSix || 'Reading: Middle and Upper Level'}</h3>
                                    <p className='p-md fw-light color-primary'>{data.titleyrFiveSixDesc || 'This class focuses on the Reading Comprehension section, teaching students key strategies for reading passages and answering each question type. Students will learn and practice crucial skills like active reading, elimination, time management, and more.'}</p>
                                    <ul className="list-classes mt-3">
                                        <li><i className="fa-solid fa-user"></i> {data.subHeadingOneYrFiveSix || 'Perferendis quis sun'}</li>
                                        <li><i className="fa-solid fa-calendar-days"></i> {data.subHeadingTwoYrFiveSix || 'Voluptates consectet'}</li>
                                    </ul>
                                </div>
                                <div className='col-sm-3'>
                                    <a className="link-btn bg-secondary " href="/register"> <i className="fa-solid fa-question"></i>  Contact Us</a>
                                </div>
                            </div>
                        ))}
                    </div>

                    <hr className='line-part mt-5 mb-5' />
                    {data.map((data: any, index: any) => (
                        <h3 key={index} className='top-title text-center mt-3' id='englishClass6'>{data.englishSix || 'English Classes'} (Yr6-Yr7)</h3>
                    ))}
                    <div className='choose-your mt-3' >
                        {data.map((data: any, index: any) => (
                            <div className='row align' key={index}>
                                <div className='col-sm-9'>
                                    <h3>{data.titleyrSixSeven || 'Reading: Middle and Upper Level'}</h3>
                                    <p className='p-md fw-light color-primary'>{data.titleyrSixSevenDesc || 'This class focuses on the Reading Comprehension section, teaching students key strategies for reading passages and answering each question type. Students will learn and practice crucial skills like active reading, elimination, time management, and more.'}</p>
                                    <ul className="list-classes mt-3">
                                        <li><i className="fa-solid fa-user"></i> {data.subHeadingOneYrSixSeven || 'Perferendis quis sun'}</li>
                                        <li><i className="fa-solid fa-calendar-days"></i> {data.subHeadingTwoYrSixSeven || 'Voluptates consectet'}</li>
                                    </ul>
                                </div>
                                <div className='col-sm-3'>
                                    <a className="link-btn bg-secondary " href="/register"> <i className="fa-solid fa-question"></i>  Contact Us</a>
                                </div>
                            </div>
                        ))}
                    </div>

                    <br />
                    <br />

                    <h2 className='title-secondary text-center fw-regular color-neutral mt-3 mb-4 title-bg-8C52FF'> MATHS CLASSES </h2>
                    {data.map((data: any, index: any) => (
                        <h3 key={index} className='top-title text-center mt-3' id='mathsClass1'>{data.MathOne || 'Maths Classes'} (Prep-Yr1)</h3>
                    ))}
                    <div className='choose-your theam-8C52FF mt-3' >
                        {data.map((data: any, index: any) => (
                            <div className='row align' key={index}>
                                <div className='col-sm-9'>
                                    <h3>{data.readingUpperLevelMath || 'Reading: Middle and Upper Level'}</h3>
                                    <p className='p-md fw-light color-primary'>{data.readingUpperLevelDescMath || 'This class focuses on the Reading Comprehension section, teaching students key strategies for reading passages and answering each question type. Students will learn and practice crucial skills like active reading, elimination, time management, and more.'}</p>
                                    <ul className="list-classes mt-3">
                                        <li><i className="fa-solid fa-user"></i> {data.subHeadingMathOne || 'Perferendis quis sun'}</li>
                                        <li><i className="fa-solid fa-calendar-days"></i> {data.subHeadingMathTwo || 'Voluptates consectet'}</li>
                                    </ul>
                                </div>
                                <div className='col-sm-3'>
                                    <a className="link-btn bg-secondary " href="/register"> <i className="fa-solid fa-question"></i>  Contact Us</a>
                                </div>
                            </div>
                        ))}
                    </div>

                    <hr className='line-part mt-5 mb-5 line-8c52ff' />
                    {data.map((data: any, index: any) => (
                        <h3 key={index} className='top-title text-center mt-3' id='mathsClass2'>{data.MathTwo || 'Maths Classes'} (Yr2-Yr3)</h3>
                    ))}
                    <div className='choose-your theam-8C52FF mt-3' >
                        {data.map((data: any, index: any) => (
                            <div className='row align' key={index}>
                                <div className='col-sm-9'>
                                    <h3>{data.readingLowerLevelMath || 'Reading: Middle and Upper Level'}</h3>
                                    <p className='p-md fw-light color-primary'>{data.readingLowerLevelDescMath || 'This class focuses on the Reading Comprehension section, teaching students key strategies for reading passages and answering each question type. Students will learn and practice crucial skills like active reading, elimination, time management, and more.'}</p>
                                    <ul className="list-classes mt-3">
                                        <li><i className="fa-solid fa-user"></i> {data.subHeadingMathThree || 'Perferendis quis sun'}</li>
                                        <li><i className="fa-solid fa-calendar-days"></i> {data.subHeadingMathFour || 'Voluptates consectet'}</li>
                                    </ul>
                                </div>
                                <div className='col-sm-3'>
                                    <a className="link-btn bg-secondary " href="/register"> <i className="fa-solid fa-question"></i>  Contact Us</a>
                                </div>
                            </div>
                        ))}
                    </div>

                    <hr className='line-part mt-5 mb-5 line-8c52ff' />
                    {data.map((data: any, index: any) => (
                        <h3 key={index} className='top-title text-center mt-3' id='mathsClass3'>{data.MathTwo || 'Maths Classes'} (Yr3-Yr4)</h3>
                    ))}
                    <div className='choose-your theam-8C52FF mt-3' >
                        {data.map((data: any, index: any) => (
                            <div className='row align' key={index}>
                                <div className='col-sm-9'>
                                    <h3>{data.writingMath || 'Reading: Middle and Upper Level'}</h3>
                                    <p className='p-md fw-light color-primary'>{data.writingDescMath || 'This class focuses on the Reading Comprehension section, teaching students key strategies for reading passages and answering each question type. Students will learn and practice crucial skills like active reading, elimination, time management, and more.'}</p>
                                    <ul className="list-classes mt-3">
                                        <li><i className="fa-solid fa-user"></i> {data.subHeadingMathFive || 'Perferendis quis sun'}</li>
                                        <li><i className="fa-solid fa-calendar-days"></i> {data.subHeadingMathSix || 'Voluptates consectet'}</li>
                                    </ul>
                                </div>
                                <div className='col-sm-3'>
                                    <a className="link-btn bg-secondary " href="/register"> <i className="fa-solid fa-question"></i>  Contact Us</a>
                                </div>
                            </div>
                        ))}
                    </div>

                    <hr className='line-part mt-5 mb-5 line-8c52ff' />
                    {data.map((data: any, index: any) => (
                        <h3 key={index} className='top-title text-center mt-3' id='mathsClass4'>{data.MathTwo || 'Maths Classes'} (Yr4-Yr5)</h3>
                    ))}
                    <div className='choose-your theam-8C52FF mt-3' >
                        {data.map((data: any, index: any) => (

                            <div className='row align' key={index}>
                                <div className='col-sm-9'>
                                    <h3>{data.verbalLevelMath || 'Reading: Middle and Upper Level'}</h3>
                                    <p className='p-md fw-light color-primary'>{data.verbalLevelDescMath || 'This class focuses on the Reading Comprehension section, teaching students key strategies for reading passages and answering each question type. Students will learn and practice crucial skills like active reading, elimination, time management, and more.'}</p>
                                    <ul className="list-classes mt-3">
                                        <li><i className="fa-solid fa-user"></i> {data.subHeadingMathSeven || 'Perferendis quis sun'}</li>
                                        <li><i className="fa-solid fa-calendar-days"></i> {data.subHeadingMathEight || 'Voluptates consectet'}</li>
                                    </ul>
                                </div>
                                <div className='col-sm-3'>
                                    <a className="link-btn bg-secondary " href="/register"> <i className="fa-solid fa-question"></i>  Contact Us</a>
                                </div>
                            </div>
                        ))}
                    </div>

                    <hr className='line-part mt-5 mb-5 line-8c52ff' />
                    {data.map((data: any, index: any) => (
                        <h3 key={index} className='top-title text-center mt-3' id='mathsClass5'>{data.MathFive || 'Maths Classes'} (Yr5-Yr6)</h3>
                    ))}
                    <div className='choose-your theam-8C52FF mt-3' >
                        {data.map((data: any, index: any) => (

                            <div className='row align' key={index}>
                                <div className='col-sm-9'>
                                    <h3>{data.titleyrMathFiveSix || 'Reading: Middle and Upper Level'}</h3>
                                    <p className='p-md fw-light color-primary'>{data.titleYrMathFiveSixDesc || 'This class focuses on the Reading Comprehension section, teaching students key strategies for reading passages and answering each question type. Students will learn and practice crucial skills like active reading, elimination, time management, and more.'}</p>
                                    <ul className="list-classes mt-3">
                                        <li><i className="fa-solid fa-user"></i> {data.subHeadingMathOneYrFiveSix || 'Perferendis quis sun'}</li>
                                        <li><i className="fa-solid fa-calendar-days"></i> {data.subHeadingMathTwoYrFiveSix || 'Voluptates consectet'}</li>
                                    </ul>
                                </div>
                                <div className='col-sm-3'>
                                    <a className="link-btn bg-secondary " href="/register"> <i className="fa-solid fa-question"></i>  Contact Us</a>
                                </div>
                            </div>
                        ))}
                    </div>

                    <hr className='line-part mt-5 mb-5 line-8c52ff' />
                    {data.map((data: any, index: any) => (
                        <h3 key={index} className='top-title text-center mt-3' id='mathsClass6'>{data.MathSix || 'Maths Classes'} (Yr6-Yr7)</h3>
                    ))}
                    <div className='choose-your theam-8C52FF mt-3' >
                        {data.map((data: any, index: any) => (

                            <div className='row align' key={index}>
                                <div className='col-sm-9'>
                                    <h3>{data.titleyrMathSixSeven || 'Reading: Middle and Upper Level'}</h3>
                                    <p className='p-md fw-light color-primary'>{data.titleYrMathSixSevenDesc || 'This class focuses on the Reading Comprehension section, teaching students key strategies for reading passages and answering each question type. Students will learn and practice crucial skills like active reading, elimination, time management, and more.'}</p>
                                    <ul className="list-classes mt-3">
                                        <li><i className="fa-solid fa-user"></i> {data.subHeadingMathOneYrSixSeven || 'Perferendis quis sun'}</li>
                                        <li><i className="fa-solid fa-calendar-days"></i> {data.subHeadingMathTwoYrSixSeven || 'Voluptates consectet'}</li>
                                    </ul>
                                </div>
                                <div className='col-sm-3'>
                                    <a className="link-btn bg-secondary " href="/register"> <i className="fa-solid fa-question"></i>  Contact Us</a>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>
            <div className='line-gradient'></div>

            <section className="testimonial-classes">
                <div className="container">
                    <h2 className="title-secondary text-center fw-regular color-neutral mb-4">
                        Testimonials
                    </h2>

                    {testimonialData?.length > 0 ? (
                        <div className="row">
                            {testimonialData.map((item: any, index: number) => {
                                const colors = ["bg-7cc576", "bg-00bff5", "bg-a764a9", "bg-f78e55"];
                                const bgColor = colors[index % colors.length];
                                return (
                                    <div key={index} className="col-md-6  ">
                                        <div className={`card-box ${bgColor}`}>
                                            <p className="p-sm color-light">
                                                {item.description || "No description provided."}
                                            </p>
                                            <p className="p-lg text-end color-light mb-1">
                                                - {item.name || "Anonymous"}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="testimonial-card text-center">
                            <p>No testimonials available.</p>
                        </div>
                    )}
                </div>
            </section>

        </div>
    )
}
