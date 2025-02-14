'use client';
import { useContext, useEffect, useState } from 'react';
import { GetSubmitPackageEssay } from '@/lib/commonApi';
import AuthContext from '@/contexts/AuthContext';
import { Table } from 'antd';
import { Package } from '@/lib/types';
import { Button } from 'antd'
import Link from 'next/link'
import dayjs from 'dayjs';

export default function EssaySubmitListing() {
    const { user } = useContext(AuthContext);
    const [packages, setPackages] = useState<Package[]>([]);

    const fetchSubmitPackageData = async () => {
        const response = await GetSubmitPackageEssay(user?._id);
        console.log(response, "GetSubmitPackageEssay")
        if (response) {
            setPackages(response.data);
        }
    };

    useEffect(() => {
        if (user) {
            fetchSubmitPackageData();
        }
    }, [user]);

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: 'Essay Type',
            dataIndex: 'packageEssayId',
            key: 'essayType',
            render: (text: any) => text?.essayType || 'N/A'
        },
        {
            title: 'Essay Topic',
            dataIndex: 'packageEssayId',
            key: 'essayName',
            render: (text: any) => text?.essayName || 'N/A'
        },
        {
            title: 'Submission date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: string) => dayjs(text).format('DD/MM/YYYY'),

        },
        {
            title: 'Package',
            dataIndex: 'packageId',
            key: 'packageName',
            align: 'center',
            render: (text: any) => text?.packageName || 'N/A',
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
                        <h2 className="top-title mb-3 ">
                            My Submitted Essays
                        </h2>
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
                                        <button className="btn-primary fix-content-width btn-spac  xs-w-100 ">
                                            New Essay Submission
                                        </button>
                                    </Link>
                                </div>
                                {/* <div className="col-sm-8 text-end">
                                    <span className="p-lg  color-light bg-dark-blue fix-content-width fw-regular red-message xs-center">
                                        Essay Submission Pending for September: 0
                                    </span>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

