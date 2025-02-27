'use client';
import React, { useContext, useEffect, useState } from 'react';
import './style.css';
import AuthContext from '@/contexts/AuthContext';
import { getUserDashboardData } from '@/lib/studentApi';
import ErrorHandler from '@/lib/ErrorHandler';
import { Skeleton, Image, Flex, Pagination } from 'antd';
import Link from 'next/link';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';

interface DashboardData {
	totalTest: number,
	totalPurchasedEbooks: number,
	totalPurchasedPackages: number,
	totalPurchasedTests: number,
	totalFreePackages: number,
	totalFreeTests: number,
	totalPackagesEssay: number,
	totalTestDurationHours: number,
	completedTestCount: number,
	totalTimeSpentHours: number,
	categorizedResults: any;
}
interface CategoryItem {
	test: {
		testName: string;
	};
	score: number;
}
export default function Dashboard() {
	const { user } = useContext(AuthContext);
	const [skeltonLoading, setSkeltonLoading] = useState(true);
	const [dashboardData, setDashboardData] = useState<DashboardData>();
	const [currentIndices, setCurrentIndices] = useState<{ [key: string]: number }>({});

	const ITEMS_PER_PAGE = 5; // Display 2 items per page

	const handleNext = (key: string, category: CategoryItem[]) => {
		setCurrentIndices((prev) => {
			const currentIndex = prev[key] || 0;
			const nextIndex = currentIndex + ITEMS_PER_PAGE;
			return {
				...prev,
				[key]: nextIndex < category.length ? nextIndex : currentIndex,
			};
		});
	};

	const handlePrev = (key: string) => {
		setCurrentIndices((prev) => ({
			...prev,
			[key]: Math.max((prev[key] || 0) - ITEMS_PER_PAGE, 0),
		}));
	};

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
													<p className="title-lg mb-0 fw-bold mintGreen">{dashboardData?.totalTest}</p>
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
													<p className="p-sm mb-0">Tests Completed</p>
													<hr className="line w-100 opacity-3" />
													<p className="title-lg mb-0 fw-bold mintGreen">{dashboardData?.completedTestCount}/{dashboardData?.totalTest}</p>
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
													<p className="title-lg mb-0 fw-bold mintGreen">{dashboardData?.totalPurchasedTests}</p>
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
												<div className="icon-card-dash dash-icon-g" style={{ background: 'linear-gradient(83.31deg, rgb(235 201 107) 21.22%, rgb(223 171 20) 88.54%)' }} >
													<i className="fa-solid fa-file-signature"></i>
												</div>
											</div>

											<div className="col-sm-9 col-8">
												<div className="card-value-height">
													<p className="p-sm mb-0">Total Hours Of Practice Tests</p>
													<hr className="line w-100 opacity-3" />
													<p className="title-lg mb-0 fw-bold" style={{ color: 'rgb(241 180 3)' }}>{dashboardData?.totalTestDurationHours} Hours</p>
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
												<div className="icon-card-dash dash-icon-g" style={{ background: 'linear-gradient(83.31deg, rgb(231 69 61) 21.22%, rgb(228 96 89) 88.54%)' }} >
													<i className="fa-solid fa-file-signature"></i>
												</div>
											</div>

											<div className="col-sm-9 col-8">
												<div className="card-value-height">
													<p className="p-sm mb-0">Hours Spent On Tests</p>
													<hr className="line w-100 opacity-3" />
													<p className="title-lg mb-0 fw-bold mintGreen" style={{ color: '#E46059' }}>{dashboardData?.totalTimeSpentHours} Hours</p>
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
													<p className="title-lg mb-0 fw-bold mintGreen">{dashboardData?.totalPackagesEssay}</p>
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
													<p className="title-lg mb-0 fw-bold mintGreen">{dashboardData?.totalPurchasedPackages}</p>
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
													<p className="title-lg mb-0 fw-bold mintGreen">{dashboardData?.totalPurchasedEbooks}</p>
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
					<div className="row">
						{
							dashboardData &&
							Object.entries(dashboardData.categorizedResults).map(([key, category]: any) => (
								<div className="col-sm-4" key={key}>
									<ul className="list-button-contant">
										<li>
											<button
												className="btn-primary btn-spac contant-width p-extra-small"
												style={{
													backgroundColor: key === "strength" ? "#A0D368" :
														key === "opportunity" ? "#FFD700" :
															key === "weakness" ? "#FFA500" : "#FF6B6B"
												}}
											>
												{key.charAt(0).toUpperCase() + key.slice(1)}
											</button>
										</li>
										<li>Score</li>
										<li>
											<span> &gt; </span>
										</li>
										<li>Score</li>
									</ul>
									<div className="performanceReportCard">
										<div className="row">
											<div className="col-6">
												<p className="color-dark-gray p-sm fw-medium mb-0">Score</p>
											</div>
											<div className="col-6 text-end">
												<p className="color-dark-gray p-sm fw-medium mb-0">Score</p>
											</div>
										</div>
									</div>
									<div className="card card-value min-height-200" style={{ backgroundColor: "#EFF8E6" }}>
										{category.length > 0 ? (
											<>
												<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: '10px' }}>
													<p style={{ fontWeight: "bold", margin: 0 }}>Test Name</p>
													<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
														<FaCaretLeft
															onClick={() => handlePrev(key)}
															className={`pagination-icon ${currentIndices[key] === 0 ? "disabled" : ""}`}
															style={{
																fontSize: 18,
																color: currentIndices[key] === 0 ? "#ccc" : "#333",
																cursor: currentIndices[key] === 0 ? "not-allowed" : "pointer",
																transition: "color 0.3s ease",
															}}
														/>
														<span
															style={{
																fontSize: "12px",
																fontWeight: "bold",
																color: "#333",
																backgroundColor: "#f5f5f5",
																padding: "2px 12px",
																borderRadius: "6px",
																boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
															}}
														>
															{Math.floor((currentIndices[key] || 0) / ITEMS_PER_PAGE) + 1}
														</span>
														<FaCaretRight
															onClick={() => handleNext(key, category)}
															className={`pagination-icon ${(currentIndices[key] || 0) + ITEMS_PER_PAGE >= category.length ? "disabled" : ""
																}`}
															style={{
																fontSize: 18,
																color:
																	(currentIndices[key] || 0) + ITEMS_PER_PAGE >= category.length ? "#ccc" : "#333",
																cursor:
																	(currentIndices[key] || 0) + ITEMS_PER_PAGE >= category.length
																		? "not-allowed"
																		: "pointer",
																transition: "color 0.3s ease",
															}}
														/>
													</div>
												</div>
												{category
													.slice(currentIndices[key] || 0, Math.min((currentIndices[key] || 0) + ITEMS_PER_PAGE, category.length))
													.map((item: any, index: any) => (
														<Flex justify="space-between" key={index} style={{ borderBottom: "1px solid #bea3a338", margin: "2px 0" }}>
															<span>{item.test.testName}</span>
															<span>{item.score}%</span>
														</Flex>
													))}
											</>

										) : (
											<p className="p-sm mb-0 p-sm color-dark-gray text-center">
												No Data Available
											</p>
										)}
									</div>
								</div>
							))
						}

					</div>
				</div>
			</div>
		</section >

	);
}
