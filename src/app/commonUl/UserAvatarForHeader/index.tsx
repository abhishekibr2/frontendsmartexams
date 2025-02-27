'use client'
import React, { useContext } from 'react';
import { Image, MenuProps } from 'antd';
import { Dropdown } from 'antd';
//@ts-ignore
import { useRouter } from 'nextjs-toploader/app';
import Cookies from 'js-cookie';
import AuthContext from '@/contexts/AuthContext';
import { MdLock, MdEdit } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { MdSpaceDashboard } from "react-icons/md";


export default function UserAvatarForHeader() {
   const { logout, user, setUser, locale } = useContext(AuthContext);
   const router = useRouter();
   function handleLogout(e: any) {
      e.preventDefault();
      logout();
   }

   function handleLockScreen(e: any) {
      e.preventDefault();
      setUser(undefined);
      Cookies.remove('session_token');
      Cookies.remove('roleName');
      const userId = user?._id;
      router.replace(`/${locale}/lock-screen?userId=${userId}`);
      window.history.forward();
   }

   function handleDashboard(e: any) {
      e.preventDefault();
   }

   function redirectToPage() {
      const page = user?.role === 'admin' ? `/${locale}/admin/dashboard` : `/${locale}/user/dashboard`;
      router.push(page);
   }

   const editProdile = () => {
      router.push(`/${locale}/${user?.role}/edit-profile`);
   }

   const items: MenuProps['items'] = [
      {
         label: (
            <div style={{ display: 'flex', marginTop: '12px', alignItems: 'center', marginLeft: '6px', cursor: 'pointer' }}>

               {user && user.image ? (
                  <Image
                     preview={false}
                     src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/original/${user.image}`}
                     alt="Avatar"


                     style={{ width: 35, height: 35, objectFit: 'cover', borderRadius: '30px' }}
                  />
               ) : (
                  <Image
                     preview={false}
                     src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/profile-user.jpg`}
                     alt="Profile"


                     style={{ width: 35, height: 35, objectFit: 'cover', borderRadius: '30px' }}
                  />
               )}
               <div ><span style={{ marginLeft: '15px' }}>{user?.name}</span></div>
            </div>
         ),
         key: '0',
      },


      {
         label: (
            <div
               onClick={redirectToPage}
            >
               <>
                  <MdSpaceDashboard style={{ marginRight: '10px', marginLeft: '6px', color: '#2C2C2C' }} />
                  <span onClick={handleDashboard}>Dashboard</span>
               </>
            </div>
         ),
         key: '1',
      },
      {
         label: (
            <>
               <MdEdit style={{ marginRight: '10px', marginLeft: '6px', color: '#2C2C2C' }} />
               <span onClick={editProdile}>Edit Profile</span>
            </>
         ),
         key: '2',
      },

      {
         label: (
            <>
               <MdLock style={{ marginRight: '10px', marginLeft: '6px', color: '#2C2C2C' }} />
               <span onClick={handleLockScreen}>Lock Screen</span>
            </>
         ),
         key: '2',
      },
      {
         label: (
            <>
               <BiLogOut style={{ marginRight: '10px', marginLeft: '6px', color: '#2C2C2C' }} />
               <span onClick={handleLogout}>Logout</span>
            </>
         ),
         key: '3',
      },
   ];

   return (
      <Dropdown menu={{ items }} trigger={['click']}>
         <a onClick={(e) => e.preventDefault()}>
            <div style={{ marginRight: '10px', marginLeft: '6px', color: '#2C2C2C' }}>
               {user && user.image ? (
                  <Image
                     preview={false}
                     src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/original/${user.image}`}
                     alt="Avatar"
                     style={{ width: 35, height: 35, objectFit: 'cover', borderRadius: '30px' }}
                  />
               ) : (
                  <Image
                     preview={false}
                     src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/profile-user.jpg`}
                     alt="Profile"
                     style={{ width: 35, height: 35, objectFit: 'cover', borderRadius: '30px' }}
                  />
               )}
            </div>
         </a>
      </Dropdown>
   )
}


