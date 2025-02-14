import { useState, useEffect, useContext } from 'react';
import ParaText from '@/app/commonUl/ParaText'
import { Col, Form, Image, Row, Tabs } from 'antd'
import { FaPhone } from 'react-icons/fa';
import { IoMailOutline } from 'react-icons/io5';
import EditProfile from '../../Profile/EditProfile';
import About from '../About';
import Activity from '../Activity';
import Documents from '../Documents';
import PaymentHistory from '../PaymentHistory';
import AuthContext from '@/contexts/AuthContext';

export default function Index() {
    const storedTab = typeof window !== "undefined" ? localStorage.getItem('activeTab') : '1';
    const [activeTab, setActiveTab] = useState(storedTab || '1');

    const { user } = useContext(AuthContext);

    const items = user?.roleId?.roleName === 'admin' ? (
        // Admin logic: Display all tabs
        new Array(5).fill(null).map((_, i) => {
            const id = String(i + 1);
            let label = '';
            switch (i) {
                case 0:
                    // label = 'About';
                    break;
                case 1:
                    // label = 'Activity';
                    break;
                case 2:
                    // label = 'Documents';
                    break;
                case 3:
                    label = 'Edit Profile';
                    break;
                case 4:
                    // label = 'Payment History';
                    break;
                default:
                    break;
            }

            return {
                label: label,
                key: id,
                type: 'left',
                tabPosition: 'left',
                children: (
                    <>
                        {/* {i === 0 && <About />} */}
                        {/* {i === 1 && <Activity />} */}
                        {/* {i === 2 && <Documents />} */}
                        {i === 3 && <EditProfile />}
                        {/* {i === 4 && <PaymentHistory />} */}
                    </>
                )
            };
        })
    ) : (
        // Non-admin logic: Only show 'Edit Profile'
        new Array(1).fill(null).map((_, i) => {
            const id = '0'; // Only one tab for non-admin users
            const label = 'Edit Profile';

            return {
                label: label,
                key: id,
                type: 'left',
                tabPosition: 'left',
                children: (
                    <>
                        {i === 0 && <EditProfile />}
                    </>
                )
            };
        })
    );


    // Handle tab change
    const handleTabChange = (key: string) => {
        setActiveTab(key); // Update state
        // Store the selected tab in localStorage
        localStorage.setItem('activeTab', key);
    };

    return (
        <>
            <div className="smallTopMargin"></div>
            <Form layout='vertical' size='large' >
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
                            <Col md={20} lg={20} xl={20} sm={24} xs={24}>
                                <ParaText size="small" fontWeightBold={500} color="PrimaryColor">
                                    Name: {user?.name}
                                </ParaText>
                                <br />
                                <span className=""><IoMailOutline /> Email : {user?.email}</span><br />
                                <span className=""><FaPhone /> Phone : {user?.phoneNumber}</span><br />
                                <span className="">State: {user?.address.country}</span>
                                <br />
                                <span className="">Country: {user?.address.state}</span>
                                <br />
                                <div className="smallTopMargin"></div>
                                {user?.roleId?.roleName == 'admin' ? <span className="">Website : https://abc.com</span> : ''}
                            </Col>
                            <Col md={24} lg={24} xl={24} sm={24} xs={24}>
                                <div className="largeTopMargin"></div>
                                <Tabs
                                    activeKey={activeTab} // Set the active tab here
                                    onChange={handleTabChange} // Handle tab change
                                    defaultActiveKey="1"
                                    items={items}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Form>
        </>
    );
}
