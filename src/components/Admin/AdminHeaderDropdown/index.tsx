'use client'
import React, { useContext } from 'react';
import { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import AuthContext from '@/contexts/AuthContext';
import { BiLogOut } from "react-icons/bi";
import { MdSpaceDashboard } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { usePathname } from 'next/navigation'
import Link from 'next/link';

export default function AdminHeaderDropdown() {
    const { logout, user } = useContext(AuthContext);
    const pathname = usePathname()
    const roleName = user?.roleId?.roleName || 'admin';
    const rolePath = `/${roleName}`;
    const isAdmin = roleName === 'admin';
    const destination = isAdmin ? '/admin/dashboard' : `${rolePath}/dashboard`;

    const items: MenuProps['items'] = [
        {
            label: (
                <>
                    <FaUser style={{ marginRight: '10px', marginLeft: '6px', color: '#2C2C2C' }} />
                    <Link href={`/admin/profile`} >{user?.name}</Link>
                </>),
            key: '0',
        },
        {
            label: (
                <>
                    <Link href={pathname.includes(rolePath) ? '/' : destination} passHref>
                        <span>
                            <MdSpaceDashboard style={{ marginRight: '10px', marginLeft: '6px', color: '#2C2C2C' }} />
                            {pathname.includes(rolePath) ? 'Home' : isAdmin ? 'Dashboard' : 'Dashboard'}
                        </span>
                    </Link>

                </>
            ),
            key: '1',
        },

        {
            label: (
                <>

                    <Link href={`/login`} onClick={() => logout()}>
                        <BiLogOut style={{ marginRight: '10px', marginLeft: '6px', color: '#2C2C2C' }} />
                        Logout</Link>
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


