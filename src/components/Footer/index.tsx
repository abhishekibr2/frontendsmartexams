import './style.css'
import Link from 'next/link';
import { Button, Col, Image, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { getBrandDetails, getServicesFrontEnd, getCommonFooterFrontEnd, getFooterTests } from '@/lib/frontendApi';
import { useDispatch } from 'react-redux';
import { setCurrentService } from '@/redux/reducers/serviceReducer';

export default function Footer() {
    const [brandMenu, setBrandMenu]: any = useState([]);
    const [stateMenu, setStateMenu] = useState([]);
    const [testMenu, setTestMenu] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const dispatch = useDispatch();

    const handleStateClick = (label: string, key: string) => {
        const selectedService = stateMenu.find((item: any) => item._id === key);
        if (selectedService) {
            console.log(selectedService, 'selectedService');
            dispatch(setCurrentService(selectedService));
        } else {
            console.error('Service not found');
        }
    };


    const fetchBrandMenuItems = async () => {
        try {
            const response = await getBrandDetails();
            setBrandMenu(response.data);
        } catch (error) {
            console.error('Error fetching header menus:', error);
        }
    };

    const fetchStateMenu = async () => {
        try {
            const response = await getServicesFrontEnd();
            setStateMenu(response.data);
        } catch (error) {
            console.error('Error fetching header menus:', error);
        }
    };

    const fetchTestMenu = async () => {
        try {
            const response = await getFooterTests();
            setTestMenu(response.data);
        }
        catch (error) {
            console.error('Error fetching header menus:', error);
        }
    };


    const fetchMenuItems = async () => {
        try {
            const response = await getCommonFooterFrontEnd();
            setMenuItems(response.data);
        } catch (error) {
            console.error('Error fetching header menus:', error);
        }
    };

    useEffect(() => {
        fetchBrandMenuItems();
        fetchStateMenu();
        fetchTestMenu();
        fetchMenuItems();
    }, [])

    const getRandomTests = (menu: any[]) => {
        const shuffledMenu = menu.sort(() => Math.random() - 0.5); // Shuffle the array randomly
        return shuffledMenu.slice(0, 4); // Get the first 4 items
    };

    return (
        <>
            <footer className="footer-part bg-dark-blue">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-8 col-md-12">
                            <div className="row">
                                <div className="col-sm-8">
                                    <img src="/images/smart/ft-logo.png" alt="ft-logo" className="ft-logo" />

                                    {/* <li >
                                        <Link href="/">
                                            <Image
                                                alt=''
                                                src={brandMenu
                                                    ? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/brandImage/original/${brandMenu?.logo}`
                                                    : '/images/logo.svg'} className="card__image"
                                                preview={false}
                                                width={200}
                                            />
                                        </Link>

                                    </li> */}
                                    <p className="ft-contant p-sm">
                                        {brandMenu?.footerDescriptionOne || 'Smart Exams is a leader in online test preparation, having assisted over 3500 students in enhancing their scores and gaining entry into selective schools across Australia.'}
                                    </p>
                                </div>

                                <div className="col-sm-4 mobile-none">
                                    <h4 className="p-lg fw-medium color-light">About</h4>
                                    <ul className="footer-links">
                                        {menuItems.map((item: any) => (
                                            <li key={item._id}>
                                                <Link
                                                    href={item.link}
                                                >
                                                    {item.title}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-12">
                            <div className="row">
                                <div className="col-sm-4 col-6 dask-none">
                                    <h4 className="p-lg fw-medium color-light">About</h4>
                                    <ul className="footer-links">
                                        {menuItems.map((item: any) => (
                                            <li key={item._id}>
                                                <Link
                                                    href={item.link}
                                                >
                                                    {item.title}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="col-sm-3 col-6">
                                    {/* <h4 className="p-lg fw-medium color-light">Exams Info</h4>
                                    <ul className="footer-links ">
                                        {stateMenu.slice(0, 6).map((item: any) => (
                                            <li key={item._id}>
                                                <Link href="/test-packs">
                                                    {item.title.toUpperCase()}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul> */}
                                </div>

                                <div className="col-sm-7 ">
                                    <h4 className="p-lg fw-medium color-light">Connect</h4>
                                    <ul className="footer-links contact-info">
                                        {brandMenu?.phone && (
                                            <li>
                                                <a href="tel:14444623235">
                                                    <i className="fa-solid fa-phone" /> Phone: {brandMenu.phone}
                                                </a>
                                            </li>
                                        )}
                                        {brandMenu?.email && (
                                            <li>
                                                <a href="mailto:admin@gmail.com">
                                                    <i className="fa-regular fa-envelope" /> Email: {brandMenu.email}
                                                </a>
                                            </li>
                                        )}

                                        {brandMenu?.address && (
                                            <li>
                                                <a href="#">
                                                    <i className="fa-solid fa-location-dot" /> Address: {brandMenu.address}
                                                </a>
                                            </li>
                                        )}

                                        <li>
                                            <a href="#">
                                                <i className="fa-regular fa-clock" />
                                                {brandMenu.time || 'Hours: 9am-5pm ET, Mon- Sun'}

                                            </a>
                                        </li>
                                    </ul>
                                    <br />

                                    {/* <h4 className="p-lg fw-medium color-light ">Be social with us!</h4>
                                    <ul className="footer-links social-media">
                                        {brandMenu?.socialLinks?.facebook && (
                                            <li>
                                                <a href={brandMenu.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                                                    <i className="fa-brands fa-facebook" />
                                                </a>
                                            </li>
                                        )}

                                        {brandMenu?.socialLinks?.instagram && (
                                            <li>
                                                <a href={brandMenu.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                                                    <i className="fa-brands fa-instagram" />
                                                </a>
                                            </li>
                                        )}

                                        {brandMenu?.socialLinks?.twitter && (
                                            <li>
                                                <a href={brandMenu.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                                                    <i className="fa-brands fa-twitter" />
                                                </a>
                                            </li>
                                        )}
                                    </ul> */}


                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </footer >

            <footer className="footer-bottam bg-dark-gray">
                <div className="container">
                    <p className="color-light p-xxs text-center">
                        {brandMenu?.footerDescriptionTwo || 'The names of standardized tests and other trademarks are the property of their respective trademark holders. None of the trademark holders are affiliated with or sponsored by Easy Exams.'}
                        <br className="md-none" />
                        {brandMenu?.footerSubHeadingOne || 'To add a link to this resource, permission is not required.'}

                    </p>
                    <p className="color-light p-xxs text-center mb-0">
                        {" "}
                        {brandMenu?.footerSubHeadingTwo || 'Copyright © 2025 easy exam. All Rights Reserved'}


                    </p>
                </div>

                <Row justify="end" align="middle" style={{ paddingRight: '20px' }}>
                    <Col>
                        <Button
                            style={{
                                fontSize: '18px',
                                padding: '30px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50px',
                                color: '#fff',
                                background: '#3098a0',
                                borderColor: '#3098a0',
                                fontWeight: '500'
                            }}
                        >
                            <Image
                                src="/images/support.png"
                                alt="Support"
                                width={30}
                                height={30}
                                preview={false}
                                style={{
                                    marginRight: '10px',
                                }}
                            />
                            Support
                        </Button>
                    </Col>
                </Row>

            </footer >
        </>
    );
}
