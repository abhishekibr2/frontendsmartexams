'use client';
import './style.css'
import Link from 'next/link';
import TestPacks from '../TestPacks';
import { TestPacksProps } from '@/lib/types';
import FaqPage from '@/app/[locale]/(frontend)/faq/page';
import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { getTestimonial } from '@/lib/frontendApi';
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { Image } from "antd";

export default function HomePage({ menuItemdata, allData, stateDataExam, homepageContent }: TestPacksProps) {
	const [endTime, setEndTime] = useState<number | null>(null);
	const [startTime, setStartTime] = useState<number | null>(null);
	const [showSaleSection, setShowSaleSection] = useState(false);
	const [testimonialData, setTestimonialData]: any = useState([]);
	const { ref, inView } = useInView({ triggerOnce: true });

	const fetchTestimonials = async () => {
		try {
			const response = await getTestimonial();
			setTestimonialData(response.data);
		} catch (error) {
			console.error('Error fetching testimonials:', error);
		}
	};

	useEffect(() => {
		fetchTestimonials();
	}, []);

	const [timeLeft, setTimeLeft] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});

	useEffect(() => {
		if (homepageContent?.startTime) {
			setStartTime(new Date(homepageContent.startTime).getTime());
		}
		if (homepageContent?.endTime) {
			setEndTime(new Date(homepageContent.endTime).getTime());
		}
	}, [homepageContent]);

	useEffect(() => {
		if (!startTime || !endTime) return;

		const now = new Date().getTime();

		if (now < startTime) {
			setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
			return;
		}

		const updateTimer = () => {
			const now = new Date().getTime();
			const difference = endTime - now;

			if (difference > 0) {
				const days = Math.floor(difference / (1000 * 60 * 60 * 24));
				const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
				const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
				const seconds = Math.floor((difference % (1000 * 60)) / 1000);

				setTimeLeft({ days, hours, minutes, seconds });
				setShowSaleSection(true);
			} else {
				clearInterval(timer);
				setShowSaleSection(false);
			}
		};

		const timer = setInterval(updateTimer, 1000);
		return () => clearInterval(timer);
	}, [startTime, endTime]);

	return (
		<>
			{showSaleSection && (
				<section className="banner-part">
					<div className="container">
						<div className="row align">
							<div className="col-sm-3 xs-center">
								{/* <img src="/images/smart/sale-img.png" alt="sale-img" className="sale-img" /> */}
								<Image
									src={homepageContent?.image
										? `${process.env.NEXT_PUBLIC_IMAGE_URL}/bannerImages/original/${homepageContent.image}`
										: '/images/smart/sale-img.png'}
									alt="sale-img"
									className="sale-img"
									height={150}
									width={250}
									preview={false}
								/>

							</div>
							<div className="col-sm-6">
								<div className="text-container">
									<big>{homepageContent?.heading}</big>
									<br />
									{/* <span className="font2ed">
										{homepageContent?.discount}% off</span>  */}
									<br />
									{homepageContent?.bannerDescription}
									{/* <span className="font2ed">{homepageContent?.couponCode}</span> */}
								</div>
							</div>
							<div className="col-sm-3">
								<div id="countdown">
									<ul>
										<li>
											<span id="days">{timeLeft.days}</span> <br /> Days
										</li>
										<li>
											<span id="hours">{timeLeft.hours}</span> <br /> Hours
										</li>
										<li>
											<span id="minutes">{timeLeft.minutes}</span> <br /> Min
										</li>
										<li>
											<span id="seconds">{timeLeft.seconds}</span> <br /> Sec
										</li>
									</ul>
								</div>
								<p>
									<i>{homepageContent?.description}</i>
								</p>
							</div>
						</div>
					</div>
				</section>
			)}
			<section className="hero-part">
				<div className="container">
					<div className="row align">
						<div className="col-lg-7 col-md-12">
							<h1 className="title-primary color-primary fw-regular">
								{homepageContent?.headingOne || "Australia’s #1 Resource for Selective School and Scholarship Tests"}
							</h1>

							<p className="p-md fw-light color-primary">
								{homepageContent?.descriptionOne || "Get ready for the digital Scholarship and Selective School Tests with hundreds of full-length, computer adaptive practice tests and thousands of questions."}
							</p>
							<Link href="/register" className="link-btn bg-secondary">
								{homepageContent?.buttonOne || "GET STARTED"}
							</Link>
						</div>
						<div className="col-lg-5 col-md-12 text-end md-center md-spacing-top">
							<img
								src={homepageContent?.imageOne ? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/homeImages/original/${homepageContent.imageOne}` : "/images/smart/banner-img.png"}
								alt="banner-img"
								className="banner-img vert-move"
							/>

						</div>
					</div>
				</div>
			</section>
			<section className="selective-part bg-light-white">
				<div className="container">
					<h2 className="title-secondary text-center fw-regular color-neutral mt-3">
						{homepageContent?.headingTwo || "Get the Best Selective School and Scholarship"}
						<br className="md-none" />
						{homepageContent?.subHeadingTwo || "Test Practice"}
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
								{homepageContent?.sectionTwoTitleOne || 'Hundreds of Practice Tests'}

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
								{homepageContent?.sectionTwoTitleTwo || 'Over 50,000+ Digital Practice Questions'}

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
								{homepageContent?.sectionTwoTitleThree || 'Immediate Score Reports'}

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
								{homepageContent?.sectionTwoTitleFour || 'Detailed Performance Analysis'}

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
								{homepageContent?.sectionTwoTitleFive || 'Full Answer Explanations'}

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
								{homepageContent?.sectionTwoTitleSix || 'Suggested Areas of Improvements'}

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
									src={homepageContent?.sectionTwoImageOne ? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/homeImages/original/${homepageContent.sectionTwoImageOne}` : "/images/smart/dash-file.png"}
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
									src={homepageContent?.sectionTwoImageTwo ? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/homeImages/original/${homepageContent.sectionTwoImageTwo}` : "/images/smart/dash-file2.png"}
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
									src={homepageContent?.sectionTwoImageThree ? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/homeImages/original/${homepageContent.sectionTwoImageThree}` : "/images/smart/dash-file3.png"}
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
									src={homepageContent?.sectionTwoImageFour ? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/homeImages/original/${homepageContent.sectionTwoImageFour}` : "/images/smart/dash-file4.png"}
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
									src={homepageContent?.sectionTwoImageFive ? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/homeImages/original/${homepageContent.sectionTwoImageFive}` : "/images/smart/dash-file5.png"}
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
									src={homepageContent?.sectionTwoImageSix ? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/homeImages/original/${homepageContent.sectionTwoImageSix}` : "/images/smart/dash-file6.png"}
									alt="dash-file6"
									className="tab-img-active vert-move"
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			<TestPacks menuItemdata={menuItemdata} allData={allData} stateDataExam={stateDataExam} homepageContent={homepageContent} />

			<img
				src="/images/smart/top-border-test.png"
				alt="top-borde"
				className="w-100 top-border-test img-section-fix"
			/>

			<section className="testimonial-part">
				<div className="container">
					<div className="text-center">
						<h2 className="text-center title-secondary fw-medium fw-regular">
							TESTIMONIALS
						</h2>
						<div className="max-box-center">
							<Carousel autoPlay showStatus={false} infiniteLoop>
								{testimonialData?.length > 0 ? (
									testimonialData.map((item: any) => (
										<div className="testimonial-card" key={item._id}>
											<p>
												{item.description || 'No description provided.'}
											</p>
											<br />
											<p className="p-xl fw-semi-bold bottom-no-space">
												{item.name || 'Anonymous'}
											</p>
										</div>
									))
								) : (
									<div className="testimonial-card">
										<p>No testimonials available.</p>
									</div>
								)}
							</Carousel>
						</div>
					</div>
				</div>
			</section>

			<section className="trusted-part trusted-box ">
				<div className="container" ref={ref}>
					<div className="">
						<h2 className="text-center title-secondary  fw-medium fw-regular">
							{homepageContent?.headingFour || "Trusted by Students Across Australia"}
						</h2>
						<p className="text-center p-lg color-dark-gray mt-4 mb-4">
							{homepageContent?.descriptionFour || "Our platform has supported countless students in their journey towards selective school success. From comprehensive test papers to valuable resources, we are dedicated to helping students achieve their goals."}
						</p>
						{inView && <div className="row mt-4" >
							<div className="col-lg-3 col-md-6">
								<div className="card-number hover-effects-up text-center bg-warning">
									<h3 className="color-light title-secondary fw-semi-bold">
										<CountUp
											start={0}
											end={Number(homepageContent?.cardCountOne) || 1500}
											duration={4}
											separator=","
										/>
									</h3>
									<p className="p-md fw-medium color-light">
										{homepageContent?.cardTextOne || "Students Helped"}
									</p>
								</div>
							</div>

							<div className="col-lg-3 col-md-6">
								<div className="card-number hover-effects-up text-center bg-muted-purple">
									<h3 className="color-light title-secondary fw-semi-bold">
										<CountUp
											start={0}
											end={Number(homepageContent?.cardCountTwo) || 30000}
											duration={4}
											separator=","
										/>
									</h3>
									<p className="p-md fw-medium color-light">
										{homepageContent?.cardTextTwo || "Tests Conducted"}
									</p>
								</div>
							</div>

							<div className="col-lg-3 col-md-6">
								<div className="card-number hover-effects-up text-center bg-info-blue">
									<h3 className="color-light title-secondary fw-semi-bold">
										<CountUp
											start={0}
											end={Number(homepageContent?.cardCountThree) || 50000}
											duration={4}
											separator=","
										/>
									</h3>
									<p className="p-md fw-medium color-light">
										{homepageContent?.cardTextThree || "Questions in DataBank"}
									</p>
								</div>
							</div>

							<div className="col-lg-3 col-md-6">
								<div className="card-number hover-effects-up text-center bg-info-blue">
									<h3 className="color-light title-secondary fw-semi-bold">
										<CountUp
											start={0}
											end={Number(homepageContent?.cardCountFour) || 60}
											duration={4}
											separator=","
										/>
									</h3>
									<p className="p-md fw-medium color-light">
										{homepageContent?.cardTextFour || "Tutors Helped"}
									</p>
								</div>
							</div>
						</div>}
					</div>
				</div>
			</section>
			<section className="faq-part bg-light-white">

				<FaqPage />
			</section>
		</>

	);
}
