'use client'
import './style.css'
import ParaText from '@/app/commonUl/ParaText';
import { Form } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '@/contexts/AuthContext';
import SectionOne from './sectionOne';

interface Props {
    activeKey: string
}


export default function WhyChooseUsContentPage({ activeKey }: Props) {
    const { user } = useContext(AuthContext);
    const [form] = Form.useForm();

    useEffect(() => {
        if (user?._id) {
        }
    }, [activeKey, user])

    return (
        <>
            <ParaText size="large" fontWeightBold={600} color="PrimaryColor">

                <SectionOne />

            </ParaText>
            <div className="gapMarginTopOne"></div>

        </>
    )
}

