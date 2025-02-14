'use client';
import React from 'react';
import './style.css';
import ParaText from '@/app/commonUl/ParaText';
import EditProfile from '@/components/Admin/UserProfile/EditProfile';
export default function settings() {
    return (
        <>
            <div className='profileStyle'>
                <ParaText size="large" fontWeightBold={600} color="PrimaryColor">
                    Profile
                </ParaText>
                <EditProfile />
            </div>
        </>
    );
}

