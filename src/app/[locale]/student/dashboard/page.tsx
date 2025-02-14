'use client';
import React, { useContext, useEffect, useState } from 'react';
import './style.css';
import AuthContext from '@/contexts/AuthContext';
import { getUserDashboardData } from '@/lib/studentApi';
import ErrorHandler from '@/lib/ErrorHandler';
import { Skeleton, Image } from 'antd';
import Link from 'next/link';

interface DashboardData {
	totalTest: number,
	totalPurchasedEbooks: number,
	totalPurchasedPackages: number,
	totalPurchasedTests: number,
	totalFreePackages: number,
	totalFreeTests: number,
	totalPackagesEssay: number
}

export default function Dashboard() {
	const { user } = useContext(AuthContext);
	const [skeltonLoading, setSkeltonLoading] = useState(true);
	const [dashboardData, setDashboardData] = useState<DashboardData>();

	const fetchData = async () => {
		try {
			const res = await getUserDashboardData(user?._id as string);
			if (res.status) {
				setDashboardData(res.data);
				setSkeltonLoading(false);
			}
		} catch (error) {
			setSkeltonLoading(false);
			ErrorHandler.showNotification(error);
		}
	};

	useEffect(() => {
		if (user?._id) fetchData();
	}, [user]);

	return (
		<section className="dash-part bg-light-steel ">
			<div className="">
				<div className="">
					<h2 className="top-title mb-3">Dashboard</h2>
					<div className="row">
						<div className="col-lg-3 col-md-6">
							{skeltonLoading ?
								<div className="card card-value back-design-img student-dash-card p-2">
									<Skeleton active={skeltonLoading} loading={skeltonLoading} />
								</div>
								:
								<Link href='/student/test'>
									<div className="card card-value back-design-img student-dash-card">
										<div className="row align">
											<div className="col-sm-3 col-4 pr-0">
												<div className="icon-card-dash dash-icon-g" style={{ background: 'linear-gradient(83.31deg, rgb(115 116 116) 21.22%, rgb(64 67 66) 88.54%)' }} >
													<i className="fa-regular fa-paste"></i>
												</div>
											</div>

											<div className="col-sm-9 col-8">
												<div className="card-value-height">
													<p className="p-sm mb-0">Total Tests</p>
													<hr className="line w-100 opacity-3" />
													<p className="title-lg mb-0 fw-bold mintGreen">{dashboardData?.totalFreeTests}</p>
												</div>
											</div>
										</div>

										<Image
											src="https://html.phoenixcoded.net/light-able/bootstrap/assets/images/widget/img-status-9.svg"
											className="image-shapes"
										/>
									</div>
								</Link>
							}
						</div>
						{/* <div className="col-lg-3 col-md-6">
							{skeltonLoading ?
								<div className="card card-value back-design-img student-dash-card p-2">
									<Skeleton active={skeltonLoading} loading={skeltonLoading} />
								</div>
								:
								<div className="card card-value back-design-img student-dash-card">
									<div className="card-value-height">
										<p className="p-sm mb-0">Test Completed </p>
										<hr className="line w-100 opacity-3" />
										<p className="title-lg mb-0 fw-bold color-dark-gray  ">
											32/100
										</p>
									</div>
									<Image
										src="https://html.phoenixcoded.net/light-able/bootstrap/assets/images/widget/img-status-2.svg"
										className="image-shapes"
									/>
								</div>
							}
						</div> */}
						<div className="col-lg-3 col-md-6">
							{skeltonLoading ?
								<div className="card card-value back-design-img student-dash-card p-2">
									<Skeleton active={skeltonLoading} loading={skeltonLoading} />
								</div>
								:
								<Link href='/student/test'>
									<div className="card card-value back-design-img student-dash-card">
										<div className="row align">
											<div className="col-sm-3 col-4 pr-0">
												<div className="icon-card-dash dash-icon-g" style={{ background: ' linear-gradient(83.31deg, rgb(10, 101, 199) 21.22%, rgb(22, 138, 255) 88.54%)' }} >
													<i className="fa-solid fa-file-signature"></i>
												</div>
											</div>
											<div className="col-sm-9 col-8">
												<div className="card-value-height">
													<p className="p-sm mb-0">Purchased Tests</p>
													<hr className="line w-100 opacity-3" />
													<p className="title-lg mb-0 fw-bold mintGreen">{dashboardData?.totalFreeTests}</p>
												</div>
											</div>
										</div>
										<Image
											src="https://html.phoenixcoded.net/light-able/bootstrap/assets/images/widget/img-status-3.svg"
											className="image-shapes"
										/>
									</div>
								</Link>
							}
						</div>
						<div className="col-lg-3 col-md-6">
							{skeltonLoading ?
								<div className="card card-value back-design-img student-dash-card p-2">
									<Skeleton active={skeltonLoading} loading={skeltonLoading} />
								</div>
								:
								<Link href='/student/test'>
									<div className="card card-value back-design-img student-dash-card">
										<div className="row align">
											<div className="col-sm-3 col-4 pr-0">
												<div className="icon-card-dash dash-icon-g" style={{ background: ' linear-gradient(83.31deg, rgb(163, 137, 212), rgb(137, 158, 212) 88.54%)' }} >
													<i className="fa-solid fa-hand-holding-dollar"></i>
												</div>
											</div>

											<div className="col-sm-9 col-8">
												<div className="card-value-height">
													<p className="p-sm mb-0">Free Package Tests</p>
													<hr className="line w-100 opacity-3" />
													<p className="title-lg mb-0 fw-bold mintGreen">{dashboardData?.totalFreeTests}</p>
												</div>
											</div>
										</div>
										<Image
											src="https://html.phoenixcoded.net/light-able/bootstrap/assets/images/widget/img-status-4.svg"
											className="image-shapes"
										/>
									</div>
								</Link>
							}
						</div>
						{/* <div className="col-lg-3 col-md-6">
							{skeltonLoading ?
								<div className="card card-value back-design-img student-dash-card p-2">
									<Skeleton active={skeltonLoading} loading={skeltonLoading} />
								</div>
								:
								<div className="card card-value back-design-img student-dash-card">
									<div className="card-value-height">
										<p className="p-sm mb-0">
											Hours of Practice Tests Available
										</p>
										<hr className="line w-100 opacity-3" />
										<p className="title-lg mb-0 fw-bold sunYellow">1000 Hours </p>
									</div>
									<Image
										src="https://html.phoenixcoded.net/light-able/bootstrap/assets/images/widget/img-status-5.svg"
										className="image-shapes"
									/>
								</div>
							}
						</div> */}
						{/* <div className="col-lg-3 col-md-6">
							{skeltonLoading ?
								<div className="card card-value back-design-img student-dash-card p-2">
									<Skeleton active={skeltonLoading} loading={skeltonLoading} />
								</div>
								:
								<div className="card card-value back-design-img student-dash-card">
									<div className="card-value-height">
										<p className="p-sm mb-0">Hours Spent on Tests</p>
										<hr className="line w-100 opacity-3" />
										<p className="title-lg mb-0 fw-bold softRed">100 Hours</p>
									</div>
									<Image
										src="https://html.phoenixcoded.net/light-able/bootstrap/assets/images/widget/img-status-2.svg"
										className="image-shapes"
									/>
								</div>
							}
						</div> */}
						<div className="col-lg-3 col-md-6">
							{skeltonLoading ?
								<div className="card card-value back-design-img student-dash-card p-2">
									<Skeleton active={skeltonLoading} loading={skeltonLoading} />
								</div>
								:
								<Link href='/student/myEssay'>
									<div className="card card-value back-design-img student-dash-card">
										<div className="row align">
											<div className="col-sm-3 col-4 pr-0">
												<div className="icon-card-dash dash-icon-g" style={{ background: 'linear-gradient(83.31deg, rgb(233, 172, 18) 21.22%, rgb(231, 117, 0) 88.54%)' }} >
													<i className="fa-solid fa-file-pen"></i>
												</div>
											</div>
											<div className="col-sm-9 col-8">
												<div className="card-value-height">
													<p className="p-sm mb-0">Essays for Pratice</p>
													<hr className="line w-100 opacity-3" />
													<p className="title-lg mb-0 fw-bold mintGreen">{dashboardData?.totalFreeTests}</p>
												</div>
											</div>
										</div>
										<Image
											src="https://html.phoenixcoded.net/light-able/bootstrap/assets/images/widget/img-status-7.svg"
											className="image-shapes"
										/>
									</div>
								</Link>
							}
						</div>
						<div className="col-lg-3 col-md-6">
							{skeltonLoading ?
								<div className="card card-value back-design-img student-dash-card p-2">
									<Skeleton active={skeltonLoading} loading={skeltonLoading} />
								</div>
								:
								<Link href={'/student/buy-test'}>
									<div className="card card-value back-design-img student-dash-card">
										<div className="row align">
											<div className="col-sm-3 col-4 pr-0">
												<div className="icon-card-dash dash-icon-g" style={{ background: 'linear-gradient(83.31deg, rgb(0, 207, 142) 21.22%, rgb(9, 253, 188) 88.54%)' }} >
													<i className="fa-solid fa-dollar-sign"></i>
												</div>
											</div>
											<div className="col-sm-9 col-8">
												<div className="card-value-height">
													<p className="p-sm mb-0">Purchased Packages</p>
													<hr className="line w-100 opacity-3" />
													<p className="title-lg mb-0 fw-bold mintGreen">{dashboardData?.totalFreeTests}</p>
												</div>
											</div>
										</div>
										<Image
											src="https://html.phoenixcoded.net/light-able/bootstrap/assets/images/widget/img-status-8.svg"
											className="image-shapes"
										/>
									</div>
								</Link>
							}
						</div>
						<div className="col-lg-3 col-md-6">
							{skeltonLoading ?
								<div className="card card-value back-design-img student-dash-card p-2">
									<Skeleton active={skeltonLoading} loading={skeltonLoading} />
								</div>
								:
								<Link href={'/student/ebooks'}>
									<div className="card card-value back-design-img student-dash-card">
										<div className="row align">
											<div className="col-sm-3 col-4 pr-0">
												<div className="icon-card-dash dash-icon-g" style={{ background: 'linear-gradient(83.31deg, rgb(119 80 190) 21.22%, rgb(151 94 255) 88.54%)' }} >
													<i className="fa-solid fa-book"></i>
												</div>
											</div>
											<div className="col-sm-9 col-8">
												<div className="card-value-height">
													<p className="p-sm mb-0">Purchased Ebooks</p>
													<hr className="line w-100 opacity-3" />
													<p className="title-lg mb-0 fw-bold mintGreen">{dashboardData?.totalFreeTests}</p>
												</div>
											</div>
										</div>
										<Image
											src="https://html.phoenixcoded.net/light-able/bootstrap/assets/images/widget/img-status-3.svg"
											className="image-shapes"
										/>
									</div>
								</Link>
							}
						</div>
					</div>
					<h2 className="color-dark-gray p-lg bottom-ultra-space top-ultra-space fw-regular ">
						Performance Report
					</h2>
					<div className="row ">
						<div className="col-sm-4">
							<ul className="list-button-contant">
								<li>
									<button
										className="btn-primary btn-spac contant-width p-extra-small"
										style={{ backgroundColor: "#A0D368" }}
									>
										Strengths
									</button>
								</li>
								<li>Score</li>
								<li>
									{" "}
									<span> &gt; </span>{" "}
								</li>
								<li>Score</li>
							</ul>
							<div className="performanceReportCard">
								<div className="row">
									<div className="col-6 ">
										<p className="color-dark-gray p-sm fw-medium mb-0">Score</p>
									</div>
									<div className="col-6  text-end">
										<p className="color-dark-gray p-sm fw-medium mb-0">Score</p>
									</div>
								</div>
							</div>
							<div
								className="card card-value min-height-200"
								style={{ backgroundColor: "#EFF8E6" }}
							>
								<p className="p-sm mb-0 p-sm color-dark-gray text-center">
									No Data Available
								</p>
							</div>
						</div>
						<div className="col-sm-4">
							<ul className="list-button-contant">
								<li>
									<button
										className="btn-primary btn-spac contant-width p-extra-small"
										style={{ backgroundColor: "#3FACA4" }}
									>
										Strengths
									</button>
								</li>
								<li>Score</li>
								<li>
									{" "}
									<span> &gt; </span>{" "}
								</li>
								<li>Score</li>
							</ul>
							<div className="performanceReportCard">
								<div className="row">
									<div className="col-6 ">
										<p className="color-dark-gray p-sm fw-medium mb-0">Test Name</p>
									</div>
									<div className="col-6  text-end">
										<p className="color-dark-gray p-sm fw-medium mb-0">Score</p>
									</div>
								</div>
							</div>
							<div
								className="card card-value min-height-200"
								style={{ backgroundColor: "#E2F1F1" }}
							>
								<p className="p-sm mb-0 p-sm color-dark-gray text-center">
									No Data Available
								</p>
							</div>
						</div>
						<div className="col-sm-4">
							<ul className="list-button-contant">
								<li>
									<button
										className="btn-primary btn-spac contant-width p-extra-small"
										style={{ backgroundColor: "#FBB03D" }}
									>
										Weakness
									</button>
								</li>
								<li>50%</li>
								<li>
									{" "}
									<span> &gt; </span>{" "}
								</li>
								<li>Score</li>
								<li>
									{" "}
									<span> &gt; </span>{" "}
								</li>
								<li>75%</li>
							</ul>
							<div className="performanceReportCard">
								<div className="row">
									<div className="col-6">
										<p className="color-dark-gray p-sm fw-medium mb-0">Test Name</p>
									</div>
									<div className="col-6 text-end">
										<p className="color-dark-gray p-sm fw-medium mb-0">Score</p>
									</div>
								</div>
							</div>
							<div
								className="card card-value min-height-200"
								style={{ backgroundColor: "#FFF1E0" }}
							>
								<div className="row">
									<div className="col-8">
										<p className="p-sm mb-0 p-sm color-dark-gray">English Test</p>
									</div>
									<div className="col-4 text-end">
										<p className="p-sm mb-0 p-sm color-dark-gray">75%</p>
									</div>
								</div>
								<div className="row mt-3">
									<div className="col-8">
										<p className="p-sm mb-0 p-sm color-dark-gray">Maths Test</p>
									</div>
									<div className="col-4 text-end">
										<p className="p-sm mb-0 p-sm color-dark-gray">78%</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-sm-4">
							<ul className="list-button-contant">
								<li>
									<button
										className="btn-primary btn-spac contant-width p-extra-small"
										style={{ backgroundColor: "#B20022" }}
									>
										Strengths
									</button>
								</li>
								<li>Score</li>
								<li>
									{" "}
									<span> &gt; </span>{" "}
								</li>
								<li>Score</li>
							</ul>
							<div className="performanceReportCard">
								<div className="row">
									<div className="col-6">
										<p className="color-dark-gray p-sm fw-medium mb-0">Test Name</p>
									</div>
									<div className="col-6 text-end">
										<p className="color-dark-gray p-sm fw-medium mb-0">Score</p>
									</div>
								</div>
							</div>
							<div
								className="card card-value min-height-200"
								style={{ backgroundColor: "#B2002226" }}
							>
								<div className="row">
									<div className="col-8">
										<p className="p-sm mb-0 p-sm color-dark-gray">English Test</p>
									</div>
									<div className="col-4 text-end">
										<p className="p-sm mb-0 p-sm color-dark-gray">75%</p>
									</div>
								</div>
								<div className="row mt-3">
									<div className="col-8">
										<p className="p-sm mb-0 p-sm color-dark-gray">Maths Test</p>
									</div>
									<div className="col-4 text-end">
										<p className="p-sm mb-0 p-sm color-dark-gray">78%</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

	);
}
