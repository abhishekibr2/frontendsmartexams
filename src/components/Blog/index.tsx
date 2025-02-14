
'use client';
import React from 'react';
import './style.css';
import { Button, Col, Image, Row } from 'antd';
import Link from 'next/link';
import Titles from '@/app/commonUl/Titles';
import ParaText from '@/app/commonUl/ParaText';


interface BlogPost {
	key: string;
	name: string;
	age: number;
	address: string;
	tags: string[];
	profileImage: any;

}
interface Props {
	blogs?: any;
}

interface Blogs {
	slug: string;
	title: string | undefined;
	image: string;
	description: string;
	timeToRead: number;
	data: BlogPost[];
	authorId: Author;

}

interface Author {
	profileImage: string;
	name: string;
}


export default function Blogs({ blogs }: Props) {

	return (
		<>
			<section id="blog">
				<div className="customContainer">
					<Titles color="PrimaryColor" level={3} className="textCenter">
						Blogs
					</Titles>
					<div className="gapMarginTop"></div>
					<Row gutter={[16, 16]}>
						{blogs?.data.map((item: Blogs) => {
							return (
								<Col key={item.slug} xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
									<div className="mainCard hover01 container-fluid">
										<Link
											href={`${process.env['NEXT_PUBLIC_SITE_URL']}/blog/${item.slug}`}
											passHref
										>
											<div className="card">
												<div className="card__header">
													<Image
														alt="blog-image"
														src={item
															? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/blogs/original/${item?.image}`
															: '/images/profile-user.jpg'} className="card__image"
														preview={false}
														style={{ objectFit: 'cover', width: '100%', height: '100%' }}
													/>

												</div>
												<div className="card__body">

													<ParaText size="small" color="black" fontWeightBold={600}>
														{item?.title?.trim().slice(0, 50)}
														{item?.title ? item?.title?.length > 50 : '...'}
													</ParaText>
													<ParaText size="extraSmall">
														{item.description ? (
															<div
																dangerouslySetInnerHTML={{
																	__html: item.description.trim().slice(0, 100)
																}}
															></div>
														) : (
															'Loading...'
														)}
													</ParaText>
												</div>

												{/* Card Footer with Author Info */}
												<div className="card__footer">
													<div className="user">
														<Image
															src={
																item.authorId?.profileImage
																	? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/authors/original/${item.authorId?.profileImage}`
																	: '/images/profile-user.jpg'
															} // Default image path should be accessible
															alt="Profile"
															style={{ width: 50, height: 50, borderRadius: '50%' }}
														/>

														<div className="user__info">
															<h5>{item.authorId?.name}</h5>
															<small>{item.timeToRead} min. read</small>
														</div>
													</div>
												</div>
											</div>
										</Link>
									</div>
								</Col>
							);
						})}
					</Row>
					<div className="gapMarginTop"></div>
					<div className='textCenter see-more-btn'>
						<Link href="/blog">
							<Button type='primary'>See More</Button>
						</Link>
					</div>
				</div>
			</section>
		</>
	);
}
