import Link from 'next/link';
import AuthContext from '@/contexts/AuthContext';
import React, { useContext } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Dropdown, Flex, Menu, Image, Avatar, } from 'antd';

const HeaderTopBar = () => {
    const { user, logout } = useContext(AuthContext);

    function handleLogout(e: any) {
        e.preventDefault();
        logout();
    }

    const userMenu = (
        <Menu>
            <Menu.Item key="profile">
                <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/${user?.role}/edit-profile`}>
                    Profile
                </Link>
            </Menu.Item>

            <Menu.Item key="logout">
                <Link href="#" onClick={handleLogout}>
                    Logout
                </Link>
            </Menu.Item>
        </Menu>
    );

    return (
        <div>
            <Flex justify={'end'} align='center' gap={16} className='adminHeaderIcon'>
                <Dropdown overlay={userMenu} trigger={['click']}>
                    <div style={{ cursor: 'pointer', marginRight: '30px' }}>
                        {user?.image ?
                            <Image
                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/userImage/original/${user?.image}`}
                                alt="User Avatar"
                                width={40}
                                height={40}
                                style={{ borderRadius: '50%' }}
                                preview={false}
                            /> :
                            <Avatar className='set-mob-icon' icon={<UserOutlined />} />
                        }
                    </div>
                </Dropdown>
            </Flex>
        </div>
    );
};

export default HeaderTopBar;
