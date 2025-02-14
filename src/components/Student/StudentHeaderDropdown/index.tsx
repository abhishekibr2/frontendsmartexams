'use client'
import React, { useContext } from 'react';
import { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import AuthContext from '@/contexts/AuthContext';
import { BiLogOut } from "react-icons/bi";
import { MdSpaceDashboard } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import Link from 'next/link';


export default function StudentHeaderDropdown() {
    const { logout, user } = useContext(AuthContext);
    const pathname = usePathname()

    const items: MenuProps['items'] = [
        {
            label: (
                <>
                    <FaUser style={{ marginRight: '10px', marginLeft: '6px', color: '#2C2C2C' }} />
                    <Link href={`/student/my-profile`} >{user?.name}</Link>
                </>),
            key: '0',
        },
        {
            label: (
                <>
                    <MdSpaceDashboard style={{ marginRight: '10px', marginLeft: '6px', color: '#2C2C2C' }} />
                    <Link
                        href={pathname.includes('/student') ? '/' : '/student/dashboard'}
                    >
                        {pathname.includes('/student') ? 'Home' : 'Dashboard'}
                    </Link>
                </>
            ),
            key: '1',
        },

        {
            label: (
                <>
                    <BiLogOut style={{ marginRight: '10px', marginLeft: '6px', color: '#2C2C2C' }} />
                    <Link href='/login' onClick={() => logout()} className='icon-list-top-bar'>
                        Logout
                    </Link>
                </>
            ),
            key: '3',
        },
    ];

    return (
        <Dropdown menu={{ items }} trigger={['click']}>
            <a onClick={(e) => e.preventDefault()} >
                <div style={{ marginRight: '10px', marginLeft: '6px', color: '#2C2C2C' }}>
                    {user && user.image ? (
                        <img
                            src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/original/${user.image}`}
                            alt="Avatar"


                            style={{ width: 35, height: 35, objectFit: 'cover', borderRadius: '30px' }}
                        />
                    ) : (
                        <img
                            src={`/user.jpg`}
                            alt="Profile"

                            style={{ width: 45, height: 45, objectFit: 'cover', borderRadius: '30px' }}
                        />
                    )}
                </div>
            </a>
        </Dropdown>
    )
}


