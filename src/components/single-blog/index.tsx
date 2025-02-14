"use client"
import React, { useContext, useEffect, useState } from 'react';
import { FaUser, FaFacebookF, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { GrInstagram } from "react-icons/gr";
import { Row, Col, Image } from 'antd';
import './style.css'
import Link from 'next/link';
import ErrorHandler from '@/lib/ErrorHandler';
import { blogViews, fetchViewsBlogData, getAllBlogs } from '@/lib/frontendApi';
import AuthContext from '@/contexts/AuthContext';
import Titles from '@/app/commonUl/Titles';
import ParaText from '@/app/commonUl/ParaText';


interface Props {
   blogData?: any;
   blogViewCount?: any;
}
export default function SingleBlog({ blogData, blogViewCount }: Props) {
   const [blogPosts, setBlogPosts] = useState([]);
   const { user } = useContext(AuthContext);

   useEffect(() => {
      const fetchBlogs = async () => {
         try {
            const res = await getAllBlogs();
            if (res.status === true) {
               setBlogPosts(res.data);
            }
         } catch (error) {
            ErrorHandler.showNotification(error);
         }
      };
      fetchBlogs();
   }, [user]);

   useEffect(() => {
      const timeout = setTimeout(() => {
         fetchViewsData();
      }, 5000);

      return () => clearTimeout(timeout);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);


   const shuffledBlogPosts = [...blogPosts].sort(() => Math.random() - 0.5);
   const randomThreeBlogPosts = shuffledBlogPosts.slice(0, 3);

   const fetchViewsData = async () => {
      try {
         const data = await fetchViewsBlogData();
         const browserName = getBrowserName(navigator.userAgent);
         const operatingSystem = navigator.platform;
         const deviceName = getDeviceName(navigator.userAgent);
         const viewsData = {
            ...data,
            blogId: blogData?._id,
            browserName: browserName,
            operatingSystem: operatingSystem,
            deviceName: deviceName
         };
         await blogViews(viewsData);
      } catch (error) {
         ErrorHandler.showNotification(error);
      }
   };


   const getDeviceName = (userAgent: string): string => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
      const isTablet = /iPad/i.test(userAgent);
      const isDesktop = !isMobile && !isTablet;

      if (isMobile) {
         return 'Mobile';
      } else if (isTablet) {
         return 'Tablet';
      } else if (isDesktop) {
         return 'Desktop';
      } else {
         return 'unknown';
      }
   };

   const getBrowserName = (userAgent: string): string => {
      const match = userAgent.match(/(chrome|firefox|safari|edge|msie|trident(?=\/))\/?\s*(\d+)/i);
      if (match && match[1]) {
         return match[1].toLowerCase();
      } else {
         return 'unknown';
      }
   };

   return (
      <>
         <div className="gapMarginTop"></div>
         <div className="customContainer" id="blogSingleId">
            <Titles level={3} color="PrimaryColor" className="">
               Blog Details
            </Titles>
            <div className="gapMarginTop"></div>
            <div className="blogSingle">
               <Link href="#">
                  <Image
                     preview={false}
                     src={`${process.env["NEXT_PUBLIC_IMAGE_URL"]}/blogs/original/${blogData?.image}`}
                     alt="blog"
                     className="card__image"
                     width='100%'
                     height={500}
                  />
               </Link>

               <div className="gapMarginTop"></div>

               <Row gutter={[12, 12]}>
                  {/* Author Block */}
                  <Col xs={24} sm={24} md={17} lg={19} xl={19} xxl={20}>
                     <div className='flex-mob-text'>
                        <span className="tag1">
                           <FaUser /> <Link href="#">{blogData?.authorId?.name}</Link>
                        </span>
                     </div>
                  </Col>

                  {/* Views Block */}
                  <Col xs={24} sm={24} md={5} lg={3} xl={3} xxl={2}>
                     <div className="viewsBlock flex-mob-text">
                        <span className="tag tag-blue">Views: {blogViewCount}</span>
                     </div>
                  </Col>
                  {/* Social Media Links Block */}
                  <Col xs={24} sm={24} md={2} lg={2} xl={2} xxl={2}>
                     <div className="socialLinksBlock">
                        <ul className="socialShare">
                           <li>
                              <Link className="shareFacebook" href="https://www.facebook.com/BinaryDataPvtLtd">
                                 <FaFacebookF />
                              </Link>
                           </li>
                           <li>
                              <Link className="shareTwitter" href="https://x.com/i/flow/login?redirect_after_login=%2Fbinarydatapl">
                                 <FaTwitter />
                              </Link>
                           </li>
                           <li>
                              <Link className="sharePinterest" href="https://www.instagram.com/binarydata/?hl=en">
                                 <GrInstagram />
                              </Link>
                           </li>
                           <li>
                              <Link className="shareLinkedin" href="https://in.linkedin.com/company/binary-data-pvt-ltd">
                                 <FaLinkedin />
                              </Link>
                           </li>
                        </ul>
                     </div>
                     <div className="blogDetailsShare">
                        <small>{blogData?.timeToRead} min. read</small>
                     </div>
                  </Col>
               </Row>

               <div className="gapMarginTop"></div>

               <div>
                  <Titles level={4} color="black" className="primaryColor">
                     {blogData?.title}
                  </Titles>

                  <div className="gapMarginTop"></div>
                  <ParaText size="extraSmall" color="black">
                     {blogData?.description ? (
                        <div dangerouslySetInnerHTML={{ __html: blogData.description }}></div>
                     ) : (
                        "Loading..."
                     )}
                  </ParaText>

                  <div className="gapMarginTop"></div>

                  <Row gutter={[16, 16]} align="middle">
                     <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                        <div className="blogDetailsTag">
                           <div className="sidebarWidget">
                              <span className="label">Tags:</span>
                              <ul className="sidebarTag"></ul>
                           </div>
                        </div>
                     </Col>
                     <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} className="textEnd">
                        <div className="blogDetailsShare">
                           <small>{blogData?.timeToRead} min. read</small>
                        </div>
                     </Col>
                  </Row>

                  <div className="gapMarginTop"></div>
               </div>
            </div>

            <Row gutter={[16, 16]}>
               {randomThreeBlogPosts.map((item: any, key) => (
                  <Col xs={24} sm={24} md={8} lg={12} xl={8} xxl={8} key={item?.id}>
                     <Link href={`${process.env["NEXT_PUBLIC_SITE_URL"]}/blog/${item.slug}`} passHref>
                        <div className="card">
                           <div className="card__header">
                              <Image
                                 width='100%'
                                 preview={false}
                                 src={item.image ? `${process.env["NEXT_PUBLIC_IMAGE_URL"]}/blogs/medium/${item.image}` : "/homes/default.png"}
                                 alt="card__image"
                                 className="card__image"
                              />
                           </div>
                           <div className="card__body">
                              <span className="tag tag-blue">Smart Exams</span>
                              <Titles level={5} color="black">
                                 {item.title}
                              </Titles>
                              <ParaText size="extraSmall" color="black">
                                 {item.description ? (
                                    <div dangerouslySetInnerHTML={{ __html: item.description.trim().slice(0, 100) }}></div>
                                 ) : (
                                    "Loading..."
                                 )}
                              </ParaText>
                           </div>
                           <div className="card__footer">
                              <div className="user">
                                 <Image
                                    src={item.image ? `${process.env["NEXT_PUBLIC_IMAGE_URL"]}/blogs/medium/${item.image}` : "/homes/default.png"}
                                    alt="user__image"
                                    style={{ width: 50, height: 50, borderRadius: 30 }}
                                    preview={false}
                                 />
                                 <div className="user__info">
                                    <h5>{item.authorId?.name}</h5>
                                    <small>{item.timeToRead} min. read</small>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </Link>
                  </Col>
               ))}
            </Row>

            <div className="gapMarginTop"></div>
         </div>




      </>
   )
}

