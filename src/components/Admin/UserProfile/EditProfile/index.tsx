import { useState, useEffect, useContext } from 'react';
import ParaText from '@/app/commonUl/ParaText'
import { Col, Form, Image, Row, Tabs } from 'antd'
import { FaMapMarkerAlt, FaPhone, FaRegUser } from 'react-icons/fa';
import { IoMailOutline } from 'react-icons/io5';
import EditProfile from '../../Profile/EditProfile';
import AuthContext from '@/contexts/AuthContext';
import { SlGlobe } from 'react-icons/sl';
import { FaMapLocationDot } from 'react-icons/fa6';
import { MdCall } from 'react-icons/md';

export default function Index() {
    const storedTab = typeof window !== "undefined" ? localStorage.getItem('activeTab') : '1';
    const [activeTab, setActiveTab] = useState(storedTab || '1');

    const { user } = useContext(AuthContext);

    const handleTabChange = (key: string) => {
        setActiveTab(key);
        localStorage.setItem('activeTab', key);
    };

    // const ShowSecion = user?.roleId?.roleName !== 'admin';

    // If the role is 'operator', show only the EditProfile component
    // if (user?.roleId?.roleName !== 'admin') {
    //     return <EditProfile />;
    // }

    // const items = user?.roleId?.roleName === 'admin' ? [
    //     // { label: 'Edit Profile', key: '1', children: <EditProfile /> }
    //         return <EditProfile />;

    // ] : [];

    return (
        <>
            <div className="smallTopMargin"></div>
            <>
                {/* <Form layout='vertical' size='large' >
                        <Row>
                            <Col xl={22} lg={22} md={22} sm={24} xs={24}>
                                <Row gutter={[14, 14]}>
                                    <Col md={3} lg={3} xl={3} sm={24} xs={24}>
                                        <Image
                                            width="100%"
                                            preview={false}
                                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/userImage/original/${user?.image}`}
                                            style={{ borderRadius: '5px' }}
                                            alt=""
                                        />
                                    </Col>
                                    <Col md={20} lg={20} xl={20} sm={24} xs={24} className='user-profile-part'>
                                        <ParaText className="list-profile" fontWeightBold={500} color="PrimaryColor">
                                            <FaRegUser /> <b>Name:</b> {user?.name}
                                        </ParaText>
                                        <ParaText className="list-profile"><IoMailOutline /> <b>Email:</b> {user?.email}</ParaText>
                                        <ParaText className="list-profile"><MdCall /><b>Phone:</b> {user?.phoneNumber}</ParaText>
                                        <ParaText className="list-profile"><FaMapMarkerAlt /> <b>State:</b> {user?.address?.state}</ParaText>
                                        <ParaText className="list-profile"><FaMapLocationDot /><b>Country:</b> {user?.address?.country}</ParaText>
                                        <div className="smallTopMargin"></div>
                                        {user?.roleId?.roleName === 'admin' && (
                                            <ParaText className="list-profile"><SlGlobe /> <b>Website:</b> https://abc.com</ParaText>
                                        )}
                                    </Col>
                                    <Col md={24} lg={24} xl={24} sm={24} xs={24} className='tab-box-part'>
                                        <div className="largeTopMargin"></div>
                                        <Tabs
                                            activeKey={activeTab}
                                            onChange={handleTabChange}
                                            defaultActiveKey="1"
                                            items={items}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form> */}
                <EditProfile />
            </>

        </>
    );
}

