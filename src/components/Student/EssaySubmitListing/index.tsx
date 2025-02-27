'use client';
import { useContext, useEffect, useState } from 'react';
import { GetSubmitPackageEssay } from '@/lib/commonApi';
import AuthContext from '@/contexts/AuthContext';
import { Flex, Table } from 'antd';
import { Package } from '@/lib/types';
import { Button } from 'antd'
import Link from 'next/link'
import dayjs from 'dayjs';

export default function EssaySubmitListing() {
    const { user } = useContext(AuthContext);
    const [packages, setPackages] = useState<Package[]>([]);
    const [pendingEssays, setPendingEssays] = useState(0);
    const [totalEssay, setTotalEssay] = useState<any>();

    useEffect(() => {
        if (!packages || packages.length === 0) return;

        const currentMonth = dayjs().format("YYYY-MM"); // e.g., "2025-02"

        let totalPending = 0;
        let submittedThisMonth = 0;

        // Count submitted essays in the current month
        packages.forEach((essay) => {
            if (dayjs(essay.createdAt).format("YYYY-MM") === currentMonth) {
                submittedThisMonth++;
            }
        });

        // Get total expected essays (from purchased packages)
        const totalEssaysPerMonth = totalEssay || 0; // Comes from API

        // Calculate pending essays
        totalPending = Math.max(0, totalEssaysPerMonth - submittedThisMonth);

        setPendingEssays(totalPending);
    }, [totalEssay, packages]); // Depend on both values


    const fetchSubmitPackageData = async () => {
        const response = await GetSubmitPackageEssay(user?._id);
        if (response) {
            setPackages(response.data.getEssay);
            setTotalEssay(response.data.totalEssays);
        }
    };

    useEffect(() => {
        if (user) {
            fetchSubmitPackageData();
        }
    }, [user]);

    const columns = [
        {
            title: 'Essay Name',
            dataIndex: 'packageEssayId',
            key: 'essayName',
            render: (text: any) => text?.essayName || 'N/A'
        },
        {
            title: 'Essay Topic',
            dataIndex: 'packageEssayId',
            key: 'essayName',
            render: (text: any) => text?.essayName || 'N/A'
        },
        {
            title: 'Essay Type',
            dataIndex: 'packageEssayId',
            key: 'essayType',
            render: (text: any) => text?.essayType || 'N/A'
        },
        {
            title: 'Package',
            dataIndex: 'packageId',
            key: 'packageName',
            align: 'center',
            render: (text: any) => text?.packageName || 'N/A',
        },
        {
            title: 'Submission date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: string) => dayjs(text).format('DD/MM/YYYY'),

        },
        {
            title: 'Teacher Review comments',
            dataIndex: 'operation',
            key: 'operation',
            render: (_: any, record: any) => (
                <Link href={`/student/essay-submission?EssayId=${record._id}`}>
                    <Button>
                        <i className="fa-regular fa-comment-dots" />
                    </Button>
                </Link>
            ),
        },
    ];

    return (
        <>
            <section className="dash-part bg-light-steel ">
                <div className="d-flex">
                    <div className="spac-dash w-100">
                        <Flex justify={'space-between'} align={'center'}>
                            <h2 className="top-title mb-3 ">
                                My Submitted Essays
                            </h2>
                            <h6 className='text-muted'>Total Monthly Essay Submission : <b className='text-dark'>{totalEssay}</b> </h6>
                        </Flex>
                        <Table
                            className="text-center SubmittedTable shadow-sm w-100"
                            columns={columns.map((col) => ({
                                ...col,
                                align: 'center',
                            }))}
                            dataSource={packages.map((item, index) => ({
                                ...item,
                                index,
                            }))}
                        />
                        <br />
                        <div className="top-extra-space">
                            <div className="row align">
                                <div className="col-sm-4">
                                    <Link href='/student/newEssay'>
                                        <span className="btn-primary fix-content-width btn-spac  xs-w-100 " style={{ padding: '10px 20px' }}>
                                            New Essay Submission
                                        </span>
                                    </Link>
                                </div>
                                <div className="col-sm-8 text-end">
                                    <span className="p-lg color-light bg-dark-blue fix-content-width fw-regular red-message xs-center">
                                        Essay Submission Pending for {new Date().toLocaleString('en-US', { month: 'long' })}: {pendingEssays}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

