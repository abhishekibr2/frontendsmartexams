'use client';
import { Col, Divider, Layout, Row, theme } from 'antd';
import TableData from './TableData';
import FormModal from './FormModal';
import ErrorHandler from '@/lib/ErrorHandler';
import AuthContext from '@/contexts/AuthContext';
import { getAllPackageEssay } from '@/lib/adminApi';
import { setPackageEssay } from '@/redux/reducers/packageEssayReducer';
import React, { useContext, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Titles from '@/app/commonUl/Titles';
import { PackageEssay } from '@/lib/types';
import { useSearchParams } from 'next/navigation';
import { getSinglePackageInfo } from '@/lib/adminApi';
import { IoMdArrowRoundBack } from 'react-icons/io';
//@ts-ignore
import { useRouter } from 'nextjs-toploader/app';

export default function Subjects() {
    const dispatch = useAppDispatch();
    const packageEssay = useAppSelector((state) => state.packageEssayReducer.packageEssay);
    const { user } = useContext(AuthContext);
    const [selectedRecord, setSelectedRecord] = useState<PackageEssay | null>(null);
    const { token: { colorBgContainer, borderRadiusLG }, } = theme.useToken();
    const searchParams = useSearchParams();
    const packageId = searchParams.get('packageId');
    const [packageName, setPackageName] = useState('')
    const router = useRouter();
	const roleName = user?.roleId?.roleName;

    const getPackagesData = async () => {
        try {
            if (packageId) {
                const res = await getSinglePackageInfo(packageId as string);
                setPackageName(res.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (user) {
            fetchData();
            getPackagesData();
        }
    }, [user]);

    async function fetchData() {
        try {
            const res = await getAllPackageEssay({ packageId });
            if (res.status === true) {
                dispatch(setPackageEssay(res.data));
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }

    const handleUpdateSubjects = async () => {
        await fetchData();
    };

    const handleEdit = (record: PackageEssay) => {
        setSelectedRecord(record);
    };


    const handleNavigation = () => {
        router.push(`/${roleName}/packages`)
    }

    return (
        <Layout.Content
            style={{
                padding: 0,
                margin: 0,
                minHeight: 280,
                // background: colorBgContainer,
                // borderRadius: borderRadiusLG,
            }}
        >
            {packageId ? <IoMdArrowRoundBack
                style={{
                    fontSize: '25px',
                    cursor: 'pointer',

                    color: '#000',
                    background: '#fff',

                }}
                onClick={handleNavigation}
            /> : ''}
            <Row gutter={[16, 16]} align="middle" style={{ textAlign: 'left' }}>
                <Col xs={24} sm={24} md={24} lg={24} xxl={24} xl={24}>
                    <Titles level={5} className="top-title">
                        Add Essays To Package
                    </Titles>
                </Col>
            </Row>
            <div className='mt-3'></div>
            <FormModal onEdit={handleUpdateSubjects} selectedRecord={selectedRecord}
                setSelectedRecord={setSelectedRecord} packageName={packageName} packageId={packageId} packageEssay={packageEssay} />

            <div className='mt-3'></div>
            <TableData
                packageEssay={packageEssay}
                setPackageEssay={setPackageEssay}
                fetchData={fetchData}
                onEdit={handleEdit}

                getPackagesData={getPackagesData}
            />

        </Layout.Content>
    );
}
