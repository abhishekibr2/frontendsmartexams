'use client';
import './card.css';
import Link from 'next/link';
import { Count } from '@/lib/types';
import ErrorHandler from '@/lib/ErrorHandler';
import AuthContext from '@/contexts/AuthContext';
import { getDashboardCounts } from '@/lib/adminApi';
import { getUserNotification } from '@/lib/commonApi';
import { useDispatch } from 'react-redux';
import { setBlogs } from '@/redux/reducers/blogReducer';
import { setUsers } from '@/redux/reducers/userReducer';
import React, { useContext, useEffect, useState } from 'react';
import { setContactUsData } from '@/redux/reducers/contactusReducer';
import { setNotification } from '@/redux/reducers/notificationReducer';
import { getAllUsers, getAllBlogs, getAllContactUs } from '@/lib/adminApi';
// import Image from 'next/image'

export default function Dashboard() {
	const { user } = useContext(AuthContext);
	const [count, setCount] = useState<Count | null>(null);
	const dispatch = useDispatch();

	useEffect(() => {
		if (user) {
			fetchCounts();
			fetchAllUsersAndTodoAndContact();
		}
	}, [user]);

	const fetchAllUsersAndTodoAndContact = async () => {
		try {
			const response = await getAllUsers();
			dispatch(setUsers(response.data))
			const blogs = await getAllBlogs();
			dispatch(setBlogs(blogs.data))
			const contactUs = await getAllContactUs();
			dispatch(setContactUsData(contactUs.data))
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	};

	const fetchCounts = async () => {
		try {
			const response = await getDashboardCounts();
			if (response.status === true) {
				const totalEbooks = response.data?.length ? response.data[0]?.totalEbooks : 0;
				setCount(response.counts);
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	}

	const fetchAllNotifications = async () => {
		try {
			const res = await getUserNotification(user?._id);
			if (res.status === true) {
				dispatch(setNotification(res.data.slice(0, 5)))
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	};

	useEffect(() => {
		if (user) {
			fetchAllNotifications();
		}
	}, [user]);

	return (
		<>
			<section>
				<div className="d-flex">
					<div className="spac-dash w-100">
						<h2 className="top-title">Dashboard</h2>
						<br />

						{/* <div className="row card-width-row">
							<div className="col-lg-3 col-md-6 col-6">
								<Link href="" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<p className="p-lg fw-semi-bold color-accent mb-0">1</p>
										<div className="dash-box text-center">
											<span className="icon-card-dash">
												<i className="fa-solid fa-dollar-sign" />
											</span>
											<p className="p-sm color-dark-gray opacity-7">Packages Sold</p>
										</div>
									</div>
								</Link>
							</div>
							<div className="col-lg-3 col-md-6 col-6">
								<Link href="/admin/testConducted" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<p className="p-lg fw-semi-bold color-accent mb-0">{count?.testConductedBy || 0}</p>
										<div className="dash-box text-center">
											<span className="icon-card-dash">
												<i className="fa-solid fa-book-open" />
											</span>
											<p className="p-sm color-dark-gray opacity-7">Tests Conducted</p>
										</div>
									</div>
								</Link>
							</div>
							<div className="col-lg-3 col-md-6 col-6">
								<Link href="" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<p className="p-lg fw-semi-bold color-accent mb-0">124</p>
										<div className="dash-box text-center">
											<span className="icon-card-dash">
												<i className="fa-regular fa-circle-question" />
											</span>
											<p className="p-sm color-dark-gray opacity-7">Website Visitors</p>
										</div>
									</div>
								</Link>
							</div>
							<div className="col-lg-3 col-md-6 col-6">
								<Link href="" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<p className="p-lg fw-semi-bold color-accent mb-0">26</p>
										<div className="dash-box text-center">
											<span className="icon-card-dash">
												<i className="fa-solid fa-bars-staggered" />
											</span>
											<p className="p-sm color-dark-gray opacity-7">Ebooks Sold</p>
										</div>
									</div>
								</Link>
							</div>
						</div>
						<div className="row card-width-row">
							<div className="col-lg-3 col-md-6 col-6">
								<Link href="/admin/users" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<p className="p-lg fw-semi-bold color-accent mb-0">{count?.student || 0}</p>
										<div className="dash-box text-center">
											<span className="icon-card-dash">
												<i className="fa-solid fa-dollar-sign" />
											</span>
											<p className="p-sm color-dark-gray opacity-7">Students</p>
										</div>
									</div>
								</Link>
							</div>
							<div className="col-lg-3 col-md-6 col-6">
								<Link href="/admin/package" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<p className="p-lg fw-semi-bold color-accent mb-0">{count?.package || 0}</p>
										<div className="dash-box text-center">
											<span className="icon-card-dash">
												<i className="fa-solid fa-book-open" />
											</span>
											<p className="p-sm color-dark-gray opacity-7">Total Packages</p>
										</div>
									</div>
								</Link>
							</div>
							<div className="col-lg-3 col-md-6 col-6">
								<Link href="/admin/test" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<p className="p-lg fw-semi-bold color-accent mb-0">{count?.test || 0}</p>
										<div className="dash-box text-center">
											<span className="icon-card-dash">
												<i className="fa-regular fa-circle-question" />
											</span>
											<p className="p-sm color-dark-gray opacity-7">Total Tests</p>
										</div>
									</div>
								</Link>
							</div>
							<div className="col-lg-3 col-md-6 col-6">
								<Link href="/admin/ebook" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<p className="p-lg fw-semi-bold color-accent mb-0">{count?.ebook || 0}</p>
										<div className="dash-box text-center">
											<span className="icon-card-dash">
												<i className="fa-solid fa-bars-staggered" />
											</span>
											<p className="p-sm color-dark-gray opacity-7">Ebooks Published</p>
										</div>
									</div>
								</Link>
							</div>
						</div>
						<div className="row card-width-row">
							<div className="col-lg-3 col-md-6 col-6">
								<Link href="/admin/question" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<p className="p-lg fw-semi-bold color-accent mb-0">{count?.questions || 0}</p>
										<div className="dash-box text-center">
											<span className="icon-card-dash">
												<i className="fa-solid fa-dollar-sign" />
											</span>
											<p className="p-sm color-dark-gray opacity-7">Questions</p>
										</div>
									</div>
								</Link>
							</div>
							<div className="col-lg-3 col-md-6 col-6">
								<Link href="/admin/users" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<p className="p-lg fw-semi-bold color-accent mb-0">{count?.users || 0}</p>
										<div className="dash-box text-center">
											<span className="icon-card-dash">
												<i className="fa-solid fa-book-open" />
											</span>
											<p className="p-sm color-dark-gray opacity-7">Admin Users</p>
										</div>
									</div>
								</Link>
							</div>
							<div className="col-lg-3 col-md-6 col-6">
								<Link href="/admin/questionFeedback" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<p className="p-lg fw-semi-bold color-accent mb-0">{count?.questionFeedbackModel || 0}</p>
										<div className="dash-box text-center">
											<span className="icon-card-dash">
												<i className="fa-regular fa-circle-question" />
											</span>
											<p className="p-sm color-dark-gray opacity-7">FeedBack Received Questions</p>
										</div>
									</div>
								</Link>
							</div>
							<div className="col-lg-3 col-md-6 col-6">
								<Link href="" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<p className="p-lg fw-semi-bold color-accent mb-0">26</p>
										<div className="dash-box text-center">
											<span className="icon-card-dash">
												<i className="fa-solid fa-bars-staggered" />
											</span>
											<p className="p-sm color-dark-gray opacity-7">Database Usage</p>
										</div>
									</div>
								</Link>
							</div>
						</div>
						<div className="row card-width-row">
							<div className="col-lg-3 col-md-6 col-6">
								<Link href="" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<p className="p-lg fw-semi-bold color-accent mb-0">1</p>
										<div className="dash-box text-center">
											<span className="icon-card-dash">
												<i className="fa-solid fa-dollar-sign" />
											</span>
											<p className="p-sm color-dark-gray opacity-7">Students Portal Performance</p>
										</div>
									</div>
								</Link>
							</div>
							<div className="col-lg-3 col-md-6 col-6">
								<Link href="" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<p className="p-lg fw-semi-bold color-accent mb-0">2</p>
										<div className="dash-box text-center">
											<span className="icon-card-dash">
												<i className="fa-solid fa-book-open" />
											</span>
											<p className="p-sm color-dark-gray opacity-7">Number Of Web Pages</p>
										</div>
									</div>
								</Link>
							</div>
							<div className="col-lg-3 col-md-6 col-6">
								<Link href="" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<p className="p-lg fw-semi-bold color-accent mb-0">2</p>
										<div className="dash-box text-center">
											<span className="icon-card-dash">
												<i className="fa-regular fa-circle-question" />
											</span>
											<p className="p-sm color-dark-gray opacity-7">Website Performance</p>
										</div>
									</div>
								</Link>
							</div>
							<div className="col-lg-3 col-md-6 col-6">
								<Link href="" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<p className="p-lg fw-semi-bold color-accent mb-0">2</p>
										<div className="dash-box text-center">
											<span className="icon-card-dash">
												<i className="fa-solid fa-bars-staggered" />
											</span>
											<p className="p-sm color-dark-gray opacity-7">Hosting Server Metrics</p>
										</div>
									</div>
								</Link>
							</div>
						</div>
						<div className="row card-width-row">
							<div className="col-lg-3 col-md-6 col-6">
								<Link href="/admin/testFeedback" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<p className="p-lg fw-semi-bold color-accent mb-0">{count?.testFeedback || 0}</p>
										<div className="dash-box text-center">
											<span className="icon-card-dash">
												<i className="fa-solid fa-dollar-sign" />
											</span>
											<p className="p-sm color-dark-gray opacity-7">Feedback Received Tests</p>
										</div>
									</div>
								</Link>
							</div>
							<div className="col-lg-3 col-md-6 col-6">
								<Link href="/admin/packageFeedback" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<p className="p-lg fw-semi-bold color-accent mb-0">{count?.packageFeedback || 0}</p>
										<div className="dash-box text-center">
											<span className="icon-card-dash">
												<i className="fa-solid fa-book-open" />
											</span>
											<p className="p-sm color-dark-gray opacity-7">Feedback Received Packages</p>
										</div>
									</div>
								</Link>
							</div>
							<div className="col-lg-3 col-md-6 col-6">
								<Link href="" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<p className="p-lg fw-semi-bold color-accent mb-0">124</p>
										<div className="dash-box text-center">
											<span className="icon-card-dash">
												<i className="fa-regular fa-circle-question" />
											</span>
											<p className="p-sm color-dark-gray opacity-7">Number Of Messages Not Responded</p>
										</div>
									</div>
								</Link>
							</div>
							<div className="col-lg-3 col-md-6 col-6">
								<Link href="" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<p className="p-lg fw-semi-bold color-accent mb-0">26</p>
										<div className="dash-box text-center">
											<span className="icon-card-dash">
												<i className="fa-solid fa-bars-staggered" />
											</span>
											<p className="p-sm color-dark-gray opacity-7">Essay Submissions Needing Feedbacks</p>
										</div>
									</div>
								</Link>
							</div>
						</div>
						<div className="row card-width-row">
							<div className="col-lg-3 col-md-6 col-6">
								<Link href="" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<p className="p-lg fw-semi-bold color-accent mb-0">1</p>
										<div className="dash-box text-center">
											<span className="icon-card-dash">
												<i className="fa-solid fa-dollar-sign" />
											</span>
											<p className="p-sm color-dark-gray opacity-7">Topics Sub-Topics By Exams</p>
										</div>
									</div>
								</Link>
							</div>
							<div className="col-lg-3 col-md-6 col-6">
								<Link href="" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<p className="p-lg fw-semi-bold color-accent mb-0">32,000</p>
										<div className="dash-box text-center">
											<span className="icon-card-dash">
												<i className="fa-solid fa-book-open" />
											</span>
											<p className="p-sm color-dark-gray opacity-7">Report Questions Analysis Bank</p>
										</div>
									</div>
								</Link>
							</div>
						</div> */}

						{/*  */}
						<div className="row card-width-row">
							<div className="col-lg-3 col-md-6 col-6">
								<Link href="" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<div className="row align">
											<div className="col-sm-3 col-4 pr-0">
												<div className="icon-card-dash dash-icon-g" style={{ background: 'linear-gradient(83.31deg, #1de9b6 21.22%, #1dc4e9 88.54%)' }} >
													<i className="fa-solid fa-dollar-sign" />
												</div>
											</div>
											<div className="col-sm-9 col-8">
												<img src="https://html.phoenixcoded.net/light-able/bootstrap/assets/images/widget/img-status-2.svg" alt="card-img" className="card-img-right" />
												<p className="p-xs color-dark-gray opacity-7 mb-0">Packages Sold</p>
												<h4 className="title-lg fw-semi-bold color-dark-gray mb-0">${count?.PackageSold}</h4>
											</div>
										</div>

									</div>
								</Link>
							</div>
							<div className="col-lg-3 col-md-6 col-6">
								<Link href="/admin/testConducted" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<div className="row align">
											<div className="col-sm-3 col-4 pr-0">
												<div className="icon-card-dash dash-icon-g" style={{ background: 'linear-gradient(83.31deg, #a389d4, #899ed4 88.54%)' }} >
													<i className="fa-solid fa-list"></i>
												</div>
											</div>
											<div className="col-sm-9 col-8">
												<img src="https://html.phoenixcoded.net/light-able/bootstrap/assets/images/widget/img-status-1.svg" alt="card-img" className="card-img-right" />
												<p className="p-xs color-dark-gray opacity-7 mb-0">Tests Conducted</p>
												<h4 className="title-lg fw-semi-bold color-dark-gray mb-0">{count?.testConductedBy || 0} </h4>
											</div>
										</div>
									</div>
								</Link>
							</div>

							{/* <div className="col-lg-3 col-md-6 col-6">
								<Link href="" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<div className="row align">
											<div className="col-sm-3 col-4 pr-0">
												<div className="icon-card-dash dash-icon-g" style={{ background: 'linear-gradient(83.31deg, #0aabc7 21.22%, #8ae9ff 88.54%)' }} >
													<i className="fa-solid fa-globe"></i>
												</div>
											</div>
											<div className="col-sm-9 col-8">
												<img src="https://html.phoenixcoded.net/light-able/bootstrap/assets/images/widget/img-status-2.svg" alt="card-img" className="card-img-right" />
												<p className="p-xs color-dark-gray opacity-7 mb-0">Website Visitors</p>
												<h4 className="title-lg fw-semi-bold color-dark-gray mb-0">124 </h4>
											</div>
										</div>
									</div>
								</Link>
							</div> */}

							<div className="col-lg-3 col-md-6 col-6">
								<Link href="" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<div className="row align">
											<div className="col-sm-3 col-4 pr-0">
												<div className="icon-card-dash dash-icon-g" style={{ background: 'linear-gradient(83.31deg, rgb(119 80 190) 21.22%, rgb(151 94 255) 88.54%)' }} >
													<i className="fa-solid fa-book"></i>
												</div>
											</div>
											<div className="col-sm-9 col-8">
												<img src="https://html.phoenixcoded.net/light-able/bootstrap/assets/images/widget/img-status-4.svg" alt="card-img" className="card-img-right" />
												<p className="p-xs color-dark-gray opacity-7 mb-0">Ebooks Sold</p>
												<h4 className="title-lg fw-semi-bold color-dark-gray mb-0">{count?.ebook[0].totalEbooks || 0} </h4>
											</div>
										</div>
									</div>
								</Link>
							</div>

							<div className="col-lg-3 col-md-6 col-6">
								<Link href="/admin/users" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<div className="row align">
											<div className="col-sm-3 col-4 pr-0">
												<div className="icon-card-dash dash-icon-g" style={{ background: 'linear-gradient(83.31deg, rgb(10 101 199) 21.22%, rgb(22 138 255) 88.54%)' }} >
													<i className="fa-solid fa-graduation-cap"></i>
												</div>
											</div>
											<div className="col-sm-9 col-8">
												<img src="https://html.phoenixcoded.net/light-able/bootstrap/assets/images/widget/img-status-5.svg" alt="card-img" className="card-img-right" />
												<p className="p-xs color-dark-gray opacity-7 mb-0">Students</p>
												<h4 className="title-lg fw-semi-bold color-dark-gray mb-0">{count?.student || 0} </h4>
											</div>
										</div>

									</div>
								</Link>
							</div>

							<div className="col-lg-3 col-md-6 col-6">
								<Link href="/admin/packages" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<div className="row align">
											<div className="col-sm-3 col-4 pr-0">
												<div className="icon-card-dash dash-icon-g" style={{ background: 'linear-gradient(83.31deg, rgb(0 207 142) 21.22%, rgb(9 253 188) 88.54%)' }} >
													<i className="fa-solid fa-hand-holding-dollar"></i>
												</div>
											</div>
											<div className="col-sm-9 col-8">
												<img src="https://html.phoenixcoded.net/light-able/bootstrap/assets/images/widget/img-status-9.svg" alt="card-img" className="card-img-right" />
												<p className="p-xs color-dark-gray opacity-7 mb-0">Total Packages</p>
												<h4 className="title-lg fw-semi-bold color-dark-gray mb-0">{count?.package || 0} </h4>
											</div>
										</div>

									</div>
								</Link>
							</div>

							<div className="col-lg-3 col-md-6 col-6">
								<Link href="/admin/test" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<div className="row align">
											<div className="col-sm-3 col-4 pr-0">
												<div className="icon-card-dash dash-icon-g" style={{ background: 'linear-gradient(83.31deg, rgb(115 116 116) 21.22%, rgb(64 67 66) 88.54%)' }} >
													<i className="fa-regular fa-paste"></i>
												</div>
											</div>
											<div className="col-sm-9 col-8">

												<img src="https://html.phoenixcoded.net/light-able/bootstrap/assets/images/widget/img-status-5.svg" alt="card-img" className="card-img-right" />
												<p className="p-xs color-dark-gray opacity-7 mb-0">Total Tests</p>
												<h4 className="title-lg fw-semi-bold color-dark-gray mb-0">{count?.test || 0}</h4>

											</div>
										</div>

									</div>
								</Link>
							</div>

							<div className="col-lg-3 col-md-6 col-6">
								<Link href="/admin/ebook" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<div className="row align">
											<div className="col-sm-3 col-4 pr-0">
												<div className="icon-card-dash dash-icon-g" style={{ background: 'linear-gradient(83.31deg, rgb(0 207 142) 21.22%, rgb(9 253 188) 88.54%)' }} >
													<i className="fa-solid fa-book-atlas"></i>
												</div>
											</div>
											<div className="col-sm-9 col-8">
												<img src="https://html.phoenixcoded.net/light-able/bootstrap/assets/images/widget/img-status-8.svg" alt="card-img" className="card-img-right" />
												<p className="p-xs color-dark-gray opacity-7 mb-0">Ebooks Published</p>
												<h4 className="title-lg fw-semi-bold color-dark-gray mb-0">{count?.publishEbookCount || 0} </h4>
											</div>
										</div>

									</div>
								</Link>
							</div>

							<div className="col-lg-3 col-md-6 col-6">
								<Link href="/admin/question" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<div className="row align">
											<div className="col-sm-3 col-4 pr-0">
												<div className="icon-card-dash dash-icon-g" style={{ background: 'linear-gradient(83.31deg, #0aabc7 21.22%, #8ae9ff 88.54%)' }} >
													<i className="fa-regular fa-circle-question"></i>
												</div>
											</div>
											<div className="col-sm-9 col-8">
												<img src="https://html.phoenixcoded.net/light-able/bootstrap/assets/images/widget/img-status-2.svg" alt="card-img" className="card-img-right" />
												<p className="p-xs color-dark-gray opacity-7 mb-0">Questions</p>
												<h4 className="title-lg fw-semi-bold color-dark-gray mb-0">{count?.questions || 0}</h4>
											</div>
										</div>

									</div>
								</Link>
							</div>

							{/* <div className="col-lg-3 col-md-6 col-6">
								<Link href="/admin/users" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<div className="row align">
											<div className="col-sm-3 col-4 pr-0">
												<div className="icon-card-dash dash-icon-g" style={{ background: 'linear-gradient(83.31deg, rgb(233 172 18) 21.22%, rgb(231 117 0) 88.54%)' }} >
													<i className="fa-solid fa-user-tie"></i>
												</div>
											</div>
											<div className="col-sm-9 col-8">
												<img src="https://html.phoenixcoded.net/light-able/bootstrap/assets/images/widget/img-status-2.svg" alt="card-img" className="card-img-right" />
												<p className="p-xs color-dark-gray opacity-7 mb-0">Admin Users</p>
												<h4 className="title-lg fw-semi-bold color-dark-gray mb-0">{count?.users || 0} </h4>
											</div>
										</div>

									</div>
								</Link>
							</div> */}
							<div className="col-lg-3 col-md-6 col-6">
								<Link href="/admin/questionFeedback" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<div className="row align">
											<div className="col-sm-3 col-4 pr-0">
												<div className="icon-card-dash dash-icon-g" style={{ background: 'linear-gradient(83.31deg, #a389d4, #899ed4 88.54%)' }} >
													<i className="fa-solid fa-message"></i>
												</div>
											</div>
											<div className="col-sm-9 col-8">
												<img src="https://html.phoenixcoded.net/light-able/bootstrap/assets/images/widget/img-status-1.svg" alt="card-img" className="card-img-right" />
												<p className="p-xs color-dark-gray opacity-7 mb-0">Questions Feedback </p>
												<h4 className="title-lg fw-semi-bold color-dark-gray mb-0">{count?.questionFeedbackModel || 0} </h4>
											</div>
										</div>

									</div>
								</Link>
							</div>

							{/* <div className="col-lg-3 col-md-6 col-6">
								<Link href="" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<div className="row align">
											<div className="col-sm-3 col-4 pr-0">
												<div className="icon-card-dash dash-icon-g" style={{ background: 'linear-gradient(83.31deg, #0aabc7 21.22%, #8ae9ff 88.54%)' }} >
													<i className="fa-solid fa-database"></i>
												</div>
											</div>
											<div className="col-sm-9 col-8">
												<img src="https://html.phoenixcoded.net/light-able/bootstrap/assets/images/widget/img-status-2.svg" alt="card-img" className="card-img-right" />
												<p className="p-xs color-dark-gray opacity-7 mb-0"> Database Usage</p>
												<h4 className="title-lg fw-semi-bold color-dark-gray mb-0">124 </h4>
											</div>
										</div>

									</div>
								</Link>
							</div> */}


							{/* <div className="col-lg-3 col-md-6 col-6">
								<Link href="" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<div className="row align">
											<div className="col-sm-3 col-4 pr-0">
												<div className="icon-card-dash dash-icon-g" style={{ background: 'linear-gradient(83.31deg, rgb(119 80 190) 21.22%, rgb(151 94 255) 88.54%)' }} >
													<i className="fa-solid fa-graduation-cap"></i>
												</div>
											</div>
											<div className="col-sm-9 col-8">
												<img src="https://html.phoenixcoded.net/light-able/bootstrap/assets/images/widget/img-status-4.svg" alt="card-img" className="card-img-right" />
												<p className="p-xs color-dark-gray opacity-7 mb-0">Students Portal Performance</p>
												<h4 className="title-lg fw-semi-bold color-dark-gray mb-0">26 </h4>
											</div>
										</div>

									</div>
								</Link>
							</div> */}

							{/* <div className="col-lg-3 col-md-6 col-6">
								<Link href="" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<div className="row align">
											<div className="col-sm-3 col-4 pr-0">
												<div className="icon-card-dash dash-icon-g" style={{ background: 'linear-gradient(83.31deg, rgb(10 101 199) 21.22%, rgb(22 138 255) 88.54%)' }} >
													<i className="fa-solid fa-list-ol"></i>
												</div>
											</div>
											<div className="col-sm-9 col-8">
												<img src="https://html.phoenixcoded.net/light-able/bootstrap/assets/images/widget/img-status-5.svg" alt="card-img" className="card-img-right" />
												<p className="p-xs color-dark-gray opacity-7 mb-0">Number Of Web Pages</p>
												<h4 className="title-lg fw-semi-bold color-dark-gray mb-0">15</h4>
											</div>
										</div>

									</div>
								</Link>
							</div> */}

							{/* <div className="col-lg-3 col-md-6 col-6">
								<Link href="" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<div className="row align">
											<div className="col-sm-3 col-4 pr-0">
												<div className="icon-card-dash dash-icon-g" style={{ background: 'linear-gradient(83.31deg, rgb(0 207 142) 21.22%, rgb(9 253 188) 88.54%)' }} >
													<i className="fa-solid fa-globe"></i>
												</div>
											</div>
											<div className="col-sm-9 col-8">
												<img src="https://html.phoenixcoded.net/light-able/bootstrap/assets/images/widget/img-status-9.svg" alt="card-img" className="card-img-right" />
												<p className="p-xs color-dark-gray opacity-7 mb-0">Website Performance</p>
												<h4 className="title-lg fw-semi-bold color-dark-gray mb-0">40 </h4>
											</div>
										</div>

									</div>
								</Link>
							</div> */}

							{/* <div className="col-lg-3 col-md-6 col-6">
								<Link href="" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<div className="row align">
											<div className="col-sm-3 col-4 pr-0">
												<div className="icon-card-dash dash-icon-g" style={{ background: 'linear-gradient(83.31deg, rgb(146 18 213) 21.22%, rgb(181 95 255) 88.54%)' }} >
													<i className="fa-solid fa-server"></i>
												</div>
											</div>
											<div className="col-sm-9 col-8">
												<img src="https://html.phoenixcoded.net/light-able/bootstrap/assets/images/widget/img-status-5.svg" alt="card-img" className="card-img-right" />
												<p className="p-xs color-dark-gray opacity-7 mb-0">Hosting Server Metrics</p>
												<h4 className="title-lg fw-semi-bold color-dark-gray mb-0">33 </h4>
											</div>
										</div>

									</div>
								</Link>
							</div> */}

							<div className="col-lg-3 col-md-6 col-6">
								<Link href="/admin/testFeedback" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<div className="row align">
											<div className="col-sm-3 col-4 pr-0">
												<div className="icon-card-dash dash-icon-g" style={{ background: 'linear-gradient(83.31deg, rgb(0 207 142) 21.22%, rgb(9 253 188) 88.54%)' }} >
													<i className="fa-solid fa-comment-dots"></i>
												</div>
											</div>
											<div className="col-sm-9 col-8">
												<img src="https://html.phoenixcoded.net/light-able/bootstrap/assets/images/widget/img-status-8.svg" alt="card-img" className="card-img-right" />
												<p className="p-xs color-dark-gray opacity-7 mb-0">Test Feedback </p>
												<h4 className="title-lg fw-semi-bold color-dark-gray mb-0">{count?.testFeedback || 0} </h4>
											</div>
										</div>

									</div>
								</Link>
							</div>

							<div className="col-lg-3 col-md-6 col-6">
								<Link href="/admin/packageFeedback" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<div className="row align">
											<div className="col-sm-3 col-4 pr-0">
												<div className="icon-card-dash dash-icon-g" style={{ background: 'linear-gradient(83.31deg, rgb(115 116 116) 21.22%, rgb(64 67 66) 88.54%)' }} >
													<i className="fa-solid fa-hand-holding-dollar"></i>
												</div>
											</div>
											<div className="col-sm-9 col-8">
												<img src="https://html.phoenixcoded.net/light-able/bootstrap/assets/images/widget/img-status-2.svg" alt="card-img" className="card-img-right" />
												<p className="p-xs color-dark-gray opacity-7 mb-0">Package Feedback</p>
												<h4 className="title-lg fw-semi-bold color-dark-gray mb-0">{count?.packageFeedback || 0}</h4>
											</div>
										</div>

									</div>
								</Link>
							</div>

							{/* <div className="col-lg-3 col-md-6 col-6">
								<Link href="" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<div className="row align">
											<div className="col-sm-3 col-4 pr-0">
												<div className="icon-card-dash dash-icon-g" style={{ background: 'linear-gradient(83.31deg, #0aabc7 21.22%, #8ae9ff 88.54%)' }} >
													<i className="fa-solid fa-comment-slash"></i>
												</div>
											</div>
											<div className="col-sm-9 col-8">
												<img src="https://html.phoenixcoded.net/light-able/bootstrap/assets/images/widget/img-status-2.svg" alt="card-img" className="card-img-right" />
												<p className="p-xs color-dark-gray opacity-7 mb-0">Messages Not Responded</p>
												<h4 className="title-lg fw-semi-bold color-dark-gray mb-0">25</h4>
											</div>
										</div>

									</div>
								</Link>
							</div> */}

							<div className="col-lg-3 col-md-6 col-6">
								<Link href="" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<div className="row align">
											<div className="col-sm-3 col-4 pr-0">
												<div className="icon-card-dash dash-icon-g" style={{ background: 'linear-gradient(83.31deg, #1de9b6 21.22%, #1dc4e9 88.54%)' }} >
													<i className="fa-solid fa-file-pen"></i>
												</div>
											</div>
											<div className="col-sm-9 col-8">
												<img src="https://html.phoenixcoded.net/light-able/bootstrap/assets/images/widget/img-status-2.svg" alt="card-img" className="card-img-right" />
												<p className="p-xs color-dark-gray opacity-7 mb-0">Essay Feedback</p>
												<h4 className="title-lg fw-semi-bold color-dark-gray mb-0">1 </h4>
											</div>
										</div>

									</div>
								</Link>
							</div>
							<div className="col-lg-3 col-md-6 col-6">
								<Link href="" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<div className="row align">
											<div className="col-sm-3 col-4 pr-0">
												<div className="icon-card-dash dash-icon-g" style={{ background: 'linear-gradient(83.31deg, #a389d4, #899ed4 88.54%)' }} >
													<i className="fa-solid fa-file-signature"></i>
												</div>
											</div>
											<div className="col-sm-9 col-8">
												<img src="https://html.phoenixcoded.net/light-able/bootstrap/assets/images/widget/img-status-1.svg" alt="card-img" className="card-img-right" />
												<p className="p-xs color-dark-gray opacity-7 mb-0">Topic</p>
												<h4 className="title-lg fw-semi-bold color-dark-gray mb-0">{count?.questions || 0}</h4>
											</div>
										</div>

									</div>
								</Link>
							</div>

							<div className="col-lg-3 col-md-6 col-6">
								<Link href="" className="card-link">
									<div className="card-dash bottom-ultra-space admin-card-box">
										<div className="row align">
											<div className="col-sm-3 col-4 pr-0">
												<div className="icon-card-dash dash-icon-g" style={{ background: 'linear-gradient(83.31deg, rgb(233, 172, 18) 21.22%, rgb(231, 117, 0) 88.54%)' }} >
													<i className="fa-solid fa-magnifying-glass"></i>
												</div>
											</div>
											<div className="col-sm-9 col-8">
												<img src="https://html.phoenixcoded.net/light-able/bootstrap/assets/images/widget/img-status-2.svg" alt="card-img" className="card-img-right" />
												<p className="p-xs color-dark-gray opacity-7 mb-0">Subjects</p>
												<h4 className="title-lg fw-semi-bold color-dark-gray mb-0">{count?.subjectsCount || 0} </h4>
											</div>
										</div>

									</div>
								</Link>
							</div>

						</div>


					</div>
				</div>
			</section>

		</>
	);
}
